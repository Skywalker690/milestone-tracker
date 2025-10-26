# Contributing to Milestone Tracker

First off, thank you for considering contributing to Milestone Tracker! It's people like you that make Milestone Tracker such a great tool. We welcome contributions from everyone and are grateful for every contribution, no matter how small.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [Java Style Guide](#java-style-guide)
  - [JavaScript Style Guide](#javascript-style-guide)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by the [Milestone Tracker Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

**Use the following template:**

```markdown
**Description:**
A clear and concise description of the bug.

**To Reproduce:**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
A clear and concise description of what you expected to happen.

**Screenshots:**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g., Windows 10, macOS 12, Ubuntu 22.04]
- Browser: [e.g., Chrome 98, Firefox 95]
- Node Version: [e.g., 18.12.0]
- Java Version: [e.g., 21]

**Additional Context:**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title** for the issue
- **Provide a step-by-step description** of the suggested enhancement
- **Provide specific examples** to demonstrate the steps
- **Describe the current behavior** and **explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful** to most Milestone Tracker users

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these `beginner` and `help-wanted` issues:

- **Beginner issues** - issues which should only require a few lines of code
- **Help wanted issues** - issues which should be a bit more involved than beginner issues

### Pull Requests

The process described here has several goals:

- Maintain Milestone Tracker's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Milestone Tracker
- Enable a sustainable system for maintainers to review contributions

Please follow these steps:

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our style guides
3. **Add tests** if you've added code that should be tested
4. **Ensure the test suite passes**
5. **Make sure your code lints** without errors
6. **Write a clear commit message**
7. **Issue the pull request**

## Development Setup

### Prerequisites

- Java 21 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher
- Git

### Setting Up Your Development Environment

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/milestone-tracker.git
   cd milestone-tracker
   ```

2. **Set up the backend:**
   ```bash
   cd server
   # Create .env file with your database credentials
   cp .env.example .env
   # Edit .env with your settings
   
   # Install dependencies and run
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Set up the frontend:**
   ```bash
   cd client
   # Install dependencies
   npm install
   
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:8080" > .env
   
   # Start development server
   npm start
   ```

4. **Create a new branch for your feature or fix:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` - Improving structure/format of the code
  - ⚡ `:zap:` - Improving performance
  - 🔥 `:fire:` - Removing code or files
  - 🐛 `:bug:` - Fixing a bug
  - 🚑 `:ambulance:` - Critical hotfix
  - ✨ `:sparkles:` - Introducing new features
  - 📝 `:memo:` - Writing docs
  - 🚀 `:rocket:` - Deploying stuff
  - 💄 `:lipstick:` - Updating UI and style files
  - ✅ `:white_check_mark:` - Adding tests
  - 🔒 `:lock:` - Fixing security issues
  - ⬆️ `:arrow_up:` - Upgrading dependencies
  - ⬇️ `:arrow_down:` - Downgrading dependencies
  - 🔧 `:wrench:` - Changing configuration files

**Example:**
```
✨ Add milestone filtering by date range

- Implement date range picker component
- Add filter logic to milestone service
- Update UI to show date filters
- Add unit tests for date filtering

Closes #123
```

### Java Style Guide

- Follow [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- Use meaningful variable and method names
- Keep methods small and focused (Single Responsibility Principle)
- Use Lombok annotations to reduce boilerplate code
- Write Javadoc comments for public methods and classes
- Use `@Override` annotation when overriding methods
- Proper exception handling with meaningful messages

**Example:**
```java
/**
 * Creates a new milestone for the authenticated user.
 *
 * @param milestoneDTO the milestone data to create
 * @param request the HTTP request containing auth information
 * @return Response containing the created milestone
 */
@PostMapping("/create")
public ResponseEntity<Response> createMilestone(
    @Valid @RequestBody MilestoneDTO milestoneDTO,
    HttpServletRequest request
) {
    // Implementation
}
```

### JavaScript Style Guide

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use functional components with hooks (not class components)
- Use meaningful variable and function names
- Keep components small and focused
- Use PropTypes or TypeScript for type checking (if applicable)
- Use arrow functions for anonymous functions
- Use destructuring when appropriate
- Write comments for complex logic

**Example:**
```javascript
/**
 * MilestoneCard component displays a single milestone
 * 
 * @param {Object} milestone - The milestone object to display
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 */
const MilestoneCard = ({ milestone, onEdit, onDelete }) => {
  // Component implementation
};
```

## Testing Guidelines

### Backend Testing

- Write unit tests for service layer methods
- Write integration tests for controller endpoints
- Use meaningful test method names that describe what is being tested
- Follow AAA pattern: Arrange, Act, Assert
- Aim for high code coverage (>80%)

```java
@Test
void createMilestone_WithValidData_ShouldReturnCreatedMilestone() {
    // Arrange
    MilestoneDTO milestoneDTO = new MilestoneDTO();
    milestoneDTO.setTitle("Test Milestone");
    
    // Act
    Response response = milestoneService.createMilestone(milestoneDTO);
    
    // Assert
    assertEquals(200, response.getStatusCode());
    assertNotNull(response.getMilestone());
}
```

### Frontend Testing

- Write unit tests for utility functions
- Write component tests for React components
- Test user interactions and state changes
- Use React Testing Library best practices
- Mock API calls in tests

```javascript
describe('MilestoneCard', () => {
  it('should render milestone title', () => {
    const milestone = { id: 1, title: 'Test Milestone' };
    render(<MilestoneCard milestone={milestone} />);
    expect(screen.getByText('Test Milestone')).toBeInTheDocument();
  });
});
```

### Running Tests

**Backend:**
```bash
cd server
./mvnw test
```

**Frontend:**
```bash
cd client
npm test
```

## Documentation

- Update the README.md if you change functionality
- Add JSDoc/Javadoc comments for new functions/classes
- Update API documentation if you add/change endpoints
- Include comments explaining complex logic
- Update the CHANGELOG.md for significant changes

### API Documentation

When adding new endpoints, document them in the README.md API section:

```markdown
### Endpoint Name
- **URL**: `/api/endpoint`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "field": "value"
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "message": "Success" }`
- **Error Response**:
  - **Code**: 400
  - **Content**: `{ "error": "Error message" }`
```

## Recognition

Contributors will be recognized in the following ways:

- Listed in the project's contributors section
- Mentioned in release notes for significant contributions
- Given credit in commit messages and pull requests

## Questions?

Don't hesitate to ask questions! You can:

- Open an issue with the `question` label
- Reach out to the maintainers
- Check existing documentation and issues

## License

By contributing to Milestone Tracker, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Milestone Tracker! 🎯
