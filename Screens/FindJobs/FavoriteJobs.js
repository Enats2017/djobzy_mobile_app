import { Feather, FontAwesome, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { API_URL } from "../../api/ApiUrl";

export default function FavoriteJobs() {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(true);
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
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>My Favorite Jobs</Text>

        <TouchableOpacity onPress={() => console.log("Filter clicked!")}>
          <View style={styles.filterButton}>
            <MaterialIcons name="filter-list" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.jobCard}>
        <Text style={styles.uploadTextAbove}>Uploaded 20 minutes ago</Text>

        <View style={styles.userRow}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/8.jpg" }}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>Jessie James</Text>

              <View style={styles.starRow}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesome key={i} name="star" style={styles.starIcon} />
                ))}
              </View>

              <TouchableOpacity
                onPress={() => setLiked1(!liked)}
                style={styles.heartTouchable}
              >
                <FontAwesome
                  name={liked ? "heart" : "heart-o"}
                  size={20}
                  color={liked ? "#ff0000" : "#fff"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.paymentRow}>
              <MaterialIcons name="verified" size={16} color="#40b68e" />
              <Text style={styles.paymentVerified}>Payment verified</Text>
            </View>
          </View>
        </View>

        <Text style={styles.jobTitle}>UI/UX Designer</Text>

        <Text style={styles.jobDesc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
        </Text>

        <View style={styles.skillRow}>
          {["Website design", "Website design", "website design"].map(
            (skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            )
          )}
        </View>

        <View style={styles.jobFooter}>
          <Ionicons name="cash-outline" style={styles.cashIcon} />
          <Text style={styles.hourly}>Hourly: </Text>
          <Text style={styles.hourlyRange}>$15-$35</Text>
          <View style={styles.locationRow}>
            <FontAwesome6
              name="location-dot"
              size={14}
              color="#cb7767"
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>Remote</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.viewBtn}>
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2f2c2c",
    paddingTop: 18,
    paddingHorizontal: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  jobCard: {
    backgroundColor: "transparent",
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
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  starRow: {
    flexDirection: "row",
    marginRight: 100,
    gap: 3,
    marginLeft: 5,
  },
  starIcon: {
    fontSize: 13,
    color: "#EBBE56",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
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
    alignSelf: "flex-end",
    marginRight: 12,
    marginTop: 2,
  },
});
