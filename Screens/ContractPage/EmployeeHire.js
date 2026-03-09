import React, { useState, useEffect } from "react";

import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import QuestionMark from "../../components/QuestionMark";
import { FontAwesome } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import EmployerFooter from "../../components/EmployerFooter";
import { ScrollView } from "react-native-gesture-handler";
import Loading from "../../components/Loading";
import { toastError, toastSuccess } from "../../utils/toast";
import * as Linking from "expo-linking";

const EmployeeHire = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { gid } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submit, setSubmit] = useState(false);

  const fetchUserAppliedDetials = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/view-profile/${gid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setProfileData(data?.profile);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    if (gid) {
      fetchUserAppliedDetials();
    }
  }, [gid]);

  const hireEmployer = async () => {
    try {
      setSubmit(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/hire-employer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: gid,
        }),
      });
      const data = await response.json();
      console.log("Hire response:", data);
      if (data.status === 200) {
        const paymentUrl = `${data?.payment_url}?pt=${token}`;
        if (paymentUrl) {
          setSubmit(false);
          Linking.openURL(paymentUrl); // payment page
        } else {
          toastError("Payment URL not received.");
        }
      } else {
        toastError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toastError("Network error");
    } finally {
      setSubmit(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Details" navigation={navigation} />
          {
            loading ? (
              <Loading />
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.userInfoRow}>
                  <Image
                    source={{
                      uri: profileData?.photo || "https://randomuser.me/api/portraits/women/82.jpg",
                    }}
                    style={styles.avatar}
                  />

                  <View style={styles.userDetails}>
                    <View style={styles.headerRow}>
                      <Text style={styles.userName}> {profileData?.full_name}</Text>
                      <TouchableOpacity style={styles.menuButton}>
                        {/* <Entypo name="dots-three-vertical" size={20} color="#bbb" /> */}
                      </TouchableOpacity>
                    </View>

                    <View style={styles.verifyRow}>
                      <MaterialIcons name="verified" size={16} color="#c3c3c3" />
                      <Text style={styles.verifyText}>Verification Level:  {profileData?.verification_count ?? "0"}/7</Text>
                    </View>

                    <View style={styles.locationRow}>
                      <Entypo name="location-pin" size={16} color="#c3c3c3" />
                      <Text style={styles.locationText}>{profileData?.preferred_location || "No Location"}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <View style={styles.priceBox}>
                    <Text style={styles.priceLabel}>Total Price</Text>
                    <Text style={styles.priceValue}>{profileData?.bid_price} CAD</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.priceBox}>
                    <Text style={styles.priceLabel}>Hourly Rate</Text>
                    <Text style={styles.priceValue}>{profileData?.prop_hourly_rate} CAD</Text>
                  </View>
                </View>
                <View style={styles.description}>
                  <Text style={styles.desText}>
                    {profileData?.desc_proposal}
                  </Text>
                </View>
                <TouchableOpacity style={styles.offerHeader} activeOpacity={0.7}>
                  <FontAwesome name="question-circle" size={18} color="#c3c3c3" />
                  <Text style={styles.offerText}>
                    Make sure to contract the employee via chat to arrange the
                    details.
                  </Text>
                </TouchableOpacity>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.buttonEdit} onPress={hireEmployer}>
                    {
                      submit ? (
                        <ActivityIndicator color="#fff" size={18} />
                      ) : (
                        <Text style={styles.buttonEditText}>Pay & Hire</Text>
                      )
                    }

                  </TouchableOpacity>
                  {/* <GradientButton 
                paddingVertical={12} 
               paddingHorizontal={0}
                borderRadius={7} 
                title="Pay & Hire"
                disabled={submit}
                loading={submit}  
                 onPress={hireEmployer}
                 /> */}
                  <TouchableOpacity style={styles.buttonBoost}>
                    <Text style={styles.buttonBoostText}>Chat</Text>
                  </TouchableOpacity>
                </View>

              </ScrollView>

            )
          }
        </View>
        <EmployerFooter />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#222222",
    flex: 1,
    paddingHorizontal: 15,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    padding: 16,
    marginTop: 0,
    marginVertical: 20,
    elevation: 3,
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#CFFFFC",
  },

  userDetails: {
    flex: 1,
    paddingLeft: 13,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  userName: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  verifyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
  },

  verifyText: {
    color: "#c3c3c3",
    marginLeft: 4,
    fontFamily: "Montserrat_400Medium",
    fontSize: 16,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },

  locationText: {
    color: "#c3c3c3",
    marginLeft: 2,
    fontFamily: "Montserrat_400Medium",
    fontSize: 16,
    maxWidth: "90%",
    flexWrap: "wrap",
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
  desText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#ffffff",
  },
  offerHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    gap: 6,
  },

  offerText: {
    color: "#ffffff",
    fontSize: 14,
    flex: 1,
    fontFamily: "Montserrat_500Medium",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    paddingTop: 15,
  },
  buttonEdit: {
    flex: 1,
    backgroundColor: "#C96B59",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginRight: 10,
    marginTop: 10,
  },
  buttonEditText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.1,
  },
  buttonBoost: {
    flex: 1,
    backgroundColor: "#46a282",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 10,
  },
  buttonBoostText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.1,
  },
});

export default EmployeeHire;
