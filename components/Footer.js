import { Ionicons, Entypo, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useServiceGlobalStore } from "../Screens/PromoteServicesPage/ServiceGlobalStore";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../api/ApiUrl";
import { useNotifications } from "../context/MessageNotificationContext";
import { Alert } from "react-native";

const ACTIVE_COLOR = "#CB7767";
const INACTIVE_COLOR = "#000";

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { refreshUser } = useNotifications();
  const isActive = (routeName) => route.name === routeName;
  const handleSwitchAccount = async () => {
    console.log("SWITCH BUTTON PRESSED 🔥");
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/user-switch-account`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      await AsyncStorage.removeItem("user");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      await refreshUser();

      if (data?.account_type == 0) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else if (data?.account_type == 2) {
        navigation.reset({
          index: 0,
          routes: [{ name: "EmployerDashboard" }],
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to switch account");
    }
  };

  return (
    <>
      <View style={styles.bottomContainer}>
        <View style={styles.BottomBar}>
          <TouchableOpacity style={styles.tab} onPress={handleSwitchAccount}>
            <Octicons name="arrow-switch" size={25} color={INACTIVE_COLOR} />
            {/* <Entypo
          <TouchableOpacity
            style={styles.tab}
          >
            <Entypo
              name="home"
              size={25}
              color={isActive === "jobs" ? "#007bff" : "#000000"}
            /> */}
            <Text style={[styles.label, isActive == 0 && styles.activeText]}>
              Switch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Ionicons
              name="briefcase"
              size={24}
              color={isActive("Dashboard") ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text
              style={[styles.label, isActive("Dashboard") && styles.activeText]}
            >
              Jobs
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("EmployeeAccount")}
          >
            <Ionicons
              name="person"
              size={24}
              color={isActive("EmployeeAccount") ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text
              style={[styles.label, isActive("EmployeeAccount") && styles.activeText]}
            >
              Account
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("ChatList")}
          >
            <Ionicons
              name="chatbox"
              size={24}
              color={isActive("ChatList") ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text
              style={[styles.label, isActive("ChatList") && styles.activeText]}
            >
              Chat
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("EmployeeAccount")}
          >
            <Ionicons
              name="person"
              size={24}
              color={isActive("EmployeeAccount") ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text
              style={[
                styles.label,
                isActive("EmployeeAccount") && styles.activeText,
              ]}
            >
              Account
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("NotificationScreen")}
          >
            <MaterialCommunityIcons
              name="bell-badge"
              size={24}
              color={
                isActive("NotificationScreen") ? ACTIVE_COLOR : INACTIVE_COLOR
              }
            />
            <Text
              style={[
                styles.label,
                isActive("NotificationScreen") && styles.activeText,
              ]}
            >
              Notification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("ProfileMenu")}
          >
            <FontAwesome6
              name="user-large"
              size={22}
              color={isActive("ProfileMenu") ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text
              style={[
                styles.label,
                isActive("ProfileMenu") && styles.activeText,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  BottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 17,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 999,
    right: 0,
  },
  tab: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#000000ff",
    fontFamily: "Montserrat_400Regular",
    marginTop: 2,
  },
  activeText: {
    color: "#CB7767",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
});
export default Footer;
