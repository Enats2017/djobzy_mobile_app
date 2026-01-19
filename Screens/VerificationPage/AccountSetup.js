import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";

import Icon from "react-native-vector-icons/Feather";
import { API_URL } from "../../api/ApiUrl";
import { toastError, toastSuccess } from "../../utils/toast";

const AccountSetup = ({
  countries,
  fullName,
  username,
  setFullName,
  setUsername,
  email,
  emailVerified,
  onNext,
}) => {
  console.log(username);

  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mobileCountryId, setMobileCountryId] = useState("");
  const phoneInputRef = useRef(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // const [emailVerified, setEmailVerified] = useState([]);

  //  useEffect(() => {
  //    setFullName(userDetails.full_name || "");
  //    setUsername(userDetails.name || "");
  //    setEmail(userDetails.email || "");
  //    //setEmailVerified(userDetails.confirmation || 0);
  //  }, []);

  console.log("PHONE:", phoneNumber);
console.log("COUNTRY CODE:", mobileCountryId);

  const handleAccountSetup = async () => {
    if (!fullName || !username || !phoneNumber) {
      //Alert.alert("Error", "Please fill all required fields.");
      toastError("Please fill all required fields.");
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/user-account-step`,
        {
          full_name: fullName,
          username: username,
          phone_number: phoneNumber,
          mobile_country_id: mobileCountryId,
          step_flag: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        toastSuccess("Account setup completed!");
        onNext();
        return;
      }
      if (response.data.errors) {
        const errors = response.data.errors;

        if (errors.username) {
          setUsernameError(errors.username[0]);
        }

        if (errors.phone_number) {
          setPhoneError(errors.phone_number[0]);
        }

        return; // 🔴 VERY IMPORTANT
      }

      // ✅ ONLY GENERIC ERROR → TOAST
      if (response.data.message) {
        toastError(response.data.message);
      }
    } catch (error) {
      console.error("Setup error:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong during account setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.heading}>Account Setup</Text>
        <Text style={styles.label}>Full Name / Company Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your username"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setUsernameError(false);
          }}
        />
        {usernameError ? (
          <View style={styles.erromsg}>
            <MaterialIcons name="error-outline" size={18} color="#FF0000" />
            <Text style={styles.errotext}>{usernameError}</Text>
          </View>
        ) : null}
        <Text style={styles.label}>Email</Text>
        <View style={{ position: "relative", width: "100%" }}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            editable={!emailVerified}
          />
          {emailVerified && (
            <Ionicons
              name="checkmark-done-circle-sharp"
              size={24}
              color="green"
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: [{ translateY: -11 }],
              }}
            />
          )}
        </View>
        {!emailVerified && email ? (
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => handleVerifyEmail(email)}
          ></TouchableOpacity>
        ) : null}
        <Text style={styles.label}>Phone Number</Text>
        <PhoneNumberInput
          value={phoneNumber}
          onChange={({ phone, countryCode }) => {
            setPhoneNumber(phone); // ✅ only digits
            setMobileCountryId(countryCode); // ✅ 91
          }}
        />
        {/* <View style={{ position: "relative", width: "100%" }}>
          <PhoneInput
            ref={phoneInputRef}
            defaultValue={phoneNumber}
            defaultCode="IN"
            layout="first"
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.phoneTextInputContainer}
            textInputStyle={styles.phoneTextInput}
            codeTextStyle={styles.codeText}
            flagButtonStyle={styles.flagButton}
            onChangeFormattedText={(text) => {
              setPhoneNumber(text);
              const countryData = countries.find((c) => c.phonecode);
              setMobileCountryId(countryData?.id || "");
              if (text.length >= 10) {
                setPhoneVerified(true);
                setPhoneError("");
              } else {
                setPhoneVerified(false);
                setPhoneError("Invalid phone number");
              }
            }}
          />
          {phoneVerified && (
            <Icon
              name="check-circle"
              size={22}
              color="green"
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: [{ translateY: -11 }],
              }}
            />
          )}
        </View> */}
      </View>
      {phoneError ? (
        <Text style={{ color: "red", marginTop: 4 }}>{phoneError}</Text>
      ) : null}

      <GradientButton
        title="Next"
        marginTop={25}
        disabled={loading}
        loading={loading}
        onPress={handleAccountSetup}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: "#CB7767",
    fontSize: 24,
    fontFamily: "Montserrat_600SemiBold",
  },
  label: {
    color: "#ffffff",
    fontSize: 17,
    marginTop: 18,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#faf6f6ff",
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 50,
    color: "#111010ff",
  },
  phoneInputContainer: {
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DEE2E6",
    alignItems: "center",
  },
  phoneTextInputContainer: {
    backgroundColor: "#fff",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 0,
  },
  phoneTextInput: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Nunito-Regular",
  },
  flagButton: {
    backgroundColor: "transparent",
    marginLeft: 10,
  },
  codeText: {
    color: "#000",
    fontSize: 16,
  },
  verify: {
    backgroundColor: "#d98974",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  varifytext: {
    color: "#fff",
    alignItems: "center",
    fontSize: 20,
  },
  erromsg: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingTop: 5,
  },
  errotext: {
    color: "#FF0000",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    lineHeight: 19,
  },
});

export default AccountSetup;
