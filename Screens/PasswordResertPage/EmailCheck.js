import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
  Platform,
} from "react-native";
import GradientButton from "../../components/GradientButton";
import { useState, useEffect } from "react";
const RESEND_TIME = 30;

const EmailCheck = ({ onNext, email, onResend }) => {
  console.log(email);
  const [timer, setTimer] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);

  // 🔹 Open Email App
  const openEmailApp = async () => {
    const url = Platform.OS === "android" ? "mailto:" : "message:";

    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert(
        "No Email App",
        "No email app found. Please install an email app to continue.",
      );
      return;
    }

    Linking.openURL(url);
  };

  // 🔹 Resend timer
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    onResend();
    setTimer(RESEND_TIME);
    setCanResend(false);
  };

  return (
    <>
      <View style={styles.heading}>
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>We sent a password reset link to </Text>
        <Text style={styles.sub}>{email}</Text>
        <View style={{ paddingTop: 20 }}>
          <GradientButton title="Open email app" onPress={openEmailApp} />
        </View>
        <View style={styles.link}>
          {!canResend ? (
            <Text style={styles.linktitle}>
              Didn’t receive the email? Resend in {timer}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.linktitle}>
                 Didn’t receive the email?{" "}
              <Text style={styles.textlink}>Click to resend</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 35,
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
    marginBottom: 5,
    color: "#fff",
  },
  sub: {
    color: "#CE7462",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Montserrat_700Bold",
    marginBottom: 5,
  },

  link: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    gap: 2,
  },
  linktitle: {
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  textlink: {
    color: "#f49696eb",
    textDecorationLine: "underline",
    fontFamily: "Montserrat_400Regular",
  },
});

export default EmailCheck;
