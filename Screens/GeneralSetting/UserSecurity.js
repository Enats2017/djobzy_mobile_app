import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Text, Alert, ActivityIndicator } from "react-native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import InputField from "../../components/InputField";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";

import { useNavigation } from "@react-navigation/native";
import { API_URL, API_ICON } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserSecurity = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const validate = () => {
    if (!oldPassword || !newPassword || !repeatPassword) {
      Alert.alert("Error", "All fields are required");
      return false;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return false;
    }

    if (newPassword !== repeatPassword) {
      Alert.alert("Error", "New and confirm password should match");
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token"); // if auth token exists
      const response = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: repeatPassword,
        }),
      });

      const data = await response.json();
      console.log("Change Password Response:", data);
      if (data.status === 200) {
        Alert.alert("Success", "Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setRepeatPassword("");
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Change Password Error:", error);
      Alert.alert("Error", "Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar title="Security" navigation={navigation} />

        <View style={styles.section}>
          <InputField
            label="Old Password"
            placeholder="********"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />

          <InputField
            label="New Password"
            placeholder="********"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <InputField
            label="Repeat New Password"
            placeholder="********"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.question}>
          <FontAwesome name="question-circle" size={20} color="#fff" />
          <Text style={styles.info}>
            Password must be at least 8 characters and contain numbers and
            special symbols
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <GradientButton onPress={handleChangePassword} />
        )}
      </View>

      <Footer />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  question: {
    flexDirection: "row",
    alignContent: "center",
    gap: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  info: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#ffffff",
    width: "98%",
  },
});

export default UserSecurity;
