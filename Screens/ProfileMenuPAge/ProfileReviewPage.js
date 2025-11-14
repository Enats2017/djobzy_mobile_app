import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import BorderButton from "../../components/BorderButton";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import NoReviews from "../../components/NoReviews";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "../../components/Footer";

const ProfileReviewPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("employee");
  const [employeeReview, setEmployeeReview] = useState([]);
  const [employerReview, setEmployerReview] = useState([]);
  const [employeeRating, setEmployeeRating] = useState("0");
  const [employerRating, setEmployerRating] = useState("0");

  const fetchReviews = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/my-reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setEmployeeReview(data.employee_review);
      setEmployerReview(data.employer_review);
      setEmployeeRating(data.employee_rating);
      setEmployerRating(data.employer_rating);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const ReviewCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.leftRow}>
            <View style={styles.circle}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/8.jpg",
                }}
                style={styles.profile}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.name}>{item.full_name}</Text>

                {item.is_verified === 1 && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#3ECF8E"
                    style={{ marginLeft: 5 }}
                  />
                )}
              </View>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={14} color="#FFD700" />
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.time}>{item.review_date}</Text>
        </View>
        <Text style={styles.reviewText}>{item.comment}</Text>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.conatiner}>
          <View style={styles.hedaer}>
            <PageNameHeaderBar title="Reviews" navigation={navigation} />
            <View style={styles.ratebox}>
              <Text style={styles.ratetext}>Average Rating</Text>
              <View style={styles.iconbox}>
                <Text style={styles.icontext}>
                  <AntDesign name="star" size={18} />{" "}
                  {activeTab === "employee" ? employeeRating : employerRating}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "employee" && styles.activeTab]}
              onPress={() => setActiveTab("employee")}
            >
              <Text
                style={
                  activeTab === "employee" ? styles.activeTabText : styles.tabText
                }
              >
                Employee’s Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "employer" && styles.activeTab]}
              onPress={() => setActiveTab("employer")}
            >
              <Text
                style={
                  activeTab === "jobs" ? styles.activeTabText : styles.tabText
                }
              >
                Employer’s Profile
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonbox}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Sort Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Sort by</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "employee" ? (
            employeeReview.length > 0 ? (
              <FlatList
                data={employeeReview}
                keyExtractor={(item) => item.rid.toString()}
                renderItem={ReviewCard}
                contentContainerStyle={{ paddingBottom: 40 }}
              />
            ) : (
              <View style={styles.nojobs}>
                <NoReviews />
              </View>
            )
          ) : employerReview.length > 0 ? (
            <FlatList
              data={employerReview}
              keyExtractor={(item) => item.rid.toString()}
              renderItem={ReviewCard}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          ) : (
            <View style={styles.nojobs}>
              <NoReviews />
            </View>
          )}
        </View>
        <Footer/>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  hedaer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratebox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconbox: {
    backgroundColor: "#FFFF00",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  ratetext: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#ffffff",
  },
  icontext: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    color: "#000000",
  },
  tabContainer: {
    flexDirection: "row",
    borderColor: "#c5c5c591",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 18,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  tabText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  activeTab: {
    backgroundColor: "#C96B59",
    padding: 10,
    outlineColor: "#C96B59",
    outlineWidth: 1,
    borderRadius: 10,
  },

  activeTabText: {
    color: "#ffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
  },
  buttonbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderColor: "#ffffff",
    borderWidth: 1,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  nojobs: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#2C2C2C",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profile: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  starRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  time: {
    color: "#bfbfbf",
    fontSize: 13,
  },
  circle: {
    width: 52.5,
    height: 52.5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#fff",
  },
  reviewText: {
    color: "#dcdcdc",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  readMore: {
    color: "#e57373",
    fontWeight: "500",
  },
});

export default ProfileReviewPage;
