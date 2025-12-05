import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { FontAwesome } from "@expo/vector-icons";
import Footer from "../../components/Footer";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmployerFooter from "../../components/EmployerFooter";

export default function ViewHirePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [profile, setProfile] = useState({});
  const [gigs, setGigs] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = route.params || [];

  const fetchEmployerJob = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/employer_hire/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch job");
      const data = await response.json();
      setProfile(data.profile);
      setGigs(data.gigs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployerJob();
  }, []);

  const handleSelectJob = async (item) => {
  setDropdownOpen(false);
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${API_URL}/onchange-job-details`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.gid,
        emp_id: profile?.id, 
      }),
    });
    const data = await res.json();
    navigation.navigate("SendJobOffer", { jobDetails: data});
  } catch (err) {
    console.log("Job details fetch error", err);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.hireContainer}>
        <PageNameHeaderBar navigation={navigation} title="John Deo" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.cardBox}>
            <View style={styles.profileRow}>
              <Image
                style={styles.avatar}
                source={{
                  uri: "https://randomuser.me/api/portraits/men/47.jpg",
                }}
              />
              <View style={styles.profileTextContent}>
                <Text style={styles.profileName}>{profile?.full_name}</Text>
                <View style={styles.verificationRow}>
                  <View style={styles.iconTextRow}>
                    <MaterialIcons name="verified" size={18} color="#c3c3c3" />
                    <Text style={styles.verificationText}>
                      Verification Level: {profile?.verification_count}/7
                    </Text>
                  </View>
                  <View style={styles.iconTextRow}>
                    <FontAwesome6
                      name="location-dot"
                      size={18}
                      color="#c3c3c3"
                    />
                    <Text style={styles.locationText}>USA</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.hireStatsContainer}>
            <View style={styles.hireStatsBox}>
              <Text style={styles.hireStatsLabel}>Total Contracts</Text>
              <Text style={styles.hireStatsNumber}>9</Text>
            </View>
            <View style={styles.hireVerticalDivider} />
            <View style={styles.hireStatsBox}>
              <Text style={styles.hireStatsLabel}>Money Earn</Text>
              <Text style={styles.hireStatsNumber}>189 CAD</Text>
            </View>
          </View>
          <View style={styles.offerSection}>
            <Text style={styles.offerTitle}>Send a job offer</Text>
            <Text style={styles.dropdownLabel}>Choose A Job</Text>
            <View
              style={[
                styles.dropdownFullBox,
                dropdownOpen && styles.dropdownFullBoxActive,
              ]}
            >
              <TouchableOpacity
                style={styles.dropdownField}
                onPress={() => setDropdownOpen(!dropdownOpen)}
                activeOpacity={0.8}
              >
                <Text
                  style={
                    selectedJob
                      ? styles.dropdownTextSelected
                      : styles.dropdownTextPlaceholder
                  }
                >
                  {selectedJob ? selectedJob : "Choose A Job"}
                </Text>
                <FontAwesome
                  name={dropdownOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#666666"
                />
              </TouchableOpacity>
              <View style={styles.dropdownDivider} />
              {dropdownOpen && (
                <ScrollView style={styles.dropdownScrollArea}>
                  {gigs?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSelectJob(item)}
                      style={[
                        styles.dropdownOption,
                        index === gigs.length - 1 && styles.dropdownOptionLast,
                      ]}
                    >
                      <Text style={styles.dropdownOptionText}>
                        {item.subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </ScrollView>
        {/* {selectedJob !== "" && (
          <View style={styles.fixedContinueContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.navigate("SendJobOffer")}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )} */}
      </View>
      <EmployerFooter/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#222222",
  },
  hireContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardBox: {
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 18,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#c3c3c3",
  },
  profileTextContent: {
    marginLeft: 13,
    flex: 1,
  },
  profileName: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
    paddingBottom: 6,
  },
  verificationRow: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  verificationText: {
    color: "#c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    marginLeft: 6,
  },
  locationText: {
    color: "#c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    marginLeft: 6,
  },
  hireStatsContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ffffff33",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 18,
    alignItems: "center",
  },
  hireStatsBox: {
    flex: 1,
    alignItems: "center",
  },
  hireStatsNumber: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  hireStatsLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  hireVerticalDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ffffff33",
    marginHorizontal: 4,
  },
  offerSection: {
    // marginBottom: 24,
  },
  offerTitle: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 18,
    marginBottom: 8,
  },
  dropdownLabel: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    marginBottom: 6,
  },
  dropdownFullBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1.5,
    marginBottom: 1,
    overflow: "hidden",
  },
  dropdownField: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#00000033",
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#ffffff",
  },
  dropdownOptionLast: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  fixedContinueContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
  },
  continueButton: {
    backgroundColor: "#d17b68",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.7,
  },
  dropdownOptionText: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#666666",
  },
  dropdownTextPlaceholder: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#666666",
  },
  dropdownTextSelected: {
    color: "#666666",
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
  },
  dropdownScrollArea: {
    maxHeight: 200,
    backgroundColor: "#ffffff",
  },
});
