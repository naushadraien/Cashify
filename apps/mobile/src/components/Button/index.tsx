import { COLORS, getBorderRadius, RadiusType } from "@/theme";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Typography } from "../Typography";

type ButtonSize = "sm" | "md" | "lg" | "xl";
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  borderRadius?: RadiusType;
}

type ButtonColorConfig = {
  bg: string;
  text: string;
  borderColor?: string;
  borderWidth?: number;
};

const VARIANT_COLORS: Record<ButtonVariant, ButtonColorConfig> = {
  primary: { bg: COLORS.PRIMARY, text: COLORS.PRIMARY_FOREGROUND },
  secondary: { bg: COLORS.SECONDARY, text: COLORS.TEXT_COLOR },
  outline: {
    bg: "transparent",
    text: COLORS.TEXT_COLOR,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
  },
  ghost: {
    bg: "transparent",
    text: COLORS.TEXT_COLOR,
  },
};

const DISABLED_COLORS: ButtonColorConfig = {
  bg: COLORS.SECONDARY,
  text: COLORS.MUTED_FOREGROUND,
};

const SIZE_STYLES: Record<
  ButtonSize,
  {
    minHeight: number;
    paddingVertical: number;
    paddingHorizontal: number;
    fontSize: number;
    iconGap: number;
  }
> = {
  sm: {
    minHeight: 36,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    iconGap: 6,
  },
  md: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    iconGap: 8,
  },
  lg: {
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 16,
    iconGap: 8,
  },
  xl: {
    minHeight: 64,
    paddingVertical: 20,
    paddingHorizontal: 32,
    fontSize: 18,
    iconGap: 10,
  },
};

export const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  borderRadius = "RADIUS_12",
}: ButtonProps) => {
  const colors = disabled ? DISABLED_COLORS : VARIANT_COLORS[variant];
  const sizeStyle = SIZE_STYLES[size];
  const radius = getBorderRadius(borderRadius);

  const isDisabled = disabled || loading;

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.container,
        {
          borderRadius: radius,
          backgroundColor: colors.bg,
          borderColor: colors.borderColor,
          borderWidth: colors.borderWidth,
          minHeight: sizeStyle.minHeight,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        variant === "primary" && !isDisabled && styles.primaryShadow,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && (
            <View style={[{ marginRight: title ? sizeStyle.iconGap : 0 }]}>
              {leftIcon}
            </View>
          )}
          {title && (
            <Typography
              variant="button"
              style={[
                { color: colors.text, fontSize: sizeStyle.fontSize },
                styles.text,
                textStyle,
              ]}
            >
              {title}
            </Typography>
          )}
          {rightIcon && (
            <View style={[{ marginLeft: title ? sizeStyle.iconGap : 0 }]}>
              {rightIcon}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

Button.displayName = "Button";

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontFamily: "Inter_700Bold",
  },
  primaryShadow: {
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
