import { COLORS } from "@/theme";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

export const ModalLoader = (props: { loading: boolean }) => {
  const { loading } = props;

  return (
    <Modal transparent={true} animationType={"none"} visible={loading}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={loading}
            color={COLORS.PRIMARY}
            size={"large"}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },
  activityIndicatorWrapper: {
    backgroundColor: COLORS.SECONDARY,
    height: 80,
    width: 80,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
