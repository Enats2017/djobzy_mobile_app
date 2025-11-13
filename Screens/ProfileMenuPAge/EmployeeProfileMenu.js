import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";

const EmployeeProfileMenu = () => {
  const [isEmployer, setIsEmployer] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [accountType, setAccountType] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const navigation = useNavigation();
  const handleSwitchAccount = async () => {
    setSwitchLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/user-switch-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
           Purpose: "fetch",
        },
      });
      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setAccountType(data.account_type);
         setUserInfo(data.name)
         
         

        if (data.account_type === 0) {
          navigation.replace("Dashboard");
        } else if (data.account_type === 2) {
          navigation.replace("JobProfile");
        }
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to switch account");
    } finally {
      setSwitchLoading(false);
    }
  };
  
  const toggleSwitch = async () => {
    setIsEmployer((prev) => !prev);
    await handleSwitchAccount();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.pageHeader}>
        <PageNameHeaderBar title="Employee Profile" navigation={navigation} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/women/44.jpg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            Aman
          </Text>
          <Text style={styles.profileRole}>Employee</Text>
        </View>

        {/* Switch Section */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Switch to Employer</Text>
          <Switch
            trackColor={{ false: "#c3c3c3c3", true: "#5cb85c" }}
            thumbColor={isEmployer ? "#666666" : "#666666"}
            onValueChange={toggleSwitch}
            value={isEmployer}
            disabled={switchLoading}
            style={styles.switch}
          />
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          <MenuItem icon="add-circle-outline" title="Promote Services" onPress={() => navigation.navigate("PromoteService")} />
          <MenuItem icon="grid-outline" title="Dashboard" />
          <MenuItem icon="person-outline" title="My account" />
          <MenuItem icon="star-outline" title="Reviews" />
          <MenuItem icon="checkmark-done-outline" title="Verification" onPress={()=> navigation.navigate("EmployeeVerification")} />
          <MenuItem icon="wallet-outline" title="Wallet" />
          <MenuItem icon="gift-outline" title="Referral wallet" />
          <MenuItem icon="chatbubble-ellipses-outline" title="Chat" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, title,onPress }) => (
  <TouchableOpacity style={styles.menuItem}  onPress={onPress}>
    <View style={styles.iconbox}>
      <Ionicons name={icon} size={22} color="#fff" style={styles.menuIcon} />
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons
      name="chevron-forward"
      size={18}
      color="#999"
      style={styles.forwardIcon}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#555",
  },
  profileName: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    marginTop: 10,
  },
  profileRole: {
    color: "#c3c3c3c3",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff1a",
    borderRadius: 12,
     paddingHorizontal:10,
    marginBottom: 18,
  },
  switch:{
      transform: [{ scaleX: 1.3 }, { scaleY: 1.3}],
  },
  switchLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  menuContainer: {
    backgroundColor: "#ffffff1a",
    borderRadius: 12,
    paddingVertical: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
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

export default EmployeeProfileMenu;
