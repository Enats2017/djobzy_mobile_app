import Footer from "../../components/Footer";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../../components/Loading";

const JobProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const jobId = route.params?.gid;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/employee-job-details/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch job");
      const data = await response.json();
      setJob(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isFocused) {
      fetchJob();
    }
  }, [isFocused]);

  if (loading) return <Loading />;
  if (error) return <Text style={{ color: "#fff" }}>Error: {error}</Text>;
  if (!job) return <Text style={{ color: "#fff" }}>No job found</Text>;

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#222222" }}>
        <View style={styles.container}>
          <PageNameHeaderBar navigation={navigation} title="Job Details" />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.userInfoRow}>
              <Image
                source={{
                  uri:
                    job.details.photo ||
                    "https://randomuser.me/api/portraits/women/82.jpg",
                }}
                style={styles.avatar}
              />

              <View style={styles.userDetails}>
                <View style={styles.headerRow}>
                  <Text style={styles.userName}>{job.details.full_name}</Text>
                  <TouchableOpacity style={styles.menuButton}>
                    <Entypo name="dots-three-vertical" size={20} color="#bbb" />
                  </TouchableOpacity>
                </View>

                <View style={styles.verifyRow}>
                  <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                  <Text style={styles.verifyText}>
                    Verification Level: {job.details.verification_count}/7
                  </Text>
                </View>

                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={16} color="#c3c3c3" />
                  <Text style={styles.locationText}>
                    {job.details.preferred_location || "Unknown"}
                  </Text>
                </View>
              </View>
            </View>
             {job.details.request_status < 2 && job?.award != null && (
            <View style={styles.msgBox}>
              <Text style={styles.msgtext}>The journey starts now. Applied for the Job role.</Text>
            </View>
             )}

            {/* Job Title */}
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.uploadTime}>
                  Uploaded on {job.details.created}
                </Text>
                <Text style={styles.jobTitle}>
                  {job.details.subject || "Untitled Job"}
                </Text>
              </View>
            </View>
            <View
              style={{ backgroundColor: "#ffffff33", height: 1, width: "100%" }}
            />

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.tagContainer}>
                {job.category.map((cat, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{cat.subname}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View
              style={{ backgroundColor: "#ffffff33", height: 1, width: "100%" }}
            />

            {/* Pricing */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pricing</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>
                  Total Price:{" "}
                  <Text style={styles.boldText}>
                    CAD {job.details.fixed_minimum}
                  </Text>
                </Text>
                <Text style={styles.priceText}>
                  Hourly Rate:{" "}
                  <Text style={styles.boldText}>
                    CAD {job.details.hour_minimum}
                  </Text>
                </Text>
                <Text style={styles.priceText}>
                  Expected Hours:{" "}
                  <Text style={styles.boldText}>
                    {job.details.expected_hour}
                  </Text>
                </Text>
              </View>
            </View>
            <View
              style={{ backgroundColor: "#ffffff33", height: 1, width: "100%" }}
            />

            {/* Bidding */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bidding</Text>
              <Text style={styles.priceText}>
                Total bidding:{" "}
                <Text style={styles.boldText}>{job.proposal_count || 0}</Text>
              </Text>
            </View>

            <View
              style={{ backgroundColor: "#ffffff33", height: 1, width: "100%" }}
            />

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>
                {job.details.description || "No description provided."}
              </Text>
            </View>
          </ScrollView>
          <View>
            {job.details.request_status < 2 && job?.award != null ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("MyCurrentBiddingProfile", {
                    myOffer: job.my_offer || [],
                    current_user: job.current_user || [],
                    gig: job.details,
                    award: job.award || [],                    
                  })
                }
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>
                  See My Offer
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("JobApply", {
                    gig: job.details,
                    award: job.award || [],
                  })
                }
              >
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
            )}
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
  headerCard: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    marginBottom: 12,
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
    alignItems: "flex-start",
    gap: 4,
  },

  locationText: {
    color: "#c3c3c3",
    marginLeft: 2,
    fontFamily: "Montserrat_400Medium",
    fontSize: 16,
    maxWidth: "90%",
    flexWrap: "wrap"
  },
   msgBox:{
    borderColor:"#46A282",
    borderWidth:2,
    backgroundColor:"#46A2821A",
    borderRadius:10,
     paddingVertical:10,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:5,
   },
   msgtext:{
    color:"#46A282",
    fontFamily:"Montserrat_700Bold",
    fontSize:14,

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
  button: {
    marginBottom: "25%",
    marginTop: 7,
    marginHorizontal: 5,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#cb7767",
  },
  buttonText: {
    color: "#f7f3f3ff",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default JobProfile;
