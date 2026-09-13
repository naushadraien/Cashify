import {
  Button,
  Input,
  SafeAreaWrapper,
  Typography,
  ModalLoader,
} from "@/components";
import { Country, getCountryFromName } from "@/data/countries";
import { useAuth } from "@/providers";
import { useInputFocus } from "@/hooks";
import { COLORS } from "@/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { RegisterFormData, RegisterSchema } from "../schema";
import { CountryPicker } from "./components/CountryPicker";
import Toast from "react-native-toast-message";

export function RegisterScreen() {
  const router = useRouter();
  const { onRegister, isLoginLoading } = useAuth();
  const { setRef, focusNext } = useInputFocus(6);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const defaultCountry = getCountryFromName("Qatar");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    defaultCountry,
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: defaultCountry.name,
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const formattedData = { ...data };

      // The backend schema specifically uses .regex(/^\+?[0-9]+$/), which means
      // no hyphens or spaces are allowed! We strip all non-digits from the phone input
      // and append it directly to the dial code.
      formattedData.phoneNumber = `${selectedCountry?.dialCode || ""}${data.phoneNumber.replace(/\D/g, "")}`;

      await onRegister(formattedData);

      Toast.show({
        type: "success",
        text1: "Account Created!",
        text2: "Please log in with your new credentials.",
      });
      router.replace("/(auth)/login");
    } catch (error) {
      // Error is handled by requestAPI and toast
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setValue("country", country.name, { shouldValidate: true });
    // The dial code is now shown statically in the leftIcon, so we don't pre-fill the editable input
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={COLORS.TEXT_COLOR}
            />
          </TouchableOpacity>
          <Typography variant="h1" style={styles.title}>
            Create Account
          </Typography>
          <Typography variant="body" color={COLORS.MUTED_FOREGROUND}>
            Join Cashify today
          </Typography>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="First Name"
                  placeholder="First Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.firstName?.message}
                  containerStyle={{ flex: 1 }}
                  inputRef={setRef(0)}
                  onSubmitEditing={() => focusNext(0)}
                  returnKeyType="next"
                />
              )}
            />
            <View style={{ width: 16 }} />
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Last Name"
                  placeholder="Last Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lastName?.message}
                  containerStyle={{ flex: 1 }}
                  inputRef={setRef(1)}
                  onSubmitEditing={() => focusNext(1)}
                  returnKeyType="next"
                />
              )}
            />
          </View>

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
                inputRef={setRef(2)}
                onSubmitEditing={() => focusNext(2)}
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

          <Controller
            control={control}
            name="country"
            render={({ field, fieldState: { error } }) => (
              <View>
                <View style={styles.labelRow}>
                  <Typography variant="label">Country</Typography>
                </View>
                <TouchableOpacity
                  style={[
                    styles.countrySelect,
                    error ? { borderColor: COLORS.DANGER } : {},
                  ]}
                  onPress={() => setShowPicker(true)}
                >
                  {selectedCountry ? (
                    <Typography variant="bodyBold">
                      {selectedCountry.flag} {selectedCountry.name}
                    </Typography>
                  ) : (
                    <Typography variant="body" color={COLORS.MUTED_FOREGROUND}>
                      Select Country
                    </Typography>
                  )}
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={24}
                    color={COLORS.MUTED_FOREGROUND}
                  />
                </TouchableOpacity>
                {error && (
                  <Typography variant="error" style={styles.errorText}>
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone Number"
                placeholder="Phone Number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phoneNumber?.message}
                keyboardType="phone-pad"
                inputRef={setRef(3)}
                onSubmitEditing={() => focusNext(3)}
                returnKeyType="next"
                leftIcon={
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="phone-outline"
                      size={20}
                      color={COLORS.MUTED_FOREGROUND}
                    />
                    {selectedCountry && (
                      <Typography variant="bodyBold" style={{ marginLeft: 8 }}>
                        {selectedCountry.dialCode}
                      </Typography>
                    )}
                  </View>
                }
              />
            )}
          />

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
                inputRef={setRef(4)}
                onSubmitEditing={() => focusNext(4)}
                returnKeyType="next"
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
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                secureTextEntry={!showConfirmPassword}
                inputRef={setRef(5)}
                onSubmitEditing={handleSubmit(onSubmit)}
                returnKeyType="done"
                leftIcon={
                  <MaterialCommunityIcons
                    name="lock-check-outline"
                    size={20}
                    color={COLORS.MUTED_FOREGROUND}
                  />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <MaterialCommunityIcons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color={COLORS.MUTED_FOREGROUND}
                    />
                  </TouchableOpacity>
                }
              />
            )}
          />

          <Button
            title="Sign Up"
            onPress={handleSubmit(onSubmit)}
            loading={isLoginLoading || isSubmitting}
            style={styles.signupBtn}
          />
        </View>

        <View style={styles.footer}>
          <Typography variant="body">Already have an account? </Typography>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Typography variant="bodyBold" color={COLORS.PRIMARY}>
              Login
            </Typography>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <ModalLoader loading={isLoginLoading} />

      <CountryPicker
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleCountrySelect}
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SECONDARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    marginBottom: 8,
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
  },
  countrySelect: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.INPUT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 16,
  },
  signupBtn: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 4,
  },
});
