// UploadCard.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons, FontAwesome, Feather, MaterialIcons } from "@expo/vector-icons";
import LineDivider from "../../components/LineDivider";
const { width } = Dimensions.get("window");
const CARD_PADDING = 15;
const CARD_WIDTH = width - CARD_PADDING * 2;

export default function FeedPost({
  avatar =  require("../../assets/images/social-img.png"),
  author = "John deo",
  subtitle = "Redesign reviews & UX audit",
  time = "19 Sept, 10 am",
  text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
  image = require("../../assets/images/post-img.png"),
  likes = "23K",
  comments = "10K",
  saves = "2.1K",
  share = "10k",
  onPress,
}) { 
  return (
      <View style={styles.card}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileRow} onPress={onPress}>
            <Image source={avatar} style={styles.avatar} />
            <View style={styles.nameBlock}>
              <Text style={styles.name}>{author}</Text>
              <Text style={styles.subtitle}>
                {subtitle} · {time}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreBtn}>
            <Feather name="more-vertical" size={18} color="#9a9aa0" />
          </TouchableOpacity>
        </View>
        <Text style={styles.postText} numberOfLines={4}>
          {text}
        </Text>
        <View style={styles.imageWrap}>
          <Image source={image} style={styles.postImage} resizeMode="cover" />
        </View>
        <View style={styles.actionsRow}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="heart-outline" size={21} color="#ddd" />
              <Text style={styles.countText}>{likes}</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.actionItem}>
               <FontAwesome name="share-square-o" size={18} color="#ffffff" />
              <Text style={styles.countText}>{share}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <FontAwesome name="comment" size={20} color="#ddd" />
              <Text style={styles.countText}>{comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Feather name="send" size={20} color="#ddd" />
              <Text style={styles.countText}>Send</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="info" size={18} color="#9a9aa0" />
            </TouchableOpacity>
          </View>
        </View>
        <LineDivider/>
      </View>
    
  );
}

const styles = StyleSheet.create({
  card: {
    paddingTop:10,
    overflow: "hidden",
    width: CARD_WIDTH,
    alignSelf: "center",    
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap:10
  },
   avatar: {
        width: 55,
        height: 55,
        borderRadius: 100,
        borderWidth: 1.5,     
        borderColor: "#fff",
    },
  nameBlock: {
    flexShrink: 1,
  },
  name: {
    color: "#c3c3c3",
    fontSize: 18,
    fontFamily:"Montserrat_600SemiBold",
  },
  subtitle: {
    color: "#c3c3c3",
    fontSize: 14,
    marginTop: 2,
    fontFamily:"Montserrat_400Regular",
  },
  moreBtn: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  postText: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 18,
    marginTop:7,
    marginBottom: 15,
    fontFamily:"Montserrat_400Regula"
  },
  imageWrap: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#111",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
     gap:18
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center",   
  },
  countText: {
    color: "#ddd",
    marginLeft: 6,
    fontSize: 13,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: 12,
    padding: 6,
  },
});
