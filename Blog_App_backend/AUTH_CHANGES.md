# Authentication & Authorization — What Changed

## New dependencies (pom.xml)
- `spring-boot-starter-security`
- `io.jsonwebtoken:jjwt-api/impl/jackson` (0.12.6) for JWT signing/parsing

## New files
- `entity/Role.java` — `ROLE_USER` / `ROLE_ADMIN`
- `entity/User.java` — now implements `UserDetails`, has a `role` field (defaults to `ROLE_USER`), password is `@JsonIgnore`d so it's never serialized back to clients
- `payload/auth/LoginRequest.java`, `RegisterRequest.java`, `AuthResponse.java`
- `security/JwtService.java` — generates/validates JWTs (HMAC, configurable secret + expiry)
- `security/JwtAuthFilter.java` — reads `Authorization: Bearer <token>`, populates the security context
- `security/UserDetailsServiceImpl.java` — loads a `User` by email for Spring Security
- `security/JwtAuthEntryPoint.java` — returns a clean JSON 401 instead of the default HTML error page
- `App_config/SecurityConfig.java` — the actual route rules (see below), stateless sessions, BCrypt, CORS
- `controller/AuthController.java` — `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`

## Route rules
| Route | Access |
|---|---|
| `POST/GET /api/auth/**` | Public |
| `GET /api/posts`, `/api/post/**`, `/api/category/**` | Public (read-only) |
| `POST/PUT/DELETE /api/post/**` | Authenticated, and must be the post's author or an admin |
| `POST/PUT/DELETE /api/category/**` | Admin only |
| `/api/user/**` | Admin only (regular users use `/api/auth/me` for their own profile) |
| Everything else | Authenticated |

## Other changes
- `UserServiceImpl` now BCrypt-encodes passwords and never lets a client set their own role through the update endpoint.
- `PostController` now resolves the current user from the JWT (`@AuthenticationPrincipal`) and checks post ownership before allowing update/delete/image-upload, instead of trusting the path variable blindly.
- `PostDto` / `CategoryDto` gained `postId` / `categoryId` fields (needed by the frontend to link, edit, and delete things — they were missing before).
- `UserDto` gained `id` and `role`; `password` is write-only in JSON.
- `application.properties` gained `app.jwt.secret` and `app.jwt.expiration-ms`. **Change the secret before deploying anywhere real** — it's a placeholder.
- `GlobalExceptionHandler` now handles `BadCredentialsException`, `AuthenticationException`, and `AccessDeniedException` with clean JSON responses (401/403) instead of Spring's defaults.

## Creating the first admin
There's no self-service admin signup on purpose. Register a normal account, then flip that row's `role` to `ROLE_ADMIN` directly in MySQL:

```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'you@example.com';
```

## A note on testing
This environment has no network/Maven access, so I wasn't able to run `mvn compile` against the new Spring Security/JJWT dependencies. The code follows standard, current Spring Security 6 / jjwt 0.12 patterns, but please run a build locally before deploying and let me know if anything needs fixing.

## Round 2 — feature completion

On top of auth, the following were added to close the remaining gaps:

- **Comments**: new `Comment.user` + `Comment.createdAt` fields, `CommentDto`, `CommentRepository`, `CommentService`/`Impl`, `CommentController` — `POST /api/post/{postId}/comment` (auth required), `GET /api/post/{postId}/comments` (public), `DELETE /api/comment/{id}` (owner or admin).
- **Image upload wired up for real**: `FileServiceImpl` now writes each upload under a random UUID filename (no more overwrite collisions on duplicate names), and a new `WebConfig` serves `${project.image}` on `GET /images/**` (already permitted in `SecurityConfig`), so uploaded images are actually retrievable.
- **Search**: `PostRepository` gained `findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase`, and `PostService.searchPost` now does a real, paginated title/content search instead of returning an empty list. New endpoint: `GET /api/posts/search?query=...&pageNumber=&pageSize=`.
- **Real pagination metadata**: `GET /api/posts` and `GET /api/posts/search` now return a `PostResponse` (`content`, `pageNumber`, `pageSize`, `totalElements`, `totalPages`, `lastPage`) instead of a bare list, so the frontend can show real page counts. `pageNumber` now correctly starts at 0.
- **Self-service profile editing**: `PUT /api/auth/me` lets a logged-in user update their name/about and optionally change their password (requires the current password). `/api/auth/me` is now explicitly `authenticated()` rather than folded into the public `/api/auth/**` block.

