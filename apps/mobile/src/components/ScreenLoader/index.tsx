import { COLORS } from "@/theme";
import { ActivityIndicator, StyleSheet, View, ViewProps } from "react-native";

interface ScreenLoaderProps extends ViewProps {
  color?: string;
  size?: "small" | "large";
}

export function ScreenLoader({
  color = COLORS.PRIMARY,
  size = "large",
  style,
  ...props
}: ScreenLoaderProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
  },
});
