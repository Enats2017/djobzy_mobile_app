import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BestMatches from "./BestMatches";
import Categories from "./AllCategories";
import FavoriteJobs from "./FavoriteJobs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../../components/Footer";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";

export default function MyFindJobs({ route }) {
  const receivedTab = route?.params?.tab;
  const [activeTopTab, setActiveTopTab] = useState(receivedTab ?? 1);
  const [activeBottomTab, setActiveBottomTab] = useState("Jobs");
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar navigation={navigation} title="Find Jobs" />

        <View>
          <View style={styles.topButtonRow}>
            <TouchableOpacity
              onPress={() => setActiveTopTab(1)}
              style={[
                styles.topButton,
                activeTopTab === 1
                  ? styles.topButtonActive
                  : styles.topButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.topButtonText,
                  activeTopTab === 1
                    ? styles.topButtonTextActive
                    : styles.topButtonTextInactive,
                ]}
              >
                Best Matches
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTopTab(2)}
              style={[
                styles.topButton,
                activeTopTab === 2
                  ? styles.topButtonActive
                  : styles.topButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.topButtonText,
                  activeTopTab === 2
                    ? styles.topButtonTextActive
                    : styles.topButtonTextInactive,
                ]}
              >
                Categories
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTopTab(3)}
              style={[
                styles.topButton,
                activeTopTab === 3
                  ? styles.topButtonActive
                  : styles.topButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.topButtonText,
                  activeTopTab === 3
                    ? styles.topButtonTextActive
                    : styles.topButtonTextInactive,
                ]}
              >
                Favorite Jobs
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {activeTopTab === 1 && <BestMatches />}
          {activeTopTab === 2 && <Categories />}
          {activeTopTab === 3 && <FavoriteJobs />}
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2f2c2c",
    paddingHorizontal: 18,
  },
  topButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  topButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  topButtonActive: {
    backgroundColor: "#fff"
  },
  topButtonInactive: { backgroundColor: "#423c3c" },
  topButtonText: { fontSize: 14, fontFamily: "Montserrat_500Medium", textAlign: "center" },
  topButtonTextActive: { color: "#303030", fontFamily: "Montserrat_600SemiBold" },
  topButtonTextInactive: { color: "#fff", fontWeight: "500" },
  contentContainer: {
    flex: 1,
  },
});
