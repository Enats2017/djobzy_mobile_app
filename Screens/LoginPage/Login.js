import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { API_URL, API_ICON } from "../../api/ApiUrl";
import { SafeAreaView } from "react-native-safe-area-context";
import { toastError, toastSuccess } from "../../utils/toast";
import GradientButton from "../../components/GradientButton";

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
    padding: isSmall ? 12 : isTablet ? 15 : 15,
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

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailerror, setEmailError] = useState(" ");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      setEmailError("Emaii Field is require");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email");
      return;
    }

    if (!password) {
      setPasswordError("Password Field is require");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        toastError("Login Failed", data.message || "Invalid credentials");
        return;
      }
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      toastSuccess("Login successful");
      const { verification_count, admin } = data.user;
      if (verification_count < 2) {
        navigation.reset({
          index: 0,
          routes: [{ name: "VerificationPage" }],
        });
        return;
      }

      if (admin == 2) {
        navigation.reset({
          index: 0,
          routes: [{ name: "EmployerDashboard" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong: " + error.message);

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#444444", "#222222"]} style={styles.containers}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          extraScrollHeight={40}
          keyboardShouldPersistTaps="handled"
        >
          <ScrollView
            contentContainerStyle={styles.scrolcontent}
            showsVerticalScrollIndicator={false}
          >
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
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="xyz@gmail.com"
                placeholderTextColor="#888"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError(""); // clear error while typing
                }}
              />
            </View>
            {emailerror ? (
              <Text style={{ color: "red", marginTop: 5 }}>{emailerror}</Text>
            ) : null}

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError(""); // clear error while typing
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={eyeIconSize}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={{ color: "red", marginTop: 5 }}>
                {passwordError}
              </Text>
            ) : null}

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setRemember(!remember)}
              >
                <View
                  style={[styles.checkbox, remember && styles.checkboxChecked]}
                >
                  {remember && (
                    <Ionicons
                      name="checkmark"
                      size={checkIconSize}
                      color="#000"
                    />
                  )}
                </View>
                <Text style={styles.rememberText}> Remember Me</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("PasswordResert")}
              >
                <Text style={styles.forgotText}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%" }}>
              <GradientButton
                title="Log in"
                disabled={loading}
                loading={loading}
                onPress={handleLogin}
              />
            </View>

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

            {/* <TouchableOpacity style={styles.socialBtn}>
              <Image
                source={require("../../assets/images/facebook.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialText}>Sign In with Facebook</Text>
            </TouchableOpacity> */}

            <Text style={styles.footerText}>
              Don’t have an account?{" "}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("Signup")}
              >
                Create one now
              </Text>
            </Text>
          </ScrollView>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containers: { flex: 1 },
  scrolcontent: {
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 20,
  },

  logo: { width: logoSize, height: logoSize, resizeMode: "contain" },
  title: {
    fontSize: titleSize,
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
    padding: 2,
  },
  subtitle: {
    fontSize: subtitleSize,
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 5,
    fontFamily: "Montserrat_600SemiBold",
 
    fontSize: labelSize,
  },
  input: {
    flex:1,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#0000",
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
  passwordInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#000",
  },
  eyeIcon: { paddingHorizontal: 5 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 15,
    alignItems: "center",
  },
  rememberMe: { flexDirection: "row", alignItems: "center" },
  rememberText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
  },
  forgotText: {
    color: "#D08373",
    textDecorationLine: "underline",
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
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
  orText: {
    color: "#fff",
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#FFF", borderColor: "#FFF" },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6a6565ff",
    width: "100%",
    height: 45,
    borderRadius: 6,
    marginBottom: 10,
  },
  socialIcon: {
    width: socialIconSize,
    height: socialIconSize,
    marginRight: 5,
    resizeMode: "contain",
  },
  socialText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
  },
  footerText: {
    color: "#fff",
    marginTop: 7,
    textAlign: "center",
  
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  linkText: {
    color: "#C96B59",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    textDecorationLine: "underline",
  },
});

export default Login;
