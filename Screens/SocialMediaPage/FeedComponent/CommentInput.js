// components/CommentInput.js

import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function CommentInput({ value, onChangeText, onSend, sending }) {
  const canSend = value.trim().length > 0;

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="type your thought"
        placeholderTextColor="#9a9a9a"
        multiline
        maxLength={500}
      />

      {/* <TouchableOpacity style={styles.emojiBtn} onPress={onEmojiPress}>
        <Ionicons name="happy-outline" size={20} color="#cc9a3a" />
      </TouchableOpacity> */}

      <TouchableOpacity
        style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
        onPress={() => {
          console.log("SEND BUTTON PRESSED");
          onSend();
        }}
        disabled={!canSend || sending}
      >
        {sending ? (
          <ActivityIndicator color="#fff" size={18} />
        ) : (
          <Feather name="arrow-up" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f4",
    borderRadius: 28,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    color: "#222",
    maxHeight: 100,
    paddingVertical: 6,
  },
  emojiBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fde3a7",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D17B68",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
});
