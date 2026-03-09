import React, { useEffect, useState } from "react";
import {
  Ionicons,
  FontAwesome5,
  FontAwesome,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import EmployerFooter from "../../components/EmployerFooter";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";



const ViewCurrentJobPost = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const { gid } = route.params || [];

  const [job, setJob] = useState([]);
  const [category, setCategory] = useState([]);
  const [admin, setAdmin] = useState(0);


  const fetchData = async () => {
    try {
      console.log(gid);

      const token = await AsyncStorage.getItem("token");
      console.log(token);

      const response = await fetch(
        `${API_URL}/user-current-job-details/${gid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      setJob(data);
      console.log("1111jobdata", data);

      setCategory(data.category);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("1111", job.request_status);

  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    setAdmin(user?.admin);
  };

  useEffect(() => {
    loadUser();
    fetchData();
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {
            loading ? (
              <Loading />
            ) : (
              <>
                <PageNameHeaderBar
                  navigation={navigation}
                  title={
                    job?.details?.request_status == 2
                      ? "My Completed Contract"
                      : "My Active Contract"
                  }
                />
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ paddingBottom: 100 }}
                >
                  <View style={styles.topCard}>
                    <View style={styles.topRow}>
                      <View style={styles.topBox}>
                        <Text style={styles.topLabel}>Total Price</Text>
                        <Text style={styles.topValue}>
                          {job.gigProp?.bid_price}
                          <Text style={styles.unit}> CAD</Text>
                        </Text>
                      </View>
                      <View style={styles.vertDivider} />
                      <View style={styles.topBox}>
                        <Text style={styles.topLabel}>Hourly Rate</Text>
                        <Text style={styles.topValue}>
                          {job.gigProp?.prop_hourly_rate}
                          <Text style={styles.unit}> CAD</Text>
                        </Text>
                      </View>
                      <View style={styles.vertDivider} />
                      <View style={styles.topBox}>
                        <Text style={styles.topLabel}>Project Length</Text>
                        <Text style={styles.topValue}>
                          {job.gigProp?.prop_total_hour}
                          <Text style={styles.unit}> hours</Text>
                        </Text>
                      </View>
                    </View>
                    <View style={styles.dividerLine} />
                    <View style={styles.topMetaRow}>
                      <View style={styles.metaItemRowLeft}>
                        <Text style={styles.metaLabel}>Start Date:</Text>
                        <Text style={styles.metaValue}>
                          {job.details?.award_date}
                        </Text>
                      </View>
                      <View style={styles.metaItemRowRight}>
                        <Text style={styles.metaLabel}>Contract ID:</Text>
                        <Text style={styles.metaValue}>{job.details?.gid}</Text>
                      </View>
                    </View>
                    <View style={styles.messagesRow}>
                      <View style={styles.newMsgBox}>
                        <Text style={styles.metaLabel}>New Messages</Text>
                        <Text style={styles.metaValue}>0</Text>
                      </View>
                      <TouchableOpacity style={styles.messagesBtn}>
                        <Text style={styles.messagesBtnText}>Messages</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.userCard}>
                    <Image
                      source={{
                        uri: job.user?.photo,
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                      <View style={styles.nameStarsWrapper}>
                        <Text
                          style={styles.userName}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {job.user?.full_name}
                        </Text>
                        <View style={styles.starsInline}>
                          {[...Array(5)].map((_, i) => (
                            <FontAwesome
                              key={i}
                              name="star"
                              size={13}
                              color="#EBBE56"
                              style={{ marginLeft: 2 }}
                            />
                          ))}
                        </View>
                      </View>

                      <View style={styles.verifLevelRow}>
                        <MaterialIcons
                          name="verified"
                          size={16}
                          color="#c3c3c3"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.verification}>
                          Verification Level: {job.user?.verification_count}/7
                        </Text>
                      </View>

                      {job.user?.address && (
                        <View style={styles.locationRow}>
                          <FontAwesome5
                            name="map-marker-alt"
                            size={13}
                            color="#c3c3c3"
                            style={{ marginRight: 2 }}

                          />
                          <Text style={styles.verification}>{job.user?.address}</Text>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity style={styles.menuButton}>
                      <Entypo name="dots-three-vertical" size={20} color="#bbb" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.section}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.jobTitle}>{job.details?.subject}</Text>
                    </View>
                  </View>

                  <View
                    style={{ backgroundColor: "#ffffff33", height: 1, width: "100%" }}
                  />
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <View style={styles.tagContainer}>
                      {category.map((cat, i) => (
                        <View key={i} style={styles.tag}>
                          <Text style={styles.tagText}>{cat.subname}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View
                    style={{ backgroundColor: "#ffffff33", height: 1, width: "100%" }}
                  />
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                      {job.details?.description}
                    </Text>
                  </View>
                </ScrollView>
                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.chatBtn}>
                    <Text style={styles.btnText}>Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() =>
                      navigation.navigate("CurrentJobPaymentPage", {
                        gid: job.details?.gid,
                      })
                    }
                  >
                    <Text style={styles.btnText}>Payment Details</Text>
                  </TouchableOpacity>
                </View>
              </>
            )
          }
        </View>

        {admin == 2 ? <EmployerFooter /> : <Footer />}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#222222"
  },
  topCard: {
    padding: 12,
    backgroundColor: "#2c2c2e",
    borderRadius: 12,
    borderColor: "#ffffff33",
    borderWidth: 2,
    paddingVertical: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBox: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    justifyContent: "center",
    minWidth: 0,
  },
  topLabel: {
    fontSize: 12,
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
  },
  topValue: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
  },
  unit: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    marginTop: 2,
  },
  dividerLine: {
    height: 2,
    backgroundColor: "#FFFFFF33",
    marginBottom: 15,
    marginTop: 10,
  },
  vertDivider: {
    width: 2,
    height: "70%",
    backgroundColor: "#444",
  },
  topMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 2,
  },
  metaItemRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  metaItemRowRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  metaLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  metaValue: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    marginLeft: 6,
  },
  messagesRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF33",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  newMsgBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    flex: 1,
  },
  messagesBtn: {
    backgroundColor: "#D17B68",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: "center",
    marginLeft: 10,
  },
  messagesBtnText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    paddingVertical: 20,
    backgroundColor: "#444",
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 14,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#c3c3c3",
    marginRight: 13,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 18,
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    flexShrink: 1,
  },
  nameStarsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    maxWidth: "100%",
  },

  starsInline: {
    flexDirection: "row",
    marginTop: 0,
  },
  verifLevelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    marginBottom: 2,
  },
  verification: {
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 2,
    gap: 4,
  },
  location: {
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    marginLeft: 3,
  },
  section: {
    paddingVertical: 11,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: "column",
    gap: 5,
  },
  jobTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
  },
  uploadTime: {
    color: "#c3c3c3c3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#ffffff1a",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
  },
  tagText: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 10,
  },
  priceText: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
  boldText: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
  },
  descriptionText: {
    color: "#ffffff",
    fontFamily: "Montserrat_400",
    fontSize: 16,
    lineHeight: 24,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingBottom: 90,
    paddingTop: 10,
  },
  chatBtn: {
    flex: 1,
    backgroundColor: "#D17B68",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  payBtn: {
    flex: 1,
    backgroundColor: "#46A282",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  btnText: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
});

export default ViewCurrentJobPost;
