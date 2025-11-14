import { MaterialIcons } from "@expo/vector-icons";
import Foundation from "@expo/vector-icons/Foundation";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import GradientButton from "../../components/GradientButton";

const CompletedJobs = () => {
  const navigation = useNavigation();
  const [closeJob, setCloseJob] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/closed-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (data.status == 200) {
        setCloseJob(data.closed_jobs);
      }
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {closeJob.map((job, index) => (
        <View style={styles.outerContainer} key={index}>
          <View style={styles.cardContainer}>
            <View style={styles.profileSection}>
              <Image
                source={{
                  uri:
                    job.photo ||
                    "https://randomuser.me/api/portraits/women/44.jpg",
                }}
                style={styles.avatar}
              />

              <View style={styles.profileInfo}>
                <View style={styles.usernameRow}>
                  <Text style={styles.username}> {job.full_name}</Text>
                </View>
                <View style={styles.verificationRow}>
                  <MaterialIcons
                    name="verified"
                    size={16}
                    color="#c3c3c3"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.verification}>
                    Verification Level:{job.verification_count}/7
                  </Text>
                </View>
              </View>

              <View style={styles.incomeContainer}>
                <Text style={styles.incomeLabel}>Total Income:</Text>
                <View style={styles.cadButton}>
                  <Text style={styles.cadText}>CAD {job.bid_price}</Text>
                </View>
              </View>
            </View>

            <View style={styles.jobTitleSection}>
              <Text style={styles.jobTitle}>{job.subject}</Text>
              <Text style={styles.postedDate}> Start Date: {job.award_date} | End Date: {job.gig_end_date}</Text>
              
            </View>

            <View style={styles.jobInfoSection}>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <Text style={styles.infoText}>Total Price: </Text>
                <Text style={[styles.infoHighlight, { marginRight: 10 }]}>
                  CAD {job.bid_price}
                </Text>
                <Text style={styles.infoText}>Hourly Rate: </Text>
                <Text style={styles.infoHighlight}>
                  CAD {job.prop_hourly_rate}
                </Text>
              </View>

              <Text style={styles.infoText}>
                Expected Hours:{" "}
                <Text style={styles.infoHighlight}>{job.expected_hour}</Text>
              </Text>

              {job.preferred_location && (
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <Text style={styles.infoText}>Location: </Text>
                  <Text style={[styles.infoHighlight, { flex: 1 }]}>
                    {job.preferred_location}
                  </Text>
                </View>
              )}

              {Number(job.is_remote_job) === 1 && (
                <View style={styles.remoteBadge}>
                  <Foundation name="home" size={24} color="#000000" />
                  <Text style={styles.remoteText}>Remote</Text>
                </View>
              )}
            </View>

            <View style={styles.jobDescriptionSection}>
              <Text style={styles.descTitle}>Job Description</Text>
              <Text style={styles.descText}>{job.description}</Text>
            </View>

            <View style={styles.buttonSection}>
              <GradientButton
                title="View Job Post"
                onPress={() =>
                  navigation.navigate("ViewCompletedJobPost", {
                    gid: job.request_slug,
                  })
                }
              />
            </View>
          </View>

          {/* {index !== closeJob.length - 1 && <LineDivider />} */}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: "#444444ff",
    borderRadius: 16,
    padding: 10,
    elevation: 5,
    marginBottom: 15
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: {
    marginLeft: 8,
    flex: 1,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  username: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  starsRow: {
    flexDirection: "row",
  },
  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  verification: {
    fontSize: 12,
    color: "#c3c3c3c3",
    fontFamily: "Montserrat_400Regular",
  },
  incomeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  incomeLabel: {
    color: "#ffffff",
    fontSize: 10,
    textAlign: "center",
    justifyContent: "center",
    fontFamily: "Montserrat_500Medium",
    marginBottom: 4,
  },
  cadButton: {
    backgroundColor: "#46A282",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cadText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
  },
  jobTitleSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  jobTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  postedDate: {
    color: "#ffffff",
    fontSize: 11,
    fontFamily: "Montserrat_400Regular",
    marginTop: 4,
  },
  jobInfoSection: {
    backgroundColor: "transparent",
    borderRadius: 12,
    borderColor: "#797474ff",
    borderWidth: 1,
    padding: 10,
    marginBottom: 14,
  },
  infoText: {
    color: "#ffffff",
    fontSize: 12,
    marginBottom: 5,
    fontFamily: "Montserrat_400Regular",
  },
  infoHighlight: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    gap: 6,
  },
  remoteBadge: {
    flexDirection: "row",
    backgroundColor: "#FABB05",
    borderRadius: 22,
    paddingVertical: 2,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    width: "35%",
    gap: 7,
  },
  remoteText: {
    color: "#000000",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 14,
  },
  jobDescriptionSection: {
    backgroundColor: "transparent",
    borderRadius: 12,
    borderColor: "#797474ff",
    borderWidth: 1,
    padding: 15,
    marginBottom: 16,
  },
  descTitle: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "Montserrat_500Medium",
  },
  descText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  viewJobButton: {
    backgroundColor: "#f88371",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  viewJobButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },

});

export default CompletedJobs;
