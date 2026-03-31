import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome6,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomSwitch from "./CustomSwitch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../api/ApiUrl";
import LineDivider from "./LineDivider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useServiceGlobalStore } from "../Screens/PromoteServicesPage/ServiceGlobalStore";

const HeaderMenuModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const [isEmployer, setIsEmployer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  const go = (screen, params = {}) => {
    onClose();
    navigation.navigate(screen, params);
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/profile-menu-list`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching User:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSwitchAccount = async () => {
    try {
      setSwitchLoading(true);
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
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

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
    } finally {
      setSwitchLoading(false);
    }
  };

  const toggleSwitch = async (newValue) => {
    setIsEmployer(newValue);
    onClose();
    await handleSwitchAccount();
  };

  const handleLogout = async () => {
    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status === 200) {
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    } catch (error) {
      console.log("Template API error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={[styles.container]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              {user?.admin == 0 ? "Switch to Employer" : "Switch to Employee"}
            </Text>
            {!switchLoading && (
              <CustomSwitch value={isEmployer} onChange={toggleSwitch} />
            )}
            {switchLoading && <ActivityIndicator size={30} color="#D17B68" />}
          </View>
          <LineDivider />
          <View style={styles.menuContainer}>
            {user?.admin == 0 ? (
              <MenuItem
                IconComponent={Entypo}
                icon="circle-with-plus"
                title="Promote Services"
                blackBg={true}
                onPress={() => {
                  const store = useServiceGlobalStore.getState();
                  store.reset();
                  store.resetUniqueId();
                  go("PromoteService", { userId: user?.id })
                }
                }
              />
            ) : (
              <MenuItem
                icon="add-circle-outline"
                title="Create a Job"
                blackBg={true}
                onPress={() => go("CreateJob", { userId: user?.id })}
              />
            )}
            <MenuItem
              icon="grid-outline"
              title="Dashboard"
              blackBg={true}
              onPress={() =>
                user?.admin == 0 ? go("Dashboard") : go("EmployerDashboard")
              }
            />
            <MenuItem
              icon="person"
              title="My account"
              onPress={() =>
                user?.admin == 0
                  ? go("EmployeeAccount", { name: user?.name })
                  : go("EmployerAccount", { name: user?.name })
              }
            />
            <MenuItem
              IconComponent={MaterialIcons}
              icon="reviews"
              title="Reviews"
              onPress={() => go("ProfileReviewPage")}
            />
            <MenuItem
              IconComponent={MaterialIcons}
              icon="verified"
              title="Verification"
              onPress={() => go("EmployeeVerification")}
            />
            <MenuItem
              icon="wallet"
              title="Wallet"
              onPress={() => go("Wallet")}
            />
            <MenuItem
              IconComponent={Entypo}
              icon="share"
              title="Referral wallet"
              onPress={() => go("ReferralWallet")}
            />
            <MenuItem
              icon="chatbubble-ellipses-outline"
              title="Chat"
              onPress={() => go("ChatList")}
            />
            <MenuItem
              IconComponent={Feather}
              icon="user-check"
              title="My Followers"
              onPress={() => go("Followers", { activeTab: "follower" })}
            />
            <MenuItem
              IconComponent={Feather}
              icon="user-minus"
              title="My Following"
              onPress={() => go("Followers", { activeTab: "following" })}
            />
            <MenuItem
              icon="settings-outline"
              title="Settings"
              onPress={() => go("GeneralSetting")}
            />
          </View>
          <TouchableOpacity
            style={styles.logoutContainer}
            onPress={handleLogout}
          >
            <Text style={styles.logoutLabel}>Logout</Text>
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="logout" size={24} color="#ffffff" />
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const MenuItem = ({ icon, title, IconComponent = Ionicons, onPress, blackBg }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={[styles.iconbox, blackBg && { backgroundColor: "#000000" }]}>
      <IconComponent name={icon} size={20} color={blackBg ? "#fff" : "#000"} />
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons name="chevron-forward" size={18} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#8686861A",
  },

  container: {
    position: "absolute",
    right: 10,
    top: 70,
    width: 300,
    height: 500,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    zIndex: 9999,
    elevation: 50,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
  },

  switchLabel: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  iconbox: {
    backgroundColor: "#1f1e1e33",
    width: 35,
    height: 35,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  menuIcon: {
    width: 20,
    textAlign: "center",
  },

  menuText: {
    flex: 1,
    color: "#000",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginLeft: 10,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  logoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 12,
    padding: 15,
    marginTop: 18,
  },
  logoutLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
});

export default HeaderMenuModal;
