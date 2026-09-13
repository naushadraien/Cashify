# Cashify

Welcome to Cashify, your all-in-one modern fintech application. This repository contains the complete source code for both the secure NestJS backend and the sleek Expo React Native mobile application.

## 🚀 Features

- **Modern Fintech UI:** A highly polished, responsive mobile interface.
- **Robust Authentication:** Secure email and password authentication using JSON Web Tokens (JWT).
- **Biometric Login:** Seamless and secure access using Face ID or Touch ID on supported devices.
- **Type Safety:** End-to-end type safety using Zod and TypeScript.
- **Monorepo Architecture:** Powered by Turborepo for efficient builds and shared code.

## 📦 Project Structure

```text
├── apps/
│   ├── api/          # NestJS backend API
│   └── mobile/       # React Native Expo mobile app
├── packages/
│   └── schemas/      # Shared Zod schemas (backend DTOs & frontend validation)
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- pnpm 9+
- PostgreSQL 15+

### Installation & Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Variables:**
   - Copy `apps/api/.env.example` to `apps/api/.env` and update `DATABASE_URL`.
   - Copy `apps/mobile/.env.example` to `apps/mobile/.env` (if applicable).

3. **Database Setup:**
   Create a local PostgreSQL database named `cashify`:
   ```bash
   createdb cashify
   ```
   Run the Drizzle database migrations:
   ```bash
   cd apps/api
   pnpm db:generate
   pnpm db:migrate
   ```

4. **Run the Project:**
   Start the entire stack (API + Mobile) with Turborepo:
   ```bash
   pnpm dev
   ```

## 📚 Documentation
- [Backend API Documentation](./apps/api/README.md)
- [Mobile App Documentation](./apps/mobile/README.md)

---
*Developed for the Cashify Fintech Application Suite.*
