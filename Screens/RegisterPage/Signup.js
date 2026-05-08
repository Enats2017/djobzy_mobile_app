import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
  ActivityIndicator
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../components/GradientButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { toastError, toastSuccess } from "../../utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QuestionMark from "../../components/QuestionMark";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [referralUsername, setReferralUsername] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();
  const emailRegex = /^[^\s@]+@[^\s@]+\.(com)$/i;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "557477739499-i9c6llmn6veeej7pka0iu3gv49v4r27u.apps.googleusercontent.com",
    });
  }, []);

  const handleRegister = async () => {
    let hasError = false;

    if (!fullName) {
      setFullNameError("Full name is required.");
      hasError = true;
    }

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email ending with .com");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      hasError = true;
    }

    if (!confirmPassword) {
      setPasswordError("Please confirm your password.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;
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
          referral_user: referralUsername,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        toastError(data.message || "Registration failed.");
        return;
      }
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      navigation.replace("VerifyRegisterEmail", { email: email });
      toastSuccess("Register successful");
    } catch (err) {
      console.log(err);
      toastError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      console.log("1️⃣ Google signup started");
      setGoogleLoading(true);
      console.log("2️⃣ Checking play services");
      await GoogleSignin.hasPlayServices();
      console.log("3️⃣ Opening Google popup");
      const response = await GoogleSignin.signIn();
      console.log("4️⃣ Google response:", response);
      const idToken = response?.data?.idToken;
      console.log("5️⃣ ID TOKEN:", idToken);
      if (!idToken) {
        console.log("❌ Google token missing");
        toastError("Google token missing");
        return;
      }
      console.log("6️⃣ Sending token to backend");
      const res = await fetch(`${API_URL}/auth/google/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            id_token: idToken,
            referral: referralUsername || null,
          }),
        }
      );
      console.log("7️⃣ Backend response status:", res.status);
      const data = await res.json();
      console.log("8️⃣ Backend response data:", data);
      if (!res.ok) {
        console.log("❌ Backend returned error");
        toastError(data.message || "Google signup failed");
        return;
      }
      console.log("9️⃣ Saving token/user");
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      const { verification_count, admin } = data.user;
      console.log( "🔟 verification_count:", verification_count);
      if (verification_count < 2) {
        console.log("➡️ Redirecting to VerificationPage");
        navigation.reset({
          index: 0,
          routes: [{ name: "VerificationPage" }],
        });
        return;
      } else {
        console.log("➡️ Redirecting to Dashboard");
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      }
      console.log("✅ Google signup success");
      toastSuccess("Register successful");
    } catch (error) {
      console.log("❌ GOOGLE SIGNUP ERROR FULL:",JSON.stringify(error, null, 2));
      console.log("❌ GOOGLE SIGNUP ERROR RAW:",error);
      console.log("❌ GOOGLE SIGNUP ERROR CODE:",error?.code);
      console.log("❌ GOOGLE SIGNUP ERROR MESSAGE:",error?.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        toastError("Google signup cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        toastError("Google signup already running");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        toastError("Google Play Services unavailable");
      } else {
        toastError("Google signup failed");
      }
    } finally {
      console.log("🏁 Google signup finished");
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#444444", "#222222"]} style={styles.containers}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          extraScrollHeight={80}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 50 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/d_logo.png")}
                style={styles.logo}
              />
            </View>
            <Text style={styles.title}>Create Your Account</Text>

            <Text style={styles.label}>Full Name/Company Name</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder=" Enter Full Name/Company Name"
                placeholderTextColor="#838383"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setFullNameError("");
                }}
              />
            </View>
            {fullNameError ? (
              <Text style={styles.errorText}>{fullNameError}</Text>
            ) : null}
            <Text style={styles.label}>Email</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="xyz@gmail.com"
                placeholderTextColor="#838383"
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            <Text style={styles.label}>Create a password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder=" Type a password"
                placeholderTextColor="#838383"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (confirmPassword && text !== confirmPassword) {
                    setPasswordError("Passwords do not match");
                  } else {
                    setPasswordError("");
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={15}
                  color="#838383"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Repeat your Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder=" Type the password again"
                placeholderTextColor="#838383"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (password && text !== password) {
                    setPasswordError("Passwords do not match");
                  } else {
                    setPasswordError("");
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={15}
                  color="#838383"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <View style={styles.label}>
              <QuestionMark title="Referral username (Optional)"
                iconColor="#fff"
                tooltipMessage="The Referral System allows you to earn a passive income of 3% from every completed
                contract of a user you invited. If you invite someone who earned $1000,
                you get $30. If you invite someone who paid $1000 for a service, you get $30.
                The invited person also benefits by getting a 40% discount on fees when hiring and a
                15% discount when providing services. These benefits last for 6 months from the day of the invitation.
                To join the Referral Program, please navigate to: https://www.djobzy.com/referral-wallet"
              />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="username"
                placeholderTextColor="#838383"
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
                    <Ionicons name="checkmark" size={14} color="#000" />
                  )}
                </View>
                <Text style={styles.rememberText}>
                  By Signing up, you agree to the
                </Text>
              </TouchableOpacity >
              <Text style={styles.forgotText} onPress={() => Linking.openURL("https://www.djobzy.com/terms-of-use")}>
                Terms and Conditions{" "}
                <Text style={{ color: "#fff", textDecorationLine: "none" }}>
                  and
                </Text>{" "}
                Privacy Policy
              </Text>
            </View>
            <View style={{ width: "100%" }}>
              <GradientButton
                title="Sign Up"
                onPress={handleRegister}
                disabled={loading}
                loading={loading}
              />
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>Or</Text>
              <View style={styles.line} />
            </View>
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleSignup}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator size={26} color="#fff" />
              ) : (
                <>
                  <Image
                    source={require("../../assets/images/Google.png")}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialText}>Sign up with Google</Text>
                </>
              )}
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.facebookBtn}>
              <Image
                source={require("../../assets/images/facebook.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialText}>Sign up with Facebook</Text>
            </TouchableOpacity> */}
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
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  containers: {
    flex: 1,
    paddingHorizontal: 15,

  },
  errorText: {
    color: "#d32f2f",
    fontSize: 13,
    marginTop: 4,
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  logo: {
    width: 50,
    height: 50
  },

  title: {
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Montserrat_600SemiBold",
  },
  subtitle: {
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 5,
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#0000",
  },
  passwordContainer: {
    width: "100%",
    height: 48,
    borderRadius: 6,
    paddingHorizontal: 5,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#000",
  },
  eyeIcon: { paddingHorizontal: 5 },
  row: { flexDirection: "column", width: "100%", marginVertical: 10 },
  rememberMe: { flexDirection: "row", alignItems: "center" },
  rememberText: {
    color: "#fff",
    marginLeft: 12,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  forgotText: {
    color: "#CB7767",
    textDecorationLine: "underline",
    fontFamily: "Montserrat_400Regular",
    marginLeft: 32,
    fontSize: 14,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    width: "100%",
  },
  line: { flex: 1, height: 1, backgroundColor: "#ffffff33" },
  orText: {
    color: "#fff",
    marginHorizontal: 10,
    fontFamily: "Montserrat_500Medium",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FFF",
    borderColor: "#FFF",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6a6565ff",
    width: "100%",
    height: 50,
    borderRadius: 10,
    gap: 6,
  },

  socialIcon: {
    width: 22,
    height: 22,
    textAlign: "center",
  },
  socialText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 5,
    fontFamily: "Montserrat_600SemiBold",
  },
  footerText: {
    color: "#fff",
    marginTop: 8,
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
  },
  linkText: {
    color: "#CB7767",
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "Montserrat_500Medium",
  },
});

export default Signup;
