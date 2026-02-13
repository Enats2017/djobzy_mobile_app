import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
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

const AccountSetting = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [codeEnabled, setCodeEnabled] = useState(false);
  const [password, setPassword] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { user } = route.params || {};
  const [admin, setAdmin] = useState(0);

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
        setName(user?.full_name || "");
        setUsername(user?.name || "");
        setActiveTab(1);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.log("Password confirm error:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOtp = async () => {
    try {
      if (!email) {
        Alert.alert("Error", "Please enter email");
        return;
      }
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
        Alert.alert("Success", "OTP sent to your email");
        setCodeEnabled(true);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.log("Send email OTP error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    setAdmin(user?.admin);
  };
  useEffect(() => {
    loadUser();
  }, []);
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
                  placeholder="info.got@gmail.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendEmailOtp}
                >
                  <Ionicons name="paper-plane" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[
                  styles.codeInput,
                  { backgroundColor: codeEnabled ? "#fff" : "#6b6b6b" },
                ]}
                placeholder="Enter code"
                placeholderTextColor="#c8c8c8"
                value={code}
                onChangeText={setCode}
                editable={codeEnabled}
              />
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
                    placeholder="info.got@gmail.coom"
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
              title={activeTab === 0 ? "Continue" : "Save Changes"}
              onPress={() => {
                if (activeTab === 0) {
                  handleConfirmPassword();
                } else {
                  console.log("Save API call here");
                }
              }}
            />
            {activeTab == 1 && <BorderButton title="Close your account" />}
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
