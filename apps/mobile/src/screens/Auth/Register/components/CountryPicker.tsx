import { Input, Typography } from "@/components";
import { Country, countries } from "@/data/countries";
import { COLORS } from "@/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface CountryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
}

export function CountryPicker({
  visible,
  onClose,
  onSelect,
}: CountryPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search),
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={COLORS.TEXT_COLOR}
            />
          </TouchableOpacity>
          <Typography variant="h3">Select Country</Typography>
          <View style={styles.rightSpacer} />
        </View>

        <View style={styles.searchContainer}>
          <Input
            placeholder="Search country or code..."
            value={search}
            onChangeText={setSearch}
            leftIcon={
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={COLORS.MUTED_FOREGROUND}
              />
            }
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Typography variant="h3" style={styles.flag}>
                {item.flag}
              </Typography>
              <Typography variant="bodyBold" style={styles.name}>
                {item.name}
              </Typography>
              <Typography variant="body" color={COLORS.MUTED_FOREGROUND}>
                {item.dialCode}
              </Typography>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  closeBtn: {
    padding: 4,
  },
  searchContainer: {
    padding: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  flag: {
    marginRight: 16,
  },
  name: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginLeft: 60,
  },
  rightSpacer: {
    width: 24,
  },
});
