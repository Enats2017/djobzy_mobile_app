// components/CommentItem.js

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

export default function CommentItem({ comment, onLike }) {
  const timeText = moment(comment?.created_at).fromNow();

  return (
    <View style={styles.row}>
      <Image source={{ uri: comment?.user?.photo }} style={styles.avatar} contentFit="cover" cachePolicy="disk" />

      <View style={styles.body}>
        <View style={styles.nameLine}>
          <Text style={styles.name}>{comment?.user?.full_name}</Text>
          <Text style={styles.time}>{timeText}</Text>
        </View>

        <Text style={styles.message}>{comment?.comment}</Text>
      </View>

      <TouchableOpacity style={styles.likeBtn}
        onPress={() =>
          onLike?.(
            comment.id,
            comment.is_comment_liked_by_current_user ? 1 : 0
          )
        }
      >
        <Ionicons
          name={comment?.is_comment_liked_by_current_user ? "heart" : "heart-outline"}
          size={18}
          color={comment?.is_comment_liked_by_current_user ? "#cc6952" : "#b5b5ba"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#00000012",
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eee",
  },
  body: {
    flex: 1,
  },
  nameLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    color: "#222",
  },
  time: {
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    color: "#9a9a9a",
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Montserrat_400Regular",
    color: "#3a3a3a",
  },
  likeBtn: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingTop: 2,
  },
  likeCount: {
    fontSize: 11,
    color: "#9a9a9a",
    fontFamily: "Montserrat_400Regular",
  },
});
