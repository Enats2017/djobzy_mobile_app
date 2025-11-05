import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function FindJobs() {
  const [expanded1, setExpanded1] = useState(false);
  const [liked1, setLiked1] = useState(false);
  const [liked2, setLiked2] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) return <View />;

  return (
    
     
      <ScrollView contentContainerStyle={{ paddingTop: 0, paddingBottom: 140 }}>
        <View style={styles.jobCard}>
          <Text style={styles.uploadTextAbove}>Uploaded 20 minutes ago</Text>

          <View style={styles.userRow}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>Jessie James</Text>
                <View style={{ flexDirection: "row", marginLeft: 6 , gap: 3 }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={15}
                      color="#EBBE56"
                    />
                  ))}
                </View>
              </View>
              <View style={styles.paymentRow}>
                <MaterialIcons name="verified" size={16} color="#40b68e"  />
                <Text style={styles.paymentVerified}>Payment verified</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setLiked1(!liked1)}
              style={styles.heartTouchable}
            >
              <FontAwesome
                name={liked1 ? "heart" : "heart-o"}
                size={20}
                color={liked1 ? "#ff0000" : "#fff"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.jobTitle}>UI/UX Designer</Text>
          <Text style={styles.jobDesc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>

          <View style={styles.skillRow}>
            {["Website design", "Wireframing", "Prototyping"].map(
              (skill, i) => (
                <View key={i} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              )
            )}
          </View>

          <View style={styles.jobFooter}>
            <Ionicons
              name="cash-outline"
              size={16}
              color="#eb8676"
              style={styles.icon}
            />
            <Text style={styles.hourly}>Hourly: </Text>
            <Text style={styles.hourlyRange}>$15-$35</Text>
            <View style={styles.locationRow1}>
            <FontAwesome6
              name="location-dot"
              size={14}
              color="#eb8676"
              style={styles.locationIcon1}
            />
              <Text style={styles.locationText1}>Remote</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>

          <View style={styles.dividerLine} />
        </View>

        {/* Job Card 2 */}
        <View style={styles.jobCard}>
          <Text style={styles.uploadTextAbove}>Uploaded 20 minutes ago</Text>

          <View style={styles.userRow}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>Jessie James</Text>
                <View style={{ flexDirection: "row", marginLeft: 6 , gap: 3 }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={15}
                      color="#EBBE56"
                    />
                  ))}
                </View>
              </View>
              <View style={styles.paymentRow}>
                <MaterialIcons name="verified" size={16} color="#40b68e"  />
                <Text style={styles.paymentVerified}>Payment verified</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setLiked2(!liked2)}
              style={styles.heartTouchable}
            >
              <FontAwesome
                name={liked2 ? "heart" : "heart-o"}
                size={20}
                color={liked2 ? "#ff0000" : "#fff"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.jobTitle}>UI/UX Designer</Text>
          <Text style={styles.jobDesc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            interdum sapien nec lectus vulputate, at facilisis justo laoreet.
          </Text>

          <View style={styles.skillRow}>
            {["Website design", "Wireframing", "Prototyping"].map(
              (skill, i) => (
                <View key={i} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              )
            )}
          </View>

          <View style={styles.jobFooter}>
            <Ionicons
              name="cash-outline"
              size={16}
              color="#eb8676"
              style={styles.icon}
            />
            <Text style={styles.hourly}>Hourly: </Text>
            <Text style={styles.hourlyRange}>$15-$35</Text>
            <View style={styles.locationRow2}>
            <FontAwesome6
              name="location-dot"
              size={14}
              color="#eb8676"
              style={styles.locationIcon2}
            />
              <Text style={styles.locationText2}>Remote</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
  
  );
}

const styles = StyleSheet.create({
  

  jobCard: {
    backgroundColor: "Transparent",
  },

  uploadTextAbove: {
    color: "#b3b3b3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 10,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 12,
  },

  userName: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 15,
    marginRight: 7,
    fontFamily: "Montserrat_500Medium",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  paymentVerified: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 4,
    fontFamily: "Montserrat_500Medium",
  },

  jobTitle: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 5,
    fontFamily: "Montserrat_600SemiBold",
  },

  jobDesc: {
    fontSize: 15,
    marginBottom: 5,
    fontFamily: "Montserrat_400Regular",
    color: "#ffffff",
    lineHeight: 18,
    padding: 4,
  },

  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },

  skillTag: {
    backgroundColor: "#484141",
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 15,
    marginRight: 8,
    marginBottom: 8,
  },

  skillText: {
    color: "#e3e3e3",
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
    textAlign: "center",
  },

  jobFooter: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  icon: {
    marginRight: 5,
  },

  hourly: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    fontSize: 12,
    marginRight: 2,
  },

  hourlyRange: {
    color: "#fff",
    fontSize: 12,
    marginRight: 12,
    fontFamily: "Montserrat_400Regular",
  },

 locationRow1: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  locationIcon1: {
    marginRight: 5,
    marginTop: 2,
  },
  locationText1: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: "#fff",
    marginLeft: 5,
    fontFamily: "Montserrat_400Regular",
  },

  locationRow2: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  locationIcon2: {
    marginRight: 5,
    marginTop: 2,
  },
  locationText2: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: "#fff",
    marginLeft: 5,
    fontFamily: "Montserrat_400Regular",
  },

  heartTouchable: {
    alignSelf: "flex-start",
    marginLeft: 8,
    marginTop: 2,
  },


  viewBtn: {
    backgroundColor: "#eb8676",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 10,
  },

  viewBtnText: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: "Montserrat_700Bold",
  },

  dividerLine: {
    height: 1,
    backgroundColor: "rgba(200,200,200,0.4)",
    marginHorizontal: 1,
    marginTop: 30,
    marginBottom: 16,
  },
});
