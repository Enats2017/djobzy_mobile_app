import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../api/ApiUrl";
import GradientButton from "../../components/GradientButton";
import { toastError, toastSuccess } from "../../utils/toast";


const NewPassword = ({ email }) => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isValidLength = password.length >= 8;
  const isMatch = password === confirmPassword && confirmPassword.length > 0;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!isValidLength) {
      toastError("Password must be at least 8 characters");
      return;
    }
    if (!isMatch) {
      toastError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Password update failed");
      }

      toastSuccess("Password updated successfully");
      navigation.replace("Login");
    } catch (error) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.heading}>
      <Text style={styles.title}>Create New Password</Text>
      <Text style={styles.subtitle}>
        Your new password must be different from previously used password
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>New Password</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="********"
            placeholderTextColor="#999"
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
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.requirementRow}>
          <View
            style={[styles.checkbox, isValidLength && styles.checkboxChecked]}
          >
            {isValidLength && <Ionicons name="checkbox-outline" size={17} color="#fff" />}
          </View>
          <Text style={styles.requirementText}>
            Must be at least 8 characters
          </Text>
        </View>

        <Text style={[styles.label, { marginTop: 20 }]}>Confirm Password</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="********"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {confirmPassword.length > 0 && !isMatch && (
          <Text style={{ color: "red", marginTop: 5 }}>
            Passwords do not match
          </Text>
        )}

        <GradientButton marginTop={25} title="Send" onPress={handleSubmit} disabled={loading} loading={loading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    lineHeight: 24,
  },
  emalInput: {
    margin: 15,
    padding: 8,
    top: 30,
  },

  section: {
    marginTop: 25,
  },
  label: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    padding: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    width: "100%",
    marginBottom: 7,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    textAlignVertical: "center",
    fontFamily: "Montserrat_400Regular",
    color: "#000",
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
  },
  icon: {
    backgroundColor: "#ffff",
    borderRadius: 4,
  },
  requirementText: {
    color: "#ecf0ecff",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    marginLeft: 6,
  },
  loginBtn: {
    backgroundColor: "#f49696eb",
    borderRadius: 10,
    top: 30,

    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#f49696",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
});

export default NewPassword;
