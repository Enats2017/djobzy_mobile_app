import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Footer from "../../components/Footer";
import { Ionicons, Feather } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import Loading from "../../components/Loading";
import NoTransactions from "../Wallet/NoTransactions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { toastError, toastSuccess } from "../../utils/toast";
import { useNotifications } from "../../context/MessageNotificationContext";
import EmployerFooter from "../../components/EmployerFooter";
import ReferralSocialShareButtons from "./ReferralSocialShareButtons";

const ReferralWallet = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("referral");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [tableFilled, setTableFilled] = useState(false);
  const [pendingReferrals, setPendingReferrals] = useState([]);
  const [completedReferrals, setCompletedReferrals] = useState([]);
  const [shareLinks, setshareLinks] = useState({});
  const [referralUrl, setReferralUrl] = useState("");
  const {admin} = useNotifications();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/Referral-Wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      // console.log(token);
      setPendingReferrals(data.pendingReferrals);
      setCompletedReferrals(data.completedReferrals);
      setReferralUrl(data.referral_url);
      setshareLinks(data.shareLinks);

      if (data.pendingReferrals.length > 0) {
        setTableFilled(true);
      } else {
        setTableFilled(false);
      }
    } catch (error) {
      console.error("Error fetching User:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const sendInvite = async () => {
    if (!email) {
      toastError("Please put a valid email");
      return;
    }
    try {
      setSendLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/invite-user-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invite_with_email: email.trim(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toastSuccess(data.message || "Invited Successfully");
        setEmail("");
      } else {
        toastError(data.message || data.error || "Failed");
      }
    } catch (error) {
      console.log(error);
      toastError("Something went wrong");
    } finally {
      setSendLoading(false);
    }
  };

  const collectPayments = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/referral-collect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        Alert.alert("Success", data.message);
        setCompletedReferrals((prev) => [...pendingReferrals, ...prev]);
        setPendingReferrals([]);
        setTableFilled(false);
      } else {
        Alert.alert("Error", data.message || "Failed to collect");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralUrl = async () => {
    if (!referralUrl) {
      toastError("Referral link not available");
      return;
    }
    await Clipboard.setStringAsync(referralUrl);
    toastSuccess("Referral link copied successfully");
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <PageNameHeaderBar
              title="Referral Wallet"
              navigation={navigation}
            />
          </View>
          {loading ? (
            <Loading />
          ) : (
            <KeyboardAwareScrollView
              enableOnAndroid
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 50 }}
              showsVerticalScrollIndicator={false}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === "referral" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("referral")}
                  >
                    <Text
                      style={
                        activeTab === "referral"
                          ? styles.activeTabText
                          : styles.tabText
                      }
                    >
                      Referral Wallet
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === "history" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("history")}
                  >
                    <Text
                      style={
                        activeTab === "history"
                          ? styles.activeTabText
                          : styles.tabText
                      }
                    >
                      Referral History
                    </Text>
                  </TouchableOpacity>
                </View>

                {activeTab == "referral" ? (
                  <>
                    {pendingReferrals.length > 0 ? (
                      pendingReferrals.map((item, index) => (
                        <View key={index} style={styles.tableCard}>
                          <View style={styles.tableRow}>
                            <View style={styles.tableLeftCell}>
                              <Text style={styles.tableLabel}>
                                Date for Income
                              </Text>
                            </View>

                            <View style={styles.dividerVert} />

                            <View style={styles.tableRightCell}>
                              <Text style={styles.tableValue}>
                                {item?.created}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.dividerHoriz} />

                          <View style={styles.tableRow}>
                            <View style={styles.tableLeftCell}>
                              <Text style={styles.tableLabel}>User</Text>
                            </View>
                            <View style={styles.dividerVert} />
                            <View style={styles.tableRightCell}>
                              <View>
                                <Text style={styles.tableValue}>
                                  {" "}
                                  {item?.get_referred_user?.full_name}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View style={styles.dividerHoriz} />

                          <View style={styles.tableRow}>
                            <View style={styles.tableLeftCell}>
                              <Text style={styles.tableLabel}>Contract ID</Text>
                            </View>
                            <View style={styles.dividerVert} />
                            <View style={styles.tableRightCell}>
                              <Text style={styles.tableValue}>{item?.gigid}</Text>
                            </View>
                          </View>

                          <View style={styles.dividerHoriz} />

                          <View style={styles.tableRow}>
                            <View style={styles.tableLeftCell}>
                              <Text style={styles.tableLabel}>
                                My Passive Income (3.0%)
                              </Text>
                            </View>
                            <View style={styles.dividerVert} />
                            <View style={styles.tableRightCell}>
                              <Text style={styles.tableValue}>
                                {item?.amount} CAD
                              </Text>
                            </View>
                          </View>

                          <View style={styles.dividerHoriz} />

                          <View style={styles.tableRow}>
                            <View style={styles.tableLeftCell}>
                              <Text style={styles.tableLabel}>ID</Text>
                            </View>
                            <View style={styles.dividerVert} />
                            <View style={styles.tableRightCell}>
                              <Text style={styles.tableValue}>{item?.id}</Text>
                            </View>
                          </View>
                        </View>
                      ))
                    ) : (
                      <NoTransactions emoji='⏳' title="No pending referrals found" />
                    )}
                    <View style={styles.rateContainer}>
                      <Ionicons
                        name="help-circle"
                        size={16}
                        color="#ffffff"
                        style={{ marginBottom: 3 }}
                      />
                      <Text style={styles.label}>
                        You can collect the income once a month
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        disabled={!tableFilled || loading}
                        onPress={collectPayments}
                        style={[
                          styles.button,
                          {
                            backgroundColor: tableFilled ? "#D17B68" : "#754A42",
                          },
                        ]}
                      >
                        {loading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={styles.buttonText}>
                            Collect the Payments
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    {completedReferrals.length > 0 ? (
                      completedReferrals.map((item, index) => (
                        <View key={index} style={styles.tableCard}>
                          <View style={styles.tableRow}>
                            <View style={styles.tableLeftCell}>
                              <Text style={styles.tableLabel}>
                                Date for Income
                              </Text>
                            </View>

                            <View style={styles.dividerVert} />

                            <View style={styles.tableRightCell}>
                              <Text style={styles.tableValue}>
                                {item?.created}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.dividerHoriz} />

                          <View style={styles.tableRow}>
                            <View style={styles.tableLeftCell}>
                              <Text style={styles.tableLabel}>User</Text>
                            </View>
                            <View style={styles.dividerVert} />
                            <View style={styles.tableRightCell}>
                              <View>
                                <Text style={styles.tableValue}>
                                  {" "}
                                  {item?.get_referred_user?.full_name}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View style={styles.dividerHoriz} />

                          <View style={styles.tableRow}>
                            <View style={styles.tableLeftCell}>
                              <Text style={styles.tableLabel}>Action</Text>
                            </View>
                            <View style={styles.dividerVert} />
                            <View style={styles.tableRightCell}>
                              <Text style={styles.tableValue}>
                                {item?.get_gig?.subject ||
                                  "Joined with your invitation"}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.dividerHoriz} />

                          <View style={styles.tableRow}>
                            <View style={styles.tableLeftCell}>
                              <Text style={styles.tableLabel}>
                                My Passive Income (3.0%)
                              </Text>
                            </View>
                            <View style={styles.dividerVert} />
                            <View style={styles.tableRightCell}>
                              <Text style={styles.tableValue}>
                                {item?.amount || 0} CAD
                              </Text>
                            </View>
                          </View>

                          <View style={styles.dividerHoriz} />

                          <View style={styles.tableRow}>
                            <View style={styles.tableLeftCell}>
                              <Text style={styles.tableLabel}>ID</Text>
                            </View>
                            <View style={styles.dividerVert} />
                            <View style={styles.tableRightCell}>
                              <Text style={styles.tableValue}>{item?.id}</Text>
                            </View>
                          </View>
                        </View>
                      ))
                    ) : (
                      <NoTransactions emoji="✅" title="No Completed referrals found" />
                    )}
                  </>
                )}

                <View style={styles.big}>
                  <Text style={styles.bigtext}>
                    Invite your friends and get bonuses
                  </Text>
                </View>
                <View style={styles.linkcontainer}>
                  <Text style={styles.title}>Invite with an email</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      placeholder="Invite with an email"
                      placeholderTextColor="#8F8F8F"
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                    />
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={sendInvite}
                      disabled={sendLoading}
                      loading={sendLoading}
                    >
                      {sendLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Feather name="send" size={22} color="#ffffff" />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.title}>Invite with an Link</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.textWrap}>
                      <Text
                        style={styles.linkText}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {referralUrl}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={copyReferralUrl}
                    >
                      <Ionicons name="copy" size={22} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.title}>Or share with social media</Text>
                  <View style={styles.socialMediaBtns}>
                    <ReferralSocialShareButtons shareLinks={shareLinks} />
                  </View>
                </View>
              </ScrollView>
            </KeyboardAwareScrollView>
          )}
        </View>
        {admin == 2 ? <EmployerFooter /> : <Footer />}
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
  tabContainer: {
    flexDirection: "row",
    borderColor: "#c5c5c591",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 25,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  tabText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  activeTab: {
    backgroundColor: "#C96B59",
    padding: 10,
    outlineColor: "#C96B59",
    outlineWidth: 1.5,
    borderRadius: 10,
  },

  activeTabText: {
    color: "#ffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
  },
  tableCard: {
    backgroundColor: "#000000",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 13,

    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
  },
  tableLeftCell: {
    flex: 1,
    justifyContent: "center",
  },
  tableRightCell: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 10,
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
    backgroundColor: "#FFFFFF1A",
  },
  dividerVert: {
    width: 1,
    height: "100%",
    backgroundColor: "#FFFFFF1A",
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
    paddingBottom: 20,
  },
  label: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#ffffff",
  },
  button: {
    paddingVertical: 11,
    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
  big: {
    paddingVertical: 10,
  },
  bigtext: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 30,
    color: "#ffffff",
  },
  inputWrapper: {
    backgroundColor: "#fff",
    height: 48,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingHorizontal: 2,
    marginBottom: 15,
  },
  textWrap: {
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#666666",
  },
  title: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 8,
  },
  iconButton: {
    width: 43,
    height: 43,
    backgroundColor: "#46A282",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  copyButton: {
    width: 43,
    height: 43,
    backgroundColor: "#CB7767",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  linkcontainer: {
    paddingBottom: 100,
  },
});

export default ReferralWallet;
