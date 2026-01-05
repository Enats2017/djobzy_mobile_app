import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ACTIVE_COLOR = "#CB7767";
const INACTIVE_COLOR = "#000";

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isActive = (routeName) => route.name === routeName;
  return (
    <>
      <View style={styles.bottomContainer}>
        <View style={styles.BottomBar}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Ionicons
              name="briefcase"
              size={24}
              color={isActive("Dashboard") ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text style={[
              styles.label,
              isActive("Dashboard") && styles.activeText,
            ]}>
              Jobs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("PromoteService")}
          >
            <Ionicons
              name="add-circle"
              size={24}
              color={isActive("PromoteService") ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text style={[
              styles.label,
              isActive("PromoteService") && styles.activeText,
            ]}>
              Promote
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("NotificationScreen")}
          >
            <Ionicons
              name="notifications"
              size={24}
              color={isActive("NotificationScreen") ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text style={[
              styles.label,
              isActive("NotificationScreen") && styles.activeText,
            ]}>
              Notification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("ProfileMenu")}
          >
            <Ionicons
              name="person"
              size={24}
              color={isActive("ProfileMenu") ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text style={[
              styles.label,
              isActive("ProfileMenu") && styles.activeText,
            ]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </>
  )
}
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
    color: "black",
    fontFamily: "Montserrat_400Regular",
    marginTop: 2,
  },
  activeText: {
    color: "#000000ff",
    fontWeight: "bold",
  },
});
export default Footer
