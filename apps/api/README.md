# Cashify API

The backend service for Cashify, built with [NestJS](https://nestjs.com/) and [Drizzle ORM](https://orm.drizzle.team/).

## 🚀 Key Technologies
- **Framework:** NestJS
- **Database:** PostgreSQL with Drizzle ORM
- **Validation:** Zod (via `nestjs-zod`)
- **Authentication:** Passport + JWT (Access and Refresh Token Rotation)

## 🛠️ Setup Instructions

From the root directory, ensure all dependencies are installed, then navigate to `apps/api`:

```bash
cd apps/api
pnpm db:generate
pnpm db:migrate
pnpm dev
```

The API will be available at `http://localhost:3000`.

## 📚 API Endpoints
- **Swagger UI:** Available at `http://localhost:3000/docs`
- **Health Check:** `http://localhost:3000/health`

## 🔒 Security & Authentication
- Passwords are securely hashed using `bcrypt` (cost factor 12).
- Authentication is handled via short-lived JWT access tokens and long-lived, rotated refresh tokens.
- All endpoints are protected against brute-force attacks via `ThrottlerModule`.
