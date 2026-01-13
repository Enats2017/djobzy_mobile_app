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
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../components/GradientButton";

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
      navigation.replace("Register_Success", { email: email });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#444444", "#222222"]} style={styles.containers}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 30 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
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
              placeholder=" Enter Full Name/Company Name"
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
            <Text style={styles.label}>Create a password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder=" Enter Password"
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
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Referral's username (Optional)</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="username"
                placeholderTextColor="#888"
                value={referralUsername}
                onChangeText={setReferralUsername}
              />
            
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
            <View style={{ width: "100%" }}>
              <GradientButton title="Sign Up" onPress={handleRegister} disabled={loading} loading={loading} />
            </View>

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
              <Text style={styles.socialText}>Sign up with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.facebookBtn}>
              <Image
                source={require("../../assets/images/facebook.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialText}>Sign up with Facebook</Text>
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
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  containers: {
    flex: 1,
    paddingHorizontal: 17,
  },
  // container: {
  //   alignItems: "center",
  //   padding: 15,
  //   marginTop: 50,
  //   marginBottom: 20,
  // },
  logoContainer:{
    alignItems:"center",
    paddingTop:20
  },

  title: {
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
      fontFamily:"Montserrat_600SemiBold",
  },
  subtitle: {
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily:"Montserrat_600SemiBold",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 5,
    fontFamily:"Montserrat_600SemiBold",
    marginTop: 10,
    fontSize:16,
  },
  input: {
    width: "100%",
    height: 48,
   fontFamily:"Montserrat_400Regular",
    fontSize:14,
    color:"#0000",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    width: "100%",
    height: 48,
    borderRadius: 6,
    paddingHorizontal:5,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: { 
    flex: 1,
    fontFamily:"Montserrat_400Regular",
    fontSize:14,
    color:"#000"

   },
  eyeIcon: { paddingHorizontal: 5 },
  row: { flexDirection: "column", width: "100%", marginVertical: 10 },
  rememberMe: { flexDirection: "row", alignItems: "center" },
  rememberText: { color: "#fff", marginLeft: 5, fontFamily:"Montserrat_400Regular", fontSize:14 },
  forgotText: {
    color: "#CB7767",
    textDecorationLine: "underline",
    fontFamily:"Montserrat_400Regular",
    marginLeft: 24,
    fontSize:14,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    width: "100%",
  },
  line: { flex: 1, height: 1, backgroundColor: "#888" },
  orText: { color: "#fff", marginHorizontal: 10, fontFamily:"Montserrat_500Medium" },
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
  socialText: { color: "#fff", fontWeight: "600", marginLeft: 10, fontFamily:"Montserrat_600SemiBold" },
  footerText: { color: "#fff", marginTop: 8, fontSize: 16, fontFamily:"Montserrat_400Regular", textAlign:"center" },
  linkText: {
    color: "#CB7767",
    fontWeight: "600",
    fontSize: 18,
    textDecorationLine: "underline",
  },
});

export default Signup;
