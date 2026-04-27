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
import NoReviews from "../../components/NoReviews";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import LineDivider from "../../components/LineDivider";

const SORT_ORDER_OPTIONS = ['Ascending', 'Descending'];
const SORT_BY_OPTIONS = ['Date Added', 'Rating'];

const ProfileReviewPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("employee");
  const [employeeReview, setEmployeeReview] = useState([]);
  const [employerReview, setEmployerReview] = useState([]);
  const [employeeRating, setEmployeeRating] = useState("0");
  const [employerRating, setEmployerRating] = useState("0");
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const renderStars = (rating) => {
    if (!rating || rating <= 0) return "⭐";
    return "⭐".repeat(Math.round(rating));
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
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

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const handleSelect = (type, value) => {
    if (type === 'order') {
      setSortOrder(value);
      handleSortOrder(value);   // pass value directly, don't rely on state
    } else {
      setSortBy(value);
      handleSortBy(value);
    }
    setActiveDropdown(null);
  };
  const handleSortOrder = (order) => {
    const source = activeTab === "employee" ? employeeReview : employerReview;
    const setter = activeTab === "employee" ? setEmployeeReview : setEmployerReview;
    const isAsc = order === "Ascending";
    const sorted = [...source].sort((a, b) => {
      const dateA = new Date(a.review_date);
      const dateB = new Date(b.review_date);
      // console.log("dateA:", dateA, "dateB:", dateB, "order:", order);
      return isAsc ? dateA - dateB : dateB - dateA;
    });

    setter(sorted);
  };

  const handleSortBy = (type) => {
    const source = activeTab === "employee" ? employeeReview : employerReview;
    const setter = activeTab === "employee" ? setEmployeeReview : setEmployerReview;
    const sorted = [...source];
    if (type === 'Date Added') {
      sorted.sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
    } else if (type === 'Rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    setter(sorted);
  };

  const ReviewCard = ({ item, index, length }) => {
    const currentRating = activeTab === "employee" ? employeeRating : employerRating;
    const isLastItem = index === length - 1;

    return (
      <>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.leftRow}>
              <View style={styles.circle}>
                <Image
                  source={{
                    uri: item.photo,
                  }}
                  style={styles.profile}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.name}>{item.full_name}</Text>
                </View>
                <View style={styles.starRow}>
                  <Text style={styles.rating}>{renderStars(currentRating)}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.time}>{item.updated_review_date}</Text>
          </View>
          {item.subject && (
            <Text style={styles.reviewSubject}>{item.subject}</Text>
          )}
          <Text style={styles.reviewText}>{item.comment}</Text>
        </View>

        {!isLastItem && <LineDivider />}
      </>
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <PageNameHeaderBar title="Reviews" navigation={navigation} />
            {
              !loading && (
                <View style={styles.ratebox}>
                  <Text style={styles.ratetext}>Average Rating</Text>
                  <View style={styles.iconbox}>
                    <Text style={styles.icontext}>
                      <AntDesign name="star" size={18} />{" "}
                      {activeTab === "employee" ? employeeRating : employerRating}
                    </Text>
                  </View>
                </View>
              )
            }
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
                  activeTab === "employer" ? styles.activeTabText : styles.tabText
                }
              >
                Employer’s Profile
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonbox}>
            {/* Sort Order Button */}
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => toggleDropdown('order')}
              >
                <Text style={styles.buttonText}>{sortOrder || 'Sort Order'}</Text>
              </TouchableOpacity>

              {activeDropdown === 'order' && (
                <View style={styles.dropdownMenu}>
                  {SORT_ORDER_OPTIONS.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dropdownItem,
                        index === SORT_ORDER_OPTIONS.length - 1 && { borderBottomWidth: 0 },
                      ]}
                      onPress={() => handleSelect('order', option)}
                    >
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => toggleDropdown('sort')}
              >
                <Text style={styles.buttonText}>{sortBy || 'Sort By'}</Text>
              </TouchableOpacity>

              {activeDropdown === 'sort' && (
                <View style={styles.dropdownMenu}>
                  {SORT_BY_OPTIONS.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dropdownItem,
                        index === SORT_BY_OPTIONS.length - 1 && { borderBottomWidth: 0 },
                      ]}
                      onPress={() => handleSelect('sort', option)}
                    >
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {
            loading ? (
              <Loading />
            ) : (
              <>
                {activeTab === "employee" ? (
                  employeeReview.length > 0 ? (
                    <FlatList
                      data={employeeReview}
                      keyExtractor={(item) => item.rid.toString()}
                      renderItem={({ item, index }) => (
                        <ReviewCard item={item} index={index} length={employeeReview.length} />
                      )}
                      contentContainerStyle={{ paddingBottom: 100 }}
                      showsVerticalScrollIndicator={false}
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
                    renderItem={({ item, index }) => (
                      <ReviewCard item={item} index={index} length={employerReview.length} />
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={styles.nojobs}>
                    <NoReviews />
                  </View>
                )}
              </>
            )
          }
        </View>
        <Footer />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  header: {
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
    backgroundColor: "#f4c366",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  ratetext: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
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
    marginTop: 15,
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
    fontSize: 18,
  },
  buttonbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 15,
  },
  dropdownWrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },
  button: {
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
    fontFamily: "Montserrat_500Medium",
  },
  nojobs: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',           // sits just below the button
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,          // Android shadow
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontFamily: "Montserrat_500Medium",
  },
  card: {},
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
    borderRadius: 90,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  reviewSubject: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: '#F9FAFB',
    marginTop: 10,
  },
  starRow: {
    flexDirection: "row",
  },
  time: {
    color: "#bfbfbf",
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
  },
  circle: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "#fff",
  },
  reviewText: {
    color: "#dcdcdc",
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Montserrat_400Regular",
  },
  readMore: {
    color: "#e57373",
    fontFamily: "Montserrat_500Medium",
  },
});

export default ProfileReviewPage;
