import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
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
import Footer from "../../components/Footer";
import GradientButton from "../../components/GradientButton";

const MyCurrentBiddingProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { myOffer, current_user ,award, gig} = route.params || [];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.bcontainer}>
        <PageNameHeaderBar navigation={navigation} title="Bidding Profiles" />
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          {myOffer.map((offer, index) => (
            <View style={styles.card} key={index}>
              <View style={styles.profileRow}>
                <Image
                  source={{
                    uri:
                      offer.photo ||
                      "https://randomuser.me/api/portraits/men/1.jpg",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.infoColumn}>
                  <Text style={styles.name}>{offer.full_name}</Text>
                  <View style={styles.starsRow}>
                    {[...Array(4)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={12}
                        color="#EBBE56"
                        style={{ marginRight: 3 }}
                      />
                    ))}
                    <FontAwesome
                      name="star-half-full"
                      siz={15}
                      color="#EBBE56"
                    />
                  </View>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.date}>
                    {" "}
                    {offer.bid_date
                      ? new Date(offer.bid_date).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Total</Text>
                  <Text style={styles.priceValue}>{offer.bid_price} CAD</Text>
                </View>

                <View style={styles.vertDivider} />

                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Hourly</Text>
                  <Text style={styles.priceValue}>
                    {offer.prop_hourly_rate} CAD
                  </Text>
                </View>
              </View>
              {current_user == offer.req_user_id ? (
                <GradientButton title="Change my offer" 
                onPress={() =>
                  navigation.navigate("ChangeMyOffer", {
                    gig: gig || [],
                    award: award || [],
                  })
                }
                />
              ) : (
                <GradientButton title="View" />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bcontainer: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 13,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    fontWeight: "600",
    marginTop: 10,
  },
  backButton: {
    paddingRight: 8,
    paddingLeft: 4,
    marginRight: 2,
  },
  arrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#444444ff",
    margin: 20,
    width: 35,
    height: 35,
    borderRadius: 100,
  },
  headerTitle: {
    color: "white",
    fontFamily: "Montserrat_500Medium",
    letterSpacing: 0.2,
    marginLeft: 6,
    marginTop: 15,
  },

  card: {
    backgroundColor: "#444444ff",
    borderRadius: 16,

    marginBottom: 16,
    padding: 14,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    position: "relative",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 100,
    backgroundColor: "#bbb",
    borderWidth: 2,
    borderColor: "#c3c3c3",
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginLeft: 2,
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: 160,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 2,
  },
  star: {
    color: "#EBBE56",
    fontSize: 15,
  },
  date: {
    color: "#c3c3c3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF33",
    borderRadius: 12,
    backgroundColor: "transparent",
    paddingVertical: 12,
    alignItems: "center",
  },

  priceItem: {
    flex: 1,
    alignItems: "center",
    // minWidth: 90,
  },
  priceLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 2,
  },
  priceValue: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Montserrat_700Bold",
  },
  button: {
    marginTop: 4,
    backgroundColor: "#D17B68",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoColumn: {
    marginLeft: 12,
    justifyContent: "center",
    flex: 1,
    flexWrap: "wrap",
    gap: 5,
  },

  dateContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  vertDivider: {
    borderLeftWidth: 2,
    borderRadius: 5,
    height: 40,
    borderLeftColor: "#FFFFFF33",
  },
});

export default MyCurrentBiddingProfile;
