import { COLORS } from "@/theme";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
  backgroundColor?: string;
}

export const SafeAreaWrapper = ({
  children,
  style,
  edges = ["top", "bottom", "left", "right"],
  backgroundColor = COLORS.BACKGROUND,
}: SafeAreaWrapperProps) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView edges={edges} style={[styles.safeArea, style]}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
