import { COLORS } from "@/theme";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

export const ModalLoader = (props: { loading: boolean }) => {
  const { loading } = props;

  return (
    <Modal transparent={true} animationType={"fade"} visible={loading}>
      <View style={styles.modalBackground}>
        <ActivityIndicator
          animating={loading}
          color={COLORS.PRIMARY}
          size={"large"}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.BACKGROUND,
  },
});
