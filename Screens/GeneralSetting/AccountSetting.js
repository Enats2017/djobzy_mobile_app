import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import GradientButton from "../../components/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import BorderButton from "../../components/BorderButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "../../components/Footer";
import EmployerFooter from "../../components/EmployerFooter";
import { toastError, toastSuccess } from "../../utils/toast";
import { useNotifications } from "../../context/MessageNotificationContext";

const AccountSetting = () => {
  const [codeEnabled, setCodeEnabled] = useState(false);
  const [password, setPassword] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || {};
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [code, setCode] = useState("");

  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [optLoading, setOtpLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { admin } = useNotifications();

  const handleConfirmPassword = async () => {
    try {
      if (!password) {
        Alert.alert("Error", "Please enter your password");
        return;
      }
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/set-confirm-pass`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          setting_password: password,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data.status === 200) {
        setEmail(user?.email || "");
        setOriginalEmail(user.email || "");
        setName(user?.full_name || "");
        setUsername(user?.name || "");
        setActiveTab(1);
      } else {
        toastError(data.message || 'password is required');
      }
    } catch (error) {
      toastError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOtp = async () => {
    try {
      if (!isEmailChanged) {
        return toastError("Email is already verified");
      }
      if (!email) {
        toastError("Please enter email");
        return;
      }
      setOtpLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/send-email-link`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await res.json();
      console.log("Send Email OTP:", data);
      if (data.status === 200) {
        setOtpLoading(false);
        setIsOtpSent(true);
        toastSuccess("OTP sent to your email");
        setCodeEnabled(true);
      } else {
        toastError(data.message);
      }
    } catch (error) {
      console.log("Send email OTP error:", error);
      toastError("Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  };

  const isValidOtp = (otp) => {
    return /^[A-Za-z0-9]{6}$/.test(otp);
  };
  const handleVerifyOtp = async () => {
    if (!code) {
      toastError("Please enter OTP");
      return;
    }
    if (!isValidOtp(code)) {
      toastError("OTP should be 6 digits");
      return;
    }
    try {
      setIsVerifying(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/settings-email-verify`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          email_pin: code,
        }),
      });
      const data = await res.json();
      if (data.status === 200) {
        setIsEmailVerified(true);
        setIsOtpSent(false);
        setCode("");
        toastSuccess("Email verified successfully");
      } else {
        toastError(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.log("VERIFY ERROR:", error);
      toastError("Something went wrong");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!email || !name || !username) {
      toastError("Please fill all fields");
      return;
    }
    // email changed but not verified
    if (isEmailChanged && !isEmailVerified) {
      return toastError("Please verify your email first");
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/settings-step1`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          full_name: name,
          username: username,
        }),
      });

      const data = await res.json();
      console.log("SAVE RESPONSE:", data);
      if (data.status === 200) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        toastSuccess("Changes saved successfully");
        setOriginalEmail(email);
        setIsEmailChanged(false);
        setIsOtpSent(false);
        setCode("");
      } else {
        toastError(data.message || "Failed to save changes");
      }
    } catch (error) {
      console.log("SAVE ERROR:", error);
      toastError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);

    if (value !== originalEmail) {
      setIsEmailChanged(true);
      setIsOtpSent(false);
      setIsEmailVerified(false);
      setCode("");
    } else {
      setIsEmailChanged(false);
      setIsOtpSent(false);
      setIsEmailVerified(true);
      setCode("");
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {activeTab == 0 && (
            <View style={styles.Section}>
              <PageNameHeaderBar
                title="Account Setting"
                navigation={navigation}
              />
              <View style={styles.header}>
                <Text style={styles.label}>Confirm Password</Text>
                <Text style={styles.info}>
                  Password ensures your account safety. Please don’t share it
                  with anyone.
                </Text>
              </View>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordsection}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="*********"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {activeTab == 1 && (
            <View style={styles.Section}>
              <PageNameHeaderBar
                title="Account"
                navigation={navigation}
                setActiveTab={setActiveTab}
              />
              <Text style={styles.label}>Email</Text>
              <View style={styles.emailContainer}>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Enter email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={handleEmailChange}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    { opacity: isEmailChanged && !isEmailVerified ? 1 : 0.5 },
                  ]}
                  onPress={handleSendEmailOtp}
                  disabled={!isEmailChanged || isEmailVerified || optLoading}
                >
                  {optLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="paper-plane" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>

              {isEmailChanged && !isEmailVerified && (
                <TextInput
                  style={[
                    styles.codeInput,
                    { backgroundColor: isOtpSent ? "#fff" : "#6b6b6b" },
                  ]}
                  placeholder="Enter 6 digit code"
                  placeholderTextColor="#c8c8c8"
                  value={code}
                  onChangeText={setCode}
                  editable={isOtpSent}
                  maxLength={6}
                />
              )}
              {/* Show verify button only when user starts typing */}
              {isEmailChanged && !isEmailVerified && code.length > 0 && (
                <BorderButton
                  title={isVerifying ? "Verifying..." : "Verify"}
                  onPress={handleVerifyOtp}
                  disabled={isVerifying}
                />
              )}
              <View style={styles.namesection}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.passwordsection}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="info.got"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
              <View style={styles.namesection}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.passwordsection}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="name123"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
              </View>
            </View>
          )}
          <View style={styles.button}>
            <GradientButton
              loading={loading}
              disabled={loading}
              title={activeTab === 0 ? "Continue" : "Save Changes"}
              onPress={() => {
                if (activeTab === 0) {
                  handleConfirmPassword();
                } else {
                  handleSaveChanges();
                }
              }}
            />
            {activeTab == 1 && 
              <BorderButton 
                title="Close your account"
                onPress={() => navigation.navigate("DeleteAccountScreen", {
                  email: email
                })}
              />
            }
          </View>
        </View>
        {admin == 2 ? <EmployerFooter /> : <Footer />}
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
  label: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    marginBottom: 5,
  },
  info: {
    color: "#c3c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    marginBottom: 5,
  },
  passwordsection: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    flex: 1,
    color: "#000",
  },

  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -9 }],
  },

  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  emailInput: {
    flex: 1,
    color: "#000",
    paddingHorizontal: 10,
    height: 45,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontFamily: "Montserrat_400Regular",
  },
  sendButton: {
    width: 45,
    height: 44,
    borderRadius: 6,
    backgroundColor: "#29a37d",
    justifyContent: "center",
    alignItems: "center",
  },
  codeInput: {
    marginTop: 12,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 10,
    color: "#000",
    fontFamily: "Montserrat_400Regular",
  },
  namesection: {
    paddingTop: 15,
  },
  button: {
    paddingTop: 20,
  },
});

export default AccountSetting;
