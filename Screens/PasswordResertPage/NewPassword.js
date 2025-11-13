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

const NewPassword = ({ onNext }) => {
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
            <MaterialIcons
              name="done"
              size={18}
              color="#0c0c0cff"
              style={styles.icon}
            />
            <Text style={styles.requirementText}>
              Must have at least 8 characters
            </Text>
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

          <TouchableOpacity style={styles.loginBtn} onPress={onNext}>
            <Text style={styles.loginText}>Sign Up</Text>
          </TouchableOpacity>
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
    top: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#f6f0f0ff",
    textAlign: "center",
    marginHorizontal: 20,
    padding: 10,
    top: 15,
  },
  emalInput: {
    margin: 15,
    padding: 8,
    top: 30,
  },

  section: {
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    padding: 15,
    marginTop: 40,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    width: "100%",
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,

    color: "#000",
  },
  eyeIcon: {
    padding: 5,
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
