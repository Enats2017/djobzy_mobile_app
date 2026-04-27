import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FontAwesome } from "@expo/vector-icons";
import Foundation from "@expo/vector-icons/Foundation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import { truncateWords } from "../../api/TruncateWords";
import GradientButton from "../../components/GradientButton";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import EmployerFooter from "../../components/EmployerFooter";
import NoContract from "../../components/NoContract";

const ActiveContract = () => {
  const [currentJobs, setCurrnetJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/active-contract`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setCurrnetJobs(data.employee || []);
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
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Active Contracts" navigation={navigation} />
          {loading ? (
            <Loading />
          ) : (
            <>
              {currentJobs.length > 0 ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 90 }}
                >
                  {currentJobs.map((currentJob, index) => (
                    <View style={styles.outerContainer} key={index}>
                      <View style={styles.cardContainer}>
                        <View style={styles.userRow}>
                          <Image
                            source={{
                              uri:
                                currentJob.photo ||
                                "https://randomuser.me/api/portraits/women/8.jpg",
                            }}
                            style={styles.avatar}
                          />

                          <View style={styles.userInfo}>
                            <View style={styles.nameRow}>
                              <View style={styles.userNameSection}>
                                <Text style={styles.userName}>
                                  {currentJob.full_name}
                                </Text>

                                <View style={styles.starRow}>
                                  {[...Array(5)].map((_, i) => (
                                    <FontAwesome
                                      key={i}
                                      name="star"
                                      style={styles.starIcon}
                                    />
                                  ))}
                                </View>
                              </View>
                              <View style={styles.paymentRow}>
                                <MaterialIcons
                                  name="verified"
                                  size={16}
                                  color="#c3c3c3"
                                />
                                <Text style={styles.paymentVerified}>
                                  Verification Level:{" "}
                                  {currentJob.verification_count}
                                  /7
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        <View style={styles.jobTitleSection}>
                          <Text style={styles.jobTitle}>{currentJob.subject}</Text>
                          <Text style={styles.postedDate}>
                            Start Date : {currentJob.payment_date}
                          </Text>
                        </View>

                        <View style={styles.jobInfoSection}>
                          <Text style={styles.infoText}>
                            Total Price:{" "}
                            <Text style={styles.infoHighlight}>
                              CAD {currentJob.bid_price}
                            </Text>{" "}
                            Hourly Rate:{" "}
                            <Text style={styles.infoHighlight}>
                              CAD {currentJob.prop_hourly_rate}
                            </Text>
                          </Text>
                          <Text style={styles.infoText}>
                            Expected Hours:{" "}
                            <Text style={styles.infoHighlight}>
                              {currentJob.prop_total_hour}
                            </Text>
                          </Text>

                          {currentJob.preferred_location && (
                            <View
                              style={{ flexDirection: "row", flexWrap: "wrap" }}
                            >
                              <Text style={styles.infoText}>Location: </Text>
                              <Text style={[styles.infoHighlight, { flex: 1 }]}>
                                {currentJob.preferred_location}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.jobDescriptionSection}>
                          <Text style={styles.descTitle}>Job Description</Text>
                          <Text style={styles.descText}>
                            {truncateWords(currentJob.description, 20)}
                          </Text>
                        </View>

                        <View style={styles.buttonSection}>
                          <GradientButton
                            title="View"
                            onPress={() =>
                              navigation.navigate("ViewCurrentJobPost", {
                                gid: currentJob.request_slug,
                              })
                            }
                          />
                        </View>
                      </View>

                      {/* {index !== currentJobs.length - 1 && <LineDivider />} */}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <NoContract
                  icon="document-text-outline"
                  title="No active contracts"
                  description="You don't have any active contract at the moment"
                />
              )}
            </>
          )}
        </View>
        <EmployerFooter />
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
  outerContainer: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: "#444444ff",
    borderRadius: 16,
    padding: 10,
    flex: 1,
    marginBottom: 15,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    width: "100%",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,

  },
  nameRow: {
    flexDirection: "column",
    gap: 5,
  },
  userNameSection: {

    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 3,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    flexShrink: 1,
    fontFamily: "Montserrat_500Medium",
  },
  starRow: {
    flexDirection: "row",
    gap: 3,
  },
  starIcon: {
    fontSize: 13,
    color: "#EBBE56",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIcon: {
    fontSize: 16,
    color: "#39A881",
  },
  paymentVerified: {
    color: "#ffffff",
    fontSize: 13,
    marginLeft: 4,
    fontFamily: "Montserrat_400Regular",
  },
  jobTitleSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  jobTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  postedDate: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Montserrat_400Regular",
    marginTop: 6,
  },
  jobInfoSection: {
    backgroundColor: "transparent",
    borderRadius: 12,
    borderColor: "#797474ff",
    borderWidth: 1,
    padding: 10,
    marginBottom: 14,
  },
  infoText: {
    color: "#ffffff",
    fontSize: 12,
    marginBottom: 5,
    fontFamily: "Montserrat_400Regular",
  },
  infoHighlight: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
  },
  remoteBadge: {
    flexDirection: "row",
    backgroundColor: "#FABB05",
    borderRadius: 22,
    paddingVertical: 2,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    width: "35%",
    gap: 7,
  },
  remoteText: {
    color: "#181a20",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    lineHeight: 19,
  },
  jobDescriptionSection: {
    backgroundColor: "transparent",
    borderRadius: 12,
    borderColor: "#797474ff",
    borderWidth: 1,
    padding: 15,
    marginBottom: 12,
  },
  descTitle: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "Montserrat_500Medium",
  },
  descText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  viewJobButton: {
    backgroundColor: "#f88371",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  viewJobButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(200,200,200,0.4)",
    marginHorizontal: 1,
    marginVertical: 15,
  },
});
export default ActiveContract;
