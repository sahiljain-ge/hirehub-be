# 📦 Project Folder Structure & Architecture

This project follows a modular and scalable architecture to ensure
maintainability, readability, and separation of concerns. All core
application logic resides inside the `src` directory.

## 📁 Directory Overview

The 📁`src` folder contains the complete source code of the application
(excluding test files, which can be placed in a separate `tests`
directory).

### 📂 config

This folder contains all configuration and setup-related code for
external libraries and modules.

Examples:

- Environment variable setup (dotenv)
- Logging library configuration
- Database configuration
- Third-party service initialization

Purpose: To centralize all configuration logic and keep it separate from business
logic.

---

### 📂 routes

Responsible for defining application routes and mapping them to
controllers and middlewares.

Responsibilities:

- Register API endpoints
- Attach middleware functions (authentication, validation, etc.)
- Connect routes to controllers

---

### 📂 middlewares

Middlewares intercept incoming requests before they reach the controller
layer.

Responsibilities:

- Request validation
- Authentication & authorization
- Logging
- Error handling
- Request preprocessing

---

### 📂 controllers

Controllers act as the interface between incoming HTTP requests and the
business logic layer.

Responsibilities:

- Receive request data from clients
- Pass data to the service layer
- Format and send API responses
- Handle request/response lifecycle

Controllers do not contain business logic.

---

### 📂 services

Contains the core business logic of the application.

Responsibilities:

- Implement application rules and workflows
- Communicate with repositories for database operations
- Process business data

---

### 📂 repositories

Handles all database-related operations.

Responsibilities:

- Write raw SQL or ORM queries
- Perform CRUD operations
- Interact directly with the database
- Abstract database logic from services

---

### 📂 utils

Contains helper utilities and reusable components.

Examples:

- Helper functions
- Custom error classes
- Constants
- Common response formatters

---

## 📄 app.ts

Responsible for configuring the Express application.

Key Responsibilities:

- Initialize the Express app
- Register middlewares (body parser, CORS, logging, etc.)
- Register routes
- Setup global error handling
- Export the configured Express instance

This file focuses only on application setup.

---

## 📄 server.ts

Entry point of the application.

Key Responsibilities:

- Import the Express app from app.ts
- Configure the server port
- Start the HTTP server using app.listen()
- Handle server-level configurations

---

## 🏗 Architecture Flow

Client Request\
→ Routes\
→ Middlewares\
→ Controllers\
→ Services\
→ Repositories\
→ Database

---

## Benefits

- Clear separation of concerns
- Scalable and maintainable codebase
- Easy debugging and testing
- Follows industry best practices
- Clean layered architecture
