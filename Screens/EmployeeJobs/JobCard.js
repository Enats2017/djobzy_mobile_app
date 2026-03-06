import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { truncateWords } from "../../api/TruncateWords";
import { useNavigation } from "@react-navigation/native";
import GradientButton from "../../components/GradientButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import { toastError, toastSuccess } from "../../utils/toast";

const JobCard = React.memo(({ item, navigation }) => {
  const servicesCount = item.gigServices ? item.gigServices.length : 0;
  const maxVisibleServices = 2;
  const [isLiked, setIsLiked] = useState(item?.is_like == 1);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/followJob`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_id: item?.gid,
        }),
      });
      const data = await response.json();
       toastSuccess("Liked Successfully")

      if (data.status === 200) {
        setIsLiked(true);
      }
    } catch (error) {
      console.log("Follow error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/unfollowJob`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_id: item?.gid,
        }),
      });
      const data = await response.json();

        toastSuccess("Unliked Successfully")
      if (data.status == 200) {
        setIsLiked(false);
      }
    } catch (error) {
      console.log("Unfollow error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={[styles.jobCard]}>
        <Text style={[styles.uploadTextAbove, { marginBottom: 8 }]}>
          Uploaded at {item.created}
        </Text>
        <View style={styles.userRow}>
          <Image source={{ uri: item.photo }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <View style={styles.userNameSection}>
                <Text
                  style={styles.userName}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.full_name}
                </Text>

                <View style={styles.starRow}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome key={i} name="star" style={styles.starIcon} />
                  ))}
                </View>
              </View>

              <View style={styles.paymentRow}>
                <MaterialIcons name="verified" size={16} color="#40b68e" />
                <Text style={styles.paymentVerified}>Payment verified</Text>
              </View>
            </View>
          </View>
          <View style={styles.heartColumn}>
            <TouchableOpacity
              style={styles.heartTouchable}
              disabled={loading}
              onPress={() => (isLiked ? handleUnfollow() : handleFollow())}
            >
              <FontAwesome
                name={isLiked ? "heart" : "heart-o"}
                size={20}
                color={isLiked ? "#ff0000" : "#c3c3c3"}
              />
            </TouchableOpacity>
          </View>
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

        <View>
          <GradientButton
            title="View"
            paddingVertical={0}
            onPress={() =>
              navigation.navigate("JobProfile", { gid: item.request_slug })
            }
          />
        </View>
      </View>
    </>
  );
});

export default JobCard;

const styles = StyleSheet.create({
  uploadTextAbove: {
    left: 0,
    color: "#b3b3b3",
    fontSize: 11,
    fontFamily: "Montserrat_400Regular",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  userInfo: {
    flex: 1, // 💥 takes remaining width
    paddingRight: 8, // space before heart
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
    flex: 1,
  },
  nameRow: {
    flexDirection: "column",
    gap: 5,
  },
  userNameSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 2,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    flexShrink: 1,
    fontFamily: "Montserrat_500Medium",
  },
  starRow: {
    flexDirection: "row",
    gap: 3,
  },
  heartColumn: {
    width: 40, // 💥 fixed column
    alignItems: "center",
    justifyContent: "flex-start",
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
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Montserrat_600SemiBold",
  },

  jobDesc: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Montserrat_400Regular",
    color: "#ffffff",
    lineHeight: 24,
  },

  readMore: {
    color: "#eb8676",
    fontWeight: "600",
  },

  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },

  skillTag: {
    backgroundColor: "#ffffff1a",
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 5,
    alignItems: "center",
  },

  skillText: {
    color: "#e3e3e3",
    fontSize: 10,
    fontWeight: "500",
    fontFamily: "Montserrat_500Medium",
    textAlign: "center",
  },

  jobFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
  },

  hourly: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    fontSize: 12,
  },

  hourlyRange: {
    color: "#fff",
    fontWeight: "500",
    marginRight: 12,
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
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
  },
  heartTouchable: {
    alignItems: "flex-end",
    width: "100%",
  },
});
