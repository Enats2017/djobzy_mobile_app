import {
  Feather,
  FontAwesome,
  Ionicons,
  FontAwesome6,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import { truncateWords } from "../../api/TruncateWords";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function FavoriteJobs() {
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(true);
  const [jobs, setJobs] = useState([]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/favourite-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setJobs(data.gigs || []);
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}
    >
      <View style={styles.favoriteContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionHeader}>My Favorite Jobs</Text>

          <TouchableOpacity onPress={() => console.log("Filter clicked!")}>
            <View style={styles.filterButton}>
              <MaterialIcons name="filter-list" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {jobs.map((job, index) => (
          <View key={job.gid || index}>
            <View style={styles.jobCard}>
              <Text style={styles.uploadTextAbove}>
                Uploaded at {job.job_created}
              </Text>
              <View style={styles.userRow}>
                <Image
                  source={{
                    uri:
                      job.photo ||
                      "https://randomuser.me/api/portraits/women/8.jpg",
                  }}
                  style={styles.avatar}
                />

                <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                    <View style={styles.userNameSection}>
                      <Text style={styles.userName}>{job.full_name}</Text>

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
                        color="#40b68e"
                      />
                      <Text style={styles.paymentVerified}>
                        Payment verified
                      </Text>
                    </View>
                  </View>

                  <View>
                    <TouchableOpacity style={styles.heartTouchable}>
                      <FontAwesome
                        name={liked ? "heart" : "heart-o"}
                        size={20}
                        color={liked ? "#ff0000" : "#fff"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.jobTitleSection}>
                <Text style={styles.jobTitle}>{job.subject}</Text>
                <Text style={styles.jobDesc}>{truncateWords(job.description, 20)}</Text>
              </View>

              <View style={styles.skillRow}>
                {job.cat.map((category, index) => (
                  <View key={index}>
                    <View style={styles.skillTag}>
                      <Text style={styles.skillText}>{category.subname}</Text>
                    </View>
                  </View>
                ))}

                {job.more && Number(job.more) > 0 ? (
                  <View style={styles.skillTag}>
                    <Text style={styles.skillText}>+{job.more} more</Text>
                  </View>
                ) : null}
              </View>


              <View style={styles.jobFooter}>
                <AntDesign
                  name="dollar"
                  size={16}
                  color="#CB7767"
                  style={styles.locationIcon}
                />
                <Text style={styles.hourly}>Hourly: </Text>
                <Text style={styles.hourlyRange}>CAD {job.hour_minimum}</Text>
                <View style={styles.locationRow}>
                  {job.preferred_location && (
                    <>
                      <FontAwesome6
                        name="location-dot"
                        size={14}
                        color="#cb7767"
                        style={styles.locationIcon}
                      />

                      <Text style={styles.locationText}>
                        {job.preferred_location}
                      </Text>
                    </>
                  )}
                </View>
              </View>

              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dividerLine} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dividerLine: {
    height: 1,
    backgroundColor: "rgba(200,200,200,0.4)",
    marginHorizontal: 1,
    marginVertical: 15,
  },
  scrollView: {
    paddingBottom: 100,
  },
  favoriteContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionHeader: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 35,
    backgroundColor: "#424242",
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadTextAbove: {
    color: "#c3c3c3",
    fontSize: 12,
    marginBottom: 8,
    fontFamily: "Montserrat_400Regular",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    flex: 1,
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
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 7,
  },
  jobTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  jobDesc: {
    fontSize: 15,
    color: "#fff",
    lineHeight: 23,
    fontFamily: "Montserrat_400Regular",
  },
  readMore: {
    color: "#eb8676",
    fontWeight: "600",
    fontFamily: "Montserrat_600SemiBold",
  },
  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 30,
    gap: 6,
    fontFamily: "Montserrat_500Medium",
  },
  skillTag: {
    backgroundColor: "#514f4f",
    borderRadius: 30,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  skillText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
  },
  jobFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  cashIcon: {
    fontSize: 16,
    color: "#eb8676",
    marginRight: 6,
  },
  hourly: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    fontSize: 12,
    marginRight: 2,
  },

  hourlyRange: {
    color: "#fff",
    fontSize: 12,
    marginRight: 12,
    fontFamily: "Montserrat_400Regular",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    marginRight: 5,
  },

  locationText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
    flexWrap: "wrap"
  },

  viewBtn: {
    backgroundColor: "#eb8676",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 10,
  },
  viewBtnText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    letterSpacing: 1,
  },
  heartTouchable: {
    alignItems: "flex-end",
    width: "100%",
  },
});
