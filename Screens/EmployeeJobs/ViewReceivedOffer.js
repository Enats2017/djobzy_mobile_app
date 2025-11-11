import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GradientButton from "../../components/GradientButton";

const ViewReceivedOffer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { offerID } = route?.params || {};
  const [seeOffer, setSeeOffer] = useState([]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/see-offer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: offerID }),
      });
      const data = await response.json();
      if (data.status == 200) {
        setSeeOffer(data.offer || []);      
      }
    
      
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar navigation={navigation} title="Offer" />
        <ScrollView style={styles.offercontainer}>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: seeOffer.photoURL ||"https://randomuser.me/api/portraits/women/44.jpg",
              }}
              style={styles.profileImage}
            />

            <View style={styles.profileInfo}>
              <View style={styles.usernameRow}>
                <Text style={styles.username}>{seeOffer.full_name}</Text>
                <View style={styles.starsInline}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={13}
                      color="#EBBE56"
                      style={{ marginLeft: 3 }}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.verifLevelRow}>
                <MaterialIcons
                  name="verified"
                  size={16}
                  color="#c3c3c3"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.verification}>Verification Level {seeOffer.verification_count}/7</Text>
              </View>
            </View>
          </View>

          <Text style={styles.jobTitle}>
            {seeOffer.subject}
          </Text>

          <Text style={styles.posted}>Posted: {seeOffer.updated_at}</Text>

          <View style={styles.priceContainer}>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Total Price</Text>
              <Text style={styles.priceValue}>{seeOffer.fixed_minimum}CAD</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Hourly Rate</Text>
              <Text style={styles.priceValue}>{seeOffer.hour_minimum} CAD</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offer Letter</Text>
            <Text style={styles.sectionText}>
              {seeOffer.offer}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={styles.sectionText}>
              {seeOffer.description}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.acceptBtn} onPress={()=>navigation.navigate("AcceptReceivedOfferPage",{offerID})}>
              <Text style={styles.acceptText}>Accept Offer</Text>
            </TouchableOpacity>
            <GradientButton  title="Make a New Offer" onPress={()=>navigation.navigate("MyNewReceiveOfferPage",{
              offerID ,
              seeOffer
            })}/>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 16,
  },
  backBtn: {
    marginRight: 10,
    borderRadius: 100,
    backgroundColor: "#313131",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 21,
    fontFamily: "Montserrat_600SemiBold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#c3c3c3",
  },
  profileInfo: {
    flex: 1,
    paddingHorizontal: 8,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    maxWidth: "90%",
  },
  username: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
    flexShrink: 1,
  },
  starsInline: {
    flexDirection: "row",
    // marginLeft: 1,
    flexWrap: "wrap",
  },
  verifLevelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    marginBottom: 1,
  },
  verification: {
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
  },
  posted: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 12,
  },
  jobTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 5,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF33",
  },

  priceBox: {
    alignItems: "center",
    flex: 1,
  },
  priceLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  priceValue: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    // marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: "#FFFFFF33",
    marginHorizontal: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 6,
  },
  sectionText: {
    color: "#ffffff",
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Montserrat_400Regular",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 40,
  },
  acceptBtn: {
    backgroundColor: "#46A282",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  acceptText: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
  },
  newOfferBtn: {
    backgroundColor: "#D17B68",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  newOfferText: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
  },

 
});

export default ViewReceivedOffer;
