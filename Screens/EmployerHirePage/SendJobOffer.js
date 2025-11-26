import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../components/Footer";

export default function SendJobOffer() {
  const navigation = useNavigation();
  const [totalPrice, setTotalPrice] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  return (
    <SafeAreaView style={sendOfferStyles.safeAreaContainer}>
      <View style={sendOfferStyles.mainContainer}>
        <PageNameHeaderBar navigation={navigation} title="Send a Job Offer" />

        <ScrollView
          contentContainerStyle={sendOfferStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={sendOfferStyles.sendOfferTitleBlock}>
            <Text style={sendOfferStyles.sendOfferJobTitle}>
              Looking For logo designer
            </Text>
            <Text style={sendOfferStyles.sendOfferPostedTime}>
              posted 6 months ago
            </Text>
          </View>

          <View style={sendOfferStyles.sendOfferCardSection}>
            <View style={sendOfferStyles.sendOfferCategoriesBlock}>
              <Text style={sendOfferStyles.sendOfferCardHeading}>
                Categories
              </Text>
              <View style={sendOfferStyles.sendOfferChipList}>
                {[
                  "Illustrator",
                  "Interior Design",
                  "Photoshop",
                  "Creative",
                  "Minimal",
                  "Dark Mode",
                ].map((cat, idx) => (
                  <View key={idx} style={sendOfferStyles.sendOfferCategoryChip}>
                    <Text style={sendOfferStyles.sendOfferChipLabel}>
                      {cat}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={sendOfferStyles.sendOfferCardSection}>
            <View style={sendOfferStyles.sendOfferPricingBlock}>
              <Text style={sendOfferStyles.sendOfferCardHeading}>Pricing</Text>
              <View style={sendOfferStyles.pricingRow}>
                <View>
                  <Text style={sendOfferStyles.sendOfferPricingInfo}>
                    <Text style={sendOfferStyles.priceLabel}>
                      Total Price:{" "}
                    </Text>
                    <Text style={sendOfferStyles.sendOfferPricingHighlight}>
                      CAD 100
                    </Text>
                  </Text>
                </View>

                <View>
                  <Text style={sendOfferStyles.sendOfferPricingInfo}>
                    <Text style={sendOfferStyles.priceLabel}>
                      Hourly Rate:{" "}
                    </Text>
                    <Text style={sendOfferStyles.sendOfferPricingHighlight}>
                      CAD 10.00
                    </Text>
                  </Text>
                </View>
              </View>

              <Text style={sendOfferStyles.sendOfferProjectDuration}>
                Project Length:{" "}
                <Text style={sendOfferStyles.sendOfferPricingHighlight}>
                  10 days
                </Text>
              </Text>
              <View style={sendOfferStyles.sendOfferHourInfoRow}>
                <Text style={sendOfferStyles.sendOfferHourInfo}>2 Hours </Text>
                <Text style={sendOfferStyles.sendOfferIsInfo}>
                  is expected for the job to be done.
                </Text>
              </View>
            </View>
          </View>

          <View style={sendOfferStyles.sendOfferCardSection}>
            <Text style={sendOfferStyles.sectionTitle}>Offer New Price</Text>
            <View style={sendOfferStyles.row}>
              <View style={sendOfferStyles.box}>
                <Text style={sendOfferStyles.label}>Total Price</Text>
                <View style={sendOfferStyles.valueBox}>
                  <Text style={sendOfferStyles.currency}>CAD</Text>
                  <View style={sendOfferStyles.divider} />
                  <TextInput
                    style={sendOfferStyles.value}
                    placeholder="0"
                    placeholderTextColor="#666666"
                    keyboardType="numeric"
                    value={totalPrice}
                    onChangeText={setTotalPrice}
                  />
                </View>
              </View>

              <View style={sendOfferStyles.box}>
                <Text style={sendOfferStyles.label}>Hourly Rate</Text>
                <View style={sendOfferStyles.valueBox}>
                  <Text style={sendOfferStyles.currency}>CAD</Text>
                  <View style={sendOfferStyles.divider} />
                  <TextInput
                    style={sendOfferStyles.value}
                    placeholder="0/hr"
                    placeholderTextColor="#666666"
                    keyboardType="numeric"
                    value={hourlyRate}
                    onChangeText={setHourlyRate}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={sendOfferStyles.sendOfferCardSection}>
            <View style={sendOfferStyles.sendOfferDescriptionBlock}>
              <Text style={sendOfferStyles.sendOfferCardHeading}>
                Description
              </Text>
              <Text style={sendOfferStyles.sendOfferCardText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod.Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod.Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod.Lorem ipsum dolor
                sit amet, consectetur adipiscing elit, sed do eiusmod.Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod.Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod.Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod.Lorem ipsum dolor
                sit amet, consectetur adipiscing elit, sed do eiusmod.Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod.
              </Text>
            </View>
          </View>
          <View style={sendOfferStyles.sendOfferCardSection}></View>
        </ScrollView>
        <View style={sendOfferStyles.fixedSendOfferContainer}>
          <TouchableOpacity
            style={sendOfferStyles.sendOfferButton}
          >
            <Text style={sendOfferStyles.sendOfferButtonText}>Send Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const sendOfferStyles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#222222",
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 150,
  },

  sendOfferTitleBlock: {
    paddingBottom: 9,
  },
  sendOfferJobTitle: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 18,
    paddingBottom: 2,
    letterSpacing: 0.1,
  },
  sendOfferPostedTime: {
    color: "#c3c3c3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    paddingBottom: 5,
  },
  sendOfferCardSection: {
    borderTopWidth: 1,
    borderTopColor: "#ffffff1a",
    paddingTop: 10,
    paddingBottom: 8,
  },
  sendOfferCategoriesBlock: {
    paddingBottom: 5,
  },
  sendOfferCardHeading: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    paddingBottom: 5,
    paddingTop: 5,
    letterSpacing: 0.1,
  },
  sendOfferChipList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    paddingBottom: 5,
  },
  sendOfferCategoryChip: {
    backgroundColor: "#ffffff1a",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginRight: 6,
    marginBottom: 6,
  },
  sendOfferChipLabel: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
  },
  sendOfferPricingBlock: {
    paddingBottom: 5,
  },
  sendOfferPricingInfo: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
  sendOfferPricingHighlight: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
  },
  sendOfferProjectDuration: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
  sendOfferHourInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  sendOfferHourInfo: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    paddingTop: 6,
  },
  sendOfferIsInfo: {
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    paddingTop: 6,
  },
  sendOfferDescriptionBlock: {
    paddingBottom: 5,
  },
  sendOfferCardText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    paddingTop: 2,
    lineHeight: 22,
    paddingBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    paddingBottom: 8,
    paddingTop: 10,
    color: "#ffffff",
    letterSpacing: 0.1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 16,
  },
  box: {
    flex: 1,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    paddingBottom: 6,
  },
  valueBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 4,
  },
  currency: {
    color: "#D38979",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: "70%",
    backgroundColor: "#00000033",
    marginHorizontal: 7,
  },
  value: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  priceLabel: {
    color: "#ffffff ",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
    paddingBottom: 10,
  },
  fixedSendOfferContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
  },
  sendOfferButton: {
    backgroundColor: "#d17b68",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sendOfferButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.7,
  },
});
