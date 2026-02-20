import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { truncateWords } from "../../api/TruncateWords";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfirmModal from "../../components/ConfirmModal";
import { toastSuccess } from "../../utils/toast";

const PendingOffer = ({ pendingOffer = [], onHide }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

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
        onHide(pendingOffer);
        toastSuccess("Offer Hide Successfully");
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
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarWrapperOuter}>
            <Image
              source={{
                uri: pendingOffer.photo,
              }}
              style={styles.avatarImage}
            />
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameStarsRow}>
              <Text style={styles.username}>{pendingOffer.full_name}</Text>
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesome
                    key={i}
                    name="star"
                    size={10}
                    color="#EBBE56"
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
            </View>
            <View style={styles.verificationRow}>
              <MaterialIcons
                name="verified"
                size={16}
                color="#C3C3C3"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.verification}>
                Verification Level: {pendingOffer.verification_count}/7
              </Text>
            </View>
          </View>
          <View style={styles.offeredSection}>
            <Text style={styles.offeredPriceText}>Offered Price</Text>
            <View style={styles.cadButton}>
              <Text style={styles.cadButtonText}>
                CAD {pendingOffer.offer_price}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>{pendingOffer.subject}</Text>
        <Text style={styles.posted}>Offer Date: {pendingOffer.dated} </Text>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Introduction Letter</Text>
          <Text style={styles.sectionText}>{pendingOffer.offer}</Text>
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.sectionText}>
            {truncateWords(pendingOffer.description, 20)}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.hideBtn}
            onPress={() => {
              setSelectedOffer(pendingOffer);
              setModalVisible(true);
            }}
          >
            <Text style={styles.hideBtnText}>Hide</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              navigation.navigate("ViewReceivedOffer", {
                offerID: pendingOffer?.oid,
              })
            }
          >
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => navigation.navigate("ChatList")}
          >
            <Text style={styles.chatBtnText}>Chat</Text>
          </TouchableOpacity>
        </View>
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
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#444444ff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  avatarWrapperOuter: {
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 30,
    marginRight: 2,
    width: 55,
    height: 55,
    marginRight: 7,
    overflow: "hidden",
    backgroundColor: "#222",
  },

  userInfo: { flex: 1 },

  nameStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
  },
  starsRow: {
    flexDirection: "row",
  },

  username: {
    color: "#fff",

    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },

  verificationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  verification: {
    color: "#C3C3C3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  cadButton: {
    backgroundColor: "#46A282",
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
    marginVertical: 8,
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
    gap: 10,
    marginTop: 8,
  },

  hideBtn: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 2,
  },
  hideBtnText: {
    fontFamily: "Montserrat_700Bold",
    color: "#000",
    fontSize: 15,
  },

  viewBtn: {
    backgroundColor: "#C96B59",
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 2,
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
    marginHorizontal: 2,
  },
  chatBtnText: {
    fontFamily: "Montserrat_700Bold",
    color: "#fff",
    fontSize: 15,
  },
});

export default PendingOffer;
