import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";

export default function MyJobPost() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [postJob, setPostJob] = useState([]);

  const fetchReviews = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/my-post-job`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setPostJob(data.myJobPosts);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);
  if (loading) return <Loading />;
  return (
    <SafeAreaView style={styles.jobpostcontainer}>
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <PageNameHeaderBar navigation={navigation} title="My Job Posts" />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.viewBoostedJobsBtn} onPress={()=>navigation.navigate("Details")}>
            <Text style={styles.viewBoostedJobsText}>View Boosted Jobs</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {postJob.length > 0 ? (
          postJob.map((item, index) => (
            <View key={index} style={styles.jobCard}>
              <View style={styles.topInfoContainer}>
                <View style={styles.leftInfo}>
                  <Text style={styles.jobTitle}>{item.subject}</Text>
                  <Text style={styles.jobId}>Posted {item.created_at}</Text>
                </View>
                <View style={styles.rightInfo}>
                  <View style={styles.proposalsRow}>
                    <Text style={styles.proposalsLabel}>Proposals</Text>
                    <Text style={styles.proposalsCount}>{item.proposal}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.detailsCard}>
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Total Price :</Text>
                    <Text style={styles.detailValue}>
                      {item.fixed_price ? item.fixed_minimum : "N/A"}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Hourly Rate :</Text>
                    <Text style={styles.detailValue}> {item.hour_price ? item.hour_minimum : "N/A"}</Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Expected Hours :</Text>
                  <Text style={styles.detailValue}>
                    {item.expected_hour ? item.expected_hour : 0}
                  </Text>
                </View>
              </View>             
              <View style={styles.jobDescriptionCard}>
                <Text style={styles.jobDescriptionLabel}>Job Description</Text>
                <Text style={styles.jobDescriptionText}>
                  {item.description}
                </Text>
              </View>              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() =>
                    navigation.navigate("PostJobDetails", {
                      jobId: item.request_slug,
                    })
                  }
                >
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.boostBtn}>
                  <Text style={styles.boostBtnText}>Boost</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 50, color: "#fff" }}>
            No Jobs Posted Yet
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  jobpostcontainer: {
    flex: 1,
    backgroundColor: "#222222",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 10,
  },
  viewBoostedJobsBtn: {
    backgroundColor: "#FDBF2D",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  viewBoostedJobsText: {
    color: "#000000",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  jobCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  topInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  leftInfo: {
    flex: 1,
  },
  jobTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  jobId: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Montserrat_400Regular",
    marginTop: 4,
  },
  rightInfo: {
    alignItems: "flex-end",
    justifyContent: "center",
    // marginLeft: 10,
  },
  proposalsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },

  proposalsLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  proposalsCount: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  detailsCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF33",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
    flexWrap: "wrap",
  },

  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  detailLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  detailValue: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  jobDescriptionCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 8,
    borderColor: "#FFFFFF33",
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
  },
  jobDescriptionLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 5,
  },
  jobDescriptionText: {
    color: "#ffffff",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Montserrat_400Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  viewBtn: {
    flex: 1,
    backgroundColor: "#D17B68",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  viewBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
  boostBtn: {
    flex: 1,
    backgroundColor: "#46A282",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  boostBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
});
