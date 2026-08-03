import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommentItem from "../FeedComponent/CommentItem";
import CommentInput from "../FeedComponent/CommentInput";
import useSocialEvents from "../FeedEvent/useSocialEvents";
import CommentSkeleton from "../FeedComponent/CommentSkeleton";
import { toastError } from "../../../utils/toast";
import ModalKeyboardContainer from "../../../components/ModalKeyboardContainer";
import { feedEvents } from "../FeedEvent/feedEvents";


export default function FeedCommentsModal({ visible, onClose, feedId }) {
    const insets = useSafeAreaInsets();
    const { fetchComments, addComment, likeComment, unlikeComment } = useSocialEvents();
    const [comments, setComments] = useState([]);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sending, setSending] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const flashListRef = useRef(null);

    const nextOffsetRef = useRef(0);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        if (!visible || !feedId) return;

        setComments([]);
        setHasMore(false);
        nextOffsetRef.current = 0;
        setLoading(true);

        fetchComments(feedId, 0)
            .then((data) => {
                if (data.status === 200) {
                    setComments(data.comments || []);
                    nextOffsetRef.current = data.next_offset;
                    setHasMore(data.has_more);
                }
            })
            .catch((err) => console.log("Comments fetch error:", err))
            .finally(() => setLoading(false));
    }, [visible, feedId]);

    const fetchMoreComments = useCallback(async () => {
        if (isFetchingRef.current || !hasMore) return;
        isFetchingRef.current = true;
        setLoadingMore(true);

        try {
            const data = await fetchComments(feedId, nextOffsetRef.current);
            if (data.status === 200) {
                setComments((prev) => [...prev, ...(data.comments || [])]);
                nextOffsetRef.current = data.next_offset;
                setHasMore(data.has_more);
            }
        } catch (err) {
            console.log("Load more error:", err);
        } finally {
            setLoadingMore(false);
            isFetchingRef.current = false;
        }
    }, [feedId, hasMore]);

    const handleSend = useCallback(async () => {
        const text = draft.trim();
        if (!text || sending) return;

        setSending(true);
        setDraft("");

        try {
            const data = await addComment(feedId, text);
            if (data.status === 200 || data.status === 201) {
                setComments((prev) => [data.comment, ...prev]);
                setTimeout(() => {
                    flashListRef.current?.scrollToIndex({
                        index: 0,
                        animated: true,
                    });
                }, 200);
                feedEvents.emit("commentAdded", { feedId });
            } else if (data.status === 429) {
                setDraft(text);
                handleClose();
                toastError(data.message || 'You have reached the comment limit for this post.');
            } else {
                setDraft(text);
                toastError(data.message || 'Failed to add comment.');
            }
        } catch (err) {
            console.log("Add comment error:", err);
        } finally {
            setSending(false);
        }
    }, [draft, feedId, sending]);

    const handleClose = useCallback(() => {
        setDraft("");
        onClose();
    }, [onClose]);

    const handleCommentLike = useCallback(async (commentId, type) => {
        setComments((prev) =>
            prev.map((comment) =>
                comment.id === commentId
                    ? {
                        ...comment, is_comment_liked_by_current_user: type === 0,
                        total_likes: (comment.total_likes || 0) + (type === 0 ? 1 : -1),
                    } : comment
            )
        );

        try {
            if (type === 0) {
                await likeComment(commentId);
            } else {
                await unlikeComment(commentId);
            }
        } catch (err) {
            console.log("Comment like error:", err);
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId
                        ? {
                            ...comment, is_comment_liked_by_current_user: type !== 0,
                            total_likes: (comment.total_likes || 0) + (type === 0 ? -1 : 1),
                        } : comment
                )
            );
        }
    }, [likeComment, unlikeComment]);

    const renderItem = useCallback(({ item }) => <CommentItem comment={item} onLike={handleCommentLike} />,
        [handleCommentLike]
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <ModalKeyboardContainer>
                <View style={styles.overlay}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
                    <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                                <Ionicons name="chevron-back" size={26} color="#303030" />
                            </TouchableOpacity>
                            <Text style={styles.title}>Comments</Text>
                        </View>

                        <View style={[styles.listWrap]}>
                            {loading ? (
                                <CommentSkeleton count={4} />
                            ) : (
                                <FlashList
                                    ref={flashListRef}
                                    data={comments}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => String(item.id)}
                                    onEndReached={fetchMoreComments}
                                    showsVerticalScrollIndicator={false}
                                    onEndReachedThreshold={0.4}
                                    keyboardShouldPersistTaps="handled"
                                    ListFooterComponent={
                                        loadingMore ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="#cc6952"
                                                style={{ marginVertical: 12 }}
                                            />
                                        ) : null
                                    }
                                    ListEmptyComponent={
                                        <Text style={styles.emptyText}>
                                            No comments yet — be the first to say something.
                                        </Text>
                                    }
                                />
                            )}
                        </View>

                        <View style={styles.inputRow}>
                            <CommentInput
                                value={draft}
                                onChangeText={setDraft}
                                onSend={handleSend}
                                sending={sending}
                            />
                        </View>
                    </View>
                </View>
            </ModalKeyboardContainer>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
        maxHeight: "70%",
        paddingHorizontal: 18,
        paddingTop: 14,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ecedef",
        width: 40,
        height: 40,
        borderRadius: 100,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Montserrat_600SemiBold',
        lineHeight: 48,
        color: "#303030",
    },
    listWrap: {
        flex: 1,
    },
    inputRow: {
        paddingTop: 10,
    },
    loadingMoreText: {
        textAlign: "center",
        color: "#303030",
        fontSize: 14,
        paddingVertical: 12,
        fontFamily: "Montserrat_400Regular",
    },
    emptyText: {
        textAlign: "center",
        color: "#303030",
        fontSize: 14,
        paddingVertical: 30,
        fontFamily: "Montserrat_500Medium",
    },
});