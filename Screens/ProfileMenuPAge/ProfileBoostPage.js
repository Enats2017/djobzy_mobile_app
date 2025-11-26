import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";

const ProfileBoostPage = () => {
  const [activeTab, setActiveTab] = useState("CAD 1");
  const navigation = useNavigation();

  const data = ["CAD 1", "CAD 2", "CAD 3"];

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar navigation={navigation} />
          <ScrollView  contentContainerStyle={{ paddingBottom: 140 }}
             showsVerticalScrollIndicator={false}>
            <View style={styles.boostimg}>
              <Image
                source={require("../../assets/images/boost-rocket.png")}
                style={styles.avatar}
              />
              <View style={styles.costsection}>
                <Text style={styles.costtext}>Total Cost</Text>
                <Text style={styles.costcad}>
                  00 <Text style={styles.cad}>CAD</Text>
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
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Frontend</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Backend</Text>
                </View>
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
              <GradientButton title="Boost" />
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
    gap: 8,
    paddingBottom: 10,
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
  tabWrapper: {
    flexDirection: "row",
    
     justifyContent:"center",
     gap:8,
    width: "100%",
  },
  tabBox: {
    backgroundColor: "#46A282",
    paddingVertical: 17,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  activeTabBox: {
    backgroundColor: "#4DA578",
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
});

export default ProfileBoostPage;
