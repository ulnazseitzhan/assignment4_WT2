Laptop Store API (Assignment 4)
# Project Overview

This project is a backend application for an online laptop store.
It is a refactored version of Assignment 3, redesigned using MVC architecture and enhanced with authentication, authorization, and security features.

The project demonstrates industry-standard backend practices including JWT authentication, Role-Based Access Control (RBAC), and password hashing.

# Project Architecture (MVC)
project-root/
│
├── server.js
├── .env
│
├── models/
│   ├── Laptop.js
│   ├── User.js
│   └── Cart.js
│
├── routes/
│   ├── laptops.js
│   ├── auth.js
│   └── cart.js
│
├── middleware/
│   └── auth.js
│
└── public/
    └── index.html


Models — MongoDB schemas (Laptop, User, Cart)

Routes — API endpoints and request handling

Middleware — authentication and authorization logic

Public — simple frontend for demonstration

# Data Models
🔹 Laptop (Primary Object)

Represents products in the store.

Fields:

name

brand

price

description

timestamps

Supports full CRUD operations.

🔹 User

Used for authentication and authorization.

Fields:

email (unique)

password (hashed)

role (user or admin)

🔹 Cart (Secondary Object)

Represents a user’s shopping cart.

Fields:

userId (reference to User)

items (references to Laptop)

# Authentication & Security
Password Hashing

Passwords are hashed using bcrypt

Plain-text passwords are never stored

JWT Authentication

Users authenticate via /auth/login

Server issues a JWT token

Token must be sent in Authorization header:

Authorization: Bearer <token>

# Role-Based Access Control (RBAC)

Two roles are supported:

user

admin

Access rules:

GET /laptops → public access

POST /laptops → admin only

PUT /laptops/:id → admin only

DELETE /laptops/:id → admin only

Cart operations → authenticated users only

Authorization is enforced using middleware.

# API Endpoints
Auth

POST /auth/register — register a new user

POST /auth/login — login and receive JWT

Laptops

GET /laptops — get all laptops (public)

POST /laptops — create laptop (admin)

PUT /laptops/:id — update laptop (admin)

DELETE /laptops/:id — delete laptop (admin)

Cart

POST /cart/add/:id — add laptop to cart (user)

GET /cart — get current user cart

# How to Run the Project
1. Install dependencies
npm install

2. Configure environment variables

Create a .env file:

JWT_SECRET=supersecretkey123

3. Start MongoDB

Ensure MongoDB is running locally.

4. Run the server
node server.js


Server will start at:

http://localhost:3000

# Testing

All endpoints can be tested using Postman.
Role-based access is verified by logging in as admin and user.

# Notes

The frontend is intentionally simple and is used only to demonstrate API functionality.
The main focus of this assignment is backend architecture, security, and role-based access control.

# Author

Ulnaz Seitzhan
Assignment 4 — Web Backend Development