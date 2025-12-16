import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ICON, API_URL } from "../../api/ApiUrl";

const ProfileBoostPage = () => {
  const [activeTab, setActiveTab] = useState("CAD 1");
  const navigation = useNavigation();
  const route = useRoute();
  const { categories } = route.params || { categories: [] };
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const toggleCategory = (subid) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(subid)
          ? prev.filter((id) => id !== subid) // unselect
          : [...prev, subid] // select
    );
  };

  const data = ["CAD 1", "CAD 2", "CAD 3"];
  const priceMap = {
    "CAD 1": 1,
    "CAD 2": 2,
    "CAD 3": 3,
  };

  const pricePerCategory = priceMap[activeTab] || 0;
  const selectedCount = selectedCategories.length;
  const totalCost = selectedCount * pricePerCategory;
  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 5);

  const handleBoost = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!selectedCount) {
      Alert.alert("Error", "Please select at least one category.");
      return;
    }

    if (!pricePerCategory) {
      Alert.alert("Error", "Please select a boost price.");
      return;
    }
    try {      
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      selectedCategories.forEach((id) => {
        formData.append("service[]", id);
      });
      formData.append("cost", pricePerCategory);
      const response = await fetch(`${API_URL}/save-promotion`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });
      const result = await response.json();
      if (result.status === 200) {
        Alert.alert("Success", "Promotion created successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", result.message || "Something went wrong");
      }
    } catch (err) {
      console.log("Boost API error:", err);
      Alert.alert("Error", "Network error while saving promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar navigation={navigation} />
          <ScrollView
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.boostimg}>
              <Image
                source={require("../../assets/images/boost-rocket.png")}
                style={styles.avatar}
              />
              <View style={styles.costsection}>
                <Text style={styles.costtext}>Total Cost</Text>
                <Text style={styles.costcad}>
                  {String(totalCost).padStart(2, "0")}{" "}
                  <Text style={styles.cad}>CAD</Text>
                </Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.title}>
                Looking For loYou can boost Your Category with a small paymentgo
                designer
              </Text>
              <Text style={styles.des}>
                Boosted services will be shown above other son the employee
                search pages. The boost will last for 1 week.
              </Text>
              <Text style={styles.title}>
                Choose categories you want to boost:
              </Text>
              <View style={styles.tagContainer}>
                {displayedCategories.map((item) => {
                  const isSelected = selectedCategories.includes(item.subid);
                  return (
                    <TouchableOpacity
                      key={item.subid}
                      onPress={() => toggleCategory(item.subid)}
                      style={[styles.tag, isSelected && styles.tagSelected]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          isSelected && styles.tagTextSelected,
                        ]}
                      >
                        {item.subname}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {categories.length > 5 && (
                  <TouchableOpacity
                    onPress={() => setShowAllCategories((prev) => !prev)}
                    style={styles.showMoreBtn}
                  >
                    <Text style={styles.showMoreText}>
                      {showAllCategories ? "Show Less" : "Show More"}
                    </Text>

                    <Ionicons
                      name={showAllCategories ? "chevron-up" : "chevron-down"}
                      size={14}
                      color="#000"
                      style={{ marginLeft: 5 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.title}>
                Select the boost price per category:
              </Text>
              <View style={styles.tabWrapper}>
                {data.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setActiveTab(item)}
                    style={[
                      styles.tabBox,
                      activeTab === item && styles.activeTabBox,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === item && styles.activeTabText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.iconsec}>
                <FontAwesome name="exclamation-circle" size={18} color="#fff" />
                <Text style={styles.icontext}>
                  The higher boost amount will result in higher ranking.
                </Text>
              </View>
            </View>
            <View style={{ paddingTop: 20 }}>
              <GradientButton  title={loading ? "Processing..." : "Boost"}  onPress={loading ? undefined : handleBoost} />
            </View>
          </ScrollView>
        </View>
        <Footer />
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
  boostimg: {
    flex: 1,
    alignItems: "center",
  },
  costsection: {
    paddingTop: 18,
  },

  costtext: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Montserrat_600SemiBold",
  },
  costcad: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "Montserrat_600SemiBold",
  },
  cad: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    alignSelf: "baseline",
  },

  section: {
    paddingTop: 10,
  },
  title: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 18,
    marginBottom: 15,
  },
  des: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
    marginBottom: 15,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    paddingBottom: 10,
  },
  tag: {
    backgroundColor: "#ffffff1a",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 18,
  },
  tagSelected: {
    backgroundColor: "#ffffff", // selected = white
    borderWidth: 1,
    borderColor: "#ffffff", // optional black border for highlight
  },
  tagText: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 10,
  },
  tagTextSelected: {
    color: "#000", // black
    fontFamily: "Montserrat_700Bold",
  },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  tabBox: {
    backgroundColor: "#439b7cff",
    paddingVertical: 17,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  activeTabBox: {
    backgroundColor: "#26be70ff",
  },
  tabText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  activeTabText: {
    color: "#fff",
  },
  iconsec: {
    flexDirection: "row",
    paddingTop: 17,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  icontext: {
    fontFamily: "Montserrat_500Medium",
    color: "#fff",
    fontSize: 16,
  },

  showMoreBtn: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: "#ececec",
    borderRadius: 20,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },

  showMoreText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#000",
  },
});

export default ProfileBoostPage;
