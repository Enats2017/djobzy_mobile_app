import React, { useEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useNotifications } from "../context/MessageNotificationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderMenuModal from "./HeaderMenuModal";

const HeaderBar = ({  showMenu = true, showSearch = true }) => {
  const navigation = useNavigation();
  const { messageCount } = useNotifications();
  const [menuVisible, setMenuVisible] = useState(false);

  const goToSearch = async () => {
    const userStr = await AsyncStorage.getItem("user");
    const user = JSON.parse(userStr);
    const { admin } = user;
    const search_type = admin == 2 ? 2 : 0;
    navigation.navigate("SearchScreen", { search_type });
  };
  return (
    <>
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={require("../assets/images/d_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.right}>
        {showSearch && (
          <TouchableOpacity style={styles.iconWrapper} onPress={goToSearch}>
            <Feather name="search" size={18} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => navigation.navigate("ChatList")}
        >
          <Ionicons name="chatbubble-outline" size={22} color="#fff" />
          {messageCount > 0 && (
            <View style={styles.messageBadge}>
              <Text style={styles.messageBadgeText}>
                {messageCount > 99 ? "99+" : messageCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconWrapper} onPress={() => setMenuVisible(true)}>
          <Feather name="menu" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
    {showMenu && (
        <HeaderMenuModal
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      )}
    </>
  );
};

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#222222",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    zIndex: 100,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 55,
    height: 55,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    position: "relative",
    marginLeft: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2d2d2d",
    alignItems: "center",
    justifyContent: "center",
  },
  messageBadge: {
    position: "absolute",
    top: -5,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 9,
    backgroundColor: "#d51b1b",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 10,
  },
  messageBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
  },
});

export default HeaderBar;
