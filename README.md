# Cashify

Welcome to Cashify, your all-in-one modern fintech application. This repository contains the complete source code for both the secure NestJS backend and the sleek Expo React Native mobile application.

## Tech Stack Notes

This project was built using **Expo (React Native)** for the mobile app and **NestJS (Node.js)** for the backend.

- **Expo** is a framework and toolchain built directly on top of React Native — it uses the same component model, the same native rendering (bridge/JSI), and the same core APIs. It was chosen here because it enabled fast, reliable access to native device capabilities like biometric authentication (`expo-local-authentication`) and secure token storage (`expo-secure-store`) without writing custom native Android/iOS modules from scratch — which was important given the delivery timeline.
- **NestJS** is a framework built on top of Node.js (running on Express under the hood). It's still fundamentally a Node.js backend — NestJS adds structure (modules, dependency injection, decorators, guards/pipes) on top of Node rather than replacing it. This kept the backend organized and production-grade while moving quickly.

Happy to walk through any part of the implementation at the bare React Native or Express level if useful for evaluation.

Biometric login uses local device authentication (via `expo-local-authentication`) to gate access to a securely stored refresh token — the same pattern production banking/fintech apps use for this specific feature. No biometric data is ever sent to or handled by the backend; the server only ever sees a standard refresh-token exchange once the local biometric check succeeds.

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
