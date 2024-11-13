
# 🎫 Ticket Reservation System API - Backend

This is the backend service for the Ticket Reservation System, designed to handle event management and ticket reservation functionalities.

## 📜 Project Overview

The Ticket Reservation System API allows users to:
- 🔍 View available events
- 🎟️ Reserve tickets for specific events
- 🔐 Administrators can manage events (create, update, and delete)

The backend is designed as a RESTful API using [Node.js with Express](https://expressjs.com/) (or PHP with Laravel as an alternative) and is fully dockerized.

## ⚙️ Requirements

- Node.js (or PHP for Laravel implementation)
- Docker
- Docker Compose
- MySQL or MongoDB (configurable database choice)

## 🚀 Setup

### 1. 📂 Clone the Repository

```bash
git clone https://github.com/codediaz/ct-candidates-app-backend.git
cd ct-candidates-app-backend
```

### 2. 🔧 Environment Variables

Create a `.env` file in the backend root directory to configure environment variables like database connection and other configurations.

Example `.env` file:

```
DATABASE_URL=mysql://user:password@localhost:3306/ticket_system
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 3. 🐳 Docker Setup

Ensure Docker and Docker Compose are installed on your machine. Build and start the containers using the following command:

```bash
docker-compose up --build
```

This will start the backend service along with the database (configured in Docker Compose).

### 4. 📄 API Documentation

The API documentation is available in the `openapi.yaml` file. Use Swagger UI or any OpenAPI viewer to load and explore the API endpoints.

To view the documentation locally, you can use tools like [Swagger Editor](https://editor.swagger.io/) by loading the `openapi.yaml` file.

## 🛠️ Usage

### Endpoints Overview

The backend provides the following key endpoints:

- `GET /events` - List all available events
- `GET /events/{id}` - Get details of a specific event
- `POST /events` - Add a new event (Admin only)
- `PUT /events/{id}` - Edit an existing event
- `DELETE /events/{id}` - Delete an event (Admin only)
- `POST /reservations` - Create a new ticket reservation

Refer to `openapi.yaml` for detailed specifications and request/response schemas.

## 🤝 Contribution

### Pull Request Guidelines for Candidates

If you are a candidate completing this technical test, please ensure your Pull Request (PR) includes:
1. A clear title summarizing the changes (e.g., "Implement event reservation feature").
2. A detailed description covering:
   - The purpose of the PR.
   - The main changes introduced, with a breakdown of each endpoint or functionality added.
   - Any new dependencies or setup steps.
   - Instructions for testing your implementation, if applicable.
3. Ensure that your code follows best practices and passes any tests provided.

Follow the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) model.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 📬 Contact

For any inquiries, please reach out to [Sergio Díaz](mailto:sergio.diaz@funiber.org).
