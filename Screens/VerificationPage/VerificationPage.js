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
  TouchableOpacity,
  View,
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
  const [emailVerified, setEmailVerified] = useState([]);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [admin, setAdmin] = useState(null);
  const lineProgress = useState(new Animated.Value(0))[0];
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);

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
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const res = await axios.get(`${API_URL}/user-verification-step`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.userDetails || {};
      console.log(user);

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
    }
  };
  useEffect(() => {
    fetchVerificationData();
  }, []);

  return (
    <>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <HeaderBar />
          <ScrollView>
            <View style={styles.StepContainer}>
              {["Account Setup", "Default Profile", "Profile Setup"].map(
                (label, index, array) => {
                  const isActive = index === activeTab;
                  const isCompleted = index < activeTab;

                  return (
                    <View
                      key={index}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View style={styles.step}>
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
                              size={15}
                              color="black"
                            />
                          )}
                        </View>
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
                      </View>

                      {/* Line Between Steps */}
                      {index < array.length - 1 && (
                        <Animated.View
                          style={[
                            styles.line,
                            isCompleted
                              ? styles.completedLine
                              : styles.inactiveLine,
                          ]}
                        />
                      )}
                    </View>
                  );
                }
              )}
            </View>
            <View style={{ display: activeTab === 0 ? "flex" : "none" }}>
              <AccountSetup
                countries={countries}
                fullName={fullName}
                username={username}
                setUsername={setUsername}
                email={email}
                emailVerified={emailVerified}
                onNext={() => setActiveTab(1)}
              />
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
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#222222",
  },
  container: {
    flex: 1,
    padding: 18,
  },
  StepContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    marginBottom: 15,
  },
  step: {
    alignItems: "center",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  completedCircle: {
    backgroundColor: "#CB7767",
    borderWidth: 1,
    borderColor: "#1b1a1aff",
  },
  activeCircle: {
    backgroundColor: "#CB7767",
    borderWidth: 1,
    borderColor: "#1b1a1aff",
  },
  inactiveCircle: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
  },
  stepText: {
    fontSize: 12,
    width: 80,
    textAlign: "center",
  },
  completedText: {
    color: "#fff",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inactiveText: {
    color: "#aaa",
  },
  line: {
    height: 1.5,
    width: 60,
  },
  completedLine: {
    backgroundColor: "#ff6666",
    
  },
  inactiveLine: {
    borderWidth: 1,
    marginBottom: 15,
    borderColor: "#aaa",
    borderStyle:"dashed",
    backgroundColor: "transparent",
  },

  backBtn: {
    backgroundColor: "#eee8e8ff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 15,
    marginBottom: 10,
  },
  backBtnText: {
    color: "#303030",
    fontFamily:"Montserrat_700Bold",
    fontSize:20
  },
});

export default VerificationPage;
