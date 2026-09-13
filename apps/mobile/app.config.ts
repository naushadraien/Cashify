import { ExpoConfig } from "@expo/config";
import "dotenv/config";

export default (): ExpoConfig => {
  return {
    name: "Cashify",
    slug: "cashify",
    owner: "cashify",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "cashify",
    userInterfaceStyle: "dark",
    icon: "./assets/images/icon.png",

    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.cashify.mobile",
      infoPlist: {
        NSFaceIDUsageDescription:
          "Cashify uses Face ID for quick and secure login.",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#0A0A0A",
        foregroundImage: "./assets/images/icon.png",
      },
      package: "com.cashify.mobile",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          resizeMode: "cover",
          backgroundColor: "#0A0A0A",
        },
      ],
      "expo-dev-client",
      "expo-secure-store",
      [
        "expo-local-authentication",
        {
          faceIDPermission: "Allow Cashify to use Face ID for biometric login.",
        },
      ],
      "expo-font",
    ],
    experiments: {
      typedRoutes: true,
    },
  };
};
