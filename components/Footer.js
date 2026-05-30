import {
  Ionicons,
  MaterialCommunityIcons,
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

import { API_URL } from "../api/ApiUrl";
import { useNotifications } from "../context/MessageNotificationContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useServiceGlobalStore } from "../Screens/PromoteServicesPage/ServiceGlobalStore";
import { useState } from "react";

const ACTIVE_COLOR = "#CB7767";
const INACTIVE_COLOR = "#000";

const Footer = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { refreshUser } = useNotifications();
  const [switchLoading, setSwitchLoading] = useState(false);

  const isActive = (routeName) => route.name === routeName;

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
    } finally {
      setSwitchLoading(false);
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
    ]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.BottomBar}
      >
        <TouchableOpacity style={styles.tab} onPress={handleSwitchAccount}>
          {
            switchLoading ? (
              <ActivityIndicator size={24} color="#CB7767" />
            ) : (
              <Octicons name="arrow-switch" size={24} color={INACTIVE_COLOR} />
            )
          }
          <Text style={styles.label}>Switch Role</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Image
            source={ require("../assets/images/logo-landing-bk.png")}
            style={{ width: 25, height: 24, resizeMode: "contain" }}
          />
          <Text
            style={[
              styles.label,
              isActive("Dashboard") && styles.activeText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={goToSearch}
        >
          <Ionicons
            name="search-outline"
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
          onPress={() => navigation.navigate("ProfileMenu")}
        >
          <Ionicons
            name="menu"
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
          onPress={() => {
            const store = useServiceGlobalStore.getState();
            store.reset();
            store.resetUniqueId();
            navigation.navigate("PromoteService")
          }}
        >
          <MaterialCommunityIcons
            name="plus-circle"
            size={24}
            color={isActive("PromoteService") ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
          <Text
            style={[styles.label, isActive("PromoteService") && styles.activeText]}
          >
            Create Service
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
            Notification
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
});

export default Footer;