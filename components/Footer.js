import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Footer = () => {
  const [active, setActive] = useState(0);
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.bottomContainer}>
        <View style={styles.BottomBar}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Ionicons
              name="briefcase-outline"
              size={24}
              color={active === "Jobs" ? "#007bff" : "#000000"}
            />
            <Text style={[styles.label, active === "Jobs" && styles.activeText]}>
              Jobs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate("CreateJob")}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}

              color={active === "Post" ? "#f49676" : "#000000"}
            />
            <Text style={[styles.label, active === "Post" && styles.activeText]}>
              Post
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={active === "Alerts" ? "#007bff" : "#000000ff"}
            />
            <Text style={[styles.label, active === "Alerts" && styles.activeText]}>
              Alerts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}

          >
            <Ionicons
              name="person-outline"
              size={24}
              color={active === "Profile" ? "#007bff" : "#000000ff"}
            />
            <Text style={[styles.label, active === "Profile" && styles.activeText]}>
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
