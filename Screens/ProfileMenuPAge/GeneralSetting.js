import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome6,
  AntDesign,
  Octicons,
} from "@expo/vector-icons";

import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation, useStateForPath } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../../components/Footer";

const GeneralSetting = () => {
  const navigation = useNavigation();
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="General Settings" navigation={navigation} />
          <View style={styles.menuContainer}>
            <MenuItem
              type="material"
              icon="account-circle"
              title="Account"
              onPress={() => navigation.navigate("AccountSetting")}
            />
            <MenuItem
              type="AntDesign"
              icon="profile"
              title="Profile Settings"
              onPress={() => navigation.navigate("ProfileSetting")}
            />
            <MenuItem type="Font" icon="contact-book" title="Contact Info" onPress={()=>navigation.navigate("UserContactInfo")} />
            <MenuItem
              type="ion"
              icon="wallet-outline"
              title="Billing Methods"
              onPress={()=>navigation.navigate("UserPaymentPage")}
              
            />
            <MenuItem
              type="ion"
              icon="notifications-outline"
              title="Notifications"
              onPress={()=>navigation.navigate("UserNotification")}
            />
            <MenuItem type="material" icon="security" title="Security"  onPress={()=>navigation.navigate("UserSecurity")}/>
            <MenuItem
              type="ion"
              icon="finger-print"
              title="Identity Verification"
              onPress={()=>navigation.navigate("IDVerificationUploadScreen")}
            />
            <MenuItem type="Octicons" icon="verified" title="Verification" />
          </View>
          
        </View>

        <Footer />
      </SafeAreaView>
    </>
  );
};
const MenuItem = ({ type, icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.iconbox}>
      {type === "ion" && (
        <Ionicons name={icon} size={22} color="#fff" style={styles.menuIcon} />
      )}
      {type === "material" && (
        <MaterialIcons
          name={icon}
          size={22}
          color="#fff"
          style={styles.menuIcon}
        />
      )}
      {type === "AntDesign" && (
        <AntDesign name={icon} size={18} color="#fff" style={styles.menuIcon} />
      )}
      {type === "Font" && (
        <FontAwesome6
          name={icon}
          size={18}
          color="#fff"
          style={styles.menuIcon}
        />
      )}
      {type === "Octicons" && (
        <Octicons name={icon} size={18} color="#fff" style={styles.menuIcon} />
      )}
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons
      name="chevron-forward"
      size={20}
      color="#999"
      style={styles.forwardIcon}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,

    paddingHorizontal: 5,
    borderBottomColor: "#3a3a3a",
  },
  iconbox: {
    backgroundColor: "#ffffff33",
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
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginLeft: 10,
  },
  forwardIcon: {
    marginRight: 5,
  },
});

export default GeneralSetting;
