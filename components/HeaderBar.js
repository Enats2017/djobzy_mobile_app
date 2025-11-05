import React from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View, Platform, StatusBar } from "react-native";

const HeaderBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={require("../assets/images/d_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.right}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Feather name="search" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Ionicons name="chatbubble-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Feather name="menu" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
   
    // paddingBottom: 10,
    height: 60,
    backgroundColor: "#222222",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    zIndex: 100,
    elevation: 10, // For Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  left: {
    // paddingTop:10,
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
    marginLeft: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2d2d2d",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HeaderBar;
