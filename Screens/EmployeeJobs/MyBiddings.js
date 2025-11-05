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
import ActiveBiddings from "./ActiveBiddings";
import ExpiredBiddings from "./ExpiredBiddings";
import NoJobs from "./NoJobs";

const MyBiddings = () => {
  const [activeTab, setActiveTab] = useState(true);
  const [activeBids, setActiveBids] = useState([]);
  const [expireBids, setExpireBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}/sent-proposal`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        setActiveBids(data.active_bids || []);
        setExpireBids(data.expired_bids || []);
       
        
      } catch (error) {
        console.log("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.biddingContainer}>
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
            Active Biddings
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
            Expired Biddings
          </Text>
          {!activeTab && <View style={styles.underline} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : activeTab ? (
          activeBids.length > 0 ? (
            activeBids.map((offer, index) => (
              <ActiveBiddings key={index} activeBids={offer} />
            ))
          ) : (
            <NoJobs />
          )
        ) : expireBids.length > 0 ? (
          expireBids.map((offer, index) => (
            <ExpiredBiddings key={index} expireBids={offer} />
          ))
        ) : (
          <NoJobs />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: { flex: 1, backgroundColor: "#1a1a1a" },
  biddingContainer: {
    width: "100%",
    flex: 1,
  },
  toggleWrapper: {
    flexDirection: "row",
    width:"100%",
    justifyContent: "space-around",
    marginBottom: 10,
    paddingTop:30,
  },
  toggleBtn: {
    alignItems: "center",
    paddingBottom: 10,
    flex: 1,
  },
  toggleText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#8E8E8E",
    fontSize: 16,
    textAlign: "center"
  },
  inactiveText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#8E8E8E",
    fontSize: 16,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    width: '100%',
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
  scrollView: { paddingHorizontal: 1 ,
    paddingBottom:100,
  },
});

export default MyBiddings;
