import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import SearchBar from "../../components/SearchBar";
import { useNavigation } from "@react-navigation/native";
import { useNotifications } from "../../context/MessageNotificationContext";
import moment from "moment";
import Loading from "../../components/Loading";
import NoTransactions from "../Wallet/NoTransactions";
import EmployerFooter from "../../components/EmployerFooter";
import Footer from "../../components/Footer";

const ChatList = () => {
  const navigation = useNavigation();
  const { notifications, admin, user } = useNotifications();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("admin from context:", admin);
  }, [admin]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() =>
        navigation.navigate("ChatRoom", {
          userId: item.sender_id,
        })
      }
    >
      <Image source={{ uri: item.sender_photo }} style={styles.avatar} />

      <View style={styles.rowText}>
        <View style={styles.rowTop}>
          <Text style={styles.name}>{item.sender_name}</Text>
          <Text style={styles.time}>
            {moment(item.submitted_at).format("hh:mm A")}
          </Text>
        </View>

        <View style={styles.rowBottom}>
          <Text numberOfLines={1} style={styles.subtitle}>
            {item.last_message}
          </Text>

          {item.unread_count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar title="Chat" navigation={navigation} />
        <SearchBar />
        {notifications.length === 0 ? (
          <NoTransactions title="No Conversation Found" />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.sender_id.toString()}
            renderItem={renderItem}
            refreshing={loading}
            onRefresh={() => {}}
          />
        )}
      </View>
      {admin == 2 ? <EmployerFooter /> : <Footer />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    gap: 10,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },
  searchIcon: {
    color: "rgba(255,255,255,0.8)",
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  iconBtn: {
    padding: 8,
    marginLeft: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  rowText: { flex: 1 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    flex: 1,
  },
  badge: {
    backgroundColor: "#ff7a00",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default ChatList;
