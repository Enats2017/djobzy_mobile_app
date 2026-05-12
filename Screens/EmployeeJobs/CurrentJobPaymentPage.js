import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Footer from "../../components/Footer";
import GradientButton from "../../components/GradientButton";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import EmployerFooter from "../../components/EmployerFooter";
import { useNotifications } from "../../context/MessageNotificationContext";
import RequestAdditionalPaymentModal from "./RequestAdditionalPaymentModal";
import { toastError, toastSuccess } from "../../utils/toast";
import StarRating from "../../components/StarRating";

export default function CurrentJobPaymentPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [user, setUser] = useState([]);
  const [data, setData] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { gid } = route.params || [];
  const { admin } = useNotifications();

  const fetchPayemnt = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/job-payment-page/${gid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setGigs(data.gig);
      setUser(data.user);
      setData(data);
      // console.log("API Success:", data);

    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdfInvoice = async () => {
    try {
      setInvoiceLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/send-invoice-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job_id: gid }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        toastSuccess("Invoice sent! Check your registered email.");
      } else {
        toastError(data.message || "Could not send invoice. Please try again.");
      }
    } catch (error) {
      console.log("API Error:", error);
      toastError("A connection error occurred. Please try again.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  useEffect(() => {
    fetchPayemnt();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar navigation={navigation} title="Payment Details" />
        {loading ? (
          <Loading />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90 }}
          >
            <View style={styles.topCard}>
              <View style={styles.topRow}>
                <View style={styles.topBox}>
                  <Text style={styles.topLabel}>Total Price</Text>
                  <Text style={styles.topValue}>
                    {gigs?.bid_price}
                    <Text style={styles.unit}> CAD</Text>
                  </Text>
                </View>
                <View style={styles.vertDivider} />
                <View style={styles.topBox}>
                  <Text style={styles.topLabel}>Hourly Rate</Text>
                  <Text style={styles.topValue}>
                    {gigs?.prop_hourly_rate}
                    <Text style={styles.unit}> CAD</Text>
                  </Text>
                </View>
                <View style={styles.vertDivider} />
                <View style={styles.topBox}>
                  <Text style={styles.topLabel}>Project Length</Text>
                  <Text style={styles.topValue}>
                    {gigs?.expected_hour}
                    <Text style={styles.unit}> hours</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.dividerLine} />
              <View style={styles.topMetaRow}>
                <View style={styles.metaItemRowLeft}>
                  <Text style={styles.metaLabel}>Start Date:</Text>
                  <Text style={styles.metaValue}>{gigs?.payment_date}</Text>
                </View>
                <View style={styles.metaItemRowRight}>
                  <Text style={styles.metaLabel}>Contract ID:</Text>
                  <Text style={styles.metaValue}>{gigs?.contract_id}</Text>
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
                  uri: user.photo,
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
                    {user.full_name}
                  </Text>
                  <View style={styles.starsInline}>
                    <StarRating rating={user.rating} starSize={13} />
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
                    Verification Level: {user.verification_count}/7
                  </Text>
                </View>

                {
                  user.address && (
                    <View style={styles.locationRow}>
                      <FontAwesome5
                        name="map-marker-alt"
                        size={13}
                        color="#c3c3c3"
                        style={{ marginRight: 2 }}
                      />
                      <Text style={styles.location}>{user.address}</Text>
                    </View>
                  )
                }
              </View>
            </View>
            <Text style={styles.payForTitle}>Payment For</Text>
            <Text style={styles.payForJob}>{gigs.subject}</Text>
            {data &&
              data.orders.map((val, index) => (
                <React.Fragment key={index}>
                  <View style={styles.tableCard}>
                    <View style={styles.tableRow}>
                      <View style={styles.tableLeftCell}>
                        <Text style={styles.tableLabel}>Date</Text>
                      </View>
                      <View style={styles.dividerVert} />
                      <View style={styles.tableRightCell}>
                        <Text style={styles.tableValue}>{val.payment_date}</Text>
                      </View>
                    </View>
                    <View style={styles.dividerHoriz} />
                    <View style={styles.tableRow}>
                      <View style={styles.tableLeftCell}>
                        <Text style={styles.tableLabel}>Payment Type</Text>
                      </View>
                      <View style={styles.dividerVert} />
                      <View style={styles.tableRightCell}>
                        <View>
                          {data.authUser?.id == data.gigProp?.prop_user_id ? (
                            <Text style={styles.tableValue}>Expenses</Text>
                          ) : (
                            <Text style={styles.tableValue}>Income</Text>
                          )}
                        </View>
                      </View>
                    </View>
                    <View style={styles.dividerHoriz} />
                    <View style={styles.tableRow}>
                      <View style={styles.tableLeftCell}>
                        <Text style={styles.tableLabel}>Payment Status</Text>
                      </View>
                      <View style={styles.dividerVert} />
                      <View style={styles.tableRightCell}>
                        {val.status && val.status == 1 ? (
                          <>
                            {
                              val.payment_release_status == 0 ? (
                                <Text style={styles.tableValue}>In Escrow Account</Text>
                              ) : (
                                <Text style={styles.tableValue}>Completed</Text>
                              )
                            }
                          </>
                        ) : (
                          <Text style={styles.tableValue}>Pending</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.dividerHoriz} />
                    <View style={styles.tableRow}>
                      <View style={styles.tableLeftCell}>
                        <Text style={styles.tableLabel}>Payment Method</Text>
                      </View>
                      <View style={styles.dividerVert} />
                      <View style={styles.tableRightCell}>
                        <Text style={styles.tableValue}>{val.ptype}</Text>
                      </View>
                    </View>
                    <View style={styles.dividerHoriz} />
                    <View style={styles.tableRow}>
                      <View style={styles.tableLeftCell}>
                        <Text style={styles.tableLabel}>Price</Text>
                      </View>
                      <View style={styles.dividerVert} />
                      <View style={styles.tableRightCell}>
                        <Text style={styles.tableValue}>CAD {val.amount}</Text>
                      </View>
                    </View>
                    <View style={styles.dividerHoriz} />
                    <View style={styles.tableRow}>
                      <View style={styles.tableLeftCell}>
                        <Text style={styles.tableLabel}>Reference ID</Text>
                      </View>
                      <View style={styles.dividerVert} />
                      <View style={styles.tableRightCell}>
                        <Text style={styles.tableValue}>{val.ref}</Text>
                      </View>
                    </View>
                  </View>
                  {data.authUser?.admin !== 0 && (
                    <View style={styles.tableCard}>
                      <View style={styles.tableRow}>
                        <View style={styles.tableLeftCell}>
                          <Text style={styles.tableLabel}>Date</Text>
                        </View>
                        <View style={styles.dividerVert} />
                        <View style={styles.tableRightCell}>
                          <Text style={styles.tableValue}>{val.payment_date}</Text>
                        </View>
                      </View>

                      <View style={styles.dividerHoriz} />

                      <View style={styles.tableRow}>
                        <View style={styles.tableLeftCell}>
                          <Text style={styles.tableLabel}>Payment Type</Text>
                        </View>
                        <View style={styles.dividerVert} />
                        <View style={styles.tableRightCell}>
                          <Text style={styles.tableValue}>Fee</Text>
                        </View>
                      </View>

                      <View style={styles.dividerHoriz} />

                      <View style={styles.tableRow}>
                        <View style={styles.tableLeftCell}>
                          <Text style={styles.tableLabel}>Payment Status</Text>
                        </View>
                        <View style={styles.dividerVert} />
                        <View style={styles.tableRightCell}>
                          <Text style={styles.tableValue}>
                            {val.status === 0 ? "Pending" : "Completed"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.dividerHoriz} />

                      <View style={styles.tableRow}>
                        <View style={styles.tableLeftCell}>
                          <Text style={styles.tableLabel}>Payment Method</Text>
                        </View>
                        <View style={styles.dividerVert} />
                        <View style={styles.tableRightCell}>
                          <Text style={styles.tableValue}>{val.ptype}</Text>
                        </View>
                      </View>

                      <View style={styles.dividerHoriz} />

                      <View style={styles.tableRow}>
                        <View style={styles.tableLeftCell}>
                          <Text style={styles.tableLabel}>Fee</Text>
                        </View>
                        <View style={styles.dividerVert} />
                        <View style={styles.tableRightCell}>
                          <Text style={styles.tableValue}>
                            CAD {val.processing_fee}
                          </Text>
                        </View>
                      </View>

                    </View>
                  )}
                </React.Fragment>
              ))
            }
            <View style={styles.tableCard}>
              <View style={styles.tableRow}>
                <View style={styles.tableLeftCell}>
                  <Text style={styles.tableLabel}>All Payments</Text>
                </View>
                <View style={styles.dividerVert} />
                <View style={styles.tableRightCell}>
                  <Text style={styles.tableValue}>CAD {data.total_payment}</Text>
                </View>
              </View>
            </View>
            <View style={styles.footer}>
              {data?.authUser?.id != gigs?.req_user_id && (
                <GradientButton title="Download PDF" onPress={downloadPdfInvoice} disabled={invoiceLoading} loading={invoiceLoading} />
              )}
              {data?.authUser?.id == gigs?.req_user_id && admin == 0 && gigs.request_status == 1 && (
                <GradientButton
                  title="Request an additional payment"
                  onPress={() => setShowPaymentModal(true)}
                />
              )}
            </View>
          </ScrollView>
        )}
        {data?.authUser?.id == gigs?.req_user_id && admin == 0 && gigs.request_status == 1 && (
          <RequestAdditionalPaymentModal
            visible={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            data={data}
            prpId={gigs.prp_id}
            initialTotal={gigs?.bid_price}
            initialHourly={gigs?.prop_hourly_rate}
          />
        )}

      </View>
      {admin == 2 ? <EmployerFooter /> : <Footer />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
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
    justifyContent: "center",
    gap: 4,
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
    padding: 12,
    paddingVertical: 20,
    backgroundColor: "#444",
    borderRadius: 12,
    marginVertical: 16,
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
  starsInline: {
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
  },
  location: {
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    marginLeft: 3,
  },
  payForTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",

    marginTop: 4,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  payForJob: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Montserrat_600SemiBold",

    marginBottom: 10,
    letterSpacing: 0.6,
  },
  tableCard: {
    backgroundColor: "#000000",

    borderRadius: 11,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    // paddingVertical:4,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    paddingHorizontal: 14,
  },
  tableLeftCell: {
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 14,
  },
  tableRightCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingRight: 14,
    marginLeft: 20,
  },
  tableLabel: {
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  tableValue: {
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  dividerHoriz: {
    height: 1,
    backgroundColor: "#FFFFFF33",
    marginHorizontal: 0,
  },
  dividerVert: {
    width: 1,
    height: "100%",
    backgroundColor: "#39393a",
  },
});
