import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
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
import { API_URL } from "../../api/ApiUrl";
import FeedPost from "../SocialMediaPage/FeedPost";
import GradientButton from "../../components/GradientButton";
import LineDivider from "../../components/LineDivider";
import Loading from "../../components/Loading";
import EmployerFooter from "../../components/EmployerFooter";

export default function PublicEmployeeProfile({ route }) {
  const navigation = useNavigation();
  const { name } = route?.params ?? {};
  const [user, setUser] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [profile, setProfile] = useState([]);
  const [isEmployer, setIsEmployer] = useState(false);
  const [subcategory, setSubcategory] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [job, setJob] = useState([]);
  const [followAction, setFollowAction] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [submit, setSubmit] = useState(false);

  const fetchEmployeeProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/employer/${name}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setProfile(data);
      setUser(data.editprofile);
      setJob(data.myJobPosts);
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
  }, [name]);

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

  if (loading) return <Loading />;
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
                  Switch to {user?.full_name || "User"}'s Employee Profile
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsEmployer(!isEmployer);
                    setIsEmployer(false);
                    navigation.replace("EmployerProfilePage", {
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
                {/* <TouchableOpacity
                style={styles.btnHire}
                 onPress={() => {
                    setIsEmployer(!isEmployer);
                    navigation.navigate("EmployerProfilePage", {
                      name: user?.name
                    });
                  }}
              >
                <Text style={styles.btnHireText}>Hire</Text>
              </TouchableOpacity> */}
                <TouchableOpacity style={styles.btnChat} onPress={() => navigation.navigate("FeedChat")}>
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
            <FlatList
              data={feeds}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={feeds.length > 5 ? true : false}
              renderItem={({ item }) => (
                <FeedPost
                  author={item.full_name}
                  subtitle={item.profile_title_employer ?? "No title"}
                  time={item.created}
                  text={item?.message}
                  avatar={{ uri: item.photo }}
                  image={{ uri: item.file_name }}
                  likes={item.likes_count}
                  comments={item.comment_count}
                  share="0"
                />
              )}
            />

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
            <View style={styles.pillsWrapper}>
              <Text style={styles.sectionLabel}> MyJobPosts</Text>
              {job?.data?.map((item, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.heading}>{item.subject}</Text>
                  <Text style={styles.desc}>{item.description}</Text>
                  <Text style={styles.row}>
                    <Text style={styles.label}>Total Price:</Text> CAD{" "}
                    {item.fixed_minimum}
                    {"   "}
                    <Text style={styles.label}>Hourly Rate:</Text> CAD{" "}
                    {item.hour_minimum}
                  </Text>
                  <Text style={styles.row}>
                    <Text style={styles.label}>Project Length:</Text>{" "}
                    {item.expected_hour}
                  </Text>
                  <LineDivider />
                  <View style={styles.gridentbtn}>
                    <Text style={styles.row}>Proposals: {item.proposal}</Text>
                    <GradientButton
                      title="View"
                      paddingVertical={6}
                      paddingHorizontal={22}
                      marginTop={0}
                      onPress={() =>
                        navigation.navigate("JobProfile", {
                          gid: item.request_slug,
                        })
                      }
                    />
                  </View>
                </View>
              ))}

              <LineDivider />
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
    backgroundColor: "#222222",
  },
  employeeContainer: {
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
    alignItems: "center",
  },
  avatar: {
    width: 90,
    height: 90,
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
    textAlign: "center",
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
    paddingTop: 18,
    gap: 10,
  },
  iconContainer: {
    position: "absolute",
    top: -20,
    zIndex: 10,
    width: 40,
    height: 40,
    left: 60,
    paddingBottom: 4.2,
    borderRadius: 22.5,
    backgroundColor: "#E7C1AF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3D3D3D",
  },
  card: {
    width: 160,
    paddingTop: 27,
    paddingBottom: 18,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ffffff1a",
  },

  title: {
    color: "#ffffff",
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
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff1a",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 4,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ffffff1a",
    borderRadius: 7,
    padding: 13,
    marginTop: 8,
    marginBottom: 12,
  },
  heading: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },
  desc: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
    color: "#bfbfbf",
    marginBottom: 10,
    lineHeight: 18,
  },
  row: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
  },
  label: {
    fontFamily: "Montserrat_500Medium",
    color: "#fff",
  },
  gridentbtn: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
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
