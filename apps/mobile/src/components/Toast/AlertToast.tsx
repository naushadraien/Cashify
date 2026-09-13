import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";
import { COLORS } from "@/theme";
import { Typography } from "../Typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ToastType = "success" | "error" | "info" | "warning";

interface AlertToastProps extends BaseToastProps {
  type: ToastType;
}

const TOAST_ICONS: Record<
  ToastType,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  success: "check-circle",
  error: "close-circle",
  info: "information",
  warning: "alert",
};

const TOAST_COLORS: Record<ToastType, string> = {
  success: COLORS.PRIMARY,
  error: COLORS.DANGER,
  info: "#3B82F6",
  warning: "#F59E0B",
};

export const AlertToast = ({ type, text1, text2 }: AlertToastProps) => {
  const iconName = TOAST_ICONS[type];
  const color = TOAST_COLORS[type];

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={iconName} size={24} color={color} />
      </View>
      <View style={styles.content}>
        {text1 && (
          <Typography variant="bodyBold" style={styles.title}>
            {text1}
          </Typography>
        )}
        {text2 && (
          <Typography
            variant="body"
            color={COLORS.MUTED_FOREGROUND}
            style={styles.message}
          >
            {text2}
          </Typography>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: "hidden",
  },
  indicator: {
    width: 4,
    height: "100%",
  },
  iconContainer: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 16,
  },
  title: {
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
  },
});
