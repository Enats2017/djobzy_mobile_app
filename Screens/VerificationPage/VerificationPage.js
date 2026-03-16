import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../../api/ApiUrl";
import AccountSetup from "./AccountSetup";
import DefaultProfile from "./DefaultProfile";
import JobCreate from "./JobCreate";
import ProfileSetup from "./ProfileSetup";
import HeaderBar from "../../components/HeaderBar";

const VerificationPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [countries, setCountries] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [emailVerified, setEmailVerified] = useState(0);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [admin, setAdmin] = useState(null);
  const lineProgress = useState(new Animated.Value(0))[0];
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Animated.timing(lineProgress, {
      toValue: activeTab, // 0, 1, 2
      duration: 600,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const fetchVerificationData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const res = await axios.get(`${API_URL}/user-verification-step`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.userDetails || {};
      await AsyncStorage.removeItem("user");
      await AsyncStorage.setItem("user", JSON.stringify(res.data.userDetails));
      console.log("user:", user);
      setUserDetails(user);

      const verificationStep = user.verification_step;
      if (verificationStep == "step2") {
        setActiveTab(1);
      } else if (verificationStep == "step3") {
        setActiveTab(2);
      } else {
        setActiveTab(0);
      }

      const fetchedServices = res.data.services || [];
      setServices(fetchedServices);
      setFiltered(fetchedServices);
      setFullName(user.full_name || "");
      setUsername(user.name || "");
      setEmail(user.email || "");
      setUserId(user.id || " ");
      setCountries(res.data.countries || []);
      setEmailVerified(user.confirmation || 0);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to load verification data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVerificationData();
  }, []);

  return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <HeaderBar showSearch={false} showMenu={false} />
          <ScrollView
            contentContainerStyle={{ paddingBottom: 5 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.StepContainer}>
              {["Account Setup", "Default Profile", "Profile Setup"].map(
                (label, index, array) => {
                  const isActive = index === activeTab;
                  const isCompleted = index < activeTab;
                  return (
                    <View key={index} style={styles.stepItem}>
                      <View style={styles.topRow}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={styles.circleTouch}
                          onPress={() => setActiveTab(index)}
                        >
                          <View
                            style={[
                              styles.circle,
                              isCompleted
                                ? styles.completedCircle
                                : isActive
                                  ? styles.activeCircle
                                  : styles.inactiveCircle,
                            ]}
                          >
                            {isCompleted && (
                              <MaterialIcons
                                name="done"
                                size={14}
                                color="#fff"
                              />
                            )}
                          </View>
                        </TouchableOpacity>

                        {/* LABEL */}
                        <Text
                          style={[
                            styles.stepText,
                            isActive
                              ? styles.activeText
                              : isCompleted
                                ? styles.completedText
                                : styles.inactiveText,
                          ]}
                        >
                          {label}
                        </Text>

                        {/* LINE */}
                        {index < array.length - 1 && (
                          <View
                            style={[
                              styles.line,
                              isCompleted
                                ? styles.completedLine
                                : styles.inactiveLine,
                            ]}
                          />
                        )}
                      </View>
                    </View>
                  );
                },
              )}
            </View>
            <View style={{ display: activeTab === 0 ? "flex" : "none" }}>
              {loading ? (
                <View style={styles.loaderWrap}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.loadingText}>
                    Loading account details...
                  </Text>
                </View>
              ) : (
                <AccountSetup
                  countries={countries}
                  fullName={fullName}
                  setFullName={setFullName}
                  username={username}
                  setUsername={setUsername}
                  email={email}
                  emailVerified={emailVerified}
                  userDetails={userDetails}
                  onNext={() => setActiveTab(1)}
                />
              )}
            </View>

            <View style={{ display: activeTab === 1 ? "flex" : "none" }}>
              <DefaultProfile
                services={services}
                filtered={filtered}
                onNext={() => setActiveTab(2)}
              />
            </View>
            <View style={{ display: activeTab === 2 ? "flex" : "none" }}>
              <ProfileSetup
                userId={userId}
                onNext={(adminValue) => {
                  setAdmin(adminValue);
                  setActiveTab(3);
                }}
              />
            </View>
            <View style={{ display: activeTab === 3 ? "flex" : "none" }}>
              <JobCreate admin={admin} userId={userId} />
            </View>
            {activeTab > 0 && activeTab < 3 && (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setActiveTab(activeTab - 1)}
              >
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 70,
    backgroundColor: "#222222",
  },
 StepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
     marginBottom:20,
    width: "100%",
  },

  stepItem: {
    flex: 1,
    alignItems: "center",
  },

  topRow: {
    alignItems: "center",
    width: "100%",
    position: "relative",
  },

  /* 👆 BIG TOUCH AREA */
  circleTouch: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },

  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  completedCircle: {
    backgroundColor: "#CB7767",
    borderColor: "#CB7767",
  },

  activeCircle: {
    backgroundColor: "#CB7767",
    borderColor: "#CB7767",
  },

  inactiveCircle: {
    backgroundColor: "transparent",
    borderColor: "#fff",
  },

  stepText: {
    marginTop: 8,
    fontSize: 12,
    width: 100,
    textAlign: "center",
    color: "#fff",
  },

  completedText: {
    color: "#fff",
    fontFamily:"Montserrat_400Regular",
    fontSize:14,
  },

  activeText: {
    color: "#fff",
    fontFamily:"Montserrat_400Regular",
    fontSize:14,
  },

  inactiveText: {
    color: "#aaa",
    fontFamily:"Montserrat_400Regular",
    fontSize:14,
  },

  line: {
    position: "absolute",
    top: 20, // center of 40px touch area
    left: "55%",
    right: "-45%",
    height: 1,
    borderWidth: 1,
    zIndex: 1,
  },

  completedLine: {
    borderStyle: "solid",
    borderColor: "#CB7767",
  },

  inactiveLine: {
    borderStyle: "dashed",
    borderColor: "#aaa",
  },

  backBtn: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 12,
    marginBottom: 10,
  },
  backBtnText: {
    color: "#303030",
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
});

export default VerificationPage;
