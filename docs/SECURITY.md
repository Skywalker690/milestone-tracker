# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Milestone Tracker team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisory**: Use GitHub's [private vulnerability reporting feature](https://github.com/Skywalker690/milestone-tracker1/security/advisories/new) (preferred method)
2. **GitHub Issues**: For non-critical security concerns, you can open a private security issue

### What to Include in Your Report

To help us better understand and resolve the issue, please include as much of the following information as possible:

- **Type of vulnerability** (e.g., SQL injection, XSS, authentication bypass, etc.)
- **Full paths of source file(s)** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability**, including how an attacker might exploit it
- **Any suggested fixes or patches**

### What to Expect

After submitting a vulnerability report:

1. **Acknowledgment**: We'll acknowledge receipt of your report within 48 hours
2. **Assessment**: We'll investigate and assess the severity of the issue
3. **Updates**: We'll keep you informed about our progress
4. **Resolution**: We'll work on a fix and coordinate disclosure timing with you
5. **Credit**: With your permission, we'll credit you in the security advisory

### Disclosure Policy

- We'll work with you to understand and resolve the issue quickly
- We'll keep you informed of the progress towards a fix
- Once the issue is resolved, we'll publicly disclose the vulnerability
- We'll credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices for Users

### For Deployment

1. **Use Strong Secrets**:
   - Generate a strong JWT secret (minimum 256 bits)
   - Use a complex database password
   - Never commit secrets to version control

2. **Environment Variables**:
   - Keep `.env` files secure and never commit them
   - Use different secrets for development and production
   - Rotate secrets regularly

3. **Database Security**:
   - Use SSL/TLS for database connections in production
   - Restrict database access to specific IP addresses
   - Regularly backup your database
   - Keep PostgreSQL updated

4. **Application Security**:
   - Always use HTTPS in production
   - Keep dependencies updated
   - Enable CORS only for trusted domains
   - Implement rate limiting for API endpoints
   - Use a reverse proxy (Nginx, Apache) for additional security

5. **Authentication**:
   - Enforce strong password policies
   - Consider implementing 2FA (Two-Factor Authentication)
   - Set appropriate JWT expiration times
   - Implement refresh token mechanism for better security

### For Development

1. **Dependency Management**:
   - Regularly update dependencies
   - Use `npm audit` and `mvn dependency:tree` to check for vulnerabilities
   - Review security advisories for used packages

2. **Code Review**:
   - Review all code changes for security implications
   - Use automated security scanning tools
   - Follow secure coding practices

3. **Testing**:
   - Test authentication and authorization flows
   - Validate input sanitization
   - Test error handling (don't expose sensitive information)

## Known Security Considerations

### Current Implementation

1. **JWT Storage**: Tokens are stored in browser localStorage
   - **Risk**: Vulnerable to XSS attacks
   - **Mitigation**: React's built-in XSS protection, consider httpOnly cookies for production

2. **Password Storage**: Using BCrypt with salt
   - **Status**: Industry standard ✅

3. **SQL Injection**: Using JPA with parameterized queries
   - **Status**: Protected ✅

4. **CORS**: Configured for cross-origin requests
   - **Note**: Ensure proper configuration in production

5. **Rate Limiting**: Not currently implemented
   - **Recommendation**: Implement for production deployment

### Planned Security Enhancements

- [ ] Refresh token mechanism
- [ ] Rate limiting on API endpoints
- [ ] Account lockout after failed login attempts
- [ ] Email verification for new accounts
- [ ] Two-factor authentication (2FA)
- [ ] Security headers (CSP, HSTS, etc.)
- [ ] API request logging and monitoring
- [ ] Automated security scanning in CI/CD

## Security Update Process

1. Security patches are released as soon as possible
2. Critical vulnerabilities receive immediate attention
3. Users are notified through:
   - GitHub Security Advisories
   - Release notes
   - Email notifications (if available)

## Security Tools and Resources

### Recommended Tools

- **Frontend Security**:
  - `npm audit` - Check for vulnerable dependencies
  - ESLint security plugins
  - Snyk - Continuous security monitoring

- **Backend Security**:
  - OWASP Dependency-Check Maven Plugin
  - SpotBugs with Find Security Bugs plugin
  - SonarQube for code quality and security

- **Testing**:
  - OWASP ZAP - Web application security testing
  - Burp Suite - Security testing toolkit

### Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Compliance

This project aims to follow:
- OWASP Top 10 security guidelines
- CWE (Common Weakness Enumeration) standards
- General data protection best practices

## Questions?

If you have questions about security but don't have a vulnerability to report:
- Open a GitHub issue with the `security` label
- Check our [FAQ section](README.md#contact--support)
- Review existing security discussions

## Attribution

We follow responsible disclosure practices and will credit security researchers who help improve the security of Milestone Tracker.

---

Thank you for helping keep Milestone Tracker and its users safe! 🔒
