import { COLORS, FONTS } from "@/theme";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodyBold"
  | "label"
  | "helper"
  | "error"
  | "button";

interface TypographyProps extends TextProps {
  variant?: Variant;
  color?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  color,
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        color ? { color } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: COLORS.TEXT_COLOR,
  },
  h1: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    lineHeight: 34,
  },
  h2: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 24,
    lineHeight: 30,
  },
  h3: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    lineHeight: 26,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: COLORS.MUTED_FOREGROUND,
  },
  helper: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.MUTED_FOREGROUND,
  },
  error: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.DANGER,
  },
  button: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
});
