import { getIcon, IconKey } from "../../../assets/icons";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

interface SvgIconProps extends Omit<SvgProps, "width" | "height"> {
  name: IconKey;
  size?: IconSize;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const SIZE_MAP: Record<Exclude<IconSize, number>, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

export const SvgIcon = ({
  name,
  size = "md",
  color,
  style,
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  ...restProps
}: SvgIconProps) => {
  const iconSize = typeof size === "number" ? size : SIZE_MAP[size];
  const IconComponent = getIcon(name);

  if (!IconComponent) {
    console.warn(`SvgIcon: Icon "${name}" not found`);
    return null;
  }

  const svgProps: SvgProps = {
    width: iconSize,
    height: iconSize,
    color: color,
    ...restProps,
  };

  const renderIcon = () => <IconComponent {...svgProps} />;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          style,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
        ]}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={accessibilityLabel || name}
        accessibilityHint={accessibilityHint}
      >
        {renderIcon()}
      </Pressable>
    );
  }

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || name}
    >
      {renderIcon()}
    </View>
  );
};

SvgIcon.displayName = "SvgIcon";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  pressable: {
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
