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

### 1. Prerequisites
- **Node.js**: v18+
- **pnpm**: 9+ (This monorepo uses `pnpm@9.7.0`)
- **PostgreSQL**: v15+ (Running locally)
- **Expo Go** app OR a development build on a physical device.
- **adb (Android Debug Bridge)**: Required if testing on a physical Android device via USB.
- *Note: Turbo is already included as a devDependency and will be installed automatically with the project dependencies — no global install needed.*

### 2. Installation
```bash
git clone <repo-url>
cd <repo-folder>
pnpm install
```
This single install step, run from the monorepo root, installs dependencies for all apps (mobile + api) via the workspace setup — no need to `cd` into each app and install separately.

### 3. Database Setup
Drizzle does NOT create the database itself — it only manages the schema/migrations inside an existing database.

Connect to Postgres (e.g. `psql -U postgres`) and create the database:
```sql
CREATE DATABASE cashify;
```
*(If you are running the project under a different name, make sure it matches your `DATABASE_URL`)*

Next, set up the backend environment variables:
Copy `apps/api/.env.example` to `apps/api/.env`:
- `PORT=3000` (The port the backend API runs on)
- `NODE_ENV=development`
- `DATABASE_URL=postgres://postgres:postgres@localhost:5432/cashify` (Postgres connection string)
- `JWT_ACCESS_SECRET=change-me-access-secret` (Secret used for signing short-lived access tokens)
- `JWT_ACCESS_EXPIRES_IN=15m` (Access token lifespan)
- `JWT_REFRESH_SECRET=change-me-refresh-secret` (Secret used for signing long-lived refresh tokens)
- `JWT_REFRESH_EXPIRES_IN=30d` (Refresh token lifespan)

Run the database migrations (this root-level script runs the drizzle migrations in the API):
```bash
pnpm db:migrate
```

### 4. Environment Variables — Mobile App
Set up the mobile environment variables by copying `apps/mobile/.env.example` to `apps/mobile/.env`:
- `EXPO_PUBLIC_API_URL` — This must point to wherever the backend is actually reachable from the device being used to test (e.g., `http://192.168.1.5:3000` instead of `http://localhost:3000` if using a physical device on Wi-Fi).

### 5. Running the Project
Use the following root-level commands to start the development servers:
```bash
pnpm dev                        # Runs both backend and mobile concurrently via Turbo
pnpm --filter @repo/api dev     # Backend only
pnpm --filter @repo/mobile dev  # Mobile only
```

### 6. Running on a Physical Device — Networking
This is the most failure-prone part of setup. Choose the scenario that matches your environment:

#### Android Emulator
Works out of the box with no special config — `http://10.0.2.2:3000` (or `localhost` depending on the emulator) resolves correctly to the host machine automatically.

#### Physical Device — Same Wi-Fi Network as the Dev Machine
- Find your machine's LAN IP (`ipconfig` on Windows / `ifconfig` or `ip addr` on Mac/Linux).
- Set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` to `http://<your-LAN-IP>:3000` instead of `localhost`.
- Ensure the NestJS backend listens on `0.0.0.0`, not `127.0.0.1`.
- Both devices must be on the exact same Wi-Fi network/subnet, with no AP/client isolation enabled on the router (common on guest/office networks).
- If the Metro/dev-client screen shows no server detected even though `expo start` is running, the phone likely can't reach the dev machine at all over Wi-Fi. Fastest fix: connect the phone via USB and run:
  ```bash
  adb devices          # confirm the phone is listed
  adb reverse tcp:8081 tcp:8081
  ```
  Then manually enter `exp+cashify://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081` in the dev-client's manual URL entry. This forwards Metro's port through the USB cable, bypassing Wi-Fi issues entirely.
- A firewall (Windows Defender or similar) can silently block inbound connections. If the above steps don't resolve it, temporarily disable the firewall to confirm, then add a proper inbound allow rule for ports `3000` and `8081`.

#### Physical Device — Using ngrok (works regardless of network/Wi-Fi setup)
- Start the backend locally, then tunnel it:
  ```bash
  ngrok http 3000
  ```
- Copy the generated `https://...ngrok-free.dev` URL into `EXPO_PUBLIC_API_URL` in `apps/mobile/.env`.
- **Important**: On ngrok's free tier, this URL changes every time the tunnel is restarted. The `.env` value must be updated each time, and Metro must be restarted with cache cleared (`npx expo start -c`) for the new value to be picked up, since `EXPO_PUBLIC_*` variables are inlined at bundle-build time.
- Note: Using ngrok for the backend does NOT automatically solve Metro/dev-client discovery. If the phone still can't find the Metro bundler itself, use `adb reverse tcp:8081 tcp:8081` as described above, or run `npx expo start --dev-client --tunnel` to tunnel Metro itself.

### 7. Troubleshooting
- **`NoRouteToHostException` when opening the app on a physical device** → See the Networking section above; almost always a Wi-Fi/subnet/firewall issue, not a code bug.
- **Metro/dev-client shows no server found** → Phone and dev machine aren't on the same reachable network segment; use `adb reverse` or `--tunnel` as described above.
- **Database connection errors on first run** → Confirm the database was actually created (Drizzle does not create it automatically) and that `DATABASE_URL` in `apps/api/.env` matches the database name/credentials used in the `CREATE DATABASE` step.
- **`.env` changes not taking effect on the mobile app** → Fully restart Metro with `npx expo start -c` and reload the app; `EXPO_PUBLIC_*` values are baked in at build time, not read live.

## 📚 Documentation
- [Backend API Documentation](./apps/api/README.md)
- [Mobile App Documentation](./apps/mobile/README.md)

---
*Developed for the Cashify Fintech Application Suite.*
