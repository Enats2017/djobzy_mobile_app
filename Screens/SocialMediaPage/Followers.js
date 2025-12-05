import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import SearchBar from "../../components/SearchBar";
import { Header } from "@react-navigation/stack";
import LineDivider from "../../components/LineDivider";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialIcons,
  Octicons,
  Entypo,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Footer from "../../components/Footer";

const Followers = () => {
  const route = useRoute();
  const initialTab = route.params?.activeTab || "following";
  const [activeTab, setActiveTab] = useState(initialTab);
  const followingData = [
    {
      id: 1,
      name: "Sushi",
      rating: 5,
      jobs: 3,
      img:  "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      id: 2,
      name: "Aman",
      rating: 4,
      jobs: 3,
      img: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      id: 3,
      name: "Nabil",
      rating: 4,
      jobs: 2,
      img: "https://randomuser.me/api/portraits/men/6.jpg",
    },
     {
      id: 4,
      name: "Swaym",
      rating: 4,
      jobs: 2,
      img: "https://randomuser.me/api/portraits/men/7.jpg",
    },
     {
      id: 5,
      name: "Sashi",
      rating: 4,
      jobs: 2,
      img: "https://randomuser.me/api/portraits/women/20.jpg",
    },
     {
      id: 6,
      name: "Sashi",
      rating: 4,
      jobs: 2,
      img: "https://randomuser.me/api/portraits/women/21.jpg",
    },
     {
      id: 7,
      name: "Sashi",
      rating: 4,
      jobs: 2,
      img: "https://randomuser.me/api/portraits/women/22.jpg",
    },
  ];

  const followersData = [
    {
      id: 1,
      name: "Sushi",
      rating: 5,
      jobs: 3,
      img: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: 2,
      name: "Ayaush",
      rating: 4,
      jobs: 3,
      img: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    {
      id: 3,
      name: "Abhishek",
      rating: 4,
      jobs: 2,
      img: "https://randomuser.me/api/portraits/men/15.jpg",
    },
     {
      id: 4,
      name: "Gulzar",
      rating: 4,
      jobs: 2,
      img: "https://randomuser.me/api/portraits/men/15.jpg",
    },
     {
      id: 5,
      name: "Sashi",
      rating: 4,
      jobs: 2,
      img: "https://randomuser.me/api/portraits/men/15.jpg",
    },
  ];

  const currentList = activeTab === "following" ? followingData : followersData;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: item.img }} style={styles.imglogo} />
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.rating}>
            ⭐ {item.rating} 🟢 {item.jobs}
          </Text>
        </View>
      </View>

      {activeTab === "following" ? (
        <TouchableOpacity style={styles.unfollowBtn}>
          <Text style={styles.unfollowText}>Unfollow</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.Header}>
            <PageNameHeaderBar />
            <SearchBar
              placeholder="My Followers"
              showFilter={false}
              showDots={false}
            />
          </View>
          <View style={styles.profileCard}>
            <View style={styles.profileinfo}>
              <View style={styles.profileRow}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/women/44.jpg",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.profileInfoRow}>
                  <Text style={styles.name}>Aman Yadav</Text>
                  <View style={styles.iconbox}>
                    <Octicons name="clock-fill" size={12} color="#c3c3c3c3" />
                    <Text style={styles.infoText}>GMT+05:30</Text>
                  </View>
                  <View style={styles.iconbox}>
                    <MaterialIcons
                      name="verified"
                      size={14}
                      color="#c3c3c3c3"
                    />
                    <Text style={styles.infoText}>Verification Level: 5/7</Text>
                  </View>
                  <View style={styles.iconbox}>
                    <Entypo name="location-pin" size={14} color="#c3c3c3c3" />
                    <Text style={styles.infoText}>Mumbai, Maharshtra</Text>
                  </View>
                </View>
              </View>
            </View>
            <LineDivider />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>2</Text>
                  <Text style={styles.statLabel}>Number of Jobs</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Money Earned</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>My Followers</Text>
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={styles.tabWrapper}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === "following" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("following")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "following" && styles.activeText,
                ]}
              >
                Following
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === "follower" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("follower")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "follower" && styles.activeText,
                ]}
              >
                Followers
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={currentList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
              ItemSeparatorComponent={() => <LineDivider />}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        </View>
        <Footer/>  
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  Header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "85%",
  },
  profileCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom:15
  },
  profileinfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 60,
    marginRight: 12,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 7,
  },
  iconbox: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 2,
  },
  infoText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statBox: {
    backgroundColor: "#C97863",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Montserrat_700Bold",
  },
  statLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginTop: 2,
  },
  tabWrapper: {
    flexDirection: "row",
    borderRadius: 8,
    borderColor:"#fff",
    borderWidth:1,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9.5,
    alignItems: "center",
     justifyContent: "center",
    
  },
  activeTab: {
    backgroundColor: "#34A853",
     borderRadius:5,
    outlineColor: "#34A853",
    outlineWidth: 6.2

  },
  tabText: {
    color: "#aaa",
    fontSize: 15,
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  imglogo: {
    width: 48,
    height: 48,
    borderRadius: 26,
  },
  name: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  rating: {
    color: "#d9d9d9",
    fontSize: 13,
    marginTop: 4,
  },
  unfollowBtn: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 6,
  },
  unfollowText: {
    color: "#fff",
    fontWeight: "600",
  },
  followBtn: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 6,
  },
  followText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Followers;
