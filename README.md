# ✒️ Inkwell — A Full-Stack Blog Application

Inkwell is a modern full-stack blogging platform where users can create, manage, and explore blog posts.

The application is built with **React** on the frontend and **Spring Boot** on the backend, with **MySQL** for data persistence and **Cloudinary** for image management.

---

## 🚀 Features

### 👤 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based authorization
- Admin and normal user roles
- Protected routes
- Users can modify only their own posts
- Admins can manage posts across users

### 📝 Blog Posts
- Create blog posts
- View all posts
- View individual posts
- Update posts
- Delete posts
- Search posts
- Pagination
- Category-based posts
- User-specific posts

### 🖼️ Image Upload
- Upload images for blog posts
- Cloudinary integration
- Store image information with posts
- Display uploaded images on the frontend

### 💬 Comments
- Add comments to posts
- View comments
- Delete comments
- Comments are associated with blog posts

### 🗂️ Categories
- Create and manage categories
- Assign categories to posts
- Filter posts by category

### 🎨 Frontend
- Responsive React UI
- Modern blog-style design
- Featured story section
- Blog post cards
- Post detail page
- Login/Register pages
- User profile
- Dashboard
- Post editor
- Category pages

---

# 🛠️ Tech Stack

## Frontend

- React
- JavaScript
- React Router
- Tailwind CSS
- Lucide React
- Vite
- Axios

## Backend

- Java
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate
- Spring Security
- JWT
- Lombok
- Maven

## Database

- MySQL

## Cloud / Storage

- Cloudinary

---

# 🏗️ Project Architecture

```text
Inkwell_Blog_Redesigned
│
├── Blog_App_backend
│   │
│   ├── src
│   │   └── main
│   │       ├── java
│   │       │   └── com.mayank.blog_app
│   │       │       │
│   │       │       ├── App_config
│   │       │       ├── controller
│   │       │       ├── entity
│   │       │       ├── exception
│   │       │       ├── payload
│   │       │       ├── repository
│   │       │       ├── security
│   │       │       ├── service
│   │       │       └── service.impl
│   │       │
│   │       └── resources
│   │           └── application.properties
│   │
│   └── pom.xml
│
└── blog-frontend
    │
    ├── src
    │   ├── api
    │   ├── components
    │   ├── context
    │   ├── pages
    │   ├── routes
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── public
    ├── package.json
    └── vite.config.js


                    ┌──────────────────┐
                    │   React Frontend │
                    │   Vite + Tailwind│
                    └────────┬─────────┘
                             │
                             │ REST API
                             ▼
                    ┌──────────────────┐
                    │   Spring Boot    │
                    │     Backend      │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌───────────┐   ┌───────────┐
        │  MySQL   │   │  Spring   │   │ Cloudinary│
        │ Database │   │ Security  │   │  Images   │
        └──────────┘   │    JWT    │   └───────────┘
                       └───────────┘


🔐 Authentication
The application uses JWT authentication.
Authentication Flow

User Login
    ↓
Spring Security
    ↓
Validate Credentials
    ↓
Generate JWT
    ↓
Frontend stores Token
    ↓
Token sent with API requests
    ↓
JwtAuthFilter validates token
    ↓
Request authorized
