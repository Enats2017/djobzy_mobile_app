import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../../components/Footer";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";

const ViewCompletedJobPost = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const { gid } = route.params || [];
  const [job, setJob] = useState([]);
  const [category, setCategory] = useState([]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);

      const response = await fetch(`${API_URL}/closed-job-details/${gid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setJob(data.gigs);
      console.log(job);
      
      setCategory(data.category);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(job.gid);
  
    if (loading) return <Loading />;
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#222222" }}>
        <View style={styles.container}>
          <PageNameHeaderBar
            navigation={navigation}
            title="My Completed Jobs"
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingBottom: 100 }}
          >
            <View style={styles.statsRow}>
              <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>Hourly Rate</Text>
                <Text style={styles.statsValue}>20.00 CAD</Text>
              </View>
              <View style={styles.vertDivider} />
              <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>Total Hour</Text>
                <Text style={styles.statsValue}>1</Text>
              </View>
              <View style={styles.vertDivider} />
              <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>Total Earn</Text>
                <Text style={styles.statsValue}>20.00 CAD</Text>
              </View>
            </View>
            <View style={styles.userInfoRow}>
              <Image source={{ uri: job?.photo }} style={styles.avatar} />
              <View style={styles.userDetails}>
                <View style={styles.headerRow}>
                  <Text style={styles.userName}>{job.full_name}</Text>
                  <TouchableOpacity style={styles.menuButton}>
                    <Entypo name="dots-three-vertical" size={20} color="#bbb" />
                  </TouchableOpacity>
                </View>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={16} color="#c3c3c3" />
                  <Text style={styles.locationText}>
                    {job.preferred_location}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.uploadTime}>Uploaded on {job.created}</Text>
                <Text style={styles.jobTitle}>{job.subject}</Text>
              </View>
            </View>

            <View
              style={{ backgroundColor: "#ffffff33", height: 1, width: "100%" }}
            />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.tagContainer}>
                {category.map((cat, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{cat.subname}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View
              style={{ backgroundColor: "#ffffff33", height: 1, width: "100%" }}
            />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pricing</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>
                  Total Price:{" "}
                  <Text style={styles.boldText}>CAD {job.fixed_minimum}</Text>
                </Text>
                <Text style={styles.priceText}>
                  Hourly Rate:{" "}
                  <Text style={styles.boldText}>CAD {job.hour_minimum}</Text>
                </Text>
                <Text style={styles.priceText}>
                  Expected Hours:{" "}
                  <Text style={styles.boldText}>{job.expected_hour}</Text>
                </Text>
              </View>
            </View>

            <View
              style={{ backgroundColor: "#ffffff33", height: 1, width: "100%" }}
            />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bidding</Text>
              <Text style={styles.priceText}>
                Total bidding:{" "}
                <Text style={styles.boldText}>{job.proposal_count}</Text>
              </Text>
            </View>

            <View
              style={{ backgroundColor: "#ffffff33", height: 1, width: "100%" }}
            />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{job.description}</Text>
            </View>
          </ScrollView>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.chatBtn}>
              <Text style={styles.btnText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => navigation.navigate("CompletedJobPaymentPage",{gid:job.gid})}
            >
              <Text style={styles.btnText}>Payment Details</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Footer />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#161616",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    borderColor: "#FFFFFF33",
    borderWidth: 2,
    borderRadius: 15,
    padding: 14,
  },
  statsBox: {
    alignItems: "center",
    width: "30%",
  },
  statsLabel: {
    color: "#ffffff",
    fontSize: 12,
    marginBottom: 2,
    fontFamily: "Montserrat_400Regular",
  },
  statsValue: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 15,
  },
  headerCard: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    marginBottom: 12,
  },
  vertDivider: {
    borderLeftWidth: 2,
    borderRadius: 5,
    height: 40,
    borderLeftColor: "#FFFFFF33",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    padding: 16,
    marginTop: 0,
    marginVertical: 20,
    elevation: 3,
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#CFFFFC",
  },

  userDetails: {
    flex: 1,
    paddingLeft: 13,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  userName: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  verifyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
  },

  verifyText: {
    color: "#c3c3c3",
    marginLeft: 4,
    fontFamily: "Montserrat_400Medium",
    fontSize: 16,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  locationText: {
    color: "#c3c3c3",
    marginLeft: 2,
    fontFamily: "Montserrat_400Medium",
    fontSize: 16,
  },
  section: {
    paddingVertical: 11,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: "column",
    gap: 5,
  },
  jobTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
  },
  uploadTime: {
    color: "#c3c3c3c3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#ffffff1a",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
  },
  tagText: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 10,
  },
  priceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  priceText: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
  boldText: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
  },
  descriptionText: {
    color: "#ffffff",
    fontFamily: "Montserrat_400",
    fontSize: 16,
    lineHeight: 24,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingBottom: 90,
    paddingTop: 10,
  },
  chatBtn: {
    flex: 1,
    backgroundColor: "#D17B68",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  payBtn: {
    flex: 1,
    backgroundColor: "#46A282",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  btnText: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
});

export default ViewCompletedJobPost;
