import React from "react";
import { Modal, View, StyleSheet, Pressable } from "react-native";
import { Typography } from "../Typography";
import { Button } from "../Button";
import { COLORS } from "@/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type BiometricSetupModalProps = {
  visible: boolean;
  onClose: () => void;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  title?: string;
  description?: string;
};

export function BiometricSetupModal({
  visible,
  onClose,
  iconName = "fingerprint-off",
  title = "Biometrics Not Set Up",
  description = "It looks like you don't have Face ID or Fingerprint set up on this device. Please enable biometrics in your device settings to securely log in.",
}: BiometricSetupModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={iconName}
              size={48}
              color={COLORS.PRIMARY}
            />
          </View>

          <Typography variant="h2" style={styles.title}>
            {title}
          </Typography>

          <Typography
            variant="body"
            color={COLORS.MUTED_FOREGROUND}
            style={styles.message}
          >
            {description}
          </Typography>

          <Button
            title="Got It"
            onPress={onClose}
            style={styles.btn}
            fullWidth
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.BORDER,
    borderRadius: 2,
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.SECONDARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  btn: {
    marginTop: 8,
  },
});
