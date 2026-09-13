import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useState } from "react";

export function useBiometric() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricType, setBiometricType] =
    useState<LocalAuthentication.AuthenticationType | null>(null);

  const checkBiometrics = useCallback(async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);

        const supportedTypes =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
          supportedTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
          )
        ) {
          setBiometricType(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
          );
        } else if (
          supportedTypes.includes(
            LocalAuthentication.AuthenticationType.FINGERPRINT,
          )
        ) {
          setBiometricType(LocalAuthentication.AuthenticationType.FINGERPRINT);
        } else if (
          supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
        ) {
          setBiometricType(LocalAuthentication.AuthenticationType.IRIS);
        }
      }
    } catch (error) {
      console.error("Error checking biometrics:", error);
    }
  }, []);

  useEffect(() => {
    checkBiometrics();
  }, [checkBiometrics]);

  const authenticate = async (
    promptMessage = "Authenticate to access Cashify",
  ) => {
    if (!isSupported || !isEnrolled) {
      throw new Error(
        "Biometric authentication is not supported or enrolled on this device.",
      );
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    if (!result.success) {
      throw new Error(result.error || "Authentication failed");
    }

    return result;
  };

  return {
    isSupported,
    isEnrolled,
    biometricType,
    authenticate,
    checkBiometrics,
  };
}
