# Inkwell — Blog App Frontend

A clean React + Vite + Tailwind frontend for the Blog_App Spring Boot backend, with JWT authentication and role-based access.

## Setup

```bash
npm install
cp .env.example .env   # edit VITE_API_BASE_URL if your backend isn't on localhost:8080
npm run dev
```

Runs at http://localhost:5173 by default. Make sure the Spring Boot backend is running on the URL set in `.env`.

## What it does

- **Auth**: register / login against `/api/auth/register` and `/api/auth/login`, JWT stored in `localStorage`, attached to every request via an axios interceptor. Token expiry is checked on load, and a 401 response anywhere logs the user out automatically.
- **Public**: anyone can browse the post feed, search, filter by category, and read a post + its comments.
- **Logged-in users**: can write, edit, and delete their own posts (dashboard at `/dashboard`), upload a cover image, comment on any post, delete their own comments, and edit their profile / change password at `/profile`.
- **Admins** (`ROLE_ADMIN`): can additionally manage categories at `/categories`, edit/delete any post, and delete any comment.

## Project layout

```
src/
  api/          axios client + one file per resource (auth, posts, categories)
  context/      AuthContext (login/register/logout/refreshUser, current user)
  routes/       ProtectedRoute (auth + admin-only route guard)
  components/   Navbar, PostCard
  pages/        Home, Login, Register, PostDetail, PostEditor, Dashboard, Categories, Profile, NotFound
```

## Note on the first admin user

Registration always creates a `ROLE_USER`. To get an admin, register normally, then update that user's `role` column to `ROLE_ADMIN` directly in the database (there's no self-service admin signup, by design).
