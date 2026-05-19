import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import ContactInfo from "../../components/ContactInfo";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import GradientButton from "../../components/GradientButton";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { getCountryCallingCode, isValidPhoneNumber } from "libphonenumber-js";
import { toastError, toastSuccess } from "../../utils/toast";
import TimezoneSelector from "./TimezoneSelector";
import EmployerFooter from "../../components/EmployerFooter";
import { useNotifications } from "../../context/MessageNotificationContext";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UserContactInfo = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { user, timezone, countries} = route.params || {};
  const [phoneNumber, setPhoneNumber] = useState(user.mobile_number || "");
  const [mobileCountryId, setMobileCountryId] = useState(user.mobile_country_id || "",);
  const [mobileCountryISO, setMobileCountryISO] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [canVerify, setCanVerify] = useState(false);
  const [postal, setPostal] = useState(user.postal_code || "");
  const [location, setLocation] = useState(user.address || "");
  const [selectedTimezone, setSelectedTimezone] = useState(user.timezone || "");
  const [loading, setLoading] = useState(false);
  const { admin } = useNotifications();

  useEffect(() => {
    if (!user) return;
    const transformedPhone = user.mobile_number || "";
    const transformedCountryId = user.phonecode || "";
    const transformedISO = user.iso2 || "";
    const transformedLocation = user.address || "";
    const transformedTimezone = user.timezone || "";
    setPhoneNumber(transformedPhone);
    setMobileCountryId(transformedCountryId);
    setMobileCountryISO(transformedISO);
    setLocation(transformedLocation);
    setSelectedTimezone(transformedTimezone);
  }, [user]);

  const isoToFlag = (iso) =>
    iso
      ?.toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt()),
      );

  const isoToCallingCode = (iso) => {
    try {
      return `+${getCountryCallingCode(iso)}`;
    } catch {
      return "+1";
    }
  };

  const countryISO = user?.iso2 || "CA";
  const defaultCountryISO = countryISO;
  const defaultCallingCode = isoToCallingCode(countryISO);
  const defaultFlag = isoToFlag(countryISO) || "🇨🇦";

  const submitContactInfo = async () => {
    if (!phoneNumber) {
      toastError("Phone Number is required");
      return;
    }
    if (!location) {
      toastError("Location is required");
      return;
    }
    const fullNumber = `+${mobileCountryId}${phoneNumber}`;
    const updatedFullNumber = `${mobileCountryId}${phoneNumber}`;

    const isPhoneValid = isValidPhoneNumber(fullNumber, mobileCountryISO || user?.iso2);
    if (!isPhoneValid) {
      toastError("Please enter a valid phone number.");
      return;
    }
    if (!selectedTimezone) {
      toastError("Please select a timezone.");
      return;
    }

    const formData = new FormData();
    formData.append("phone_number", updatedFullNumber); // no +
    formData.append("mobile_country_id", mobileCountryId);
    formData.append("postal_code", postal);
    formData.append("searchInput", location);
    formData.append("country_iso2", mobileCountryISO);
    formData.append("timezone", selectedTimezone);

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/contact-save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await res.json();

      if (result.status == 200) {
        await AsyncStorage.setItem("user", JSON.stringify(result.user));
        toastSuccess("Contact info saved successfully");
      } else {
        toastError(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("API Error:", error);
      toastError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.container}>
          <PageNameHeaderBar title="Contact Info" navigation={navigation} />
          <ScrollView
            contentContainerStyle={{
              paddingBottom: insets.bottom + 40,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <PhoneNumberInput
              value={phoneNumber}
              countries={countries}
              countryISO={mobileCountryISO}
              countryCode={mobileCountryId}
              onChange={({ phone, countryCode, countryISO }) => {
                setPhoneNumber(phone);
                setMobileCountryId(countryCode);
                setMobileCountryISO(countryISO);
                setPhoneError("");

                const full = `+${countryCode}${phone}`;
                const valid = isValidPhoneNumber(full, countryISO);
                setCanVerify(valid);
              }}
              defaultFlag={defaultFlag}
              defaultCallingCode={defaultCallingCode}
              defaultCountryISO={defaultCountryISO}
            />

            {phoneError ? (
              <Text style={{ color: "red", marginTop: 4 }}>
                {phoneError}
              </Text>
            ) : null}

            <ContactInfo
              postalCodeValue={postal}
              onChangePostalCode={setPostal}
              locationValue={location}
              onChangeLocation={setLocation}
              user={user}
            />

            <TimezoneSelector
              timezones={timezone || []}
              selectedTimezone={selectedTimezone}
              setSelectedTimezone={setSelectedTimezone}
            />

            <View style={{ paddingBottom: 10 }}>
              <GradientButton
                loading={loading}
                disabled={loading}
                title="Send"
                onPress={submitContactInfo}
              />
            </View>
          </ScrollView>
        </View>

        {/* Footer stays OUTSIDE scroll but INSIDE safe area */}
        {admin == 2 ? <EmployerFooter /> : <Footer />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
});

export default UserContactInfo;
