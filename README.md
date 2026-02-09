# Laptop Store (Endterm Project) — Advanced Databases (NoSQL)

## Project Overview
Laptop Store is a full-stack web application built with:
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Frontend: React + Vite + TailwindCSS

The project demonstrates:
- Advanced NoSQL data modeling (embedded + referenced documents)
- REST API design with business logic
- Authentication & Authorization (JWT + roles)
- Advanced MongoDB update/delete operators
- Aggregation pipelines for analytics
- Indexing and query optimization

---

## System Architecture
**Frontend (React)** communicates with **Backend (Express REST API)** through HTTP requests.
The backend performs:
- CRUD operations
- Validation & business logic
- Authentication and authorization
- Aggregations and optimized queries

MongoDB stores all application data.

---

## Database Schema (Collections)

### 1) users
- username (String)
- email (String, unique)
- password (String, hashed)
- role (user/admin)

Indexes:
- { email: 1 } unique

### 2) laptops
- name (String)
- brand (String)
- price (Number)
- stock (Number)
- imageUrl (String)
- description (String)

Indexes:
- Compound: { brand: 1, price: 1 }
- Text index: { name: "text", brand: "text", description: "text" }

### 3) carts
- userId (ObjectId -> users)
- items[] (embedded array)
  - laptopId (ObjectId -> laptops)
  - quantity (Number)

Indexes:
- { userId: 1 } unique
- { userId: 1, "items.laptopId": 1 }

### 4) orders
- userId (ObjectId -> users)
- items[] (embedded snapshot)
  - laptopId
  - name
  - brand
  - priceAtPurchase
  - quantity
- totalPrice (Number)
- status (pending/paid/shipped/cancelled)

Indexes:
- { userId: 1, createdAt: -1 }

---

## MongoDB Operators Used

### Advanced Updates
- $inc (decrease laptop stock, increase cart item quantity)
- $push (add new item into cart)
- $pull (remove item from cart)
- $set (set cart quantity, clear cart, update order status)
- Positional operator ($) for updating embedded array elements

### Aggregation Framework
- $match
- $unwind
- $lookup
- $group
- $sort
- $limit
- $project
- $addFields

---

## API Documentation (Main Endpoints)

### Auth
- POST /auth/register
- POST /auth/login

### Laptops
- GET /laptops
- GET /laptops/:id
- POST /laptops (admin)
- PUT /laptops/:id (admin)
- DELETE /laptops/:id (admin)

### Cart (authorized user)
- GET /cart
- PATCH /cart/add/:laptopId
- PATCH /cart/set/:laptopId
- DELETE /cart/remove/:laptopId
- DELETE /cart/clear

### Orders
User:
- POST /orders/checkout
- GET /orders/my

Admin:
- GET /orders
- GET /orders/:id
- PATCH /orders/:id/status
- DELETE /orders/:id

### Analytics (Aggregation)
- GET /analytics/top-brands (admin)
- GET /analytics/cart-total (user)

---

## Indexing and Optimization Strategy
Indexes were added to support:
- Fast login lookup by email (users)
- Filtering and sorting laptops by brand + price (compound index)
- Full text search for catalog (text index)
- Fast cart lookup by userId (unique)
- Fast order history retrieval by userId + createdAt

---

## Security
Authentication:
- JWT token

Authorization:
- Role-based access control
- adminOnly middleware protects admin endpoints

---

## Frontend Pages
- Home
- Register
- Login
- Catalog
- Cart
- Orders
- Admin Laptops (CRUD)
- Analytics (aggregation result table)

---

## How to Run

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev