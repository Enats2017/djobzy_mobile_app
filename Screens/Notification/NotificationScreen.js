import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Footer from "../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import LineDivider from "../../components/LineDivider";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import EmployerFooter from "../../components/EmployerFooter";
import { useNotifications } from "../../context/MessageNotificationContext";
import { Ionicons } from "@expo/vector-icons";

const NotificationItem = memo(({ item, isLast, onPress, showMore }) => (
  <View>
    <View style={styles.notificationContainer}>
      <View style={styles.headerRow}>
        <View style={styles.avatarStack}>
          {item.isNew && <View style={styles.greenDot} />}
          <Image
            source={{
              uri: item.profile_photo || "https://randomuser.me/api/portraits/men/62.jpg",
            }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <View style={styles.nameTimeRow}>
          <Text style={styles.name}>{item?.name}</Text>
          {item?.time ? (
            <Text style={styles.time}>{item.time}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.messageRow}>
        <Text style={styles.message}>
          {item.text}
        </Text>
        {showMore && (
          <Text style={styles.moreText} onPress={() => onPress(item)}>
            {" ...More"}
          </Text>
        )}
      </View>
    </View>
    {!isLast && <LineDivider />}
  </View>
));

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { admin } = useNotifications();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newPage, setNewPage] = useState(1);
  const [oldPage, setOldPage] = useState(1);
  const [newLastPage, setNewLastPage] = useState(1);
  const [oldLastPage, setOldLastPage] = useState(1);
  const searchTimeout = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const SHOW_MORE_TYPES = useMemo(() => [1, 2, 3, 4, 7, 8, 9, 10, 12], []);
  const fetchNotifications = useCallback(async (newP = 1, oldP = 1, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/notifications?new_page=${newP}&old_page=${oldP}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();
      const newList = data?.new_notifications?.data?.map((item) => ({ ...item, isNew: true })) || [];
      const oldList = data?.old_notifications?.data?.map((item) => ({ ...item, isNew: false })) || [];
      setNewLastPage(data?.new_notifications?.last_page || 1);
      setOldLastPage(data?.old_notifications?.last_page || 1);

      if (append) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const merged = [...newList, ...oldList].filter((n) => !existingIds.has(n.id));
          return [...prev, ...merged];
        });
      } else {
        setNotifications([...newList, ...oldList]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1, 1, false);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isSearching || loadingMore) return;
    const canLoadNew = newPage < newLastPage;
    const canLoadOld = oldPage < oldLastPage;
    if (!canLoadNew && !canLoadOld) return;
    const nextNewPage = canLoadNew ? newPage + 1 : newPage;
    const nextOldPage = canLoadOld ? oldPage + 1 : oldPage;

    setNewPage(nextNewPage);
    setOldPage(nextOldPage);
    fetchNotifications(nextNewPage, nextOldPage, true);
  }, [loadingMore, newPage, oldPage, newLastPage, oldLastPage, isSearching, fetchNotifications]);

  const handleSearch = useCallback((text) => {
    setSearch(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!text.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      setIsSearching(true);
      const lower = text.toLowerCase();
      const filtered = notifications.filter(
        (n) =>
          n.text?.toLowerCase().includes(lower) ||
          n.name?.toLowerCase().includes(lower)
      );
      setSearchResults(filtered);
    }, 300);
  }, [notifications]);

  const displayData = isSearching ? searchResults : notifications;

  const handleNotificationPress = useCallback((offer) => {
    switch (offer.type) {
      case 2:
      case 4:
      case 9:
        if (offer?.job?.request_slug) {
          if(offer?.job?.request_status === 2) {
            navigation.navigate("ViewCompletedJobPost", { gid: offer?.job?.request_slug, });
          } else {
            navigation.navigate("ViewCurrentJobPost", { gid: offer?.job?.request_slug });
          }
        }
        break;
      case 1:
      case 8:
        if (offer?.job?.request_slug) {
          if (offer?.job?.request_status === 0 && offer?.job?.user_id === offer?.to_user_id) {
            navigation.navigate("PostJobDetails", { jobId: offer?.job?.request_slug, });
          } else if (offer?.job?.request_status === 1) {
            navigation.navigate("ViewCurrentJobPost", { gid: offer?.job?.request_slug });
          } else if (offer?.job?.request_status === 2) {
            navigation.navigate("ViewCompletedJobPost", { gid: offer?.job?.request_slug, });
          } else {
            navigation.navigate("JobProfile", { gid: offer?.job?.request_slug })
          }
        }
        break;
      case 10:
        navigation.navigate("ReferralWallet");
        break;
      case 11:
        navigation.navigate("VerificationPage");
        break;
      case 12:
        navigation.navigate("Followers", { activeTab: "follower" });
        break;
      default:
        if (offer?.job?.request_slug) {
          navigation.navigate("JobProfile", { gid: offer?.job?.request_slug });
        }
        break;
    }
  }, [admin, navigation]);

  const renderItem = useCallback(({ item, index }) => (
    <NotificationItem
      item={item}
      isLast={index === displayData.length - 1}
      onPress={handleNotificationPress}
      showMore={SHOW_MORE_TYPES.includes(item.type)}
    />
  ), [displayData.length, handleNotificationPress, SHOW_MORE_TYPES]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 16, alignItems: "center" }}>
        <ActivityIndicator size={30} color="#46A282" />
      </View>
    );
  }, [loadingMore]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isSearching ? "No results found" : "No Notifications"}
      </Text>
    </View>
  ), [isSearching]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PageNameHeaderBar navigation={navigation} title="Notifications" />

        <View style={styles.searchBarRow}>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#ffffff" style={styles.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Find Notification"
              placeholderTextColor="#ffffff"
              value={search}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <FontAwesome6 name="filter" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={displayData}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
            initialNumToRender={10}
          />
        )}
      </View>
      {admin == 2 ? <EmployerFooter /> : <Footer />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#222222",
    flex: 1,
    paddingHorizontal: 15,
  },
  tabContainer: {
    flexDirection: "row",
    borderColor: "#c5c5c591",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 5,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  tabText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  activeTab: {
    backgroundColor: "#C96B59",
    padding: 10,
    outlineColor: "#C96B59",
    outlineWidth: 1,
    borderRadius: 10,
  },

  activeTabText: {
    color: "#ffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
  },
  searchBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff1a",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  icon: {
    marginLeft: 7,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
  },
  filterBtn: {
    marginLeft: 8,
    backgroundColor: "#333333",
    borderRadius: 100,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    paddingTop: 15,
  },
  notificationContainer: {
    flexDirection: "column",
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarStack: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: 45,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#fff",
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: "#46A282",
    borderWidth: 1.5,
    borderColor: "#ffffff",
    marginLeft: 5,
    marginBottom: -10,
    zIndex: 1,
  },
  nameTimeRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    margin: 0,
  },
  time: {
    fontSize: 12,
    color: "#c3c3c3",
    fontFamily: "Montserrat_500Medium",
    textAlign: "right",
    flexShrink: 0,
    marginLeft: 8,
  },
  messageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
  },
  message: {
    fontSize: 15,
    color: "#f5f5f5",
    fontFamily: "Montserrat_400Regular",
  },
  moreText: {
    fontSize: 14,
    color: "#46A282",
    fontFamily: "Montserrat_600SemiBold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
  },
});

export default NotificationScreen;
