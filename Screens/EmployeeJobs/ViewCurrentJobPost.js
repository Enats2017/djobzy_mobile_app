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
import { useNotifications } from "../../context/MessageNotificationContext";
import RequirementDataList from "../Employer/RequirementDataList";
import LanguageDataList from "../Employer/LanguagesDataList";
import JobAddressBlock from "../Employer/JobAddressBlock";
import EmployerPaymentAcceptDeclineModal from "../EmployerJobs/EmployerPaymentAcceptDeclineModal";
import AdditionalPaymentRequestBanner from "../EmployerJobs/AdditionalPaymentRequestBanner";
import StarRating from "../../components/StarRating";

const ViewCurrentJobPost = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const { gid } = route.params || [];
  const [job, setJob] = useState([]);
  const [category, setCategory] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { admin } = useNotifications();

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
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
      setCategory(data.category);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const shouldShowModal = admin === 2 && job?.details?.request_status !== 2 && job?.newRequest?.change_status === 0;
  useEffect(() => {
    let timer;
    if (!loading && shouldShowModal) {
      timer = setTimeout(() => {
        setShowRequestModal(true);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [loading, shouldShowModal]);

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
                          {job.details?.payment_date}
                        </Text>
                      </View>
                      <View style={styles.metaItemRowRight}>
                        <Text style={styles.metaLabel}>Contract ID:</Text>
                        <Text style={styles.metaValue}>{job.details?.contract_id}</Text>
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
                          <StarRating rating={job.user?.rating} starSize={13} />
                        </View>
                      </View>

                      <View style={styles.verifLevelRow}>
                        <MaterialIcons
                          name="verified"
                          size={16}
                          color="#c3c3c3"
                          style={{ marginRight: 3 }}
                        />
                        <Text style={styles.verification}>
                          Verification Level: {job.user?.verification_count}/7
                        </Text>
                      </View>

                      {job.user?.address && (
                        <View style={styles.locationRow}>
                          <FontAwesome5
                            name="map-marker-alt"
                            size={16}
                            color="#c3c3c3"
                            style={{ marginRight: 3 }}
                          />
                          <Text style={styles.verification}>{job.user?.address}</Text>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity style={styles.menuButton}>
                      <Entypo name="dots-three-vertical" size={20} color="#bbb" />
                    </TouchableOpacity>
                  </View>

                  {job?.authUser?.id === job?.details?.prop_user_id && job?.details?.request_status === 1 && job?.newRequest?.change_status === 0 && (
                    <AdditionalPaymentRequestBanner onView={() => setShowRequestModal(true)} />
                  )}
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

                  <RequirementDataList data={job.requirements} />
                  <LanguageDataList data={job.languages} />
                  <JobAddressBlock details={job?.details} />

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

        <EmployerPaymentAcceptDeclineModal
          visible={shouldShowModal && showRequestModal}
          onClose={() => setShowRequestModal(false)}
          onReopen={() => setShowRequestModal(true)}
          onRefresh={fetchData}
          gigProp={job?.gigProp}
          newRequest={job?.newRequest}
        />
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
    width: 80,
    height: 80,
    borderRadius: 160,
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
  menuButton: {
    marginBottom: "auto",
  },
  verifLevelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  verification: {
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "baseline",
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
