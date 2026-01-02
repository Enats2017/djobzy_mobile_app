import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import EmployerFooter from "../../components/EmployerFooter";
import ConfirmModal from "../../components/ConfirmModal";

const EmployerSentOffer = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [sentOffer, setSentOffer] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fetchSentOffer = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/sent-offer`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch job");
      const data = await response.json();
      setSentOffer(data.gigs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSentOffer();
  }, []);

  const hidedata = async (oid) => {
    setSubmitted(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/hide-offer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: oid }),
      });
      const data = await response.json();
      if (data.status == 200) {
        setSentOffer((prev) => prev.filter((offer) => offer.oid !== oid));
        Alert.alert("Success", " Data hide Successfully");
        setModalVisible(false);
      }
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Sent Offer" navigation={navigation} />
          {loading ? (
            <Loading />
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
              {sentOffer.length > 0 ? (
                sentOffer.map((item, index) => (
                  <View key={index} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.avatarWrapperOuter}>
                        <Image
                          source={{ uri: item.photo }}
                          style={styles.avatarImage}
                        />
                      </View>

                      <View style={styles.userInfo}>
                        <View style={styles.nameStarsRow}>
                          <Text style={styles.username}>{item.name}</Text>
                          <View style={styles.starsRow}>
                            {[...Array(5)].map((_, i) => (
                              <FontAwesome
                                key={i}
                                name="star"
                                size={10}
                                color="#EBBE56"
                              />
                            ))}
                          </View>
                        </View>

                        <View style={styles.verificationRow}>
                          <MaterialIcons
                            name="verified"
                            size={16}
                            color="#C3C3C3"
                          />
                          <Text style={styles.verification}>
                            Verification Level: {item.verification_count}/7
                          </Text>
                        </View>
                      </View>

                      <View style={styles.offeredSection}>
                        <Text style={styles.offeredPriceText}>
                          Offered Price
                        </Text>
                        <View style={styles.cadButton}>
                          <Text style={styles.cadButtonText}>
                            CAD {item.offer_price}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.title}>{item.subject}</Text>
                    <Text style={styles.posted}>Posted On: {item.dated}</Text>

                    <View style={styles.sectionBox}>
                      <Text style={styles.sectionTitle}>
                        Introduction Letter
                      </Text>
                      <Text style={styles.sectionText}>
                        {item.desc_proposal}
                      </Text>
                    </View>

                    <View style={styles.sectionBox}>
                      <Text style={styles.sectionTitle}>Job Description</Text>
                      <Text style={styles.sectionText}>{item.description}</Text>
                    </View>

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.hideBtn}
                        onPress={() => {
                          setSelectedOffer(item);
                          setModalVisible(true);
                        }}
                      >
                        <Text style={styles.hidetext}>Hide</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() =>
                          navigation.navigate("PostJobDetails", {
                            jobId: item.request_slug,
                          })
                        }
                      >
                        <Text style={styles.viewBtnText}>View</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.chatBtn}>
                        <Text style={styles.chatBtnText}>Chat</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text
                  style={{ textAlign: "center", marginTop: 50, color: "#fff" }}
                >
                  No Applicants Found
                </Text>
              )}
            </ScrollView>
          )}
        </View>
        <ConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={() => hidedata(selectedOffer?.oid)}
          disabled={submitted}
          loading={submitted}
          title="Hide Offer"
          message="Are you sure you want to hide this offer?"
          confirmText="Yes, Hide"
        />
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
  card: {
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
    flex: 1,
    padding: 15,
    marginBottom: 15,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarWrapperOuter: {
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 30,
    width: 55,
    height: 55,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },

  userInfo: { flex: 1 },

  nameStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  starsRow: {
    flexDirection: "row",
  },

  username: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginLeft: 8,
  },

  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 8,
  },
  verification: {
    color: "#C3C3C3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  cadButton: {
    backgroundColor: "#FDBF2D",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cadButtonText: {
    fontFamily: "Montserrat_700Bold",
    color: "#fff",
    fontSize: 13,
  },

  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 2,
    fontFamily: "Montserrat_700Bold",
  },
  posted: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 12,
  },

  sectionBox: {
    borderColor: "#ffffff33",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 6,
    fontFamily: "Montserrat_500Medium",
  },
  sectionText: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Montserrat_400Regular",
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
    width: "100%",
  },

  viewBtn: {
    backgroundColor: "#C96B59",
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  viewBtnText: {
    fontFamily: "Montserrat_700Bold",
    color: "#fff",
    fontSize: 15,
  },

  offeredPriceText: {
    color: "#ffffff",
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Montserrat_500Medium",
    marginBottom: 4,
  },

  chatBtn: {
    backgroundColor: "#46A282",
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  hideBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  chatBtnText: {
    fontFamily: "Montserrat_700Bold",
    color: "#fff",
    fontSize: 15,
  },
  hidetext: {
    fontFamily: "Montserrat_700Bold",
    color: "#333333",
    fontSize: 15,
  },
});

export default EmployerSentOffer;
