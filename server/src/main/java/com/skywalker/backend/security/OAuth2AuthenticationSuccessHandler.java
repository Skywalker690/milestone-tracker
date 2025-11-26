package com.skywalker.backend.security;

import com.skywalker.backend.model.User;
import com.skywalker.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtils jwtUtils;
    private final UserRepository userRepository;

    @Value("${oauth2.redirect-uri:http://localhost:3000/oauth2/callback}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();
        String registrationId = oauthToken.getAuthorizedClientRegistrationId();

        String email = extractEmail(oAuth2User, registrationId);
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

    private String extractEmail(OAuth2User oAuth2User, String registrationId) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        if ("google".equals(registrationId)) {
            return (String) attributes.get("email");
        } else if ("github".equals(registrationId)) {
            return (String) attributes.get("email");
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
}
