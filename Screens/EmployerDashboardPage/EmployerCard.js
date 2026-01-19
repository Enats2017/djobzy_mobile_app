import React, { useState } from "react";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";

const EmployerCard = ({ item, isLastItem }) => {
  const navigation = useNavigation();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isLiked, setIsLiked] = useState(item?.is_like == 1);
   const [loading, setLoading] = useState(false);
  

  const handleProfileNavigation = (item) => {
    console.log("Employer name 👉", item?.name);

    if (item?.name?.trim() && item.is_closed == 1 && item.is_spam_user == 1) {
      Alert.alert(
        "User unavailable",
        "User data is unavailable at the moment.",
      );
      return;
    }

    if (item?.admin == 2) {
      navigation.navigate("PublicEmployeeProfile", {
        name: item?.name,
      });
    } else {
      navigation.navigate("EmployerProfilePage", {
        name: item?.name || "",
      });
    }
  };

  const handleFollow = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/followUser`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: item?.id,
        }),
      });
      const data = await response.json();
      console.log("Follow response:", data);
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
      const response = await fetch(`${API_URL}/unfollowUser`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: item?.id,
        }),
      });
      const data = await response.json();
      console.log("Unfollow response:", data);
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
      <View style={styles.cardContainer}>
        <View style={styles.employeeCard}>
          <View style={styles.cardHeader}>
            <Image
              source={{
                uri:
                  item?.photo ||
                  "https://randomuser.me/api/portraits/women/44.jpg",
              }}
              style={styles.avatar}
            />

            <View style={styles.infoWrapper}>
              <View
                style={[styles.nameStarRow, { justifyContent: "flex-start" }]}
              >
                <Text style={styles.name}>{item?.full_name || "No Name"}</Text>

                <View
                  style={[styles.nameStarRow, { justifyContent: "flex-start" }]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 6,
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesome
                        key={star}
                        name={item.avg_rating >= star ? "star" : "star-o"}
                        size={14}
                        color="#EBBE56"
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.verification}>
                <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                <Text style={styles.verificationText}>
                  Verification Level: {item?.verification_count || 0}/7
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.heartTouchable} 
              disabled={loading}
              onPress={() => {
                if (isLiked) {
                  handleUnfollow();
                } else {
                  handleFollow();
                }
              }}
            >
              <FontAwesome
                name={isLiked ? "heart" : "heart-o"}
                size={20}
                color={isLiked ? "#FF0000" : "#c3c3c3" }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.skills}>
            {(showAllCategories
              ? item?.seller_services_for_search || []
              : (item?.seller_services_for_search || []).slice(0, 5)
            ).map((service, i) => (
              <View style={styles.skill} key={i}>
                <Text style={styles.skillText}>
                  {service?.sub_services?.subname}
                </Text>
              </View>
            ))}

            {item?.seller_services_for_search?.length > 5 && (
              <TouchableOpacity
                onPress={() => setShowAllCategories(!showAllCategories)}
                style={styles.showMoreBtn}
              >
                <Text style={styles.showMoreText}>
                  {showAllCategories ? "Show less" : "Show more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => handleProfileNavigation(item)}
          >
            <Text style={styles.profileBtnText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default EmployerCard;
const styles = StyleSheet.create({
  employeeCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF33",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: "center",

    marginLeft: 10,
  },
  nameStarRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  name: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    fontSize: 16,
    marginRight: 6,
    flexShrink: 1,
  },
  starContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  verification: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  verificationText: {
    color: "#c3c3c3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginLeft: 3,
  },
  heartTouchable: {
    padding: 6,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  skill: {
    backgroundColor: "#565656",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 4,
    marginBottom: 6,
  },
  skillText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  profileBtn: {
    backgroundColor: "#D17B68",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  profileBtnText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ffffff33",
    marginVertical: 15,
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  showMoreBtn: {
    marginTop: 10,
    paddingVertical: 7.5,
    paddingHorizontal: 12,
    backgroundColor: "#ececec",
    borderRadius: 20,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },

  showMoreText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#000",
  },
});
