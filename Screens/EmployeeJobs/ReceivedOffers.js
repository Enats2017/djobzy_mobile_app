import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HiddenOffer from "./HiddenOffers";
import NoJobs from "./NoJobs";
import PendingOffer from "./PendingOffers";

const ReceivedOffers = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [pendingOffer, setPendingOffer] = useState([]);
  const [hiddenOffer, setHiddenOffer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log(token);

        const response = await fetch(`${API_URL}/recieved-offers`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        //console.log(data);
        setPendingOffer(data.received_offers || []);
        setHiddenOffer(data.hidden_offers || []);
      } catch (error) {
        console.log("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.receiveContainer}>
      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          onPress={() => setActiveTab(true)}
          style={styles.toggleBtn}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab ? styles.activeText : styles.inactiveText,
            ]}
          >
            Pending Offers
          </Text>
          {activeTab && <View style={styles.underline} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab(false)}
          style={styles.toggleBtn}
        >
          <Text
            style={[
              styles.toggleText,
              !activeTab ? styles.activeText : styles.inactiveText,
            ]}
          >
            Hidden Offers
          </Text>
          {!activeTab && <View style={styles.underline} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : activeTab ? (
          pendingOffer.length > 0 ? (
            pendingOffer.map((offer, index) => (
              <PendingOffer key={index} pendingOffer={offer} />
            ))
          ) : (
            <NoJobs />
          )
        ) : hiddenOffer.length > 0 ? (
          hiddenOffer.map((offer, index) => (
            <HiddenOffer key={index} hiddenOffer={offer} />
          ))
        ) : (
          <NoJobs />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: { backgroundColor: "#1a1a1a" },
  receiveContainer: {
    width: "100%",
    flex: 1,
  },
  toggleWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    paddingTop:30,
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 10,
  },
  toggleText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#8E8E8E",
    fontSize: 16,
    textAlign: "center",
  },
  inactiveText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#8E8E8E",
    fontSize: 16,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    width: "100%",
    paddingBottom: 8,
  },
  activeText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#FFFFFF",
    paddingBottom: 8,
  },
  underline: {
    height: 2,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  scrollView: { paddingHorizontal: 1 },
});

export default ReceivedOffers;
