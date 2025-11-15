import React, { useEffect, useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome } from "@expo/vector-icons";
import Foundation from "@expo/vector-icons/Foundation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import { truncateWords } from "../../api/TruncateWords";
import GradientButton from "../../components/GradientButton";
import { useNavigation } from "@react-navigation/native";
import NoJobs from "./NoJobs";

const CurrentJobs = () => {
  const [currentJobs, setCurrnetJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}/user-current-jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        setCurrnetJobs(data.current_jobs || []);
      } catch (error) {
        console.log("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  if (currentJobs.length === 0) return <NoJobs />

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {currentJobs.map((currentJob, index) => (
        <View style={styles.outerContainer} key={index}>
          <View style={styles.cardContainer}>
            <View style={styles.userRow}>
              <Image
                source={{
                  uri: currentJob.photo || "https://randomuser.me/api/portraits/women/8.jpg",
                }}
                style={styles.avatar}
              />

              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <View style={styles.userNameSection}>
                    <Text style={styles.userName}>{currentJob.full_name}</Text>

                    <View style={styles.starRow}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          style={styles.starIcon}
                        />
                      ))}
                    </View>
                  </View>
                  <View style={styles.paymentRow}>
                    <MaterialIcons
                      name="verified"
                      size={16}
                      color="#c3c3c3"
                    />
                    <Text style={styles.paymentVerified}>
                      Verification Level: {currentJob.verification_count}/7
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.jobTitleSection}>
              <Text style={styles.jobTitle}>{currentJob.subject}</Text>
              <Text style={styles.postedDate}>Start Date : {currentJob.payment_date}</Text>
            </View>

            <View style={styles.jobInfoSection}>
              <Text style={styles.infoText}>
                Total Price:{" "}
                <Text style={styles.infoHighlight}>CAD {currentJob.bid_price}</Text>    Hourly Rate: <Text style={styles.infoHighlight}>CAD {currentJob.prop_hourly_rate}</Text>
              </Text>
              <Text style={styles.infoText}>
                Expected Hours: <Text style={styles.infoHighlight}>{currentJob.prop_total_hour}</Text>
              </Text>

              {currentJob.preferred_location && (
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <Text style={styles.infoText}>Location: </Text>
                  <Text style={[styles.infoHighlight, { flex: 1 }]}>
                    {currentJob.preferred_location}
                  </Text>
                </View>
              )}

              {Number(currentJob.is_remote_job) === 1 && (
                <View style={styles.remoteBadge}>
                  <Foundation name="home" size={24} color="#000000" />
                  <Text style={styles.remoteText}>Remote</Text>
                </View>
              )}
            </View>

            <View style={styles.jobDescriptionSection}>
              <Text style={styles.descTitle}>Job Description</Text>
              <Text style={styles.descText}>
                {truncateWords(currentJob.description, 20)}
              </Text>
            </View>

            <View style={styles.buttonSection}>
              <GradientButton
                title="View Job Post"
                onPress={() =>
                  navigation.navigate("ViewCurrentJobPost", {
                    gid: currentJob.request_slug,
                  })
                }
              />
            </View>
          </View>

          {/* {index !== currentJobs.length - 1 && <LineDivider />} */}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  },
  cardContainer: {
    backgroundColor: "#444444ff",
    borderRadius: 16,
    padding: 10,
    flex: 1,
    marginBottom: 15
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    // flex: 1,
  },
  nameRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5,
  },
  userNameSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  starRow: {
    flexDirection: "row",
    gap: 3,
  },
  starIcon: {
    fontSize: 13,
    color: "#EBBE56",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIcon: {
    fontSize: 16,
    color: "#39A881",
  },
  paymentVerified: {
    color: "#ffffff",
    fontSize: 13,
    marginLeft: 4,
    fontFamily: "Montserrat_400Regular",
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
    fontSize: 10,
    fontFamily: "Montserrat_400Regular",
    marginTop: 6,
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
    color: "#181a20",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    lineHeight: 19
  },
  jobDescriptionSection: {
    backgroundColor: "transparent",
    borderRadius: 12,
    borderColor: "#797474ff",
    borderWidth: 1,
    padding: 15,
    marginBottom: 12,
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
  divider: {
    height: 1,
    backgroundColor: "rgba(200,200,200,0.4)",
    marginHorizontal: 1,
    marginVertical: 15,
  },
});

export default CurrentJobs;
