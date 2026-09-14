import {
  Button,
  Input,
  SafeAreaWrapper,
  Typography,
  ModalLoader,
  SvgIcon,
  BiometricSetupModal,
} from "@/components";
import { COLORS } from "@/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { LoginFormData, LoginSchema } from "../schema";
import { useAuth } from "@/providers";
import { useBiometric } from "@/hooks/useBiometric";
import { useInputFocus } from "@/hooks";
import Toast from "react-native-toast-message";

export function LoginScreen() {
  const router = useRouter();
  const { onLogin, onBiometricLogin, isLoginLoading, biometricAvailable } =
    useAuth();
  const { authenticate, isSupported, isEnrolled } = useBiometric();
  const { setRef, focusNext } = useInputFocus(2);
  const [showPassword, setShowPassword] = useState(false);
  const [bioModalState, setBioModalState] = useState<
    "hidden" | "no-session" | "no-hardware"
  >("hidden");

  const showBiometric = biometricAvailable && isSupported && isEnrolled;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await onLogin(data);
    } catch (error) {
      // Error is handled by requestAPI and toast
    }
  };

  const handleBiometric = async () => {
    if (isLoginLoading) return;

    // Step 1: Check for a stored session first
    if (!biometricAvailable) {
      setBioModalState("no-session");
      return;
    }

    // Step 2: Only if a stored session DOES exist, check device biometric capability
    if (!isSupported || !isEnrolled) {
      setBioModalState("no-hardware");
      return;
    }

    // Step 3: If both pass, proceed with biometric authentication
    try {
      await authenticate("Log in to Cashify");
      await onBiometricLogin();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Authentication Failed",
        text2: error.message,
      });
    }
  };

  const handleFeatureNotAvailable = (feature: string) => {
    Toast.show({
      type: "info",
      text1: "Coming Soon",
      text2: `${feature} will be available in a future update.`,
    });
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bottomOffset={62}
      >
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            Welcome Back to Cashify
          </Typography>
          <Typography
            variant="body"
            color={COLORS.MUTED_FOREGROUND}
            style={styles.subtitle}
          >
            Your All-in-One Financial Hub
          </Typography>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                placeholder="Email Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                inputRef={setRef(0)}
                onSubmitEditing={() => focusNext(0)}
                returnKeyType="next"
                leftIcon={
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color={COLORS.MUTED_FOREGROUND}
                  />
                }
              />
            )}
          />

          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  inputRef={setRef(1)}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  returnKeyType="done"
                  leftIcon={
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={20}
                      color={COLORS.MUTED_FOREGROUND}
                    />
                  }
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <MaterialCommunityIcons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={COLORS.MUTED_FOREGROUND}
                      />
                    </TouchableOpacity>
                  }
                  labelRightElement={
                    <TouchableOpacity
                      onPress={() =>
                        handleFeatureNotAvailable("Password reset")
                      }
                    >
                      <Typography variant="label" style={{ color: "#3b82f6" }}>
                        Forgot Password?
                      </Typography>
                    </TouchableOpacity>
                  }
                />
              )}
            />
          </View>

          <View style={styles.actionsRow}>
            <Button
              title="Login"
              onPress={handleSubmit(onSubmit)}
              loading={isLoginLoading || isSubmitting}
              style={styles.loginBtn}
              fullWidth={!biometricAvailable}
            />
            <TouchableOpacity
              style={[
                styles.bioBtn,
                (isLoginLoading || isSubmitting) && { opacity: 0.5 },
              ]}
              onPress={handleBiometric}
              disabled={isLoginLoading || isSubmitting}
            >
              <MaterialCommunityIcons
                name="fingerprint"
                size={32}
                color={COLORS.PRIMARY}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Typography variant="label" style={styles.dividerText}>
              Or
            </Typography>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <Button
              title="Login With Apple"
              variant="outline"
              leftIcon={
                <MaterialCommunityIcons
                  name="apple"
                  size={24}
                  color={COLORS.TEXT_COLOR}
                />
              }
              onPress={() => handleFeatureNotAvailable("Apple Login")}
              fullWidth
            />
            <Button
              title="Login With Google"
              variant="outline"
              leftIcon={<SvgIcon name="google" size={24} />}
              onPress={() => handleFeatureNotAvailable("Google Login")}
              fullWidth
            />
          </View>
        </View>

        {/* Spacer to push footer to bottom */}
        <View style={{ flex: 1 }} />

        <View style={styles.footer}>
          <Typography variant="body">Don't have an account? </Typography>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Typography variant="bodyBold" color={COLORS.PRIMARY}>
              Sign Up
            </Typography>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <ModalLoader loading={isLoginLoading} />
      <BiometricSetupModal
        visible={bioModalState !== "hidden"}
        onClose={() => setBioModalState("hidden")}
        {...(bioModalState === "no-session"
          ? {
              iconName: "account-off-outline",
              title: "No Account Logged In Here",
              description:
                "Log in with your email and password first, and we'll securely enable biometric login for next time.",
            }
          : {})}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    alignItems: "center",
  },
  loginBtn: {
    flex: 1,
  },
  bioBtn: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  dividerText: {
    marginHorizontal: 16,
    color: COLORS.MUTED_FOREGROUND,
  },
  socialContainer: {
    gap: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
});
