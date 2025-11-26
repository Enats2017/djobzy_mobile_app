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
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation, useStateForPath } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import CustomSwitch from "../../components/CustomSwitch";

const EmployeeProfileMenu = () => {
  const navigation = useNavigation();
  const [isEmployer, setIsEmployer] = useState(false);
  const [loading, setLoading] = useState(false)
  const [switchLoading, setSwitchLoading] = useState(false);
  const [accountType, setAccountType] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/profile-menu-list`, {
        method: "GET",
        headers: {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAccountType(data?.account_type);
      if (data?.account_type === 0) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else if (data?.account_type === 2) {
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

  const toggleSwitch = async (newValue, delay = false) => {
    setIsEmployer(newValue);
    // if (delay) {
    //   setTimeout(async () => {
    //     await handleSwitchAccount();
    //   }, 5000000);
    // } else {
    //   await handleSwitchAccount();
    // }
  };


  // if (loading) return <Loading />
  // if (switchLoading) return <Loading />
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {
          loading ? (<Loading />) : (
            <>
              <PageNameHeaderBar title={user?.admin == 2 ? "Employer Profile" : "Employee Profile"} navigation={navigation} />
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                {/* Profile Section */}
                <View style={styles.profileContainer}>
                  <Image
                    source={{
                      uri: user?.photo,
                    }}
                    style={[styles.profileImage, { borderColor: user?.admin === 0 ? '#46a282' : '#ebbe56', borderWidth: 2 }]}
                  />
                  <Text style={styles.profileName}>{user?.full_name}</Text>
                  <Text style={styles.profileRole}> {user?.admin == 0 ? "Employee" : "Employer"} </Text>
                </View>

                {/* Switch Section */}
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>
                    {user?.admin == 0 ? "Switch to Employer" : "Switch to Employee"}
                  </Text>

                  {!switchLoading && (
                    <CustomSwitch
                      value={isEmployer}
                      onChange={toggleSwitch}
                    />
                  )}

                  {switchLoading && (
                    <ActivityIndicator size={30} color="#D17B68" style={{ marginLeft: 10 }} />
                  )}
                </View>


                {/* Menu Section */}
                <View style={styles.menuContainer}>
                  {user?.admin == 0 ? (
                    <MenuItem icon="add-circle-outline" title="Promote Services" onPress={() => navigation.navigate("PromoteService")} />
                  ) : (
                    <MenuItem icon="add-circle-outline" title="Create a Job" onPress={() => navigation.navigate("CreateJob")}/>
                  )}
                  <MenuItem icon="grid-outline" title="Dashboard" onPress={() => navigation.navigate("Dashboard")}/>
                  <MenuItem icon="person-outline" title="My account" />
                  <MenuItem icon="star-outline" title="Reviews" />
                  <MenuItem icon="checkmark-done-outline" title="Verification" />
                  <MenuItem icon="wallet-outline" title="Wallet" />
                  <MenuItem icon="gift-outline" title="Referral wallet" />
                  <MenuItem icon="chatbubble-ellipses-outline" title="Chat" />
                </View>

                <TouchableOpacity style={styles.logoutContainer}>
                  <Text style={styles.logoutLabel}>Logout</Text>
                  <MaterialIcons name="logout" size={24} color="#ffffff" />
                </TouchableOpacity>
              </ScrollView>
            </>
          )
        }
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
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
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#222222",
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
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
    marginBottom: 18,
    padding: 15,
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
    paddingHorizontal: 15,
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
  logoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff1a",
    borderRadius: 12,
    padding: 15,
    marginTop: 18,
  },
  logoutLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  }
});

export default EmployeeProfileMenu;
