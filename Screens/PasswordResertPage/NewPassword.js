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
import GradientButton from "../../components/GradientButton";

const NewPassword = ({ onNext }) => {
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState("");
  return (
    <>
      <View style={styles.heading}>
        <Text style={styles.title}>Create A New Password</Text>
        <Text style={styles.subtitle}>
          Your new Password must be different from previous used password
        </Text>
        <View style={styles.section}>
          <Text style={styles.label}> New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="* * * * * * * * * * *"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.requirementRow}>
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
                    
                    color="#fff"
                  />
                )}
              </View>
              <Text style={styles.requirementText}>
                {" "}
                Must have at least 8 characters
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>
            Conferm Password
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="* * * * * * * * * *"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <GradientButton marginTop={25} title="Send" onPress={onNext} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    lineHeight: "24",
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

    fontFamily: "Montserrat_400Regular",
    color: "#666666",
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
