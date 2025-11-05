import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { API_URL , API_ICON } from "../../api/ApiUrl";


const { width, height } = Dimensions.get("window");
const getResponsiveValues = () => {
  const isSmall = width < 380;
  const isTablet = width >= 768;

  return {
    titleSize: isSmall ? 24 : isTablet ? 40 : 35,
    subtitleSize: isSmall ? 13 : isTablet ? 22 : 16,
    labelSize: isSmall ? 12 : isTablet ? 18 : 14,
    inputTextSize: isSmall ? 13 : isTablet ? 18 : 15,
    buttonTextSize: isSmall ? 15 : isTablet ? 22 : 18,
    footerTextSize: isSmall ? 13 : isTablet ? 18 : 18,
    padding: isSmall ? 12 : isTablet ? 28 : 20,
    marginTop: isSmall ? 20 : isTablet ? 50 : 30,
    marginBottom: isSmall ? 15 : isTablet ? 35 : 25,
    buttonHeight: isSmall ? 42 : isTablet ? 60 : 48,
    buttonRadius: isSmall ? 6 : isTablet ? 12 : 8,
    inputHeight: isSmall ? 42 : isTablet ? 55 : 48,
    inputRadius: isSmall ? 6 : isTablet ? 12 : 8,
    logoSize: isSmall ? 80 : isTablet ? 150 : 100,
    eyeIconSize: isSmall ? 16 : isTablet ? 26 : 20,
    checkIconSize: isSmall ? 12 : isTablet ? 20 : 14,
    socialIconSize: isSmall ? 18 : isTablet ? 28 : 22,
  };
};

const {
  titleSize,
  subtitleSize,
  labelSize,
  inputTextSize,
  buttonTextSize,
  footerTextSize,
  padding,
  marginTop,
  marginBottom,
  buttonHeight,
  buttonRadius,
  inputHeight,
  inputRadius,
  logoSize,
  eyeIconSize,
  checkIconSize,
  socialIconSize,
} = getResponsiveValues();

const Login = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json(); 
      setLoading(false);
      if (response.ok) {
       if (data.token) {
      await AsyncStorage.setItem("token", data.token);  
       }
        Alert.alert("Success", "Login successful ");
        navigation.navigate("Dashboard");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong: " + error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#1c1c1c", "#2e2a2ac5", "#3a3a3a"]}
      style={styles.containers}
    >
       <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >

      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/Login-icon.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Sign In To Your Account</Text>
        <Text style={styles.subtitle}>
          Enter your email and password to log in
        </Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="xyz@gmail.com"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter Password"
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
              size={eyeIconSize}
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
                <Ionicons name="checkmark" size={checkIconSize} color="#fff" />
              )}
            </View>
            <Text style={styles.rememberText}> Remember Me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate("Forget")}>
            <Text style={styles.forgotText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Log in</Text>
          )}
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={require("../../assets/images/Google.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Sign In with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={require("../../assets/images/facebook.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Sign In with Facebook</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("Signup")}
          >
            Create one now
          </Text>
        </Text>
      </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  containers: { flex: 1 },
  container: {
    padding,
    alignItems: "center",
    marginTop,
    marginBottom,
  },
  logoContainer: { marginTop: 10, alignItems: "center" },
  logo: { width: logoSize, height: logoSize, resizeMode: "contain" },
  title: {
    fontSize: titleSize,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    padding: 2,
  },
  subtitle: {
    fontSize: subtitleSize,
    color: "#f6f0f0ff",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginTop: 10,
    fontSize: labelSize,
  },
  input: {
    width: "100%",
    height: inputHeight,
    backgroundColor: "#fff",
    borderRadius: inputRadius,
    paddingHorizontal: 12,
    fontSize: inputTextSize,
  },
  passwordContainer: {
    width: "100%",
    height: inputHeight,
    borderRadius: inputRadius,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  passwordInput: { flex: 1, fontSize: inputTextSize },
  eyeIcon: { paddingHorizontal: 5 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 15,
    alignItems: "center",
  },
  rememberMe: { flexDirection: "row", alignItems: "center" },
  rememberText: { color: "#fff", marginLeft: 5, fontSize: 13 },
  forgotText: {
    color: "#f76c6c",
    textDecorationLine: "underline",
    fontSize: 13,
  },
  loginBtn: {
    width: "100%",
    height: buttonHeight,
    backgroundColor: "#f49696eb",
    borderRadius: buttonRadius,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  loginText: { color: "#fff", fontWeight: "bold", fontSize: buttonTextSize },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    width: "100%",
  },
  line: { flex: 1, height: 1, backgroundColor: "#888" },
  orText: { color: "#fff", marginHorizontal: 10, fontSize: 14 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#f76c6c", borderColor: "#f76c6c" },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center",
    backgroundColor: "#6a6565ff",
    width: "100%",
    height: 45,
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  socialIcon: {
    width: socialIconSize,
    height: socialIconSize,
    marginRight: 5,
    resizeMode: "contain",
  },
  socialText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  footerText: { color: "#fff", marginTop: 10, fontSize: footerTextSize },
  linkText: {
    color: "#f76c6c",
    fontWeight: "650",
    fontSize: footerTextSize,
    textDecorationLine: "underline",
  },
});

export default Login;
