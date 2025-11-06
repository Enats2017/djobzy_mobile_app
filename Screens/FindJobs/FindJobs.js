import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { API_URL } from "../../api/ApiUrl";
import { truncateWords } from "../../api/TruncateWords";
import Loading  from "../../components/Loading";

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchJobs = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setIsFetchingMore(true);
      const res = await fetch(`${API_URL}/best-matches?page=${pageNum}`);
      const data = await res.json();
      if (!data?.gigs) {
        setHasMore(false);
        return;
      }
      const newJobs = data.gigs.filter(
        (job) => !jobs.some((j) => j.gid === job.gid)
      );

      if (newJobs.length > 0) {
        setJobs((prev) => [...prev, ...newJobs]);
        setPage(pageNum);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log("Error fetching jobs:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };
  useEffect(() => {
    if (jobs.length === 0) {
      fetchJobs();
    }
  }, []);

  if (loading) return <Loading />;

  const renderJobCard = ({ item }) => {
    const servicesCount = item.gigServices ? item.gigServices.length : 0;
    const maxVisibleServices = 2;

    return (
      <>
        <View style={[styles.jobCard]}>
          <Text style={[styles.uploadTextAbove, { marginBottom: 8 }]}>
            Uploaded at {item.created}
          </Text>
          <View style={styles.userRow}>
            <Image
              source={{
                uri: item.photo || "../assets/images/djobzy-logo.png",
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 3,
                }}
              >
                <Text style={styles.userName}>{item.full_name}</Text>
                <View style={{ flexDirection: "row", marginLeft: 6 }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={12}
                      color="#f5c242"
                    />
                  ))}
                </View>
              </View>
              <View style={styles.paymentRow}>
                <MaterialIcons name="verified" size={16} color="#39A881" />
                <Text style={styles.paymentVerified}>Payment verified</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Feather name="heart" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.jobDesc}>
            {truncateWords(item.description, 20)}
          </Text>

          <View style={styles.skillRow}>
            {servicesCount > 0 ? (
              <>
                {item.gigServices
                  .slice(0, maxVisibleServices)
                  .map((service, index) => (
                    <View key={index}>
                      <View style={styles.skillTag}>
                        <Text style={styles.skillText}>
                          {service.sub_services.subname || "No Subcategory"}
                        </Text>
                      </View>
                    </View>
                  ))}

                {servicesCount > maxVisibleServices && (
                  <View style={styles.skillTag}>
                    <Text style={styles.skillText}>
                      +{servicesCount - maxVisibleServices} More
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.noData}>No Data Found</Text>
            )}
          </View>
          <View style={styles.jobFooter}>
            <AntDesign
              name="dollar"
              size={16}
              color="#CB7767"
              style={styles.locationIcon}
            />
            <Text style={styles.hourly}>Hourly: </Text>
            <Text style={styles.hourlyRange}>{item.hour_minimum}</Text>
            <View style={styles.locationRow}>
              {item.preferred_location && (
                <>
                  <Feather
                    name="map-pin"
                    size={16}
                    color="#eb8676"
                    style={styles.locationIcon}
                  />

                  <Text style={styles.locationText}>
                    {item.preferred_location}
                  </Text>
                </>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              navigation.navigate("JobProfile", { gid: item.request_slug })
            }
          >
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
          <View style={styles.dividerLine} />
        </View>
      </>
    );
  };

  return (
    <View style={styles.findJobContainer}>
      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.gid.toString()}
        onEndReached={() => {
          if (!isFetchingMore && hasMore) fetchJobs(page + 1);
        }}
        onEndReachedThreshold={0.5}
        style={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
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
  findJobContainer: {
    flex: 1,
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
    marginBottom: 7,
    gap: 10,
    width: "100%"
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
    borderWidth: 1,
    borderColor: "#fff",
    flex: 1
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
  jobTitle: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 6,
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
    marginLeft: 15,
  },
  locationIcon: {
    fontSize: 16,
    color: "#eb8676",
    marginRight: 4,
  },
  locationText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
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
    width: "100%"
  }
});
