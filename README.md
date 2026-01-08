Todo App Backend – Technical Documentation & Analysis

1. Project Overview

This backend application is a Task Management API developed using Node.js, Express.js, and MongoDB with Mongoose ODM. It supports:
•	User registration and login with secure password hashing
•	JWT-based authentication to protect routes
•	User management (viewing all users, viewing individual users)
•	Task management with CRUD functionality, linked to authenticated users
•	Structured MVC-like architecture with separate folders for models, controllers, services, middleware, and routes
Purpose:
This API serves as the backend for a "Todo" application, providing persistence with MongoDB and an authentication system for secure, multi-user use.

2. Architecture and Folder Structure

Implemented a clean separation of concerns:
project/
├── config/              # Non-request-specific config
│   └── database.js      # Database connection, central model export
├── models/              # Mongoose schema definitions
│   ├── user.js
│   └── task.js
├── services/            # Business/data access logic (auth helpers, etc.)
│   └── userService.js
├── controllers/         # Request handling logic
│   ├── authController.js
│   ├── userController.js
│   └── taskController.js
├── middleware/          # Express middlewares
│   └── authMiddleware.js
├── routes/              # Route definitions
│   ├── auth.js
│   ├── users.js
│   └── tasks.js
├── server.js            # App bootstrap
└── .env                 # Environment variables


3. Database Layer (Models)

3.1 User Model
•	Fields: name, lastname, email (unique), password
•	Security: Password is always stored hashed via bcrypt.js at creation
•	Collection: users

3.2 Task Model
•	Fields: title, description, status (enum: todo, in-progress, done), user_id (ObjectId reference to User)
•	Relationships: Linked to a specific user for multi-user separation
•	Collection: tasks

4. Services Layer
Introduced a user service to encapsulate operations like:
•	createUser() – hashes password and saves new user
•	findUserByEmail() – reusable email lookup method
Benefits:
•	Keeps controllers slim
•	Logic is reusable across different controllers
•	Easier to unit-test without Express request/response objects

5. Controllers

5.1 Auth Controller
•	register:
o	Validates request data
o	Checks for existing email
o	Calls createUser service
o	Issues JWT token valid for 24h
•	login:
o	Validates credentials
o	Verifies password with bcrypt
o	Returns JWT and user data
Security Practices:
•	Password hashing with bcrypt
•	Token signing with a secret from .env
•	Clear error messages for invalid credentials

5.2 User Controller
•	getAllUsers: Returns all users excluding passwords
•	getUserById: Returns a single user without the password
•	Both routes are protected by authenticateToken

5.3 Task Controller
Replaced mock data with MongoDB queries via Mongoose:
•	getAllTasks: Returns all tasks (optional admin usage)
•	getTasks: Returns tasks for the authenticated user
•	getTaskById, addTask, editTask, removeTask provide full CRUD

6. Middleware

authenticateToken
•	Extracts JWT from Authorization header
•	Verifies token with JWT_SECRET
•	Injects user info into req.user
•	Rejects requests with no/invalid tokens

7. Routes
Mounted modular routes in server.js:
•	/api/auth → Registration/Login
•	/api/users → Protected user info
•	/api/tasks → Protected tasks CRUD

Each route file imports the relevant controller and applies middleware where needed.

8. Environment Configuration
Not committed to version control for security.

9. Implementation Decisions & Rationale
a)Moved models to /models so database.js is now smaller and only handles connection & exports — cleaner separation and easier scaling.
b)Introduced Service Layer (userService.js) to encapsulate user-related DB logic, making it reusable in multiple controllers.
c)Refactored from mock data to MongoDB queries for tasks.
d)Standardized model naming to avoid .find() on undefined errors (e.g., Task vs Todo).
e)Protected all sensitive endpoints with authenticateToken middleware.

10. Example API Workflow
i) Register User
POST /api/auth/register with JSON body:
{
  "name": "Alice",
  "lastname": "Smith",
  "email": "alice@example.com",
  "password": "pass1234"
}

ii) Login
POST /api/auth/login → Get JWT token
iii) Create Task
POST /api/tasks with header Authorization: Bearer <token> and:
{
  "title": "Finish project",
  "description": "Due soon"
}

iv) View My Tasks
GET /api/tasks with token in header
v) Admin Query of All Tasks
GET /api/tasks/all

Conclusion
Implemented a modular Node.js backend with authentication, MongoDB data persistence, and clean project structure. 
The separation between models, controllers, services, and routes makes it easy to expand and maintain. 
The switch from mock data to live MongoDB models is a key milestone—now the app is production-ready in structure.
The architecture follows industry best practices and provides a strong foundation for scaling the application with additional features like role-based permissions, real-time updates, and advanced querying capabilities.




ToDo App – Azure Deployment Documentation

Overview
This document describes the complete deployment of a full-stack ToDo application to Microsoft Azure.
The application consists of a React (Vite) frontend with Typescript, a Node.js backend, and a MongoDB-compatible database hosted on Azure Document DB.
The deployment includes CI/CD automation and secret management

Architecture
- Frontend: Azure Static Web Apps
- Backend: Azure App Service (Node.js, Linux)
- Database: Azure Cosmos DB (MongoDB API)
- Secrets: Azure Key Vault with Managed Identity
- CI/CD: GitHub Actions

Backend Deployment
1. Created an Azure App Service (Linux, Node.js).
2. Configured application settings (MONGODB_URI, JWT_SECRET).
3. Enabled System Assigned Managed Identity.
4. Granted Key Vault Secrets User role to the App Service.
5. Connected backend to Cosmos DB using Document DB.
6. Verified backend via health endpoint.

Database Setup
- Created Cosmos DB account using Document.
- Migrated local MongoDB data using MongoDB Compass.
- Used “Self (always this cluster)” connection string.

Secrets Management
- Stored MongoDbUri and JwtSecret in Azure Key Vault.
- Referenced secrets using @Microsoft.KeyVault syntax.
- Resolved RBAC and networking access issues.

Frontend Deployment
1. Built React frontend using Vite (output: dist).
2. Created Azure Static Web App linked to GitHub repository.
3. Configured GitHub Actions CI/CD workflow.
4. Injected VITE_API_BASE_URL at build time.
5. Configured SPA routing with staticwebapp.config.json.

CI/CD
- Automated builds and deployments via GitHub Actions.
- Separate build and deploy steps for frontend.
- Environment variables injected at build time.

API Integration
- Ensured frontend calls backend using absolute API URL.

Troubleshooting
- Fixed undefined environment variables in Azure static web apps using Github Actions and Github environmental variables.
- Resolved Method Not Allowed errors by correcting API URLs.
- Addressed quota and RBAC issues.
- Fixed SPA refresh 404 using navigation fallback.

Conclusion
The application is fully deployed to Azure using best practices.
The setup demonstrates cloud-native architecture, security, automation, and scalability.

