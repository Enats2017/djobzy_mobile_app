import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../api/ApiUrl";

export default function useSocialEvents() {
    const makeRequest = async (endpoint, body) => {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        return response.json();
    };

    const likeFeed = async (feedId) => {
        return makeRequest("/add-feed-to-fav", {
            id: feedId,
        });
    };

    const unlikeFeed = async (feedId) => {
        return makeRequest("/remove-feed-from-fav", {
            id: feedId,
        });
    };

    const fetchComments = async (feedId, offset = 0, limit = 10) => {
        return makeRequest("/show-feed-comments", {
            id: feedId,
            offset,
            limit,
        });
    };

    const addComment = async (feedId, comment) => {
        return makeRequest("/add-feed-comment", {
            post_id: feedId,
            comment,
        });
    };

    const likeComment = async (commentId) => {
        return makeRequest("/like-feed-comment", {
            id: commentId,
        });
    };

    const unlikeComment = async (commentId) => {
        return makeRequest("/unlike-feed-comment", {
            id: commentId,
        });
    };

    const shareInternalList = async () => {
        return makeRequest("/feed-share-internal-modal", {});
    };

    const addInternalPostSharing = async (feedId, data) => {
        return makeRequest("/add-internal-post-sharing", {
            feedId: feedId,
            userIds: data.user_ids,
            optional_message: data.message,
        });
    };

    const reportFeed = async (feedId, subject, message = "") => {
        return makeRequest("/feed-report", {
            feed_id: feedId,
            subject,
            message,
        });
    };

    const filterUsersByKeyword = async (keyword) => {
        return makeRequest("/filter-users-by-keyword", { keyword });
    };

    const deleteOwnFeed = async (feedId) => {
        return makeRequest("/delete-my-feed", {
            id: feedId,
        });
    };

    return {
        likeFeed,
        unlikeFeed,
        fetchComments,
        addComment,
        likeComment,
        unlikeComment,
        shareInternalList,
        addInternalPostSharing,
        reportFeed,
        filterUsersByKeyword,
        deleteOwnFeed
    };
}