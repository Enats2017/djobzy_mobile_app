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
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.mainContainer}>
        <PageNameHeaderBar navigation={navigation} title="Services" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.serviceNameContainer}>
            <View style={styles.serviceNameBlock}>
              <Text style={styles.serviceTitle}>Test</Text>
              <View style={styles.timeRequiredRow}>
                <Text style={styles.timeRequiredLabel}>
                  Time Required for the service:
                </Text>
                <Text style={styles.nocalendarBadge}>no-calendar</Text>
              </View>
            </View>
          </View>

          <View style={styles.categoriesContainer}>
            <View style={styles.categoriesBlock}>
              <Text style={styles.sectionHeading}>Categories</Text>
              <View style={styles.chipList}>
                {[
                  "Illustrator",
                  "Interior Design",
                  "Photoshop",
                  "Creative",
                  "Minimal",
                  "Dark Mode",
                ].map((cat, idx) => (
                  <View key={idx} style={styles.chip}>
                    <Text style={styles.chipLabel}>{cat}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <View style={styles.descriptionBlock}>
              <Text style={styles.sectionHeading}>Description</Text>
              <Text style={styles.descriptionText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <View style={styles.descriptionBlock}>
              <Text style={styles.sectionHeading}>Description</Text>
              <Text style={styles.descriptionText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <View style={styles.descriptionBlock}>
              <Text style={styles.sectionHeading}>Description</Text>
              <Text style={styles.descriptionText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Text>
            </View>
          </View>

          <View style={styles.pricingContainer}>
            <View style={styles.pricingBlock}>
              <Text style={styles.sectionHeading}>Pricing</Text>
              <View style={styles.pricingContent}>
                <Text style={styles.pricingLabel}>Hourly rate:</Text>
                <Text style={styles.pricingValue}>5.65/</Text>
                <Text style={styles.pricingHour}>hours</Text>
              </View>

              <Text style={styles.pricingNote}>
                The price includes all taxes and charges in your jurisdiction,
                based on taxing codes for freelancers.
              </Text>
            </View>
          </View>

          <View style={styles.emptySpace} />
        </ScrollView>

        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => navigation.navigate("PromoteServiceEmployee")}
          >
            <Text style={styles.sendButtonText}>Send Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  paddingBottom: 139, 
},


  serviceNameContainer: {
    gap: 0,
  },
  serviceNameBlock: {
    gap: 4,
    paddingVertical: 12,
  },
  serviceTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
  },
  timeRequired: {
    color: "#c3c3c3",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },

  categoriesContainer: {
    gap: 0,
  },
  categoriesBlock: {
    borderTopWidth: 1,
    borderTopColor: "#ffffff1a",
    paddingVertical: 12,
    gap: 8,
  },
  sectionHeading: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    paddingTop: 6,
  },
  chipList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 10,
  },
  chip: {
    backgroundColor: "#ffffff1a",
    borderRadius: 60,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chipLabel: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
  },

  descriptionContainer: {
    gap: 0,
  },
  descriptionBlock: {
    borderTopWidth: 2,
    borderTopColor: "#ffffff1a",
    paddingVertical: 12,
    gap: 8,
  },
  descriptionText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    lineHeight: 20,
    paddingBottom: 8,
  },

  pricingContainer: {
    gap: 0,
  },
  pricingBlock: {
    borderTopWidth: 2,
    borderTopColor: "#ffffff1a",
    paddingVertical: 12,
    gap: 8,
  },
  pricingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  pricingLabel: {
    paddingRight: 4,
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
  },
  pricingValue: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    paddingRight: 2,
  },
  pricingNote: {
    color: "#999999",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    lineHeight: 18,
    paddingTop: 30,
  },

  emptySpace: {
    height: 10,
  },

  fixedButtonContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: "#d17b68",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
  timeRequiredRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeRequiredLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  nocalendarBadge: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  pricingHour: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#ffffff",
  },
});
