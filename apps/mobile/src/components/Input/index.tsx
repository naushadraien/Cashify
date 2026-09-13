import { COLORS, SPACING } from "@/theme";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Typography } from "../Typography";

type InputProps = Omit<
  TextInputProps,
  "onChange" | "onChangeText" | "placeholder" | "placeholderTextColor"
> & {
  inputRef?: React.Ref<TextInput>;
  label?: string;
  error?: string;
  helper?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  touched?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  labelRightElement?: React.ReactNode;
  disabled?: boolean;
};

export function Input({
  inputRef,
  label,
  error,
  helper,
  placeholder,
  onChangeText,
  leftIcon,
  rightIcon,
  touched,
  containerStyle,
  labelStyle,
  inputContainerStyle,
  inputStyle,
  errorStyle,
  labelRightElement,
  disabled = false,
  editable,
  value,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const innerRef = React.useRef<TextInput>(null);

  const showError =
    touched === undefined ? Boolean(error) : Boolean(error && touched);

  const borderColor = showError
    ? COLORS.DANGER
    : isFocused
      ? COLORS.PRIMARY
      : COLORS.BORDER;

  const handleFocus: TextInputProps["onFocus"] = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: TextInputProps["onBlur"] = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label || labelRightElement ? (
        <View style={styles.labelRow}>
          {label ? (
            <Typography variant="label" style={labelStyle}>
              {label}
            </Typography>
          ) : (
            <View />
          )}
          {labelRightElement}
        </View>
      ) : null}

      <Pressable
        onPress={() => {
          if (!disabled) {
            innerRef.current?.focus();
          }
        }}
        style={[
          styles.inputContainer,
          {
            borderColor,
            opacity: disabled ? 0.6 : 1,
          },
          showError && styles.errorContainer,
          isFocused && !showError && styles.focusContainer,
          inputContainerStyle,
        ]}
      >
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

        <TextInput
          ref={inputRef}
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.MUTED_FOREGROUND}
          editable={disabled ? false : editable}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </Pressable>

      {showError ? (
        <Typography variant="error" style={[styles.message, errorStyle]}>
          {error}
        </Typography>
      ) : helper ? (
        <Typography variant="helper" style={styles.message}>
          {helper}
        </Typography>
      ) : null}
    </View>
  );
}

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    minHeight: 54,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: COLORS.INPUT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 12,
  },
  focusContainer: {
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  errorContainer: {
    borderColor: COLORS.DANGER,
    shadowColor: COLORS.DANGER,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1,
  },
  leftIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  rightIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 54,
    color: COLORS.TEXT_COLOR,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  message: {
    marginTop: 6,
    marginLeft: 16,
  },
});
