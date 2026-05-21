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
import LineDivider from "../../components/LineDivider";
import {
    MaterialIcons,
    Octicons,
    FontAwesome,
    Entypo,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Footer from "../../components/Footer";
import EmployerFooter from "../../components/EmployerFooter";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import FollowerProfileHeader from "./FollowerProfileHeader";
import { useNotifications } from "../../context/MessageNotificationContext";
import NoContract from "../../components/NoContract";
import { toastError, toastSuccess } from "../../utils/toast";

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
    const [searchText, setSearchText] = useState("");
    const { admin } = useNotifications();
    const [count, setCount] = useState([]);
    const [unfollowedIds, setUnfollowedIds] = useState(new Set());

    const fetchConnections = async (tab) => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_URL}/user-connections?type=${tab}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.status === 200) {
                setProfile(data.profile);
                setCount(data);
                if (tab === "following") {
                    setFollowingData(data.liked_users);
                } else {
                    setFollowersData(data.liked_users);
                }
            }
        } catch (error) {
            console.log("Followers API error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConnections(initialTab);
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setUnfollowedIds(new Set());
        fetchConnections(tab);
    };

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
            if (data.status === 200) {
                if (activeTab === "following") {
                    setUnfollowedIds((prev) => {
                        const next = new Set(prev);
                        next.delete(userId);
                        return next;
                    });
                } else {
                    setFollowersData((prev) =>
                        prev.map((u) =>
                            u.id === userId ? { ...u, is_followed_by_auth_user: true } : u,
                        ),
                    );
                }
                toastSuccess(data.message || `Successfully followed ${data.full_name}`)
            } else {
                toastError(data.message || "Something went wrong while following the user");
            }
        } catch (err) {
            console.log("Follow error:", err);
        } finally {
            setLoadingUserId(null);
        }
    };

    const handleUnfollow = async (userId) => {
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
            if (data.status === 200) {
                if (activeTab === "following") {
                    setUnfollowedIds((prev) => new Set(prev).add(userId));
                } else {
                    setFollowersData((prev) =>
                        prev.map((u) =>
                            u.id === userId ? { ...u, is_followed_by_auth_user: false } : u,
                        ),
                    );
                }
                toastSuccess(data.message || `Successfully unfollowed ${data.full_name}`)
            } else {
                toastError(data.message || "Something went wrong while unfollowing the user");
            }
        } catch (err) {
            console.log("Unfollow error:", err);
        } finally {
            setLoadingUserId(null);
        }
    };

    const currentList = activeTab === "following" ? followingData : followersData;

    const filteredList = currentList.filter((item) =>
        item?.full_name?.toLowerCase().includes(searchText.toLowerCase()),
    );

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
                            <Text style={styles.followname} ellipsizeMode="tail">
                                {item.full_name}
                            </Text>
                        </View>
                        <View style={styles.starRow}>
                            <View style={styles.starsInline}>
                                <FontAwesome name="star" size={16} color="#FFC107" />
                                <Text style={styles.rating}>{item.rating}</Text>
                            </View>
                            <View style={styles.verificationInline}>
                                <MaterialIcons name="verified" size={18} color="#34A853" />
                                <Text style={styles.rating}>{item.verification_count}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {activeTab === "following" ? (
                    unfollowedIds.has(item.user_id) ? (
                        <TouchableOpacity
                            style={styles.followBtn}
                            onPress={() => handleFollow(item.user_id)}
                            disabled={loadingUserId === item.user_id}
                        >
                            {loadingUserId === item.user_id ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.followText}>Follow</Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.unfollowBtn}
                            onPress={() => handleUnfollow(item.user_id)}
                            disabled={loadingUserId === item.user_id}
                        >
                            {loadingUserId === item.user_id ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.unfollowText}>Unfollow</Text>
                            )}
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
                            editable={true}
                            showDots={false}
                            value={searchText}
                            onChangeText={(text) => setSearchText(text)}
                        />
                    </View>
                    <View style={styles.tabWrapper}>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === "following" && styles.activeTab]}
                            onPress={() => handleTabChange("following")}
                        >
                            <Text style={[styles.tabText, activeTab === "following" && styles.activeText]}>
                                Following
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === "follower" && styles.activeTab]}
                            onPress={() => handleTabChange("follower")}
                        >
                            <Text style={[styles.tabText, activeTab === "follower" && styles.activeText]}>
                                Followers
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            {/* <FollowerProfileHeader profile={profile} count={count} /> */}
                            <FlatList
                                data={searchText ? filteredList : currentList}
                                keyExtractor={(item) => item.id?.toString()}
                                renderItem={renderItem}
                                ItemSeparatorComponent={() => <LineDivider />}
                                contentContainerStyle={{ paddingBottom: 100 }}
                                showsVerticalScrollIndicator={false}
                                ListEmptyComponent={
                                    !loading && (
                                        <NoContract
                                            icon=""
                                            title={
                                                activeTab === "following"
                                                    ? "No following found"
                                                    : "No followers found"
                                            }
                                            description={
                                                activeTab === "following"
                                                    ? "You are not following anyone yet"
                                                    : "You don't have any followers yet"
                                            }
                                        />
                                    )
                                }
                            />
                        </>
                    )}
                </View>
                {admin == 2 ? <EmployerFooter /> : <Footer />}
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
        width: "85%",
    },
    profileCard: {
        backgroundColor: "#ffffff1a",
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    profileinfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileRow: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    profileInfoRow: {
        flex: 1,
        gap: 3,
    },
    userNameSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 2,
    },
    name: {
        color: "#fff",
        fontSize: 18,
        flexShrink: 1,
        maxWidth: "90%",
        fontFamily: "Montserrat_500Medium",
        marginBottom: 7,
    },
    followname: {
        color: "#fff",
        fontSize: 15,
        maxWidth: "100%",
        fontFamily: "Montserrat_500Medium",
    },
    iconbox: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 6,
    },
    infoText: {
        color: "#c3c3c3c3",
        fontSize: 14,
        fontFamily: "Montserrat_400Regular",
    },
    statsRow: {
        flexDirection: "row",
        gap: 10,
    },
    ratingsection: {
        flex: 1,
        gap: 2,
    },
    ratingrow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        maxWidth: "100%",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
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
        fontFamily: "Montserrat_600SemiBold",
    },
    activeText: {
        color: "#fff",
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 5,
    },
    imglogo: {
        width: 50,
        height: 50,
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
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        lineHeight: 19,
    },
    unfollowBtn: {
        backgroundColor: "#e74c3c",
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 6,
    },
    unfollowText: {
        color: "#fff",
        fontFamily: "Montserrat_700Bold",
        fontSize: 12,
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
    starRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    starsInline: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
    },

    verificationInline: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
    },
});

export default Followers;