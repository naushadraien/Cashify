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
      icon: "./assets/images/icon.png",
      supportsTablet: false,
      bundleIdentifier: "com.cashify.mobile",
      infoPlist: {
        NSFaceIDUsageDescription:
          "Cashify uses Face ID for quick and secure login.",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#262A33",
        foregroundImage: "./assets/images/icon.png",
      },
      package: "com.cashify.mobile",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#262A33",
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
