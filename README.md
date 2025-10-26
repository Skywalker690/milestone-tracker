# 🎯 Milestone Tracker

A modern, full-stack web application for tracking and managing personal or professional milestones. Built with React and Spring Boot, this application provides a beautiful, user-friendly interface to help you set, track, and achieve your goals.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-6DB33F?logo=springboot)
![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-316192?logo=postgresql)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![GitHub Stars](https://img.shields.io/github/stars/Skywalker690/milestone-tracker?style=social)

## 📚 Documentation

- **[Quick Setup Guide](/docs/SETUP.md)** - Get started in 5 minutes
- **[API Documentation](/docs/API.md)** - Complete API reference
- **[Architecture Guide](/docs/ARCHITECTURE.md)** - System design and architecture
- **[Deployment Guide](/docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines
- **[Security Policy](/docs/SECURITY.md)** - Security and vulnerability reporting

## ✨ Features

- **🔐 User Authentication**: Secure JWT-based authentication system
- **📝 Milestone Management**: Create, read, update, and delete milestones
- **🔍 Advanced Filtering**: Search and filter milestones by status, date, or keywords
- **📊 Progress Tracking**: Visual progress indicators and completion statistics
- **🎨 Modern UI**: Beautiful dark-themed interface with responsive design
- **⚡ Real-time Updates**: Instant feedback and updates across the application
- **📅 Date Management**: Set target dates and track completion times
- **🏷️ Status Tracking**: Automatically track milestone completion status

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **React Router DOM 7.5.1** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Spring Boot 3.5.5** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **PostgreSQL** - Database
- **JWT (JSON Web Tokens)** - Token-based authentication
- **Lombok** - Java boilerplate reduction
- **Maven** - Dependency management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Java 21** or higher
- **npm** or **yarn**
- **PostgreSQL 12** or higher
- **Maven 3.6** or higher (or use the included Maven wrapper)

## 🚀 Getting Started

**New to Milestone Tracker?** Check out our [Quick Setup Guide](/docs/SETUP.md) for a 5-minute setup walkthrough!

### Database Setup

1. Install and start PostgreSQL
2. Create a new database:
   ```sql
   CREATE DATABASE milestone_tracker;
   ```

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a `.env` file in the server directory with the following variables:
   ```env
   DB_URL=jdbc:postgresql://localhost:5432/milestone_tracker
   DB_USERNAME=your_postgres_username
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your_jwt_secret_key_here_minimum_256_bits
   JWT_EXPIRATION=86400000
   ```

3. Build and run the backend:
   ```bash
   # Using Maven wrapper (recommended)
   ./mvnw clean install
   ./mvnw spring-boot:run
   
   # Or using Maven directly
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

   The frontend will start on `http://localhost:3000`

## 📖 Usage

### Creating an Account

1. Open the application in your browser at `http://localhost:3000`
2. Click on the "Sign Up" or "Register" button
3. Fill in your details and create an account
4. Log in with your credentials

### Managing Milestones

1. **Create a Milestone**: Click the "+" button and fill in the milestone details
   - Title: A short, descriptive name
   - Description: Detailed information about the milestone
   - Target Date: When you aim to achieve this milestone

2. **View Milestones**: All your milestones are displayed on the main dashboard
   - Filter by status (All, Completed, Pending, Overdue)
   - Sort by date, title, or completion status
   - Search by keywords

3. **Update a Milestone**: Click on a milestone card to edit its details

4. **Mark as Complete**: Toggle the completion status with a single click

5. **Delete a Milestone**: Remove milestones you no longer need

## 🏗️ Project Structure

```
milestone-tracker1/
├── client/                   # Frontend React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # Reusable UI components
│   │   │   ├── MilestoneTracker.jsx
│   │   │   ├── MilestoneCard.jsx
│   │   │   ├── MilestoneForm.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── App.js          # Main application component
│   │   └── index.js        # Application entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                  # Backend Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   └── java/com/skywalker/backend/
│   │   │       ├── config/        # Configuration classes
│   │   │       ├── controller/    # REST controllers
│   │   │       ├── dto/           # Data Transfer Objects
│   │   │       ├── exception/     # Custom exceptions
│   │   │       ├── model/         # Entity models
│   │   │       ├── repository/    # Data repositories
│   │   │       ├── security/      # Security configuration
│   │   │       ├── service/       # Business logic
│   │   │       └── BackendApplication.java
│   │   └── test/          # Test files
│   └── pom.xml            # Maven configuration
│
├── .gitignore
├── LICENSE
├── README.md
├── CODE_OF_CONDUCT.md
└── CONTRIBUTING.md
```

## 🔌 API Endpoints

For complete API documentation with request/response examples, see [API.md](/docs/API.md).

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Milestones
- `GET /milestones/all` - Get all milestones for authenticated user
- `GET /milestones/{id}` - Get a specific milestone
- `POST /milestones/create` - Create a new milestone
- `PUT /milestones/update/{id}` - Update a milestone
- `DELETE /milestones/delete/{id}` - Delete a milestone

All milestone endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🧪 Running Tests

### Backend Tests
```bash
cd server
./mvnw test
```

### Frontend Tests
```bash
cd client
npm test
# or
yarn test
```

## 🐳 Docker Support

Docker configuration is available in the server directory:

```bash
cd server
docker build -t milestone-tracker-backend .
docker run -p 8080:8080 milestone-tracker-backend
```

For complete deployment instructions including Docker Compose, Heroku, AWS, and VPS deployment, see the [Deployment Guide](/docs/DEPLOYMENT.md).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Skywalker690** - *Initial work* - [GitHub Profile](https://github.com/Skywalker690)

## 🙏 Acknowledgments

- React and Spring Boot communities for excellent documentation
- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling
- All contributors who help improve this project

## 📧 Contact & Support

If you have any questions, issues, or suggestions:
- Open an issue on [GitHub Issues](https://github.com/Skywalker690/milestone-tracker/issues)
- Submit a pull request for improvements
- Star the repository if you find it helpful!

## 🗺️ Roadmap

Future enhancements planned:
- [ ] Email notifications for upcoming milestones
- [ ] Milestone categories and tags
- [ ] Data export functionality (CSV, PDF)
- [ ] Mobile app version
- [ ] Collaborative milestone sharing
- [ ] Analytics and insights dashboard
- [ ] Integration with calendar applications

---

Made with ❤️ by the Skywalker
