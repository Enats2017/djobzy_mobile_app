import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
  TextInput,
  Keyboard,
  Platform,
} from "react-native";
import GradientButton from "../../components/GradientButton";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { toastError } from "../../utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import { toastSuccess } from "../../utils/toast";
import NewPassword from "./NewPassword";
const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

const EmailCheck = ({ onNext, email, onResend }) => {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(1);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) {
      const pastedCode = text.slice(0, CODE_LENGTH).split("");
      setCode(pastedCode);
      Keyboard.dismiss();
      return;
    }
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < CODE_LENGTH - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalCode = code.join("");

    if (finalCode.length !== CODE_LENGTH) {
      toastError("Please enter the full verification code.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/verify-forgot-otp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          email_pin: finalCode,
        }),
      });
      const data = await response.json();
      // console.log("API Response Data:", data);
      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      toastSuccess(data.message);
      setStatus(2);
    } catch (error) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setTimer(RESEND_SECONDS);
      toastSuccess("Verification code resent.");
    } catch (error) {
      toastError("Failed to resend code. ".error);
    }
  };

  // Resend timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <View style={{ flex: 1 }}>
      {status === 1 ? (
        <View style={styles.heading}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>We sent a password reset link to </Text>
          <Text style={styles.sub}>{email}</Text>
          <View style={styles.otpContainer}>
            {code.map((digit, index) => {
              const isActive = activeIndex === index;
              const isFilled = digit !== "";
              return (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={[
                    styles.input,
                    isActive && styles.activeInput,
                    isFilled && !isActive && styles.filledInput,
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  placeholder="-"
                  placeholderTextColor="#666"
                  caretHidden={true}
                  onFocus={() => setActiveIndex(index)}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              );
            })}
          </View>

          <View style={{ marginTop: 20 }}>
            {timer > 0 ? (
              <Text style={styles.timer}>
                00:{timer < 10 ? `0${timer}` : timer} left
              </Text>
            ) : (
              <View style={styles.resendRow}>
                <Text style={styles.resendGrey}>Didn’t receive the code? </Text>
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendRed}>Click to resend</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={{ width: "100%" }}>
            <GradientButton
              title="Verify"
              onPress={handleVerify}
              disabled={loading}
              loading={loading}
            />
          </View>
        </View>
      ) : (
        <NewPassword email={email} />
      )}
    </View>
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  input: {
    // width: 55,
    flex: 1,
    height: 55,
    borderWidth: 1.5,
    borderColor: "#444",
    borderRadius: 14,
    textAlign: "center",
    fontSize: 26,
    color: "#fff",
    marginHorizontal: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  activeInput: {
    borderColor: "#ffffff",
    textAlign: "center",
  },

  filledInput: {
    borderColor: "#777",
    textAlign: "center",
  },
  timer: {
    color: "#aaa",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendGrey: {
    color: "#888",
  },
  resendRed: {
    color: "#cb7767",
    fontWeight: "Montserrat_600SemiBold",
  },
  heading: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 10,
  },
});

export default EmailCheck;
