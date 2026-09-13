import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "./toastConfig";

export function Toaster() {
  const insets = useSafeAreaInsets();

  return (
    <Toast config={toastConfig} position="top" topOffset={insets.top + 17} />
  );
}
