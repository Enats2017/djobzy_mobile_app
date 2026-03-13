import { Ionicons, Entypo, FontAwesome6 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCreateJobGlobalStore } from "./useCreateJobGlobalStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../api/ApiUrl"; // path check karo
import { useNotifications } from "../context/MessageNotificationContext";
import { Alert } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";

const ACTIVE_COLOR = "#CB7767";
const INACTIVE_COLOR = "#000";
const CONTRACT_SCREENS = [
  "EmployerContracts",
  "EmployerJobPost",
  "ActiveContract",
  "ReceiveApplication",
  "EmployerSentOffer",
  "DeactivatedJobs",
];

const Home_Screen = [
  "EmployerDashboard",
  "PublicEmployeeProfilePage",
  "PublicEmployeeProfile",
];

const Profile_Screen = [
  "ReferralWallet",
  "EmployerAccount,",
  "ProfileSetting",
  "EmployeeVerification",
  "ProfileReviewPage",
  "Wallet",
];

const EmployerFooter = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isContractsActive = () => CONTRACT_SCREENS.includes(route.name);
  const isHomeActive = () => Home_Screen.includes(route.name);
  const isProfile = () => Profile_Screen.includes(route.name);
  const isActive = (routeName) => route.name === routeName;
  const { refreshUser } = useNotifications();

  const handleCreateJobNavigation = () => {
    const store = useCreateJobGlobalStore.getState();
    store.reset();
    store.resetEditMode();
    store.clearEditingFromReview();
    store.setActiveTab(0);
    navigation.navigate("CreateJob");
  };

  const handleSwitchAccount = async () => {
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
            onPress={() => navigation.navigate("EmployerDashboard")}
          >
            <Entypo
              name="home"
              size={24}
              color={isHomeActive() ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text style={[styles.label, isHomeActive() && styles.activeText]}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            // onPress={() => navigation.navigate("PaymentSuccess")}
            onPress={() => navigation.navigate("EmployerContracts")}
          >
            <Ionicons
              name="document-attach-sharp"
              size={24}
              color={isContractsActive() ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text
              style={[styles.label, isContractsActive() && styles.activeText]}
            >
              Contracts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={handleCreateJobNavigation}
          >
            <MaterialCommunityIcons
              name="plus-circle"
              size={24}
              color={isActive("CreateJob") ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text
              style={[styles.label, isActive("CreateJob") && styles.activeText]}
            >
              Job Post
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
              style={[
                styles.label,
                isActive("ChatList") && styles.activeText,
              ]}
            >
              Chat
            </Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("ProfileMenu")}
          >
            <FontAwesome6
              name="user-large"
              size={21}
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
    fontFamily: "Montserrat_400Regular",
  },
});
export default EmployerFooter;
