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
    Animated, Share, Platform, ToastAndroid,
    StatusBar
} from "react-native";
import { ActiveMediaProvider, useActiveMedia } from "../Context/ActiveMediaContext";
import { FlashList } from "@shopify/flash-list";
import Loading from "../../../components/Loading";
import NoSocialFeed from "../FeedComponent/NoSocialFeed";
import FeedPost from "../FeedComponent/FeedPost";
import FeedAddCommentModal from "../FeedModals/FeedAddCommentModal";
import FeedInternalSharingModal from "../FeedModals/FeedInternalSharingModal";
import { toastError, toastSuccess } from "../../../utils/toast";
import { Ionicons } from "@expo/vector-icons";
import FeedPostDropdownModal from "../FeedModals/FeedPostDropdownModal";
import FeedReportModal from "../FeedModals/FeedReportModal";
import { API_URL } from "../../../api/ApiUrl";
import { useNotifications } from "../../../context/MessageNotificationContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../../../components/Footer";
import EmployerFooter from "../../../components/EmployerFooter";
import PageNameHeaderBar from "../../../components/PageNameHeaderBar";
import useSocialEvents from "../FeedEvent/useSocialEvents";
import FeedDeleteConfirmModal from "../FeedModals/FeedDeleteConfirmModal";

const VIEWABILITY_CONFIG = {
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 150,
};

function renderOwnFeedHeader(navigation, user, estimateCount) {
    return (
        <TouchableOpacity
            style={styles.createPostBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("CreateFeedPost", {
                name: user?.full_name,
                estimate_reach_count: estimateCount,
            })}
        >
            <Ionicons name="add-circle-outline" size={30} color="#C96B59" />
            <Text style={styles.createPostText}>Create a new post</Text>
        </TouchableOpacity>
    );
}

function OwnFeedScreenInner() {
    const navigation = useNavigation();
    const { user, admin } = useNotifications();
    const { setActiveId } = useActiveMedia();

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
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const { deleteOwnFeed } = useSocialEvents();

    const sessionRef = useRef(null);
    const nextOffsetRef = useRef(0);
    const hasMoreRef = useRef(true);
    const flashListRef = useRef(null);

    const fetchOwnFeeds = async (offset = 0, isLoadMore = false) => {
        try {
            if (!isLoadMore) {
                setFeedLoading(true);
            }
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(
                `${API_URL}/my-feed-post?offset=${offset}&limit=15`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            const data = await res.json();
            if (isLoadMore) {
                setFeeds((prev) => [...prev, ...(data.feeds || [])]);
            } else {
                setFeeds(data.feeds || []);
            }
            setEstimateCount(data.totalExpectedCount);
            nextOffsetRef.current = data.next_offset;
            hasMoreRef.current = data.has_more;
        } catch (err) {
            console.log("Feed fetch error:", err);
        } finally {
            setFeedLoading(false);
        }
    };

    useEffect(() => {
        fetchOwnFeeds();
    }, []);

    const onRefresh = async () => {
        setFeedRefreshing(true);
        nextOffsetRef.current = 0;
        hasMoreRef.current = true;
        await fetchOwnFeeds(0, false);
        setFeedRefreshing(false);
    };

    const loadMoreFeeds = useCallback(async () => {
        if (loadingMore) return;
        if (!hasMoreRef.current) return;
        setLoadingMore(true);
        try {
            await fetchOwnFeeds(nextOffsetRef.current, true);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore]);

    const handleHideFeed = useCallback((feedId) => {
        setHiddenFeedIds((prev) => new Set([...prev, feedId]));
    }, []);

    const renderFeedItem = useCallback(({ item }) => (
        <FeedPost
            item={item}
            onOpenComments={handleOpenComments}
            openInternalSharing={handleOpenInternalShare}
            openExternalSharing={handleShare}
            onOpenMenu={handleOpenDropdown}
            openReportRequest={handleOpenReportModal}
            isOwner={true}
        />
    ), [handleOpenComments, handleOpenInternalShare, handleShare, handleOpenDropdown, handleOpenReportModal]);

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

    const handleOpenDelete = useCallback((feedId) => {
        setMenuVisible(false);
        setSelectedFeedId(feedId);
        setDeleteVisible(true);
    }, []);

    const handleDeleteFeed = useCallback(async () => {
        setDeleteLoading(true);
        try {
            const res = await deleteOwnFeed(selectedFeedId);
            if (res?.status === 200) {
                setFeeds(prev => prev.filter(feed => feed.id !== selectedFeedId));
                setDeleteVisible(false);
                setSelectedFeedId(null);
                toastSuccess("Post deleted successfully");
            } else {
                console.warn("Share failed:", res?.message);
            }
        } catch (err) {
            console.warn("Share error:", err);
        } finally {
            setDeleteLoading(false);
        }
    }, [selectedFeedId]);

    const handleShare = useCallback(async (item) => {
        try {
            const caption = item?.message ? `${item.message}\n\n` : "";
            const author = item?.full_name || "Someone";

            await Share.share({
                message: `${author} shared a post on Djobzy \n\n${caption}${item.share_url}`,
                url: item.share_url,
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

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (!viewableItems.length) {
            setActiveId(null);
            return;
        }
        setActiveId(viewableItems[0].item.id);
    },
        [setActiveId]
    );

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
                    data={feeds}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={renderFeedItem}
                    estimatedItemSize={420}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    onEndReached={loadMoreFeeds}
                    onEndReachedThreshold={0.5}
                    scrollEventThrottle={16}
                    ListHeaderComponent={
                        hasFeeds ? () => renderOwnFeedHeader(navigation, user, estimateCount) : null
                    }
                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator
                                size="small"
                                color="#cc6952"
                                style={{ marginVertical: 16 }}
                            />
                        ) : null
                    }
                    ListEmptyComponent={
                        <View style={styles.noSocialFeed}>
                            <NoSocialFeed name={user?.full_name} navigation={navigation} estimateCount={estimateCount} />
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
                onDelete={handleOpenDelete}
                feedId={selectedFeedId}
                isOwner={true}
            />

            <FeedReportModal
                visible={reportVisible}
                onClose={handleCloseReportModal}
                feedId={selectedFeedId}
                onHide={handleHideFeed}
            />

            <FeedDeleteConfirmModal
                visible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
                onConfirm={handleDeleteFeed}
                loading={deleteLoading}
            />
        </>
    );
}

const OwnFeedScreen = () => {
    const { admin } = useNotifications();
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <PageNameHeaderBar title="My Posts" navigation={navigation} />
                <ActiveMediaProvider>
                    <OwnFeedScreenInner />
                </ActiveMediaProvider>
            </View>

            {admin === 2 ? <EmployerFooter /> : <Footer />}
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
    noSocialFeed: {
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    createPostBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#FFFFFF1a",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#c3c3c3",
    },
    createPostText: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: "Montserrat_500Medium",
        color: "#c3c3c3",
    },
});

export default OwnFeedScreen;