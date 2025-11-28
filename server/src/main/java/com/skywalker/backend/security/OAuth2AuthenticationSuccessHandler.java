package com.skywalker.backend.security;

import com.skywalker.backend.model.User;
import com.skywalker.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtils jwtUtils;
    private final UserRepository userRepository;
    private final OAuth2AuthorizedClientService authorizedClientService;


    @Value("${oauth2.frontend-redirect}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();
        String registrationId = oauthToken.getAuthorizedClientRegistrationId();

        String email = extractEmail(oAuth2User, registrationId, authentication);
        String name = extractName(oAuth2User, registrationId);
        String providerId = extractProviderId(oAuth2User, registrationId);
        String imageUrl = extractImageUrl(oAuth2User, registrationId);

        if (email == null) {
            log.error("Email not found from OAuth2 provider: {}", registrationId);
            String errorUrl = UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("error", "Email not found")
                    .build().toUriString();
            getRedirectStrategy().sendRedirect(request, response, errorUrl);
            return;
        }

        // Find or create user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(email, name, registrationId, providerId, imageUrl));

        // Update existing user with OAuth info if they registered with email
        if (user.getAuthProvider() == User.AuthProvider.LOCAL) {
            user.setAuthProvider(User.AuthProvider.valueOf(registrationId.toUpperCase()));
            user.setProviderId(providerId);
            if (imageUrl != null) {
                user.setImageUrl(imageUrl);
            }
            user = userRepository.save(user);
        }

        // Generate JWT token - User entity already implements UserDetails
        String token = jwtUtils.generateToken(user);

        // Redirect to frontend with token
        // Note: Only token and provider are passed in URL for security
        // Frontend should decode the token or call an API to get user details
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .queryParam("provider", registrationId)
                .build().toUriString();

        log.info("OAuth2 login successful for user: {}", email);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private User createNewUser(String email, String name, String registrationId, String providerId, String imageUrl) {
        User newUser = new User();
        newUser.setEmail(email);

        // Split name into first and last name
        if (name != null && !name.isEmpty()) {
            String[] nameParts = name.split(" ", 2);
            newUser.setFirstName(nameParts[0]);
            if (nameParts.length > 1) {
                newUser.setLastName(nameParts[1]);
            }
        }

        newUser.setAuthProvider(User.AuthProvider.valueOf(registrationId.toUpperCase()));
        newUser.setProviderId(providerId);
        newUser.setImageUrl(imageUrl);

        return userRepository.save(newUser);
    }

    private String extractEmail(OAuth2User oAuth2User, String registrationId, Authentication authentication) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        if ("google".equals(registrationId)) {
            return (String) attributes.get("email");
        }

        if ("github".equals(registrationId)) {
            String email = (String) attributes.get("email");
            if (email != null) return email;

            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2AuthorizedClient client = authorizedClientService
                    .loadAuthorizedClient("github", oauthToken.getName());

            if (client == null) return null;

            return fetchGitHubPrimaryEmail(client.getAccessToken().getTokenValue());
        }

        return null;
    }


    private String extractName(OAuth2User oAuth2User, String registrationId) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        if ("google".equals(registrationId)) {
            return (String) attributes.get("name");
        } else if ("github".equals(registrationId)) {
            String name = (String) attributes.get("name");
            if (name == null) {
                name = (String) attributes.get("login");
            }
            return name;
        }
        return null;
    }

    private String extractProviderId(OAuth2User oAuth2User, String registrationId) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        if ("google".equals(registrationId)) {
            return (String) attributes.get("sub");
        } else if ("github".equals(registrationId)) {
            Object id = attributes.get("id");
            return id != null ? id.toString() : null;
        }
        return null;
    }

    private String extractImageUrl(OAuth2User oAuth2User, String registrationId) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        if ("google".equals(registrationId)) {
            return (String) attributes.get("picture");
        } else if ("github".equals(registrationId)) {
            return (String) attributes.get("avatar_url");
        }
        return null;
    }
    private String fetchGitHubPrimaryEmail(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                "https://api.github.com/user/emails",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );

        List<Map<String, Object>> emails = response.getBody();
        if (emails == null) return null;

        return emails.stream()
                .filter(e -> Boolean.TRUE.equals(e.get("primary")) && Boolean.TRUE.equals(e.get("verified")))
                .map(e -> (String) e.get("email"))
                .findFirst()
                .orElse(null);
    }


}
