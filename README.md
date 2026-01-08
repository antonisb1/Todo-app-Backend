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

1.	Moved models to /models so database.js is now smaller and only handles connection & exports — cleaner separation and easier scaling
2.	Introduced Service Layer (userService.js) to encapsulate user-related DB logic, making it reusable in multiple controllers
3.	Refactored from mock data to MongoDB queries for tasks
4.	Standardized model naming to avoid .find() on undefined errors (e.g., Task vs Todo)
5.	Protected all sensitive endpoints with authenticateToken middleware

10. Example API Workflow
1. Register User
POST /api/auth/register with JSON body:
{
  "name": "Alice",
  "lastname": "Smith",
  "email": "alice@example.com",
  "password": "pass1234"
}

2. Login
POST /api/auth/login → Get JWT token
3. Create Task
POST /api/tasks with header Authorization: Bearer <token> and:
{
  "title": "Finish project",
  "description": "Due soon"
}

4. View My Tasks
GET /api/tasks with token in header
5. Admin Query of All Tasks
GET /api/tasks/all

Conclusion
Implemented a modular Node.js backend with authentication, MongoDB data persistence, and clean project structure. 
The separation between models, controllers, services, and routes makes it easy to expand and maintain. 
The switch from mock data to live MongoDB models is a key milestone—now the app is production-ready in structure.
The architecture follows industry best practices and provides a strong foundation for scaling the application with additional features like role-based permissions, real-time updates, and advanced querying capabilities.
