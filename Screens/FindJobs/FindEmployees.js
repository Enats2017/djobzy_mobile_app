import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FindJobs() {
  const [liked1, setLiked1] = useState(false);
  const [liked2, setLiked2] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) return <View />;

  return (
   
      <ScrollView contentContainerStyle={{ paddingTop: 0, paddingBottom: 120 }}>
        {/* CARD 1 */}
        <View style={styles.jobCard1}>
          <View style={styles.userRow1}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              style={styles.avatar1}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow1}>
                <Text style={styles.userName1}>Jessie James</Text>
                <View style={{ flexDirection: "row", marginLeft: 6, gap: 3 }}>
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
              <View style={styles.paymentRow1}>
                <MaterialIcons name="verified" size={16} color="#40b68e"  />
                <Text style={styles.paymentVerified1}>3/7</Text>
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
          <Text style={styles.jobTitle1}>About Me</Text>
          <Text style={styles.jobDesc1}>Virtual Assistant & Data Analyst</Text>
          <View style={styles.locationRow1}>
            <FontAwesome6
              name="location-dot"
              size={14}
              color="#eb8676"
              style={styles.locationIcon1}
            />
            <Text style={styles.locationText1}>San Francisco, CA</Text>
          </View>
          <View style={styles.parentContainer1}>
            <Text style={styles.sectionTitle1}>Promoted Services</Text>
            <View style={styles.promotedRow1}>
              <View style={styles.promotedBox1} />
              <View style={styles.promotedBox1} />
            </View>
            <Text style={styles.sectionTitle1}>Categories</Text>
            <View style={styles.skillRow1}>
              {["Website design", "Website design", "Website design"].map(
                (skill, i) => (
                  <View key={i} style={styles.skillTag1}>
                    <Text style={styles.skillText1}>{skill}</Text>
                  </View>
                )
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.viewBtn1}>
            <Text style={styles.viewBtnText1}>View Profile</Text>
          </TouchableOpacity>
        </View>

        {/* DIVIDER */}
        <View style={styles.divider1} />

        {/* CARD 2 */}
        <View style={styles.jobCard2}>
          <View style={styles.userRow2}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/42.jpg",
              }}
              style={styles.avatar2}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow2}>
                <Text style={styles.userName2}>James Oxford enats enats</Text>
                <View style={{ flexDirection: "row", marginLeft: 6, gap: 3 }}>
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
              <View style={styles.paymentRow2}>
                <MaterialIcons name="verified" size={16} color="#40b68e"  />
                <Text style={styles.paymentVerified2}>3/7</Text>
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
          <Text style={styles.jobTitle2}>About Me</Text>
          <Text style={styles.jobDesc2}>Virtual Assistant & Data Analyst</Text>
          <View style={styles.locationRow2}>
            <FontAwesome6
              name="location-dot"
              size={14}
              color="#eb8676"
              style={styles.locationIcon2}
            />
            <Text style={styles.locationText2}>San Francisco, CA</Text>
          </View>
          <View style={styles.parentContainer2}>
            <Text style={styles.sectionTitle2}>Promoted Services</Text>
            <View style={styles.promotedRow2}>
              <View style={styles.promotedBox2} />
              <View style={styles.promotedBox2} />
            </View>
            <Text style={styles.sectionTitle2}>Categories</Text>
            <View style={styles.skillRow2}>
              {[
                "Website design",
                "Website design",
                "Website design",
                "Website design",
              ].map((skill, i) => (
                <View key={i} style={styles.skillTag2}>
                  <Text style={styles.skillText2}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.viewBtn2}>
            <Text style={styles.viewBtnText2}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
   
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    backgroundColor: "Transparent",
  },
  jobCard1: {
    backgroundColor: "Transparent",
    marginBottom: 18,
  },
  userRow1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  nameRow1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  avatar1: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 12,
  },
  userName1: {
    color: "#fff",
    fontSize: 16,
    marginRight: 7,
    fontFamily: "Montserrat_500Medium",
  },
  paymentRow1: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  paymentVerified1: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 7,
    fontFamily: "Montserrat_400Regular",
  },
  jobTitle1: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  jobDesc1: {
    fontSize: 16,
    marginTop: 7,
    marginBottom: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#fff",
  },
  parentContainer1: {
    backgroundColor: "#EDC8B81A",
    borderRadius: 18,
    padding: 14,
    marginTop: 8,
  },
  sectionTitle1: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    marginBottom: 10,
  },
  promotedRow1: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 22,
  },
  promotedBox1: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#cfcfcf",
  },
  skillRow1: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillTag1: {
    paddingHorizontal: 11,
    paddingVertical: 11,
    borderRadius: 30,
    backgroundColor: "#575454",
  },
  skillText1: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 10,
  },
  jobFooter1: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  icon1: {
    marginRight: 5,
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
  viewBtn1: {
    backgroundColor: "#eb8676",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 18,
  },
  viewBtnText1: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
  divider1: {
    borderBottomColor: "#8e8e8e",
    borderBottomWidth: 1,
    marginVertical: 12,
    opacity: 0.5,
    marginTop: 5,
  },
  jobCard2: {
    backgroundColor: "Transparent",
    marginBottom: 18,
    marginTop: 8,
  },
  userRow2: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  nameRow2: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  avatar2: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 12,
  },
  userName2: {
    color: "#fff",
    fontSize: 16,
    marginRight: 7,
    fontFamily: "Montserrat_500Medium",
  },
  paymentRow2: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  paymentVerified2: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 7,
    fontFamily: "Montserrat_400Regular",
  },
  jobTitle2: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  jobDesc2: {
    fontSize: 16,
    marginTop: 7,
    marginBottom: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#fff",
  },
  parentContainer2: {
    backgroundColor: "#EDC8B81A",
    borderRadius: 18,
    padding: 14,
    marginTop: 8,
  },
  sectionTitle2: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    marginBottom: 10,
  },
  promotedRow2: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 22,
  },
  promotedBox2: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#cfcfcf",
  },
  skillRow2: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillTag2: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "#575454",
  },
  skillText2: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 10,
  },
  jobFooter2: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  icon2: {
    marginRight: 5,
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
  viewBtn2: {
    backgroundColor: "#eb8676",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 18,
  },

  heartTouchable: {
    alignSelf: "flex-start",
    marginLeft: 8,
    marginTop: 2,
  },

  viewBtnText2: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
  divider2: {
    borderBottomColor: "#8e8e8e",
    borderBottomWidth: 1,
    marginVertical: 12,
    opacity: 0.5,
  },
});
