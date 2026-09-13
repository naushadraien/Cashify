import React from "react";
import { BaseToastProps } from "react-native-toast-message";
import { AlertToast } from "./AlertToast";

export const toastConfig = {
  error: (props: BaseToastProps) => <AlertToast {...props} type="error" />,
  info: (props: BaseToastProps) => <AlertToast {...props} type="info" />,
  warning: (props: BaseToastProps) => <AlertToast {...props} type="warning" />,
  success: (props: BaseToastProps) => <AlertToast {...props} type="success" />,
};
