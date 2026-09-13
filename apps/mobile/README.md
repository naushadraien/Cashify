# Cashify Mobile App

The mobile application for Cashify, built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/).

## 🚀 Key Technologies
- **Framework:** Expo Router (File-based routing)
- **UI & Styling:** Custom Design System with responsive layouts
- **State & Forms:** `react-hook-form` + `@hookform/resolvers/zod`
- **Security:** Local Biometric Authentication (FaceID / TouchID) with `expo-secure-store`

## 🛠️ Setup Instructions

From the root directory, ensure all dependencies are installed, then navigate to `apps/mobile`:

```bash
cd apps/mobile
pnpm dev
```
- Press `i` to launch the iOS Simulator.
- Press `a` to launch the Android Emulator.

## 📱 Features
- **Biometric Login:** Allows users to link their biometric credentials for quick access.
- **Dynamic UI:** Time-based greetings and a polished dashboard overview.
- **Validation:** Real-time form validation shared with the backend schema.
