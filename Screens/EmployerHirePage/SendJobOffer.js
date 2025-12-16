import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../components/Footer";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmployerFooter from "../../components/EmployerFooter";

export default function SendJobOffer() {
  const navigation = useNavigation();
  const [totalPrice, setTotalPrice] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [offerLetter, setOfferLetter] = useState("");
  const [hireHours, setHireHours] = useState("");
  const [expectedTime, setExpectedTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { jobDetails } = route.params || {};

  
  const handleHourlyChange = (value) => {
    setHourlyRate(value);
    const total = parseInt(totalPrice);
    const hourly = parseInt(value);
    if (!total || !hourly) {
      setExpectedTime(0);
      return;
    }
    if (hourly > total) {
      Alert.alert(
        "Invalid Input",
        "Hourly rate cannot be more than total price."
      );
      setExpectedTime(0);
      return;
    }
    const result = total / hourly;
    setExpectedTime(Math.ceil(result));
  };

  const handleTotalPriceChange = (value) => {
    setTotalPrice(value);
    const finalPrice = parseInt(value);
    const hourly = parseInt(hourlyRate);

    if (!finalPrice || !hourly) {
      setExpectedTime(0);
      return;
    }
    const result = finalPrice / hourly;
    setExpectedTime(Math.ceil(result));
  };

  const handleProcessingFeePriceChange = (value) => {
    setTotalPrice(value);
    const calculateProcessingTotal = parseFloat(value);
    if (!calculateProcessingTotal || calculateProcessingTotal <= 0) {
      setTotalPrice(0);
    } else {
      const fee = calculateProcessingTotal * 0.15;
      const finalPayment = calculateProcessingTotal + fee;
      setTotalPrice(finalPayment.toFixed(2));
    }
  };

  const sendOffer = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/employer-send-offer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emp_id: jobDetails.emp_id,
          job_id: jobDetails.gig_details.gid,
          offer_prices: totalPrice,
          offer_hourly_rates: hourlyRate,
          hire_total_hours: expectedTime,
          expected_hour: expectedTime,
          offer_letter: offerLetter,
        }),
      });

      const data = await res.json();
      if (data.status === 200) {
        Alert.alert("Success", "Offer sent successfully");
         navigation.navigate("PostJobDetails",{jobId:data.slug})
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("SEND OFFER API ERROR", error);
      Alert.alert("Error", "Could not send offer");
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.mainContainer}>
        <PageNameHeaderBar navigation={navigation} title="Send a Job Offer" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sendOfferTitleBlock}>
            <Text style={styles.sendOfferJobTitle}>
              {jobDetails?.gig_details?.subject}
            </Text>
            <Text style={styles.sendOfferPostedTime}>
              {jobDetails.gig_details?.created}
            </Text>
          </View>
          <View style={styles.sendOfferCardSection}>
            <View style={styles.sendOfferCategoriesBlock}>
              <Text style={styles.sendOfferCardHeading}>
                Categories
              </Text>
              <View style={styles.sendOfferChipList}>
                {jobDetails.category && jobDetails.category.length > 0 ? (
                  jobDetails.category.map((item, idx) => (
                    <View
                      key={idx}
                      style={styles.sendOfferCategoryChip}
                    >
                      <Text style={styles.sendOfferChipLabel}>
                        {item.subname}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.sendOfferChipLabel}>
                    No Category
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.sendOfferCardSection}>
            <View style={styles.sendOfferPricingBlock}>
              <Text style={styles.sendOfferCardHeading}>Pricing</Text>
              <View style={styles.pricingRow}>
                <View>
                  <Text style={styles.sendOfferPricingInfo}>
                    <Text style={styles.priceLabel}>
                      Total Price:{" "}
                    </Text>
                    <Text style={styles.sendOfferPricingHighlight}>
                      CAD {jobDetails.gig_details?.fixed_minimum || 0}
                    </Text>
                  </Text>
                </View>
                <View>
                  <Text style={styles.sendOfferPricingInfo}>
                    <Text style={styles.priceLabel}>
                      Hourly Rate:{" "}
                    </Text>
                    <Text style={styles.sendOfferPricingHighlight}>
                      CAD:{jobDetails.gig_details?.hour_minimum || 0}
                    </Text>
                  </Text>
                </View>
              </View>
              <Text style={styles.sendOfferProjectDuration}>
                Project Length:{" "}
                <Text style={styles.sendOfferPricingHighlight}>
                  {jobDetails.gig_details?.duration_days || []}
                </Text>
              </Text>
              <View style={styles.sendOfferHourInfoRow}>
                <Text style={styles.sendOfferHourInfo}>
                  {jobDetails.gig_details?.expected_hour} Hours{" "}
                </Text>
                <Text style={styles.sendOfferIsInfo}>
                  is expected for the job to be done.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.sendOfferCardSection}>
            <Text style={styles.sectionTitle}>Offer New Price</Text>
            <View style={styles.row}>
              <View style={styles.box}>
                <Text style={styles.label}>Total Price</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.currency}>CAD</Text>
                  <View style={styles.divider} />
                  <TextInput
                    style={styles.value}
                    placeholder="0"
                    placeholderTextColor="#666666"
                    keyboardType="numeric"
                    value={totalPrice}
                    onChangeText={(text) => {
                      handleTotalPriceChange(text);
                      handleProcessingFeePriceChange(text);
                      setTotalPrice(text.replace(/[^0-9.]/g, ""));
                    }}
                  />
                </View>
              </View>
              <View style={styles.box}>
                <Text style={styles.label}>Hourly Rate</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.currency}>CAD</Text>
                  <View style={styles.divider} />
                  <TextInput
                    style={styles.value}
                    placeholder="0/hr"
                    placeholderTextColor="#666666"
                    keyboardType="numeric"
                    value={hourlyRate}
                    onChangeText={(text) => {
                      handleHourlyChange(text);
                      setHourlyRate(text.replace(/[^0-9.]/g, ""));
                    }}
                  />
                </View>
              </View>
            </View>
            <Text style={styles.note}>
              <Text style={styles.bold}>{expectedTime} Hours </Text>
              is expected for the job to be done.
            </Text>
            <View style={styles.sendOfferCardSection}>
              <Text style={styles.sectionTitle}>Offer Letter</Text>
              <TextInput
                style={styles.textArea}
                multiline
                value={offerLetter}
                onChangeText={setOfferLetter}
                placeholder="Enter offer description..."
                placeholderTextColor="#666"
                textAlignVertical="top"

              />
            </View>
          </View>

          <View style={styles.sendOfferCardSection}>
            <View style={styles.sendOfferDescriptionBlock}>
              <Text style={styles.sendOfferCardHeading}>
                Description
              </Text>
              <Text style={styles.sendOfferCardText}>
                {jobDetails.gig_details?.description}
              </Text>
            </View>
          </View>
          <View style={styles.sendOfferCardSection}></View>
        </ScrollView>
        <View style={styles.fixedSendOfferContainer}>
          <TouchableOpacity
            style={styles.sendOfferButton}
            onPress={sendOffer}
          >
            {loading ? (
                      <ActivityIndicator color="#fff" size="large" />
                    ) : (
                      <Text style={styles.sendOfferButtonText}>Send Offer</Text>
                    )}
          </TouchableOpacity>
        </View>
         
      </View>
      <EmployerFooter/>
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
   textArea: {
    backgroundColor: "#FFFFFF0D",
    color: "#c3c3c3c3",
    borderRadius: 12,
    fontFamily: "Montserrat_400Medium",
    fontStyle: "italic",
    fontSize: 14,
    paddingHorizontal: 15,
    minHeight: 150,
    marginTop: 6,
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
  note: {
    color: "#ffffff",
    fontSize: 12,
    fontStyle: "italic",
    fontFamily: "Montserrat_400Medium",
    marginTop: 7,
    marginBottom: 16,
  },
  bold: {
    color: "#ffffff",
    fontStyle: "italic",
    fontSize: 12,
    fontFamily: "Montserrat_600SemiBold",
  },
});
