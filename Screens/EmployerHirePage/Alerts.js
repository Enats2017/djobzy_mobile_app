import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Footer from "../../components/Footer";
import { useNavigation } from "@react-navigation/native";

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PageNameHeaderBar navigation={navigation} title="Alerts" />
        <View style={styles.searchBarRow}>
          <View style={styles.searchBar}>
            <Feather
              name="search"
              size={22}
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
            <FontAwesome6 name="filter" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <>
            <View style={styles.notificationContainer}>
              <View style={styles.headerRow}>
                <View style={styles.avatarStack}>
                  <View style={styles.greenDot} />
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/62.jpg",
                    }}
                    style={styles.avatar}
                  />
                </View>

                <View style={styles.nameTimeRow}>
                  <Text style={styles.name}>Edges</Text>
                  <Text style={styles.time}>Today</Text>
                </View>
              </View>
              <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod.
              </Text>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.notificationContainer}>
              <View style={styles.headerRow}>
                <View style={styles.avatarStack}>
                  <View style={styles.greenDot} />
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/18.jpg",
                    }}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.nameTimeRow}>
                  <Text style={styles.name}>Spectrum</Text>
                  <Text style={styles.time}>Today</Text>
                </View>
              </View>
              <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod.
              </Text>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.notificationContainer}>
              <View style={styles.headerRow}>
                <View style={styles.avatarStack}>
                  <View style={styles.greenDot} />
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/0.jpg",
                    }}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.nameTimeRow}>
                  <Text style={styles.name}>Michael</Text>
                  <Text style={styles.time}>Today</Text>
                </View>
              </View>
              <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod.
              </Text>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.notificationContainer}>
              <View style={styles.headerRow}>
                <View style={styles.avatarStack}>
                  <View style={styles.greenDot} />
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/13.jpg",
                    }}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.nameTimeRow}>
                  <Text style={styles.name}>James</Text>
                  <Text style={styles.time}>Today</Text>
                </View>
              </View>
              <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod.
              </Text>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.notificationContainer}>
              <View style={styles.headerRow}>
                <View style={styles.avatarStack}>
                  <View style={styles.greenDot} />
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/6.jpg",
                    }}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.nameTimeRow}>
                  <Text style={styles.name}>Victor</Text>
                  <Text style={styles.time}>Today</Text>
                </View>
              </View>
              <Text style={styles.message}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod.
              </Text>
            </View>

            <View style={styles.dividerLine} />
          </>
        </ScrollView>
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#222222",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
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
    height: 50,
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
    width: 47,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContainer: {
    backgroundColor: "#222222",
    paddingVertical: 15,
    paddingHorizontal: 7,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatarStack: {
    flexDirection: "column",
    alignItems: "flex-start", 
    justifyContent: "flex-start",
    width: 56,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: "#34a853",
    borderWidth: 1.5,
    borderColor: "#ffffff",
    marginLeft: 7, 
    marginBottom: -12, 
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
    marginLeft: 8,
  },
  time: {
    fontSize: 12,
    color: "#c3c3c3",
    fontFamily: "Montserrat_500Medium",
    textAlign: "right",
  },
  message: {
    fontSize: 15,
    color: "#f5f5f5",
    fontFamily: "Montserrat_400Regular",
    marginTop: 4,
    marginBottom: 2,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#ffffff33",
    width: "100%",
  },
});

export default NotificationScreen;
