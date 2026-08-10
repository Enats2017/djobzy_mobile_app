import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import LineDivider from "../../../components/LineDivider";
import useSocialEvents from "../FeedEvent/useSocialEvents";
import FeedImage from "./FeedImage";
import FeedVideo from "./FeedVideo";
import FeedActions from "./FeedActions";
import { useNotifications } from "../../../context/MessageNotificationContext";
import MentionAndHashtagText from "./MentionAndHashtagText";
import { useNavigation } from "@react-navigation/native";
import { useGlobalSearch } from "../../SearchScreen/useGlobalSearch";
import FeedHotelCard from "./FeedHotelCard";
import FeedJobCard from "./FeedJobCard";

const { width } = Dimensions.get("window");
const CARD_PADDING = 15;
const CARD_WIDTH = width - CARD_PADDING * 2;

function FeedPost({ item, onOpenComments, openInternalSharing, openExternalSharing, onOpenMenu, openReportRequest, onToggleLike, navigateUserProfile, isOwner = false }) {
  // Hooks run unconditionally — the `!item` guard lives below them, otherwise a
  // row that arrives null and fills in later changes the hook count mid-life.
  const { likeFeed, unlikeFeed } = useSocialEvents();
  const { user } = useNotifications();
  const navigation = useNavigation();
  const { setKeyword, setUserSearchMode } = useGlobalSearch();

  const handleMentionPress = useCallback((data) => {
    navigation.navigate("PublicEmployeeProfilePage", { name: data?.profile_slug });
  }, [navigation]);

  const handleJobNabigationFromCard = useCallback((slug) => {
    console.log(slug);
    navigation.navigate("JobProfile", { gid: slug });
  }, [navigation]);

  const handleHashtagPress = useCallback((data) => {
    if (data.type === "job") {
      navigation.navigate("JobProfile", { gid: data.request_slug });
    } else {
      setKeyword(data.text);
      setUserSearchMode(Number(user.admin ?? 0));
      navigation.navigate("SearchResult");
    }
  }, [navigation]);

  if (!item) return null;

  const liked = !!item?.is_liked_by_current_user;
  const likesCount = item?.likes_count || 0;

  const avatar = { uri: item?.photo };
  const author = item?.full_name || "Unknown User";
  const subtitle = item?.profile_title_employee || item?.profile_title_employer || "";
  const createdAt = moment(item.created_at);
  const timeText = createdAt.isAfter(moment().subtract(1, "day"))
    ? createdAt.fromNow()
    : createdAt.format("h:mm A");
  const dateText = createdAt.format("MMM DD");

  const text = item?.message || "";
  const isImage = item?.message_type === 1 && !!item?.file_name;
  const isVideo = item?.message_type === 2 && !!item?.signed_url;
  const isStructuredCard = item?.message_type === 3;
  const cardType = item?.feed_data?.type;

  const handleLike = async () => {
    const wasLiked = liked;
    try {
      onToggleLike(item.id, wasLiked);
      if (wasLiked) {
        await unlikeFeed(item.id);
      } else {
        await likeFeed(item.id);
      }
    } catch (error) {
      console.log("Like Error:", error);
      onToggleLike(item.id, !wasLiked); // rollback on failure
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileRow} onPress={() => navigateUserProfile(item?.name, item?.admin, item?.is_closed, item?.is_spam_user)}>
            <Image source={avatar} style={styles.avatar} />
            <View style={styles.nameBlock}>
              <Text style={styles.name}>{author}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
                {createdAt ? ` | ${dateText}, ${timeText}` : ""}
              </Text>
            </View>
          </TouchableOpacity>

          {(isOwner || user?.id !== item.user_id) && (
            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => onOpenMenu(item.id)}
            >
              <Feather name="more-vertical" size={18} color="#a8a8b3" />
            </TouchableOpacity>
          )}
        </View>

        {!isStructuredCard && !!text && (
          <Text style={styles.postText}>
            <MentionAndHashtagText
              message={text}
              mentionsData={item.mentions_data}
              style={styles.postText}
              onMentionPress={handleMentionPress}
              onHashtagPress={handleHashtagPress}
            />
          </Text>
        )}

        {isImage && (
          <FeedImage
            uri={item.file_name}
            width={item.file_width}
            height={item.file_height}
          />
        )}

        {isVideo && (
          <FeedVideo
            id={item.id}
            uri={item.signed_url}
            thumbnailUrl={item.thumbnail_url}
            width={item.video_width}
            height={item.video_height}
          />
        )}

        {isStructuredCard && cardType === 'hotel' && <FeedHotelCard data={item.feed_data} />}
        {isStructuredCard && cardType === 'job' && <FeedJobCard data={item.feed_data} openJob={handleJobNabigationFromCard} />}

        <FeedActions
          liked={liked}
          likesCount={likesCount}
          shares={item?.shares_count || 0}
          comments={item?.comment_count || 0}
          onLike={handleLike}
          onShare={() => openExternalSharing(item)}
          onComment={() => onOpenComments(item.id)}
          onSend={() => openInternalSharing(item.id)}
          onReport={() => openReportRequest(item.id)}
          isOwner={isOwner}
        />
        <LineDivider />
      </View>
    </>
  );
}

// Default (shallow) comparison is exactly the right check here, and a hand-written
// comparator would be strictly worse:
//
// - `item` is reference-stable per row. Every mutation in the feed screens goes
//   through `setFeeds(prev => prev.map(f => f.id === id ? {...f} : f))`, so only
//   the row that actually changed gets a new object — untouched rows keep their
//   identity and bail out here.
// - Every handler prop is a `useCallback([])` in the parent, and `isOwner` is a
//   literal, so none of them churn between renders.
//
// A custom comparator would have to enumerate the ~20 `item` fields this card
// reads (likes, comment_count, message_type, signed_url, feed_data, mentions_data,
// …) and would silently start dropping updates the moment a new field is used.
export default React.memo(FeedPost);

const styles = StyleSheet.create({
  card: {
    paddingTop: 10,
    overflow: "hidden",
    width: CARD_WIDTH,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "#fff",
  },
  nameBlock: {
    flexShrink: 1,
  },
  name: {
    color: "#c3c3c3",
    fontSize: 17,
    fontFamily: "Montserrat_600SemiBold",
  },
  subtitle: {
    color: "#c3c3c3",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  moreBtn: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  postText: {
    color: "#e6e6ea",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
    fontFamily: "Montserrat_400Regular",
  },
});