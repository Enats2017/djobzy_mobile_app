import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import SearchBar from "../../components/SearchBar";
import { Header } from "@react-navigation/stack";
import LineDivider from "../../components/LineDivider";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialIcons,
  Octicons,
  Entypo,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Footer from "../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { API_URL, API_ICON } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";

const Followers = () => {
  const route = useRoute();
  const initialTab = route.params?.activeTab || "following";
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigation = useNavigation();
  const [followingData, setFollowingData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState(null);

  const [count, setCount] = useState([]);
  const [user, setUser] = useState();

  const renderStars = (rating) => {
    if (!rating || rating <= 0) return "⭐";
    return "⭐".repeat(Math.round(rating));
  };

  const fetchFollowersAndFollowing = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const followingRes = await fetch(`${API_URL}/followings`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const followingJson = await followingRes.json();
      const followersRes = await fetch(`${API_URL}/followers`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const followersJson = await followersRes.json();
      if (followingJson.status === 200) {
        setCount(followersJson);
        setFollowingData(followingJson.liked_users);
        setProfile(followingJson.profile);
      }
      if (followersJson.status === 200) {
        setFollowersData(followersJson.followers);
      }
    } catch (error) {
      console.log("Followers API error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFollowersAndFollowing();
  }, []);

  const handleFollow = async (userId) => {
    setLoadingUserId(userId);
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/followUser`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json();
      console.log(data);

      if (data.status === 200) {
        setFollowingData((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, is_followed_by_auth_user: true } : u
          )
        );

        setFollowersData((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, is_followed_by_auth_user: true } : u
          )
        );
      }
    } catch (err) {
      console.log("Follow error:", err);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleUnfollow = async (userId) => {
    console.log(userId);
    setLoadingUserId(userId);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/unfollowUser`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json();
      console.log(data);
      if (data.status === 200) {
        setFollowingData((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, is_followed_by_auth_user: false } : u
          )
        );
        setFollowersData((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, is_followed_by_auth_user: false } : u
          )
        );
      }
    } catch (err) {
      console.log("Unfollow error:", err);
    } finally {
      setLoadingUserId(null);
    }
  };

  const currentList = activeTab === "following" ? followingData : followersData;

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={{
              uri: item.profile_image
                ? item.profile_image
                : "https://via.placeholder.com/150",
            }}
            style={styles.imglogo}
          />
          <View style={styles.ratingsection}>
            <View style={styles.ratingrow}>
              <Text style={styles.followname}>{item.full_name}</Text>
              <Text style={styles.rating}>{renderStars(item.rating)}</Text>
            </View>
            <View style={styles.iconbox}>
              <MaterialIcons name="verified" size={18} color="#34A853" />
              <Text style={styles.infoText}>{item.verification_count}</Text>
            </View>
          </View>
        </View>
        {activeTab === "following" ? (
          item.is_followed_by_auth_user ? (
            <TouchableOpacity
              style={styles.followBtn}
              onPress={() => handleFollow(item.user_id)}
            >
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.unfollowBtn}
              onPress={() => handleUnfollow(item.user_id)}
            >
              <Text style={styles.unfollowText}>Unfollow</Text>
            </TouchableOpacity>
          )
        ) : item.is_followed_by_auth_user ? (
          <TouchableOpacity
            style={styles.followingBtn}
            onPress={() => handleUnfollow(item.id)}
            disabled={loadingUserId === item.id}
          >
            {loadingUserId === item.id ? (
              <ActivityIndicator color="#272626ff" size="small" />
            ) : (
              <Text style={styles.followingText}>Following</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.followBtn}
            onPress={() => handleFollow(item.id)}
            disabled={loadingUserId === item.id}
          >
            {loadingUserId === item.id ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.followText}>Follow Back</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.Header}>
            <PageNameHeaderBar navigation={navigation} paddingTop={27} />
            <SearchBar
              placeholder={
                activeTab == "follower" ? "My Followers" : "My Following"
              }
              showFilter={false}
              showDots={false}
            />
          </View>
          {loading ? (
            <Loading />
          ) : (
            <>
              <View style={styles.profileCard}>
                <View style={styles.profileinfo}>
                  <View style={styles.profileRow}>
                    <Image
                      source={{
                        uri: "https://randomuser.me/api/portraits/women/44.jpg",
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.profileInfoRow}>
                      <Text style={styles.name}>{profile?.full_name}</Text>

                      <View style={styles.iconbox}>
                        <Octicons
                          name="clock-fill"
                          size={12}
                          color="#c3c3c3c3"
                        />
                        <Text style={styles.infoText}>GMT+05:30</Text>
                      </View>
                      <View style={styles.iconbox}>
                        <MaterialIcons
                          name="verified"
                          size={14}
                          color="#c3c3c3c3"
                        />
                        <Text style={styles.infoText}>
                          Verification Level: {profile.verification_count}/7
                        </Text>
                      </View>
                      <View style={styles.iconbox}>
                        <Entypo
                          name="location-pin"
                          size={14}
                          color="#c3c3c3c3"
                        />
                        <Text style={styles.infoText}>Mumbai, Maharshtra</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <LineDivider />
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>2</Text>
                      <Text style={styles.statLabel}>Number of Jobs</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>12</Text>
                      <Text style={styles.statLabel}>Money Earned</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>12</Text>
                      <Text style={styles.statLabel}>My Followers</Text>
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View style={styles.tabWrapper}>
                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    activeTab === "following" && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab("following")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "following" && styles.activeText,
                    ]}
                  >
                    Following
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    activeTab === "follower" && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab("follower")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "follower" && styles.activeText,
                    ]}
                  >
                    Followers
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={currentList}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <LineDivider />}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
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
  Header: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,
    width: "85%",
  },
  profileCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  profileRow: {
    flexDirection: "row",
    gap: 10,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    width: "95%",
    fontFamily: "Montserrat_500Medium",
    marginBottom: 7,
  },
  followname: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
  },
  iconbox: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 2,
  },
  infoText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  ratingrow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },
  statBox: {
    backgroundColor: "#C97863",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Montserrat_700Bold",
  },
  statLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginTop: 2,
  },
  tabWrapper: {
    flexDirection: "row",
    borderRadius: 8,
    borderColor: "#fff",
    borderWidth: 0.7,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9.5,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#34A853",
    borderRadius: 5,
    outlineColor: "#34A853",
    outlineWidth: 5.8,
  },
  tabText: {
    color: "#aaa",
    fontSize: 15,
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  imglogo: {
    width: 52,
    height: 52,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },

  rating: {
    color: "#d9d9d9",
    fontSize: 13,
    marginTop: 4,
  },
  unfollowBtn: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 6,
  },
  unfollowText: {
    color: "#fff",
    fontWeight: "600",
  },
  followBtn: {
    backgroundColor: "#CB7767",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 6,
  },
  followingBtn: {
    backgroundColor: "#F5F6F7",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 6,
  },
  followText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 12,
  },
  followingText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 12,
    color: "#303030",
  },
});

export default Followers;
