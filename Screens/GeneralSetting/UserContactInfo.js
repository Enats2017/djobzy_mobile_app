import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import ContactInfo from "../../components/ContactInfo";
//import GoogleMap from "../../components/GoogleMap";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import Footer from "../../components/Footer";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import GradientButton from "../../components/GradientButton";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { getCountryCallingCode, isValidPhoneNumber } from "libphonenumber-js";
import { toastError, toastSuccess } from "../../utils/toast";
import TimezoneSelector from "./TimezoneSelector";

const UserContactInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, timezone } = route.params || {};
  const [phoneNumber, setPhoneNumber] = useState(user.mobile_number || "");
  const [mobileCountryId, setMobileCountryId] = useState(
    user.mobile_country_id || "",
  );
  const [mobileCountryISO, setMobileCountryISO] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [canVerify, setCanVerify] = useState(false);
  const [postal, setPostal] = useState("");
  const [location, setLocation] = useState(user.address || "");
  const [selectedTimezone, setSelectedTimezone] = useState(user.timezone || "");
  const [loading, setLoading] = useState(false);

  console.log("PHONE:", phoneNumber);
  console.log("COUNTRY CODE:", mobileCountryId);
  console.log("COUNTRY ISO:", mobileCountryISO);
  // console.log("USERSSSSSSSSSSSSS:", user);

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
      return "+1"; // fallback Canada
    }
  };

  const countryISO = user?.iso2 || "CA";
  const defaultCountryISO = countryISO;
  const defaultCallingCode = isoToCallingCode(countryISO);
  const defaultFlag = isoToFlag(countryISO) || "🇨🇦";

  const submitContactInfo = async () => {
    if (!phoneNumber || !location) {
      toastError("Phone, and location are required");
      return;
    }

    console.log("hii");
    const fullNumber = `+${mobileCountryId}${phoneNumber}`;
    const updatedFullNumber = `${mobileCountryId}${phoneNumber}`;
    console.log(selectedTimezone);

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
    console.log("SENDING DATA:", {
      phoneNumber,
      mobileCountryId,
      postal,
      location,
    });

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
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Contact Info" navigation={navigation} />
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <PhoneNumberInput
              value={phoneNumber}
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
              <Text style={{ color: "red", marginTop: 4 }}>{phoneError}</Text>
            ) : null}

            <ContactInfo
              postalCodeValue={postal}
              onChangePostalCode={setPostal}
              locationValue={location}
              onChangeLocation={setLocation}
            />
            <TimezoneSelector
              timezones={timezone || []}
              selectedTimezone={selectedTimezone}
              setSelectedTimezone={setSelectedTimezone}
            />
            {/* <GoogleMap
              region={{
                latitude: 19.076,
                longitude: 72.8777,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            /> */}
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
        <Footer />
      </SafeAreaView>
    </>
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
