# API Documentation

This document provides detailed information about the Milestone Tracker API endpoints.

## Base URL

```
http://localhost:8080
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. After logging in, include the token in the Authorization header for all protected endpoints:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this general structure:

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {},
  "error": null
}
```

## Endpoints

### Authentication Endpoints

#### Register a New User

Creates a new user account.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123",
    "role": "USER"
  }
  ```

- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "statusCode": 200,
      "message": "User registered successfully",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "role": "USER",
      "expirationTime": "24 Hours"
    }
    ```

- **Error Response**:
  - **Code**: 400
  - **Content**:
    ```json
    {
      "statusCode": 400,
      "message": "User already exists"
    }
    ```

#### Login

Authenticates a user and returns a JWT token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "SecurePassword123"
  }
  ```

- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "statusCode": 200,
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "role": "USER",
      "expirationTime": "24 Hours"
    }
    ```

- **Error Response**:
  - **Code**: 401
  - **Content**:
    ```json
    {
      "statusCode": 401,
      "message": "Invalid credentials"
    }
    ```

---

### Milestone Endpoints

All milestone endpoints require authentication.

#### Get All Milestones

Retrieves all milestones for the authenticated user.

- **URL**: `/milestones/all`
- **Method**: `GET`
- **Auth Required**: Yes
- **Request Headers**:
  ```
  Authorization: Bearer <token>
  ```

- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    [
      {
        "id": 1,
        "title": "Complete Project Documentation",
        "description": "Write comprehensive documentation for the project",
        "completed": false,
        "achieveDate": "2025-11-15",
        "createdDate": "2025-10-26",
        "completedDate": null
      },
      {
        "id": 2,
        "title": "Deploy to Production",
        "description": "Deploy the application to production server",
        "completed": true,
        "achieveDate": "2025-10-30",
        "createdDate": "2025-10-20",
        "completedDate": "2025-10-28"
      }
    ]
    ```

- **Error Response**:
  - **Code**: 401
  - **Content**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized access"
    }
    ```

#### Get Milestone by ID

Retrieves a specific milestone by its ID.

- **URL**: `/milestones/{id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id` (required) - The ID of the milestone
- **Request Headers**:
  ```
  Authorization: Bearer <token>
  ```

- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "id": 1,
      "title": "Complete Project Documentation",
      "description": "Write comprehensive documentation for the project",
      "completed": false,
      "achieveDate": "2025-11-15",
      "createdDate": "2025-10-26",
      "completedDate": null
    }
    ```

- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "statusCode": 404,
      "message": "Milestone not found"
    }
    ```

#### Create a New Milestone

Creates a new milestone for the authenticated user.

- **URL**: `/milestones/create`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "title": "Launch Marketing Campaign",
    "description": "Plan and execute the product marketing campaign",
    "achieveDate": "2025-12-01"
  }
  ```

- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "statusCode": 200,
      "message": "Milestone created successfully",
      "milestone": {
        "id": 3,
        "title": "Launch Marketing Campaign",
        "description": "Plan and execute the product marketing campaign",
        "completed": false,
        "achieveDate": "2025-12-01",
        "createdDate": "2025-10-26",
        "completedDate": null
      }
    }
    ```

- **Error Response**:
  - **Code**: 400
  - **Content**:
    ```json
    {
      "statusCode": 400,
      "message": "Invalid milestone data"
    }
    ```

#### Update a Milestone

Updates an existing milestone.

- **URL**: `/milestones/update/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id` (required) - The ID of the milestone to update
- **Request Headers**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "title": "Launch Marketing Campaign - Updated",
    "description": "Updated description",
    "completed": true,
    "achieveDate": "2025-12-01"
  }
  ```

- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "statusCode": 200,
      "message": "Milestone updated successfully",
      "milestone": {
        "id": 3,
        "title": "Launch Marketing Campaign - Updated",
        "description": "Updated description",
        "completed": true,
        "achieveDate": "2025-12-01",
        "createdDate": "2025-10-26",
        "completedDate": "2025-10-26"
      }
    }
    ```

- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "statusCode": 404,
      "message": "Milestone not found"
    }
    ```
  - **Code**: 403
  - **Content**:
    ```json
    {
      "statusCode": 403,
      "message": "Unauthorized to update this milestone"
    }
    ```

#### Delete a Milestone

Deletes a milestone.

- **URL**: `/milestones/delete/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id` (required) - The ID of the milestone to delete
- **Request Headers**:
  ```
  Authorization: Bearer <token>
  ```

- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "statusCode": 200,
      "message": "Milestone deleted successfully"
    }
    ```

- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "statusCode": 404,
      "message": "Milestone not found"
    }
    ```
  - **Code**: 403
  - **Content**:
    ```json
    {
      "statusCode": 403,
      "message": "Unauthorized to delete this milestone"
    }
    ```

---

## Error Codes

The API uses standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing authentication token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

## Data Models

### User

```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "string (USER | ADMIN)"
}
```

### Milestone

```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "achieveDate": "date (YYYY-MM-DD)",
  "createdDate": "date (YYYY-MM-DD)",
  "completedDate": "date (YYYY-MM-DD) | null"
}
```

## Rate Limiting

Currently, there are no rate limits on the API. This may change in future versions.

## Versioning

The API is currently in version 1.0. Future versions will be documented separately.

## Support

For API-related questions or issues:
- Open an issue on [GitHub](https://github.com/Skywalker690/milestone-tracker1/issues)
- Check the [Contributing Guide](CONTRIBUTING.md) for more information

---

Last Updated: October 26, 2025
