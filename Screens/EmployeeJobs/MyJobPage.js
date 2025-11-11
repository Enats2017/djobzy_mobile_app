import Footer from "../../components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CompletedJobs from "./CompletedJobs";
import CurrentJobs from "./CurrentJobs";
import MyBiddings from "./MyBiddings";
import ReceivedOffers from "./ReceivedOffers";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";

export default function MyJobPage({ route }) {
  const receivedTab = route?.params?.tab;
  const [activeTab, setActiveTab] = useState(receivedTab ?? 1);
  const navigation = useNavigation();

  const tabs = [
    { id: 1, title: "Current jobs" },
    { id: 2, title: "Received offers" },
    { id: 3, title: "My biddings" },
    { id: 4, title: "Completed Jobs" },
  ];

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <PageNameHeaderBar navigation={navigation} title="My Jobs" />

          {/* Top toggle buttons */}
          <View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.topButtonRow}>
                {tabs.map((tab) => (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}
                    style={[
                      styles.topButton,
                      activeTab === tab.id
                        ? styles.topButtonActive
                        : styles.topButtonInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.topButtonText,
                        activeTab === tab.id
                          ? styles.topButtonTextActive
                          : styles.topButtonTextInactive,
                      ]}
                    >
                      {tab.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Center content */}
          <View style={styles.contentContainer}>
            <>
              {activeTab === 1 && <CurrentJobs />}

              {activeTab === 2 && <ReceivedOffers />}

              {activeTab === 3 && <MyBiddings />}
              {activeTab === 4 && <CompletedJobs />}
            </>
          </View>

          {/* Bottom navigation */}
        </View>

        <Footer />
      </SafeAreaView>
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 18,
  },
  
  topButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  topButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  topButtonActive: { backgroundColor: "#fff" },
  topButtonInactive: { backgroundColor: "#423c3c" },
  topButtonText: { fontSize: 14, fontFamily: "Montserrat_500Medium" },
  topButtonTextActive: { color: "#222", fontWeight: "700" },
  topButtonTextInactive: { color: "#fff", fontWeight: "500" },
  contentContainer: {
    flex: 1,
  },
  
  noContractText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Montserrat_500Medium",
  },
  findJobButton: {
    backgroundColor: "#eb8676",
    borderRadius: 14,
    paddingVertical: 14,
    width: 360,
    alignItems: "center",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 1,
  },
  findJobButtonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Montserrat_700Bold",
  },
});
