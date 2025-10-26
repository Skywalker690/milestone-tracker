# Architecture Documentation

This document provides an overview of the Milestone Tracker application architecture, including its design patterns, components, and data flow.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Design](#database-design)
- [Security Architecture](#security-architecture)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)

## System Overview

Milestone Tracker is a full-stack web application built using a **three-tier architecture**:

1. **Presentation Layer** (Frontend): React-based single-page application
2. **Business Logic Layer** (Backend): Spring Boot REST API
3. **Data Layer**: PostgreSQL relational database

The application follows a **client-server model** with JWT-based authentication and RESTful API communication.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Side                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React Application (Port 3000)               │  │
│  │                                                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │  │
│  │  │  Pages   │  │Components│  │  UI Components     │ │  │
│  │  │  Routes  │  │  Logic   │  │  (Radix UI +      │ │  │
│  │  │          │  │          │  │   Tailwind CSS)    │ │  │
│  │  └────┬─────┘  └────┬─────┘  └──────────────────┬─┘ │  │
│  │       │             │                            │    │  │
│  │       └─────────────┴────────────────────────────┘    │  │
│  │                      │                                 │  │
│  │              ┌───────┴────────┐                       │  │
│  │              │  React Context │                       │  │
│  │              │  (State Mgmt)  │                       │  │
│  │              └───────┬────────┘                       │  │
│  │                      │                                 │  │
│  │              ┌───────┴────────┐                       │  │
│  │              │  API Service   │                       │  │
│  │              │    (Axios)     │                       │  │
│  │              └───────┬────────┘                       │  │
│  └──────────────────────┼──────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────┘
                          │
                          │ HTTP/REST
                          │ (JSON)
                          │
┌─────────────────────────┼────────────────────────────────┐
│                         │  Server Side                    │
├─────────────────────────┼────────────────────────────────┤
│                         │                                  │
│  ┌──────────────────────┴──────────────────────────────┐ │
│  │    Spring Boot Application (Port 8080)              │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │         Security Layer (JWT Filter)          │  │ │
│  │  └────────────────┬─────────────────────────────┘  │ │
│  │                   │                                  │ │
│  │  ┌────────────────┴─────────────────────────────┐  │ │
│  │  │            Controllers Layer                  │  │ │
│  │  │  ┌─────────────┐    ┌────────────────────┐  │  │ │
│  │  │  │    Auth     │    │    Milestone       │  │  │ │
│  │  │  │ Controller  │    │    Controller      │  │  │ │
│  │  │  └──────┬──────┘    └──────┬─────────────┘  │  │ │
│  │  └─────────┼──────────────────┼────────────────┘  │ │
│  │            │                   │                    │ │
│  │  ┌─────────┴───────────────────┴────────────────┐  │ │
│  │  │             Service Layer                     │  │ │
│  │  │  ┌──────────┐    ┌────────────────────────┐ │  │ │
│  │  │  │   User   │    │      Milestone         │ │  │ │
│  │  │  │ Service  │    │      Service           │ │  │ │
│  │  │  └────┬─────┘    └──────┬─────────────────┘ │  │ │
│  │  └───────┼──────────────────┼───────────────────┘  │ │
│  │          │                   │                      │ │
│  │  ┌───────┴───────────────────┴───────────────────┐ │ │
│  │  │           Repository Layer (JPA)              │ │ │
│  │  │  ┌──────────┐    ┌────────────────────────┐  │ │ │
│  │  │  │   User   │    │      Milestone         │  │ │ │
│  │  │  │   Repo   │    │      Repository        │  │ │ │
│  │  │  └────┬─────┘    └──────┬─────────────────┘  │ │ │
│  │  └───────┼──────────────────┼────────────────────┘ │ │
│  └──────────┼──────────────────┼────────────────────┘ │
└─────────────┼──────────────────┼──────────────────────┘
              │                   │
              │    JDBC/JPA      │
              │                   │
┌─────────────┴───────────────────┴──────────────────────┐
│                  PostgreSQL Database                    │
│                                                          │
│  ┌─────────────┐          ┌──────────────────────────┐ │
│  │    users    │          │      milestones          │ │
│  │   table     │──────────│        table             │ │
│  │             │  1   *   │                          │ │
│  └─────────────┘          └──────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Technologies
- **React 18.3.1**: Core UI library
- **React Router DOM 7.5.1**: Client-side routing
- **Axios**: HTTP client for API communication
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation

### Backend Technologies
- **Spring Boot 3.5.5**: Application framework
- **Spring Security**: Authentication & authorization
- **Spring Data JPA**: Data persistence
- **PostgreSQL**: Relational database
- **JWT (JSON Web Tokens)**: Stateless authentication
- **Lombok**: Reduce Java boilerplate
- **Maven**: Build automation and dependency management

### Development Tools
- **CRACO**: Create React App Configuration Override
- **ESLint**: JavaScript linting
- **PostCSS & Autoprefixer**: CSS processing
- **Maven Wrapper**: Consistent Maven version

## Backend Architecture

### Layer Structure

#### 1. Controller Layer
- **Responsibility**: Handle HTTP requests and responses
- **Components**: `AuthController`, `MilestoneController`
- **Pattern**: RESTful API design
- **Features**:
  - Request validation
  - Response formatting
  - Exception handling

#### 2. Service Layer
- **Responsibility**: Business logic implementation
- **Components**: `UserService`, `MilestoneService`
- **Pattern**: Service pattern
- **Features**:
  - Data validation
  - Business rules enforcement
  - Transaction management

#### 3. Repository Layer
- **Responsibility**: Data access and persistence
- **Components**: `UserRepository`, `MilestoneRepository`
- **Pattern**: Repository pattern (Spring Data JPA)
- **Features**:
  - CRUD operations
  - Custom queries
  - Database abstraction

#### 4. Security Layer
- **Components**:
  - `SecurityConfig`: Security configuration
  - `JWTAuthFilter`: JWT token validation
  - `JWTUtils`: Token generation and parsing
  - `CustomUserDetailsService`: User authentication
- **Features**:
  - JWT-based authentication
  - Role-based access control
  - Password encryption (BCrypt)
  - CORS configuration

#### 5. Model Layer
- **Components**: `User`, `Milestone`
- **Pattern**: Entity models with JPA annotations
- **Features**:
  - Object-Relational Mapping
  - Validation constraints
  - Lifecycle callbacks

#### 6. DTO Layer
- **Components**: `UserDTO`, `MilestoneDTO`, `Response`, `LoginRequest`
- **Purpose**: Data transfer between layers
- **Benefits**:
  - Decoupling
  - Security (hide sensitive data)
  - Flexibility in API design

## Frontend Architecture

### Component Structure

#### 1. Page Components
- **MilestoneTracker**: Main dashboard page
- **Features**:
  - List view of milestones
  - Filtering and sorting
  - CRUD operations

#### 2. Feature Components
- **MilestoneCard**: Individual milestone display
- **MilestoneForm**: Create/edit milestone form
- **Navbar**: Navigation and user menu
- **ProtectedRoute**: Authentication guard

#### 3. UI Components (Radix UI)
- **Reusable Components**: Button, Input, Select, Dialog, Card, etc.
- **Location**: `src/components/ui/`
- **Styling**: Tailwind CSS classes

#### 4. Context Providers
- **AuthContext**: Global authentication state
- **Features**:
  - User session management
  - Token storage
  - Authentication status

#### 5. Services
- **apiService**: Centralized API communication
- **Features**:
  - Axios instance configuration
  - Request/response interceptors
  - Error handling

#### 6. Custom Hooks
- **useToast**: Toast notifications
- **useAuth**: Authentication utilities

## Database Design

### Tables

#### users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);
```

#### milestones
```sql
CREATE TABLE milestones (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    achieve_date DATE,
    created_date DATE NOT NULL,
    completed_date DATE,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Relationships
- **One-to-Many**: One User can have many Milestones
- **Cascade**: Deleting a user deletes their milestones

### Indexes
- Primary keys on both tables (auto-indexed)
- Unique index on `users.email`
- Foreign key index on `milestones.user_id`

## Security Architecture

### Authentication Flow

1. **User Registration**:
   ```
   Client → POST /auth/register → Server
   Server → Hash Password (BCrypt)
   Server → Save User to Database
   Server → Generate JWT Token
   Server → Return Token to Client
   ```

2. **User Login**:
   ```
   Client → POST /auth/login → Server
   Server → Validate Credentials
   Server → Generate JWT Token
   Server → Return Token to Client
   ```

3. **Authenticated Requests**:
   ```
   Client → API Request + JWT Token → Server
   Server → JWTAuthFilter validates token
   Server → Extract user information
   Server → Process request with user context
   Server → Return response
   ```

### Security Features
- **Password Hashing**: BCrypt with salt
- **JWT Tokens**: Signed with HMAC-SHA256
- **Token Expiration**: 24 hours (configurable)
- **CORS**: Configured for cross-origin requests
- **SQL Injection Protection**: JPA parameterized queries
- **XSS Protection**: React's built-in escaping

## Data Flow

### Creating a Milestone

```
1. User fills form in MilestoneForm component
2. Form validation (React Hook Form + Zod)
3. apiService.createMilestone() called
4. Axios sends POST request with JWT token
5. JWTAuthFilter validates token
6. MilestoneController receives request
7. MilestoneService validates and processes data
8. MilestoneRepository saves to database
9. Response sent back through layers
10. Client updates UI with new milestone
11. Toast notification shown to user
```

### Retrieving Milestones

```
1. Component mounts (MilestoneTracker)
2. useEffect triggers loadMilestones()
3. apiService.getAllMilestones() called
4. Axios sends GET request with JWT token
5. JWTAuthFilter validates token
6. MilestoneController receives request
7. MilestoneService retrieves user's milestones
8. MilestoneRepository queries database
9. Data transformed to DTOs
10. Response sent to client
11. State updated with milestones
12. UI renders milestone list
```

## Design Patterns

### Backend Patterns
- **MVC Pattern**: Separation of concerns
- **Repository Pattern**: Data access abstraction
- **DTO Pattern**: Data transfer objects
- **Dependency Injection**: Spring's IoC container
- **Singleton Pattern**: Spring beans
- **Filter Pattern**: JWT authentication filter

### Frontend Patterns
- **Component Pattern**: Reusable React components
- **Container/Presenter**: Smart vs. presentational components
- **Context API**: Global state management
- **Custom Hooks**: Reusable stateful logic
- **Service Pattern**: Centralized API calls

## Performance Considerations

### Backend
- **Connection Pooling**: HikariCP (Spring Boot default)
- **Lazy Loading**: JPA lazy fetch for relationships
- **Caching**: Potential for future implementation
- **Pagination**: Can be added for large datasets

### Frontend
- **Code Splitting**: React.lazy() for dynamic imports
- **Memoization**: React.memo() and useMemo()
- **Debouncing**: Search input optimization
- **Virtual Scrolling**: Future improvement for large lists

## Scalability

### Current Architecture
- **Vertical Scaling**: Increase server resources
- **Horizontal Scaling**: Multiple instances with load balancer
- **Database**: PostgreSQL can handle millions of records

### Future Enhancements
- **Caching Layer**: Redis for session and data caching
- **Message Queue**: RabbitMQ/Kafka for async processing
- **Microservices**: Split into separate services
- **CDN**: Static asset delivery
- **Database Replication**: Read replicas for scaling reads

## Monitoring and Logging

### Current Implementation
- **Spring Boot Actuator**: Health checks and metrics
- **Console Logging**: Development debugging
- **Error Boundaries**: React error handling

### Future Enhancements
- **Centralized Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Application Monitoring**: New Relic, DataDog
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel

## Deployment Architecture

### Development
- **Frontend**: `npm start` on port 3000
- **Backend**: `mvn spring-boot:run` on port 8080
- **Database**: Local PostgreSQL instance

### Production (Recommended)
- **Frontend**: Built static files served by Nginx/Apache
- **Backend**: JAR file deployed to application server
- **Database**: Managed PostgreSQL (AWS RDS, Heroku Postgres)
- **Reverse Proxy**: Nginx for load balancing and SSL
- **Containerization**: Docker containers
- **Orchestration**: Kubernetes for container management

---

Last Updated: October 26, 2025
