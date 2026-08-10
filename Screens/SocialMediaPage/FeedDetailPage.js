import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Share,
    Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import FeedPost from "./FeedComponent/FeedPost";
import useSocialEvents from "./FeedEvent/useSocialEvents";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeedAddCommentModal from "./FeedModals/FeedAddCommentModal";
import FeedInternalSharingModal from "./FeedModals/FeedInternalSharingModal";
import { API_URL } from "../../api/ApiUrl";
import FeedPostDropdownModal from "./FeedModals/FeedPostDropdownModal";
import FeedReportModal from "./FeedModals/FeedReportModal";

const FeedDetailPage = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const { feedId } = route.params;

    const [feed, setFeed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [internalShareModalVisible, setInternalShareModalVisible] = useState(false);
    const [selectedFeedId, setSelectedFeedId] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);

    const fetchFeeds = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/get-feed-detail/${feedId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await res.json();
            setFeed(data.feed || []);
        } catch (err) {
            console.log(" Feed fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeds();
    }, [feedId]);

    const handleOpenComments = useCallback((feedId) => {
        setSelectedFeedId(feedId);
        setCommentModalVisible(true);
    }, []);

    const handleCloseComments = useCallback(() => {
        setCommentModalVisible(false);
        setSelectedFeedId(null);
    }, []);

    const handleOpenInternalShare = useCallback((feedId) => {
        setSelectedFeedId(feedId);
        setInternalShareModalVisible(true);
    }, []);

    const handleCloseInternalShare = useCallback(() => {
        setInternalShareModalVisible(false);
        setSelectedFeedId(null);
    }, []);

    const handleOpenDropdown = useCallback((feedId) => {
        setSelectedFeedId(feedId);
        setMenuVisible(true);
    }, []);

    const handleCloseDropdown = useCallback(() => {
        setMenuVisible(false);
        setSelectedFeedId(null);
    }, []);

    const handleOpenReportModal = useCallback((feedId) => {
        setSelectedFeedId(feedId);
        setReportVisible(true);
    }, []);

    const handleCloseReportModal = useCallback(() => {
        setReportVisible(false);
        setSelectedFeedId(null);
    }, []);

    const handleShare = useCallback(async (item) => {
        try {
            const caption = item?.message ? `${item.message}\n\n` : "";
            const author = item?.full_name || "Someone";

            await Share.share({
                message: `${author} shared a post on Djobzy \n\n${caption}${item.share_url}`,
                url: item.share_url,  // iOS
                title: "Check this post on Djobzy",
            });
        } catch (error) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Unable to share.", ToastAndroid.SHORT);
            } else {
                toastError("Unable to share.");
            }
        }
    }, []);

    // NEW — single post screen, feed is one object, not a list
    const handleToggleLike = useCallback((feedId, wasLiked) => {
        setFeed((prev) =>
            prev && prev.id === feedId
                ? {
                    ...prev,
                    is_liked_by_current_user: !wasLiked,
                    likes_count: Math.max(0, (prev.likes_count || 0) + (wasLiked ? -1 : 1)),
                }
                : prev
        );
    }, []);

    const handleProfileNavigation = useCallback(async (name, admin, closed, spam) => {
        if (name?.trim() && closed == 1 && spam == 1) {
            toastError("User data is unavailable at the moment.");
            return;
        }
        if (admin == 2) {
            navigation.navigate("PublicEmployerProfilePage", {
                name: name,
            });
        } else {
            navigation.navigate("PublicEmployeeProfilePage", {
                name: name || "",
            });
        }
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.container]}>
                <PageNameHeaderBar navigation={navigation} title="Post" />
                {loading ? (
                    <Loading />
                ) : notFound ? (
                    <View style={styles.centerState}>
                        <Ionicons name="alert-circle-outline" size={40} color="#666666" />
                        <Text style={styles.notFoundText}>Post not found or has been removed.</Text>
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={styles.scroll}
                        showsVerticalScrollIndicator={false}
                    >
                        <FeedPost
                            item={feed}
                            onOpenComments={handleOpenComments}
                            openInternalSharing={handleOpenInternalShare}
                            openExternalSharing={handleShare}
                            onOpenMenu={handleOpenDropdown}
                            openReportRequest={handleOpenReportModal}
                            onToggleLike={handleToggleLike}
                            navigateUserProfile={handleProfileNavigation}
                        />
                    </ScrollView>
                )}
            </View>

            <FeedAddCommentModal
                visible={commentModalVisible}
                onClose={handleCloseComments}
                feedId={selectedFeedId}
            />

            <FeedInternalSharingModal
                visible={internalShareModalVisible}
                onClose={handleCloseInternalShare}
                feedId={selectedFeedId}
            />
            <FeedPostDropdownModal
                visible={menuVisible}
                onClose={handleCloseDropdown}
                onReport={handleOpenReportModal}
                feedId={selectedFeedId}
            />

            <FeedReportModal
                visible={reportVisible}
                onClose={handleCloseReportModal}
                feedId={selectedFeedId}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "#222222",
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.08)",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Montserrat_600SemiBold",
        color: "#fff",
    },
    scroll: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 80,
    },
    centerState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingHorizontal: 30,
    },
    notFoundText: {
        textAlign: "center",
        color: "#9a9a9a",
        fontSize: 15,
        fontFamily: "Montserrat_400Regular",
        lineHeight: 22,
    },
});

export default FeedDetailPage;