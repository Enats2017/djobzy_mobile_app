import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";


export default function FindEmployees() {
  const [liked1, setLiked1] = useState(false);
  const [liked2, setLiked2] = useState(false);
  const [liked3, setLiked3] = useState(false);
  const [liked4, setLiked4] = useState(true);


  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Find Employees</Text>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.smallTab}
            onPress={() => console.log("Categories pressed")}
          >
            <Text style={styles.tabText}>Categories</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallTab}
            onPress={() => console.log("Favourite Employees pressed")}
          >
            <Text style={styles.tabText}>Favourite Employees</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.employeeCard}>
            <View style={styles.cardHeader}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/42.jpg",
                }}
                style={styles.avatar}
              />
              <View style={styles.infoWrapper}>
                <View style={styles.nameStarRow}>
                  <Text style={styles.name}>Ozuka</Text>
                  <View style={styles.starContainer}>
                    {[...Array(4)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={13}
                        color="#EBBE56"
                      />
                    ))}
                    <FontAwesome
                      name="star-half-full"
                      size={13}
                      color="#EBBE56"
                    />
                  </View>
                </View>
                <View style={styles.verification}>
                  <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                  <Text style={styles.verificationText}>
                    Verification Level: 2/7
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setLiked1(!liked1)}
                style={styles.heartTouchable}
              >
                <FontAwesome
                  name={liked1 ? "heart" : "heart-o"}
                  size={20}
                  color={liked1 ? "#ff0000" : "#c3c3c3"}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.skills}>
              {[
                "Full-Stack Web Application Development",
                "Cloud Infrastructure Management",
                "Logo",
                "Website Design",
                "Mobile Application Design",
              ].map((skill, i) => (
                <View style={styles.skill} key={i}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <Text style={styles.profileBtnText}>View Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.employeeCard}>
            <View style={styles.cardHeader}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/9.jpg",
                }}
                style={styles.avatar}
              />
              <View style={styles.infoWrapper}>
                <View style={styles.nameStarRow}>
                  <Text style={styles.name}>
                    Jonathan Alexander Christopher
                  </Text>
                  <View style={styles.starContainer}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={13}
                        color="#EBBE56"
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.verification}>
                  <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                  <Text style={styles.verificationText}>
                    Verification Level: 2/7
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setLiked2(!liked2)}
                style={styles.heartTouchable}
              >
                <FontAwesome
                  name={liked2 ? "heart" : "heart-o"}
                  size={20}
                  color={liked2 ? "#ff0000" : "#c3c3c3"}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.skills}>
              {[
                "High-Fidelity Mockup Design",
                "Database Optimization and API Integration",
                "Logo",
                "Website Design",
                "Mobile Application Design",
              ].map((skill, i) => (
                <View style={styles.skill} key={i}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <Text style={styles.profileBtnText}>View Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.employeeCard}>
            <View style={styles.cardHeader}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/4.jpg",
                }}
                style={styles.avatar}
              />
              <View style={styles.infoWrapper}>
                <View style={styles.nameStarRow}>
                  <Text style={styles.name}>David Miller</Text>
                  <View style={styles.starContainer}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={13}
                        color="#EBBE56"
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.verification}>
                  <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                  <Text style={styles.verificationText}>
                    Verification Level: 2/7
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setLiked3(!liked3)}
                style={styles.heartTouchable}
              >
                <FontAwesome
                  name={liked3 ? "heart" : "heart-o"}
                  size={20}
                  color={liked3 ? "#ff0000" : "#c3c3c3"}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.skills}>
              {[
                "UI/UX Design",
                "Advanced UI/UX Wireframing and Animation Design",
                "Logo",
                "Scalable Architecture for Enterprise Applications",
                "Mobile Application Design",
              ].map((skill, i) => (
                <View style={styles.skill} key={i}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <Text style={styles.profileBtnText}>View Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.employeeCard}>
            <View style={styles.cardHeader}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/47.jpg",
                }}
                style={styles.avatar}
              />
              <View style={styles.infoWrapper}>
                <View style={styles.nameStarRow}>
                  <Text style={styles.name}>
                    Michael Jordan Michael Jordan Michael Jordan Michael Jordan
                  </Text>
                  <View style={styles.starContainer}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={13}
                        color="#EBBE56"
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.verification}>
                  <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                  <Text style={styles.verificationText}>
                    Verification Level: 2/7
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setLiked4(!liked4)}
                style={styles.heartTouchable}
              >
                <FontAwesome
                  name={liked4 ? "heart" : "heart-o"}
                  size={20}
                  color={liked4 ? "#ff0000" : "#c3c3c3"}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.skills}>
              {[
                "UI/UX Design",
                "Graphic Design",
                "Logo",
                "Website Design",
                "Mobile Application Design",
              ].map((skill, i) => (
                <View style={styles.skill} key={i}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <Text style={styles.profileBtnText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    backgroundColor: "#1e1e1e",
  },
  header: {
    marginTop: 20,
    marginBottom: 8,
  },
  title: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 20,
    color: "#ffffff",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 18,
  },
  smallTab: {
    backgroundColor: "#565656",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  tabText: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
  cardContainer: {
  },
  employeeCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF33",
  },
 cardHeader: {
  flexDirection: "row",
  alignItems: "flex-start",  
  justifyContent: "space-between", 
},
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  nameStarRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  name: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    fontSize: 16,
    marginRight: 6,
    flexShrink: 1,
  },
  starContainer: {
    flexDirection: "row",
    gap: 3,
    flexWrap: "wrap",
  },
  verification: {
    flexDirection: "row",
    alignItems: "center",
  },
  verificationText: {
    color: "#c3c3c3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginLeft: 3,
  },
  heartTouchable: {
  padding: 6,
},
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  skill: {
    backgroundColor: "#565656",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 4,
    marginBottom: 6,
  },
  skillText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  profileBtn: {
    backgroundColor: "#D17B68",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  profileBtnText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ffffff33",
    marginVertical: 15,
  },
});
