import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import { SafeAreaView } from "react-native-safe-area-context";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralUsername, setReferralUsername] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password,
          referral_username: referralUsername,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        Alert.alert("Register Failed", data.message || "Something went wrong");
        console.log("Error:", data);
        return;
      }
      navigation.navigate("Login", { email: email });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to connect to server");
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <LinearGradient
      colors={["#1c1c1c", "#2e2a2ac5", "#3a3a3a"]}
      style={styles.containers}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/Login-icon.png")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>Create An Account</Text>
          <Text style={styles.subtitle}>
            Create an account to explore about our app
          </Text>
          <Text style={styles.label}>Full Name/Company Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name/Company Name"
            placeholderTextColor="#888"
            value={fullName}
            onChangeText={setFullName}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="xyz@gmail.com"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Referral's username (Optional)</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Referral's username"
              placeholderTextColor="#888"
              value={referralUsername}
              onChangeText={setReferralUsername}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.rememberMe}
              onPress={() => setRemember(!remember)}
            >
              <View
                style={[styles.checkbox, remember && styles.checkboxChecked]}
              >
                {remember && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={styles.rememberText}>
                By Signing up, you agree to the
              </Text>
            </TouchableOpacity>
            <Text style={styles.forgotText}>
              Terms and Condition{" "}
              <Text style={{ color: "#fff", textDecorationLine: "none" }}>
                and
              </Text>{" "}
              Privacy Policy
            </Text>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
            <Text style={styles.loginText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.line} />
          </View>
          <TouchableOpacity style={styles.googleBtn}>
            <Image
              source={require("../../assets/images/Google.png")}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Sign In with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.facebookBtn}>
            <Image
              source={require("../../assets/images/facebook.png")}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Sign In with Facebook</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate("Login")}
            >
              Sign in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>

    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  containers: { flex: 1 },
  container: {
    alignItems: "center",
    padding: 15,
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 29,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#f6f0f0ff",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  passwordContainer: {
    width: "100%",
    height: 48,
    borderRadius: 6,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  passwordInput: { flex: 1 },
  eyeIcon: { paddingHorizontal: 5 },
  row: { flexDirection: "column", width: "100%", marginVertical: 10 },
  rememberMe: { flexDirection: "row", alignItems: "center" },
  rememberText: { color: "#fff", marginLeft: 5 },
  forgotText: {
    color: "#f76c6c",
    textDecorationLine: "underline",
    marginLeft: 24,
  },
  loginBtn: {
    width: "100%",
    height: 50,
    backgroundColor: "#f49696eb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  loginText: { color: "#fff", fontWeight: "bold", fontSize: 19 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    width: "100%",
  },
  line: { flex: 1, height: 1, backgroundColor: "#888" },
  orText: { color: "#fff", marginHorizontal: 10 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#f76c6c",
    borderColor: "#f76c6c",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6a6565ff",
    width: "100%",
    height: 45,
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  facebookBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6a6565ff",
    width: "100%",
    height: 45,
    borderRadius: 6,
    marginBottom: 4,
    paddingHorizontal: 15,
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginLeft: 80,
    textAlign: "center",
  },
  socialText: { color: "#fff", fontWeight: "600", marginLeft: 10 },
  footerText: { color: "#fff", marginTop: 18, fontSize: 18 },
  linkText: {
    color: "#f76c6c",
    fontWeight: "600",
    fontSize: 18,
    textDecorationLine: "underline",
  },
});

export default Signup;
