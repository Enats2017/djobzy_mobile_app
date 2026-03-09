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
  Linking
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome6,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation, useStateForPath } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import CustomSwitch from "../../components/CustomSwitch";
import EmployerFooter from "../../components/EmployerFooter";
import { useNotifications } from "../../context/MessageNotificationContext";
import { useServiceGlobalStore } from "../PromoteServicesPage/ServiceGlobalStore";
import { useCreateJobGlobalStore } from "../../components/useCreateJobGlobalStore";

const EmployeeProfileMenu = () => {
  const navigation = useNavigation();
  const [isEmployer, setIsEmployer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [accountType, setAccountType] = useState(null);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { refreshUser } = useNotifications();

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
      await AsyncStorage.removeItem("user");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await refreshUser();

      setAccountType(data?.account_type);
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
  const toggleSwitch = async (newValue, delay = false) => {
    setIsEmployer(newValue);
    if (delay) {
      setTimeout(async () => {
        await handleSwitchAccount();
      }, 500);
    } else {
      await handleSwitchAccount();
    }
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

  const handlePromotebNavigation = () => {
    const store = useServiceGlobalStore.getState();
    store.reset();
    store.resetUniqueId();
    navigation.navigate("PromoteService");
  };

  const handleCreateJobNavigation = () => {
      const store = useCreateJobGlobalStore.getState();
      store.reset();
      store.resetEditMode();
      store.clearEditingFromReview();
      store.setActiveTab(0);
      navigation.navigate("CreateJob");
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <PageNameHeaderBar
              title={user?.admin == 2 ? "Employer Profile" : "Employee Profile"}
              navigation={navigation}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              <View style={styles.profileContainer}>
                <Image
                  source={{
                    uri: user?.photo,
                  }}
                  style={[
                    styles.profileImage,
                    {
                      borderColor: user?.admin === 0 ? "#46a282" : "#ebbe56",
                      borderWidth: 2,
                    },
                  ]}
                />
                <Text style={styles.profileName}>{user?.full_name}</Text>
                <Text style={styles.profileRole}>
                  {" "}
                  {user?.admin == 0 ? "Employee" : "Employer"}{" "}
                </Text>
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  {user?.admin == 0
                    ? "Switch to Employer"
                    : "Switch to Employee"}
                </Text>

                {!switchLoading && (
                  <CustomSwitch value={isEmployer} onChange={toggleSwitch} />
                )}

                {switchLoading && (
                  <ActivityIndicator
                    size={30}
                    color="#D17B68"
                    style={{ marginLeft: 10 }}
                  />
                )}
              </View>
              <View style={styles.menuContainer}>
                {user?.admin == 0 ? (
                  <MenuItem
                   type="Entypo"
                    icon="circle-with-plus"
                    title="Promote Services"
                    onPress={handlePromotebNavigation}
                  />
                ) : (
                  <MenuItem
                    type="Entypo"
                    icon="circle-with-plus"
                    title="Post a Job"
                    onPress={handleCreateJobNavigation}
                  />
                )}
                {user?.admin == 0 ? (
                  <MenuItem
                    type="ion"
                    icon="grid"
                    title="Dashboard"
                    onPress={() => navigation.navigate("Dashboard")}
                  />
                ) : (
                  <MenuItem
                    type="ion"
                    icon="grid"
                    title="Dashboard"
                    onPress={() => navigation.navigate("EmployerDashboard")}
                  />
                )}

                {user?.admin == 0 ? (
                  <MenuItem
                    type="ion"
                    icon="person"
                    title="My account"
                    onPress={() =>
                      navigation.navigate("EmployeeAccount", {
                        name: user?.name,
                      })
                    }
                  />
                ) : (
                  <MenuItem
                    type="ion"
                    icon="person"
                    title="My account"
                    onPress={() =>
                      navigation.navigate("EmployerAccount", {
                        name: user?.name,
                      })
                    }
                  />
                )}
                <MenuItem
                  type="material"
                  icon="reviews"
                  title="Reviews"
                  onPress={() => navigation.navigate("ProfileReviewPage")}
                />
                <MenuItem
                  type="material"
                  icon="verified"
                  title="Verification"
                  onPress={() => navigation.navigate("EmployeeVerification")}
                />
                <MenuItem
                  type="Entypo"
                  icon="wallet"
                  title="Wallet"
                  onPress={() => navigation.navigate("Wallet")}
                />
                <MenuItem
                  type="Entypo"
                  icon="share"
                  title="Referral wallet"
                  onPress={() => navigation.navigate("ReferralWallet")}
                />
                {/* <MenuItem
                  type="Fontisto"
                  icon="hipchat"
                  title="Chat"
                  onPress={() => navigation.navigate("ChatList")}
                /> */}
                <MenuItem
                  type="ion"
                  icon="settings"
                  title="Settings"
                  onPress={() => navigation.navigate("GeneralSetting")}
                />
                <MenuItem
                  type="Font"
                  icon="dollar-sign"
                  title="Djobzy Coin | Invest with Us"
                  onPress={() => Linking.openURL("https://www.djobzy.com/invest")}
                />
              </View>
              <TouchableOpacity
                style={styles.logoutContainer}
                onPress={handleLogout}
              >
                <Text style={styles.logoutLabel}>Log Out</Text>
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <MaterialIcons name="logout" size={24} color="#ffffff" />
                )}
              </TouchableOpacity>
            </ScrollView>
          </>
        )}
      </View>
      {user?.admin == 2 ? <EmployerFooter /> : <Footer />}
    </SafeAreaView>
  );
};

const MenuItem = ({ type, icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.iconbox}>
      {type === "ion" && (
        <Ionicons name={icon} size={20} color="#fff" style={styles.menuIcon} />
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
        <AntDesign name={icon} size={22} color="#fff" style={styles.menuIcon} />
      )}
      {type === "Font" && (
        <FontAwesome6
          name={icon}
          size={22}
          color="#fff"
          style={styles.menuIcon}
        />
      )}
      {type === "Octicons" && (
        <Octicons name={icon} size={22} color="#fff" style={styles.menuIcon} />
      )}
      {type === "Entypo" && (
        <Entypo name={icon} size={22} color="#fff" style={styles.menuIcon} />
      )}
      {type === "Fontisto" && (
        <Fontisto name={icon} size={19} color="#fff" style={styles.menuIcon} />
      )}
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons
      name="chevron-forward"
      size={22}
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

export default EmployeeProfileMenu;
