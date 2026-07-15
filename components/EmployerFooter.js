import { useState } from "react";
import {
  Ionicons,
  Entypo,
  FontAwesome6,
} from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCreateJobGlobalStore } from "./useCreateJobGlobalStore";
import { API_URL } from "../api/ApiUrl";
import { useNotifications } from "../context/MessageNotificationContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SwitchOverlayAnimation from "./SwitchOverlayAnimation";
import { toastError } from "../utils/toast";

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
  "EmployerAccount",
  "ProfileSetting",
  "EmployeeVerification",
  "ProfileReviewPage",
  "Wallet",
];

const EmployerFooter = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { refreshUser, admin } = useNotifications();
  const isContractsActive = () => CONTRACT_SCREENS.includes(route.name);
  const isHomeActive = () => Home_Screen.includes(route.name);
  const isActive = (name) => route.name === name;
  const [showSwitchOverlay, setShowSwitchOverlay] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);

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
      setShowSwitchOverlay(true);
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
      await new Promise(resolve =>
        setTimeout(resolve, 1000)
      );
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
      toastError("Failed to switch account");
    } finally {
      setShowSwitchOverlay(false);
    }
  };

  const goToSearch = async () => {
    const userStr = await AsyncStorage.getItem("user");
    const user = JSON.parse(userStr);
    const { admin } = user;
    const search_type = admin == 2 ? 2 : 0;
    navigation.navigate("SearchScreen", { search_type });
  };

  return (
    <View style={[
      styles.bottomContainer,
      {
        paddingBottom: insets.bottom,
      },
    ]}
      onLayout={(e) => {
        setFooterHeight(e.nativeEvent.layout.height);
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.BottomBar}
      >
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("EmployerDashboard")}
        >
          <Image
            source={require("../assets/images/d_logo.png")}
            style={{ width: 25, height: 24, resizeMode: "contain" }}
          />
          <Text style={[styles.label, isHomeActive() && styles.activeText]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={goToSearch}
        >
          <MaterialCommunityIcons
            name="email-search"
            size={24}
            color={isActive("SearchScreen") ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
          <Text
            style={[
              styles.label,
              isActive("SearchScreen") && styles.activeText,
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
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
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("ProfileMenu")}
        >
          <Ionicons
            name="grid"
            size={24}
            color={isActive("ProfileMenu") ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
          <Text
            style={[
              styles.label,
              isActive("ProfileMenu") && styles.activeText,
            ]}
          >
            Menu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
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
          <Text style={[styles.label, isActive("CreateJob") && styles.activeText]}>
            Post a Job
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
              isActive("NotificationScreen")
                ? ACTIVE_COLOR
                : INACTIVE_COLOR
            }
          />
          <Text
            style={[
              styles.label,
              isActive("NotificationScreen") && styles.activeText,
            ]}
          >
            Notifications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("MyFeedPost")}
        >
          <Ionicons
            name="card"
            size={24}
            color={isActive("MyFeedPost") ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
          <Text
            style={[
              styles.label,
              isActive("MyFeedPost") && styles.activeText,
            ]}
          >
            My Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={handleSwitchAccount}>
          <MaterialCommunityIcons name="account-convert" size={24} color={INACTIVE_COLOR} />
          <Text style={styles.label}>Switch Role</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Followers", { activeTab: "follower" })}
        >
          <MaterialCommunityIcons
            name="account-check"
            size={24}
            color={
              isActive("Followers")
                ? ACTIVE_COLOR
                : INACTIVE_COLOR
            }
          />
          <Text
            style={[
              styles.label,
              isActive("Followers") && styles.activeText,
            ]}
          >
            My Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Followers", { activeTab: "following" })}
        >
          <MaterialCommunityIcons
            name="account-arrow-right"
            size={24}
            color={
              isActive("Followers")
                ? ACTIVE_COLOR
                : INACTIVE_COLOR
            }
          />
          <Text
            style={[
              styles.label,
              isActive("Followers") && styles.activeText,
            ]}
          >
            My Following
          </Text>
        </TouchableOpacity> */}
      </ScrollView>

      {
        showSwitchOverlay && (
          <SwitchOverlayAnimation
            accountType={admin}
            footerHeight={footerHeight}
          />
        )
      }
    </View>
  );
};
const styles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  BottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    gap: 15,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 65,
  },
  label: {
    fontSize: 14,
    color: "#000000ff",
    fontFamily: "Montserrat_400Regular",
    marginTop: 2,
  },
  activeText: {
    color: "#CB7767",
  },
});

export default EmployerFooter;