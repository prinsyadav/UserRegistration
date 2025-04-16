# User Registration System

A full-stack application featuring a registration API with JWT authentication, Redis client validation, Kafka message queuing, and PostgreSQL database storage, with a React frontend for user management.

## Project Overview

This project implements a complete user registration system with a microservices architecture. It consists of:

1. A Spring Boot backend that:

   - Accepts user registration requests
   - Validates client credentials using Redis
   - Sends valid registrations to Kafka for async processing
   - Includes JWT security and rate limiting
   - Stores user data in PostgreSQL

2. A React frontend that:
   - Provides a user-friendly registration form
   - Displays registered users in a sortable/searchable table
   - Implements secure authentication with JWT

## Architecture

![Architecture Diagram](https://via.placeholder.com/800x400?text=Registration+System+Architecture)

### Components

- **API Gateway**: Spring Boot REST API with JWT-based authentication
- **Redis**: Stores client status information
- **Kafka**: Message broker for asynchronous processing
- **PostgreSQL**: Persistent storage for user registration data
- **React Frontend**: Modern UI for registration and user management

### Workflow

1. User submits registration form in the frontend
2. Backend API validates client status from Redis
3. If client is active, data is queued to Kafka topic
4. Kafka consumer processes messages and saves to PostgreSQL
5. Users can view all registrations in the frontend table

## Technologies

### Backend

- Java 17
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- Spring Kafka
- Spring Data Redis
- PostgreSQL
- Lombok

### Frontend

- React 19
- React Router 7
- Material UI 7
- Axios
- Vite

### Infrastructure

- Docker & Docker Compose
- Kafka
- Zookeeper
- Redis
- PostgreSQL
- PgAdmin

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Java 17+
- Node.js 18+
- npm or yarn

### Running with Docker

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/registration-system.git
   cd registration-system
   ```

2. Start the infrastructure services:

   ```bash
   docker-compose up -d
   ```

3. Start the backend service:

   ```bash
   cd prince
   ./mvnw spring-boot:run
   ```

4. Start the frontend application:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - PgAdmin: http://localhost:7001 (email: pgadmin@pgadmin.org, password: admin)

### Initial Setup

1. When the application first starts, default users are created:

   - Admin user: username `admin`, password `admin123`
   - Regular user: username `user`, password `user123`

2. The client with ID `10` is automatically set to "active" status in Redis

## API Endpoints

### Authentication

```
POST /api/v1/authenticate
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Registration

```
POST /api/v1/register
Authorization: Bearer {jwt-token}
Client_id: 10
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "city": "New York"
}
```

### Get Users

```
GET /api/v1/users
Authorization: Bearer {jwt-token}
```

## Security Features

1. **JWT Authentication**: All API requests require a valid JWT token
2. **Role-Based Access**: Different permissions for admin and regular users
3. **Rate Limiting**: Prevents API abuse using Redis-based token bucket algorithm
4. **Client Validation**: Ensures only active clients can register users

## Data Flow

1. **Registration Request**:

   - Frontend sends registration data to backend API
   - API validates client status from Redis
   - Valid registrations are sent to Kafka topic "registration"

2. **Data Processing**:
   - Kafka consumer reads from "registration" topic
   - User data is saved to PostgreSQL database
   - Users can be viewed in the frontend table

## Development

### Backend Structure

```
prince/
├── config/ - Configuration classes (Kafka, Redis, Security)
├── controller/ - REST API endpoints
├── dto/ - Data transfer objects
├── entity/ - JPA entities
├── exception/ - Custom exceptions and handlers
├── listener/ - Kafka consumers
├── repository/ - Data access interfaces
├── security/ - JWT and authentication
└── service/ - Business logic
```

### Frontend Structure

```
frontend/
├── components/ - Reusable UI components
├── context/ - React context providers
├── pages/ - Page components
└── services/ - API communication
```

## Testing

Run backend tests with:

```bash
cd prince
./mvnw test
```

Run frontend tests with:

```bash
cd frontend
npm test
```

## Deployment

The application is containerized and can be deployed using Docker Compose:

```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
