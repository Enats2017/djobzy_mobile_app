import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
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

export default function EmployerProfilePage({ route }) {
  const navigation = useNavigation();
  const { name } = route?.params ?? {};

  const [isEmployer, setIsEmployer] = useState(false);
  const [profile, setProfile] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobCount, setJobCount] = useState(0);
  const [moneyEarned, setMoneyEarned] = useState(0);
  const [isFollowed, setIsFollowed] = useState(false);

  const fetchEmployeeProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/employer-profile/${name}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        setProfile(data.profile);

        setJobCount(data.job_count ?? 0);
        setMoneyEarned(data.total_price ?? 0);
        setGigs(data.gigs || []);
        setCategories(data.subcategories || []);
        setAttachments(data.user_attachments || []);
      }
    } catch (e) {
      console.log("ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name) fetchEmployeeProfile();
  }, [name]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.employeeContainer}>
        <PageNameHeaderBar
          navigation={navigation}
          title={profile?.full_name || profile?.name || "Profile"}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.cardBox}>
            <View style={styles.profileRow}>
              <Image
                style={styles.avatar}
                source={{
                  uri: profile?.photo
                    ? profile.photo
                    : "https://dummyimage.com/150x150/ccc/fff.png&text=No+Photo",
                }}
              />

              <View style={styles.profileTextContent}>
                <Text style={styles.profileName}>
                  {profile?.full_name || profile?.name || "No Name"}
                </Text>

                <View style={styles.verificationRow}>
                  <View style={styles.iconTextRow}>
                    <MaterialIcons name="verified" size={18} color="#c3c3c3" />
                    <Text style={styles.verificationText}>
                      Verification Level: {profile?.verification_count || 0}/7
                    </Text>
                  </View>

                  <View style={styles.iconTextRow}>
                    <FontAwesome6
                      name="location-dot"
                      size={18}
                      color="#c3c3c3"
                    />
                    <Text style={styles.locationText}>
                      {profile?.address ?? "Unknown"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.horizontalDivider} />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                Switch to {profile?.full_name || "User"}'s Employer Profile
              </Text>

              <TouchableOpacity onPress={() => setIsEmployer(!isEmployer)}>
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
              <TouchableOpacity
                style={[styles.btnFollow, isFollowed && styles.btnUnfollow]}
                onPress={() => setIsFollowed(!isFollowed)}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  style={[
                    styles.btnFollowText,
                    isFollowed && styles.btnUnfollowText,
                  ]}
                >
                  {isFollowed ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnHire}
                onPress={() => navigation.navigate("ViewHirePage")}
              >
                <Text style={styles.btnHireText}>Hire</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnChat}>
                <Text style={styles.btnChatText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statsBox}>
              <Text style={styles.statsLabel}>Number of jobs</Text>
              <Text style={styles.statsNumber}>{jobCount}</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statsBox}>
              <Text style={styles.statsLabel}>Money Earn</Text>
              <Text style={styles.statsNumber}>
                {profile?.total_price ?? 0} CAD
              </Text>
            </View>
          </View>

          <View style={styles.infoOuterContainer}>
            <View style={styles.infoSection}>
              <Text style={styles.sectionLabel}>Profile Title</Text>

              <Text style={styles.profileTitleText}>
                {profile?.profile_title_employee ||
                  profile?.profile_title_employer ||
                  "No Title Added"}
              </Text>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.infoSection}>
              <Text style={styles.sectionLabel}>About Me</Text>

              <Text style={styles.aboutMeText}>
                {profile?.about ??
                  profile?.employer_about ??
                  "No about info available."}
              </Text>
            </View>
            <View style={styles.dividerLine} />
          </View>
          <FeedPost />
          <View style={styles.promote}>
            <Text style={styles.sectionLabel}>My Promoted Services</Text>
            <TouchableOpacity style={styles.plusbtn}>
              <AntDesign name="plus" size={18} color="#030303" />
              <Text style={styles.plustext}>Promote Services</Text>
            </TouchableOpacity>
            <View style={styles.wrapper}>
              <View style={styles.iconContainer}>
                <Ionicons name="logo-android" size={28} color="#000" />
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>
                  I can create mobile application
                </Text>
                <Text style={styles.price}>50.00 CAD</Text>
                <Text style={styles.perHour}>/hour</Text>
                <GradientButton
                  title="View"
                  fontSize={15}
                  paddingVertical={10}
                  paddingHorizontal={35}
                />
              </View>
              <View style={styles.iconContainer}>
                <Ionicons name="logo-android" size={28} color="#000" />
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>
                  I can create mobile application
                </Text>
                <Text style={styles.price}>50.00 CAD</Text>
                <Text style={styles.perHour}>/hour</Text>
                <GradientButton
                  title="View"
                  fontSize={15}
                  paddingVertical={10}
                  paddingHorizontal={35}
                />
              </View>
            </View>
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
              <Text style={styles.sectionLabel}>Work History And Reviews</Text>
              <Text style={styles.profileTitleText}>.........</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <Footer />
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
    marginBottom: 28,
  },
  plustext: {
    color: "#030303",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily:"Montserrat_600SemiBold",
    marginTop: 6,
  },

  perHour: {
    color: "#30D354",
    fontSize: 12,
    fontFamily:"Montserrat_400Regular",
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
});
