import { Button, SafeAreaWrapper, Typography } from "@/components";
import { getGreeting } from "@/utils/greetings";
import { useAuth } from "@/providers";
import { COLORS } from "@/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Switch,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export function HomeScreen() {
  const {
    user,
    onLogout,
    biometricAvailable,
    enableBiometric,
    disableBiometric,
  } = useAuth();

  const handleToggleBiometric = async (value: boolean) => {
    if (value) {
      await enableBiometric();
    } else {
      await disableBiometric();
    }
  };

  const greeting = `${getGreeting()}!`;

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Typography variant="body" color={COLORS.MUTED_FOREGROUND}>
              {greeting}
            </Typography>
            <Typography variant="h2">{user?.firstName || "User"}</Typography>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Typography variant="h3" color={COLORS.PRIMARY_FOREGROUND}>
              {user?.firstName?.[0] || "U"}
              {user?.lastName?.[0] || ""}
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Typography
            variant="body"
            color={COLORS.PRIMARY_FOREGROUND}
            style={{ opacity: 0.8 }}
          >
            Total Balance
          </Typography>
          <Typography
            variant="h1"
            color={COLORS.PRIMARY_FOREGROUND}
            style={styles.balanceAmount}
          >
            $12,450.00
          </Typography>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <MaterialCommunityIcons
                name="arrow-up"
                size={20}
                color={COLORS.PRIMARY_FOREGROUND}
              />
              <Typography variant="label" color={COLORS.PRIMARY_FOREGROUND}>
                Send
              </Typography>
            </TouchableOpacity>
            <View style={styles.actionDivider} />
            <TouchableOpacity style={styles.actionBtn}>
              <MaterialCommunityIcons
                name="arrow-down"
                size={20}
                color={COLORS.PRIMARY_FOREGROUND}
              />
              <Typography variant="label" color={COLORS.PRIMARY_FOREGROUND}>
                Receive
              </Typography>
            </TouchableOpacity>
            <View style={styles.actionDivider} />
            <TouchableOpacity style={styles.actionBtn}>
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={COLORS.PRIMARY_FOREGROUND}
              />
              <Typography variant="label" color={COLORS.PRIMARY_FOREGROUND}>
                Top Up
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card */}
        <Typography
          variant="label"
          color={COLORS.MUTED_FOREGROUND}
          style={styles.sectionTitle}
        >
          PROFILE INFO
        </Typography>
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color={COLORS.MUTED_FOREGROUND}
            />
            <View style={styles.profileInfo}>
              <Typography variant="bodyBold">Email Address</Typography>
              <Typography variant="body" color={COLORS.MUTED_FOREGROUND}>
                {user?.email || "Not provided"}
              </Typography>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.profileRow}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={24}
              color={COLORS.MUTED_FOREGROUND}
            />
            <View style={styles.profileInfo}>
              <Typography variant="bodyBold">Phone Number</Typography>
              <Typography variant="body" color={COLORS.MUTED_FOREGROUND}>
                {user?.phoneNumber || "Not provided"}
              </Typography>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.profileRow}>
            <MaterialCommunityIcons
              name="earth"
              size={24}
              color={COLORS.MUTED_FOREGROUND}
            />
            <View style={styles.profileInfo}>
              <Typography variant="bodyBold">Country</Typography>
              <Typography variant="body" color={COLORS.MUTED_FOREGROUND}>
                {user?.country || "Not provided"}
              </Typography>
            </View>
          </View>
        </View>

        {/* Security Card */}
        <Typography
          variant="label"
          color={COLORS.MUTED_FOREGROUND}
          style={styles.sectionTitle}
        >
          SECURITY
        </Typography>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <View style={styles.settingIcon}>
                <MaterialCommunityIcons
                  name="fingerprint"
                  size={24}
                  color={COLORS.PRIMARY}
                />
              </View>
              <View>
                <Typography variant="bodyBold">Biometric Login</Typography>
                <Typography variant="helper" color={COLORS.MUTED_FOREGROUND}>
                  Use Face ID / Fingerprint
                </Typography>
              </View>
            </View>
            <Switch
              value={biometricAvailable}
              onValueChange={handleToggleBiometric}
              trackColor={{ false: COLORS.BORDER, true: COLORS.PRIMARY }}
              thumbColor={COLORS.TEXT_COLOR}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />

        <Button
          title="Log Out"
          variant="outline"
          onPress={onLogout}
          style={styles.logoutBtn}
          leftIcon={
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={COLORS.DANGER}
            />
          }
          textStyle={{ color: COLORS.DANGER }}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },
  balanceCard: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceAmount: {
    fontSize: 36,
    marginVertical: 8,
  },
  balanceActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  actionDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    marginLeft: 8,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  logoutBtn: {
    borderColor: COLORS.DANGER,
    borderWidth: 1,
  },
});
