import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, API_ICON } from "../../api/ApiUrl";
import FeedPost from "../SocialMediaPage/FeedPost";
import GradientButton from "../../components/GradientButton";
import LineDivider from "../../components/LineDivider";
import Loading from "../../components/Loading";
import EmployerFooter from "../../components/EmployerFooter";

export default function PublicEmployeeProfilePage({ route }) {
  const navigation = useNavigation();
  const { name } = route?.params ?? {};
  const [promote, setPromote] = useState([]);
  const [user, setUser] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [profile, setProfile] = useState([]);
  const [isEmployer, setIsEmployer] = useState(false);
  const [subcategory, setSubcategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [followAction, setFollowAction] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const fetchEmployeeProfile = async () => {
    setLoading(true);
    try {
      const userStr = await AsyncStorage.getItem("user");
      const users = JSON.parse(userStr);
      setCurrentUserId(users?.id);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/employee/${name}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();

      setProfile(data);
      setUser(data.editprofile);
      setPromote(data.promote);
      setSubcategory(data.subcategory);
      setFeeds(data.feeds.data ?? []);
    } catch (e) {
      console.log("ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name) fetchEmployeeProfile();
  }, []);

  // const handleSendOffer = async () => {
  //   try {
  //     setLoading(true);
  //     const token = await AsyncStorage.getItem("token");
  //     const isLoggedIn = !!token;
  //     const formData = new FormData();
  //     formData.append("user_check", isLoggedIn);
  //     formData.append("serviceId", service?.sid);
  //     formData.append("services_title", service?.title);
  //     formData.append("hourMinimum", service?.hour_minimum ?? 0);
  //     formData.append("hourMaximum", service?.hour_maximum ?? 0);
  //     formData.append("priceMinValue", service?.fixed_minimum ?? 0);
  //     formData.append("priceMaxValue", service?.fixed_maximum ?? "");
  //     formData.append(
  //       "service_selected_time",
  //       service?.selected_time ?? "no-calendar"
  //     );
  //     formData.append("price_negotiable", service?.price_negotiable ?? 0);
  //     formData.append("admin_fee", 1.1);
  //     // convert array → comma separated
  //     if (service?.subcategory_ids?.length) {
  //       formData.append("allSubcategoryIds", service.subcategory_ids.join(","));
  //     }

  //     // if (!isLoggedIn) {
  //     //   formData.append("hiring_job_url", "/login");
  //     // }

  //     const response = await fetch(`${API_URL}/autoJobCreate`, {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
  //       },
  //       body: formData,
  //     });

  //     const data = await response.json();

  //     if (data.status === 200) {
  //       //navigation.navigate("HiringJobDetails");
  //       Alert.alert("Successfully send the data ");
  //     } else {
  //       Alert.alert("Error", data.message || "Something went wrong");
  //     }
  //   } catch (error) {
  //     console.log("Send Offer error:", error);
  //     Alert.alert("Error", "Network error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const isLiked = profile?.like?.is_like === 1;

  const handleFollow = async () => {
    try {
      setFollowAction("follow");
      setSubmit(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/followUser`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
        }),
      });
      const data = await response.json();
      console.log("Follow response:", data);
      if (data.status === 200) {
        setProfile((prev) => ({
          ...prev,
          like: { ...prev.like, is_like: 1 },
        }));
      }
    } catch (error) {
      console.log("Follow error:", error);
    } finally {
      setSubmit(false);
    }
  };
  const handleUnfollow = async () => {
    try {
      setFollowAction("unfollow");
      setSubmit(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/unfollowUser`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
        }),
      });
      const data = await response.json();
      console.log("Unfollow response:", data);
      if (data.status == 200) {
        setProfile((prev) => ({
          ...prev,
          like: { ...prev.like, is_like: 0 },
        }));
      }
    } catch (error) {
      console.log("Unfollow error:", error);
    } finally {
      setSubmit(false);
    }
  };

  const safeSubcategory = Array.isArray(subcategory) ? subcategory : [];

  const displayedCategories = showAllCategories
    ? safeSubcategory
    : safeSubcategory.slice(0, 5);

  // if (loading) return <Loading />;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.employeeContainer}>
        <PageNameHeaderBar navigation={navigation} title={user?.full_name} />
        {loading ? (
          <Loading />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View style={styles.cardBox}>
              <View style={styles.profileRow}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri:
                      user?.photo ||
                      "https://dummyimage.com/150x150/ccc/fff.png&text=No+Photo",
                  }}
                />
                <View style={styles.profileTextContent}>
                  <Text style={styles.profileName}>{user?.full_name}</Text>
                  <View style={styles.verificationRow}>
                    <View style={styles.iconTextRow}>
                      <MaterialIcons
                        name="verified"
                        size={18}
                        color="#c3c3c3"
                      />
                      <Text style={styles.verificationText}>
                        Verification Level: {user?.verification_count || 0}/7
                      </Text>
                    </View>
                    <View style={styles.iconTextRow}>
                      <FontAwesome6
                        name="location-dot"
                        size={18}
                        color="#c3c3c3"
                      />
                      <Text style={styles.locationText}>
                        {user?.address ?? "Unknown"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.horizontalDivider} />
              <View style={styles.switchRow}>
                <Text style={styles.switchText}>
                  Switch to {user?.full_name || "User"}'s Employer Profile
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsEmployer(!isEmployer);
                    navigation.replace("PublicEmployerProfilePage", {
                      name: user?.name,
                    });
                  }}
                >
                  {isEmployer ? (
                    <MaterialCommunityIcons
                      name="toggle-switch"
                      size={50}
                      color="#d17b68"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="toggle-switch-off"
                      size={50}
                      color="#c3c3c3"
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.buttonsRow}>
                {currentUserId !== user?.id && (
                  <TouchableOpacity
                    onPress={isLiked ? handleUnfollow : handleFollow}
                    style={[styles.btnFollow, isLiked && styles.btnUnfollow]}
                  >
                    {submit ? (
                      <ActivityIndicator
                        color={isLiked ? "#FFFFFF" : "#000000"}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.btnFollowText,
                          isLiked && styles.btnUnfollowText,
                        ]}
                      >
                        {isLiked ? "Unfollow" : "Follow"}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                {currentUserId !== user?.id && (
                  <TouchableOpacity
                    style={styles.btnHire}
                    onPress={() =>
                      navigation.navigate("ViewHirePage", {
                        jobId: user.id || [],
                      })
                    }
                  >
                    <Text style={styles.btnHireText}>Hire</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.btnChat}
                  onPress={() => navigation.navigate("ChatList")}
                >
                  <Text style={styles.btnChatText}>Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>Number of jobs</Text>
                <Text style={styles.statsNumber}>{profile?.count}</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statsBox}>
                <Text style={styles.statsLabel}>Money Earn</Text>
                <Text style={styles.statsNumber}>{profile?.earned} CAD</Text>
              </View>
            </View>
            {user && (
              <View style={styles.infoOuterContainer}>
                <View style={styles.infoSection}>
                  <Text style={styles.sectionLabel}>Profile Title</Text>
                  <Text style={styles.profileTitleText}>
                    {user?.profile_title_employee || "No Title Added"}
                  </Text>
                </View>
                <View style={styles.dividerLine} />
                <View style={styles.infoSection}>
                  <Text style={styles.sectionLabel}>About Me</Text>
                  <Text style={styles.aboutMeText}>
                    {user?.employer_about || "No about info available."}
                  </Text>
                </View>
                <View style={styles.dividerLine} />
              </View>
            )}

            {feeds.length > 0 && (
              <FlatList
                data={feeds}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={feeds.length > 5 ? true : false}
                ListHeaderComponent={
                  <Text style={styles.recentText}>
                    {feeds[0]?.full_name} Recent Posts
                  </Text>
                }
                renderItem={({ item }) => (
                  <FeedPost
                    author={item.full_name}
                    subtitle={item.profile_title_employer ?? "No title"}
                    text={item?.message}
                    avatar={{ uri: item.photo }}
                    image={{ uri: item.file_name }}
                    likes={item.likes_count}
                    comments={item.comment_count}
                    share="0"
                  />
                )}
              />
            )}

            {displayedCategories.length > 0 && (
              <View style={styles.category}>
                <Text style={styles.sectionLabel}>Involved Category</Text>
                <View style={styles.categoryWrapper}>
                  {displayedCategories.map((item) => (
                    <View key={item.subid} style={styles.categoryPill}>
                      <Text style={styles.categoryText}>{item.subname}</Text>
                    </View>
                  ))}
                  {subcategory.length > 5 && (
                    <TouchableOpacity
                      onPress={() => setShowAllCategories((prev) => !prev)}
                      style={styles.showMoreBtn}
                    >
                      <Text style={styles.showMoreText}>
                        {showAllCategories ? "Show Less" : "Show More"}
                      </Text>

                      <Ionicons
                        name={showAllCategories ? "chevron-up" : "chevron-down"}
                        size={14}
                        color="#000"
                        style={{ marginLeft: 5 }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            {/* <LineDivider /> */}

            <View style={styles.pillsWrapper}>
              {promote.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>My Promoted Services</Text>
                  <ScrollView
                    horizontal={true}
                    contentContainerStyle={styles.promatewrapper}
                  >
                    {promote.map((item, index) => {
                      const icon =
                        item?.seeking_services?.[0]?.get_seek_services_api
                          ?.icon;

                      console.log("111111", icon);

                      console.log(
                        "Path",
                        `${API_ICON}/images/servicephoto/png-image/${icon}`,
                      );

                      return (
                        <View key={index} style={styles.wrapper}>
                          {/* ICON */}
                          <View style={styles.iconContainer}>
                            {icon ? (
                              <Image
                                source={{
                                  uri: `${API_ICON}/images/servicephoto/png-image/${icon}`,
                                }}
                                style={styles.image}
                                resizeMode="contain"
                              />
                            ) : (
                              <Ionicons
                                name="image-outline"
                                size={28}
                                color="#999"
                              />
                            )}
                          </View>

                          {/* CARD */}
                          <View style={styles.card}>
                            {/* TOP CONTENT */}
                            <View style={styles.cardContent}>
                              <Text style={styles.title} numberOfLines={2}>
                                {item.subject}
                              </Text>

                              <View style={styles.priceRow}>
                                <Text style={styles.price}>
                                  {item.hour_minimum} CAD
                                </Text>
                                <Text style={styles.perHour}>/hour</Text>
                              </View>
                            </View>

                            {/* BUTTON (ALWAYS BOTTOM) */}
                            <GradientButton
                              title="View"
                              fontSize={15}
                              paddingVertical={10}
                              paddingHorizontal={35}
                              onPress={() =>
                                navigation.navigate("PromoteServicesDetails", {
                                  id: item.sid,
                                  type: 2,
                                })
                              }
                            />
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                  <LineDivider />
                </>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Attachments</Text>
                <Text style={styles.profileTitleText}>.........</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Current Work</Text>
                <Text style={styles.profileTitleText}>.........</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Work History And Reviews
                </Text>
                <Text style={styles.profileTitleText}>.........</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      <EmployerFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  employeeContainer: {
    backgroundColor: "#222222",
    flex: 1,
    paddingHorizontal: 15,
  },
  cardBox: {
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 18,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#c3c3c3",
  },
  profileTextContent: {
    marginLeft: 13,
    flex: 1,
  },
  profileName: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
    paddingBottom: 6,
  },
  verificationRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 3,
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  verificationText: {
    color: "#c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    marginLeft: 6,
  },
  locationText: {
    color: "#c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    marginLeft: 6,
    flexShrink: 1,
    flexWrap: "wrap",
    lineHeight: 20,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: "#ffffff33",
    marginTop: 18,
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    color: "#ffffff",
    fontSize: 16,
    flex: 1,
    marginRight: 10,
    fontFamily: "Montserrat_500Medium",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  btnFollow: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginRight: 2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  btnFollowText: {
    color: "#333333",
    fontSize: 17,
    fontFamily: "Montserrat_700Bold",
  },
  btnUnfollow: {
    backgroundColor: "#E94235",
  },

  btnUnfollowText: {
    color: "#ffffff",
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Montserrat_700Bold",
  },
  btnHire: {
    flex: 1,
    backgroundColor: "#d17b68",
    marginHorizontal: 8,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  btnHireText: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
  },
  btnChat: {
    flex: 1,
    backgroundColor: "#46a282",
    marginLeft: 2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  btnChatText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ffffff33",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 18,
    alignItems: "center",
  },
  statsBox: {
    flex: 1,
    alignItems: "center",
  },
  statsNumber: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Montserrat_700Bold",
  },
  statsLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  verticalDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ffffff33",
    marginHorizontal: 4,
  },

  sectionLabel: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 6,
    fontFamily: "Montserrat_700Bold",
  },
  profileTitleText: {
    color: "#c3c3c3",
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "Montserrat_400Regular",
  },
  recentText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    marginBottom: 5,
  },
  aboutMeText: {
    color: "#c3c3c3",
    fontSize: 14,
    flexWrap: "wrap",
    lineHeight: 20,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 4,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#ffffff33",
    marginVertical: 15,
    width: "100%",
  },
  plusbtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 8,
    width: "50%",
    paddingVertical: 5,
    marginBottom: 15,
  },
  plustext: {
    color: "#030303",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  promatewrapper: {
    flexDirection: "row",
    alignItems: "center",
        paddingTop: 8,
    gap: 10,
  },
    wrapper: {
    position: "relative",
    marginTop: 25,
  },

 iconContainer: {
    position: "absolute",
    top: -22,
    left: "50%",
    transform: [{ translateX: -22.5 }],
    zIndex: 10,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
    image: {
    width: 25,
    height: 25,
  },


  card: {
    width: 160,
    height: 180,
    paddingTop: 27,
    paddingBottom: 18,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#ffffff1a",
  },
    cardContent: {
    alignItems: "center",
  },

  title: {
    color: "#ffffff",
    fontFamily: "Montserrat_400Medium",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 17,
  },

  price: {
    color: "#25dd4dff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 6,
  },
    priceRow: {
    alignItems: "center",
    gap: 4,
  },

  perHour: {
    color: "#30D354",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  btn: {
    backgroundColor: "#CC6C52",
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 12,
  },

  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 6,
  },

  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff1a",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
   
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
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
  providesImg: {
    width: 22,
    height: 22,

    resizeMode: "contain",
  },
});
