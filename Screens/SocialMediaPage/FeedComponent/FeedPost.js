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

const { width } = Dimensions.get("window");
const CARD_PADDING = 15;
const CARD_WIDTH = width - CARD_PADDING * 2;

export default function FeedPost({ item, onOpenComments, openInternalSharing, openExternalSharing, onOpenMenu, openReportRequest, isOwner = false }) {
  if (!item) return;
  const [liked, setLiked] = useState(item?.is_liked_by_current_user);
  const [likesCount, setLikesCount] = useState(item?.likes_count || 0);
  const { likeFeed, unlikeFeed } = useSocialEvents();
  const { user } = useNotifications();
  const navigation = useNavigation();
  const { setKeyword, setUserSearchMode } = useGlobalSearch();

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

  const handleLike = async () => {
    try {
      if (liked) {
        setLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
        await unlikeFeed(item.id);
      } else {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
        await likeFeed(item.id);
      }
    } catch (error) {
      console.log("Like Error:", error);
    }
  };

  const handleMentionPress = useCallback((data) => {
    navigation.navigate("PublicEmployeeProfilePage", { name: data?.profile_slug });
  }, [navigation]);

  const handleHashtagPress = useCallback((data) => {
    if (data.type === "job") {
      navigation.navigate("JobProfile", { gid: data.request_slug });
    } else {
      setKeyword(data.text);
      setUserSearchMode(Number(user.admin));
      navigation.navigate("SearchResult");
    }
  }, [navigation]);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileRow}>
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

        {!!text && (
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