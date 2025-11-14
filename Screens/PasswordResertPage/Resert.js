import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";

const Resert = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${API_URL}/forgot`,
        { email: email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === true) {
        Alert.alert("Success", response.data.message);
        onNext(email);
      } else {
        setError(
          response.data.message || "No account found with this email address"
        );
      }
    } catch (error) {
      // console.error("API Error:", error);
      if (error.response && error.response.status === 404) {
        setError("No account found with this email address");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.heading}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter the email associated with your account and well send
          instructions to reset your password
        </Text>

        <View style={styles.emalInput}>
          <Text style={styles.label}>Email</Text>
          <View style={{ position: "relative", width: "100%" }}>
            <TextInput
              style={styles.input}
              placeholder="xyz@gmail.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error && (
              <Feather
                name="alert-circle"
                size={22}
                color="#d81818ff"
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: [{ translateY: -11 }],
                }}
              />
            )}
          </View>

          {error ? (
            <Text style={{ color: "#d81818ff", fontSize: 15, padding: 7 }}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleForgotPassword}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Email</Text>
            )}
          </TouchableOpacity>
        </View>
        <View>
          
        </View>
      </View>
     
    </>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 29,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    top: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "#f6f0f0ff",
    textAlign: "center",
    marginHorizontal: 20,
    padding: 10,
    top: 25,
  },
  emalInput: {
    margin: 15,
    padding: 8,
    top: 30,
  },
  label: {
    color: "#fff",
    alignSelf: "flex-start",
    padding: 5,
    fontSize: 17,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 8,

    paddingHorizontal: 12,
  },
  loginBtn: {
    width: "100%",
    height: 50,
    backgroundColor: "#f49696eb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  loginText: { color: "#fff", fontWeight: "bold", fontSize: 19 },
    
 
});

export default Resert;
