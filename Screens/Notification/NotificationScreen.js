import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
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

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("new");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [newNotifications, setNewNotifications] = useState([]);
  const [oldNotifications, setOldNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      // console.log(token);
      setNewNotifications(data.new_notifications);
      setOldNotifications(data.old_notifications);
    } catch (error) {
      console.error("Error fetching User:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PageNameHeaderBar navigation={navigation} title="Alerts" />
        <>
          <View style={styles.searchBarRow}>
            <View style={styles.searchBar}>
              <Feather
                name="search"
                size={18}
                color="#ffffff"
                style={styles.icon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Find Notification"
                placeholderTextColor="#ffffff"
                value={search}
                onChangeText={setSearch}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <FontAwesome6 name="filter" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          {/* Tabs inside scroll */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "new" && styles.activeTab]}
              onPress={() => setActiveTab("new")}
            >
              <Text
                style={
                  activeTab === "new" ? styles.activeTabText : styles.tabText
                }
              >
                New Notifications
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "old" && styles.activeTab]}
              onPress={() => setActiveTab("old")}
            >
              <Text
                style={
                  activeTab === "old" ? styles.activeTabText : styles.tabText
                }
              >
                Old Notifications
              </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <Loading />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <View style={styles.mainContainer}>
                {activeTab === "new" ? (
                  newNotifications?.data?.length > 0 ? (
                    newNotifications?.data?.map((offer, index) => (
                      <View key={index}>
                        <View style={styles.notificationContainer}>
                          <View style={styles.headerRow}>
                            <View style={styles.avatarStack}>
                              <View style={styles.greenDot} />
                              <Image
                                source={{
                                  uri: offer?.from_user?.photo || "https://randomuser.me/api/portraits/men/62.jpg",
                                }}
                                style={styles.avatar}
                              />
                            </View>

                            <View style={styles.nameTimeRow}>
                              <Text style={styles.name}>{offer.from_user?.full_name}</Text>
                            </View>
                          </View>
                          <Text style={styles.message}>
                            {offer.text}
                          </Text>
                        </View>
                        <LineDivider />
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No New Notifications</Text>
                    </View>
                  )
                ) :
                  oldNotifications?.data?.length > 0 ? (
                    oldNotifications?.data?.map((offer, index) => (
                      <View key={index}>
                        <View style={styles.notificationContainer}>
                          <View style={styles.headerRow}>
                            <View style={styles.avatarStack}>
                              <View style={styles.greenDot} />
                              <Image
                                source={{
                                  uri: offer?.from_user?.photo || "https://randomuser.me/api/portraits/men/62.jpg",
                                }}
                                style={styles.avatar}
                              />
                            </View>

                            <View style={styles.nameTimeRow}>
                              <Text style={styles.name}>{offer.from_user?.full_name}</Text>
                            </View>
                          </View>
                          <View style={styles.messageRow}>
                            <Text style={styles.message}>
                              {offer.text}..
                            </Text>
                            <TouchableOpacity>
                              <Text style={styles.moreText}>More</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <LineDivider />
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No Old Notifications</Text>
                    </View>
                  )}
              </View>
            </ScrollView>
          )}
        </>

      </View >
      <Footer />
    </SafeAreaView >
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
    marginBottom: 5
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
    paddingTop: 15
  },
  notificationContainer: {
    flexDirection: "column",
    gap: 10
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  avatarStack: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: 50,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#fff",
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: "#34a853",
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
    fontSize: 15,
    color: "#C96B59",
    fontFamily: "Montserrat_500Medium",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,   // ensures spacing inside ScrollView
  },
  emptyText: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
  },
});

export default NotificationScreen;
