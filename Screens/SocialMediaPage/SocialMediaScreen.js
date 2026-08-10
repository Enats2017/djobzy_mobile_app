import React, { useEffect, useState, useRef, useCallback } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ActivityIndicator,
    Animated, Share, Platform, ToastAndroid
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import { ActiveMediaProvider, useActiveMedia } from "./Context/ActiveMediaContext";
import { FlashList } from "@shopify/flash-list";
import Loading from "../../components/Loading";
import { useNotifications } from "../../context/MessageNotificationContext";
import NoSocialFeed from "./FeedComponent/NoSocialFeed";
import FeedPost from "./FeedComponent/FeedPost";
import FeedAddCommentModal from "./FeedModals/FeedAddCommentModal";
import FeedInternalSharingModal from "./FeedModals/FeedInternalSharingModal";
import { toastError } from "../../utils/toast";
import { Ionicons } from "@expo/vector-icons";
import FeedPostDropdownModal from "./FeedModals/FeedPostDropdownModal";
import FeedReportModal from "./FeedModals/FeedReportModal";
import { feedEvents } from "./FeedEvent/feedEvents";
import useMarkFeedSeen from "./FeedEvent/useMarkFeedSeen";

function renderFeedHeader(navigation, estimateCount) {
    const navigateToCreate = () =>
        navigation.navigate("CreateFeedPost", {
            estimate_reach_count: estimateCount,
        });

    return (
        <View style={styles.postcontainer}>
            <TouchableOpacity
                style={styles.postBox}
                onPress={navigateToCreate}
                activeOpacity={0.8}
            >
                <View style={styles.feed}>
                    <Text style={styles.textfeed}>Create Feed/Post</Text>
                </View>

                <View style={styles.input}>
                    <Text style={styles.inputPlaceholder}>Type about your post</Text>
                </View>

                <View style={styles.buttonRow}>
                    <View style={styles.button}>
                        <Image source={require("../../assets/images/img.png")} style={styles.logo} contentFit="contain" />
                        <Text style={styles.buttonText}>Image</Text>
                    </View>
                    <View style={styles.button}>
                        <Image source={require("../../assets/images/vedio.png")} style={styles.logo} contentFit="contain" />
                        <Text style={styles.buttonText}>Video</Text>
                    </View>
                    {/* <View style={styles.button}>
                        <Image source={require("../../assets/images/ai.png")} style={styles.logo} contentFit="contain" />
                        <Text style={styles.buttonText}>Generate AI {"\n"} Video</Text>
                    </View> */}
                </View>
            </TouchableOpacity>
        </View>
    );
}
const VIEWABILITY_CONFIG = {
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 150,
};

function SocialMediaScreenInner() {
    const navigation = useNavigation();
    const { user } = useNotifications();
    const { setActiveId } = useActiveMedia();
    const { markSeen } = useMarkFeedSeen();

    const [feedLoading, setFeedLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [feeds, setFeeds] = useState([]);
    const [feedRefreshing, setFeedRefreshing] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [internalShareModalVisible, setInternalShareModalVisible] = useState(false);
    const [selectedFeedId, setSelectedFeedId] = useState(null);
    const [estimateCount, setEstimateCount] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);
    const [hiddenFeedIds, setHiddenFeedIds] = useState(new Set());

    const sessionRef = useRef(null);
    const nextOffsetRef = useRef(0);
    const hasMoreRef = useRef(true);
    const flashListRef = useRef(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [showScrollTop, setShowScrollTop] = useState(false);

    const handleRefreshAndScrollTop = useCallback(async () => {
        flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
        setTimeout(async () => {
            setFeedRefreshing(true);
            hasMoreRef.current = true;
            nextOffsetRef.current = 0;
            sessionRef.current = null;
            await fetchFeeds();
            setFeedRefreshing(false);
        }, 500);
    }, []);

    const fetchFeeds = async () => {
        try {
            setFeedLoading(true);
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/social-feed?limit=20`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await res.json();
            setFeeds(data.feeds || []);
            setEstimateCount(data.totalExpectedCount);
            sessionRef.current = data.session;
            nextOffsetRef.current = data.next_offset;
            hasMoreRef.current = data.has_more;
        } catch (err) {
            console.log(" Feed fetch error:", err);
        } finally {
            setFeedLoading(false);
        }
    };

    const fetchMoreFeeds = async () => {
        if (loadingMore) {
            return;
        }

        if (!hasMoreRef.current) {
            return;
        }

        if (!sessionRef.current) {
            return;
        }

        try {
            setLoadingMore(true);
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/social-feed-load-more`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    session: sessionRef.current,
                    offset: nextOffsetRef.current,
                    limit: 20,
                }),
            });

            if (res.status === 410) {
                hasMoreRef.current = false;
                await fetchFeeds();
                return;
            }

            const data = await res.json();
            setFeeds((prev) => [...prev, ...(data.feeds || [])]);
            nextOffsetRef.current = data.next_offset;
            hasMoreRef.current = data.has_more;
        } catch (err) {
            console.log(" Feed load-more error:", err);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const unsubscribe = feedEvents.on("feedCreated", (newFeed) => {
            setFeeds((prev) => [newFeed, ...prev]);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = feedEvents.on("commentAdded", ({ feedId }) => {
            setFeeds((prev) =>
                prev.map((feed) =>
                    feed.id === feedId
                        ? { ...feed, comment_count: (feed.comment_count || 0) + 1 }
                        : feed
                )
            );
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        fetchFeeds();
    }, []);

    const onRefresh = async () => {
        setFeedRefreshing(true);
        hasMoreRef.current = true;
        nextOffsetRef.current = 0;
        sessionRef.current = null;
        await fetchFeeds();
        setFeedRefreshing(false);
    };

    const handleHideFeed = useCallback((feedId) => {
        setHiddenFeedIds((prev) => new Set([...prev, feedId]));
    }, []);

    // NEW — updates the single source of truth (feeds) so FlashList recycling can't go stale
    const handleToggleLike = useCallback((feedId, wasLiked) => {
        setFeeds((prev) =>
            prev.map((feed) =>
                feed.id === feedId
                    ? {
                        ...feed,
                        is_liked_by_current_user: !wasLiked,
                        likes_count: Math.max(0, (feed.likes_count || 0) + (wasLiked ? -1 : 1)),
                    }
                    : feed
            )
        );
    }, []);

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

    // Declared AFTER every handler it depends on. It used to sit above them, which
    // meant the dependency array read those `const`s before initialisation — the
    // deps silently resolved to `undefined`, and it was one Babel target change
    // away from throwing. Now the deps are the real (stable) callbacks, so this
    // stays referentially identical and React.memo on FeedPost actually bites.
    const renderFeedItem = useCallback(({ item }) => (
        <FeedPost
            item={item}
            onOpenComments={handleOpenComments}
            openInternalSharing={handleOpenInternalShare}
            openExternalSharing={handleShare}
            onOpenMenu={handleOpenDropdown}
            openReportRequest={handleOpenReportModal}
            onToggleLike={handleToggleLike}
            navigateUserProfile={handleProfileNavigation}
        />
    ), [handleOpenComments, handleOpenInternalShare, handleShare, handleOpenDropdown, handleOpenReportModal, handleToggleLike, handleProfileNavigation]);

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (!viewableItems.length) {
            setActiveId(null);
            return;
        }
        const topItem = viewableItems[0].item;
        setActiveId(topItem.id);
        markSeen(topItem.id);
    }, [setActiveId, markSeen]);

    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig: VIEWABILITY_CONFIG, onViewableItemsChanged },]);

    if (feedLoading) {
        return <Loading />;
    }

    const hasFeeds = feeds?.length > 0;
    return (
        <>
            <View style={{ flex: 1 }}>
                <FlashList
                    ref={flashListRef}
                    data={feeds.filter((f) => !hiddenFeedIds.has(f?.id))}
                    keyExtractor={(item) => item?.id?.toString()}
                    renderItem={renderFeedItem}
                    estimatedItemSize={420}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    onEndReached={fetchMoreFeeds}
                    onEndReachedThreshold={0.5}
                    onScroll={(e) => {
                        const y = e.nativeEvent.contentOffset.y;
                        setShowScrollTop(y > 600);
                    }}
                    scrollEventThrottle={16}
                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator
                                size="small"
                                color="#cc6952"
                                style={{ marginVertical: 16 }}
                            />
                        ) : null
                    }
                    ListHeaderComponent={
                        hasFeeds ? () => renderFeedHeader(navigation, estimateCount) : null
                    }
                    ListEmptyComponent={
                        <View style={styles.noSocialFeed}>
                            <NoSocialFeed navigation={navigation} estimateCount={estimateCount} />
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    refreshing={feedRefreshing}
                    onRefresh={onRefresh}
                    contentContainerStyle={{
                        paddingBottom: 80,
                        flexGrow: 1,
                    }}
                />

                {showScrollTop && (
                    <TouchableOpacity
                        style={styles.scrollTopPill}
                        onPress={handleRefreshAndScrollTop}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="arrow-up" size={14} color="#fff" />
                        <Text style={styles.scrollTopText}>Refresh</Text>
                    </TouchableOpacity>
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
                onHide={handleHideFeed}
            />
        </>
    );
}

const SocialMediaScreen = () => {
    return (
        <ActiveMediaProvider>
            <SocialMediaScreenInner />
        </ActiveMediaProvider>
    );
};

const styles = StyleSheet.create({
    postcontainer: {
        backgroundColor: "#FFFFFF1a",
        marginTop: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    postBox: {
        padding: 7,
    },
    input: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 16,
        borderRadius: 10,
        borderWidth: 1,
        color: "#FFFFFF",
        borderColor: "#FFFFFF33",
        padding: 15,
        marginHorizontal: 10,
        marginBottom: 10,
    },
    logo: {
        height: 21,
        width: 21,
        marginRight: 7,
    },
    buttonRow: {
        flexDirection: "row",
        // justifyContent: "space-between",
        gap: 30,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    buttonText: {
        fontFamily: "Montserrat_500Medium",
        fontSize: 14,
        color: "#c3c3c3c3",
    },
    feed: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 11,
        paddingHorizontal: 10,
    },
    anylog: {
        flexDirection: "row",
        gap: 3,
    },
    textfeed: {
        fontSize: 22,
        fontFamily: "Montserrat_600SemiBold",
        color: "#fff",
    },
    noSocialFeed: {
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    scrollTopPill: {
        position: "absolute",
        top: 14,
        alignSelf: "center",
        left: "50%",
        transform: [{ translateX: -50 }],
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#cc6952",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 10,
    },
    scrollTopText: {
        color: "#fff",
        fontSize: 13,
        fontFamily: "Montserrat_600SemiBold",
    },
    inputPlaceholder: {
        color: "#fff",
        fontFamily: "Montserrat_400Regular",
        fontSize: 16,
    },
});

export default SocialMediaScreen;