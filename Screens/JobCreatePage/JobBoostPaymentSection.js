import Footer from "../../components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const JobBoostPaymentSection = ({ route }) => {
  const { gig } = route.params;
  const subject = gig?.subject;
  const [selectedPrice, setSelectedPrice] = useState(5);
  const navigation = useNavigation();
  const prices = [5, 6, 7];
  return (
    <>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                size={25}
                color="#fff"
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Boost Your Job Post</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.labletext}>{subject}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.description}>
              Promotion increases the chances of finding a better employee.
            </Text>
            <Text style={styles.description}>
              Your promoted job post will be shown above others on the search
              page. The promotion will last for{" "}
              <Text style={styles.highlight}>1 week.</Text>
            </Text>
          </View>
          <View style={styles.pricecard}>
            <Text style={styles.labletext}>
              Select the promotion price per category:
            </Text>
            <View style={styles.tabWrapper}>
              {prices.map((price) => (
                <View key={price} style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      selectedPrice === price && styles.activePriceBox,
                    ]}
                    onPress={() => setSelectedPrice(price)}
                  >
                    <Text
                      style={[
                        styles.priceText,
                        selectedPrice === price && styles.activePriceText,
                      ]}
                    >
                      {price} USD
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="help-circle-outline" size={16} color="#ffffff" />
              <Text style={styles.infoText}>
                The higher promotion amount will result in higher ranking.
              </Text>
            </View>
          </View>
          <View style={styles.totalBar}>
            <Text style={styles.totalText}>Total Cost</Text>
            <Image
              source={require("../../assets/images/Vector-arrow.png")}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={styles.totalPrice}>{selectedPrice} </Text>
              <Text style={styles.dollor}>USD</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#D17B68" }]}
          >
            <Text style={styles.buttonText}>Boost the Job post</Text>
          </TouchableOpacity>
        </View>
        <Footer />

      </SafeAreaView>

    </>
  );
};
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#222222",
  },
  container: {
    flex: 1,
    padding: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backIcon: {
    backgroundColor: "#3333",
    borderRadius: 100,
    padding: 5,
    marginRight: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Montserrat_600SemiBold",
  },
  section: {
    backgroundColor: "#FFFFFF1A",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 17,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 4,
  },
  labletext: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  description: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    lineHeight: 20,
    marginBottom: 6,
  },
  highlight: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
  },
  pricecard: {
    paddingTop: 20,
  },
  tabWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffffff33",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  tabContainer: {
    flex: 1,
  },
  tab: {
    paddingVertical: 18,
    alignItems: "center",
  },
  priceText: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 18,
    color: "#c3c3c3c3",
  },
  activePriceText: {
    fontFamily: "Montserrat_700Bold",
    color: "#000000",
  },
  activePriceBox: {
    backgroundColor: "#EDC8B8",
    borderRadius: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  infoText: {
    color: "#aaa",
    fontSize: 14,
    marginLeft: 4,
    fontFamily: "Montserrat_500Medium",
  },
  totalBar: {
    backgroundColor: "#FABB05",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 76,
    marginTop: 60,
    marginBottom: 50,
  },

  totalText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
  },

  totalPrice: {
    color: "#000",
    fontFamily: "Montserrat_700Bold",
    fontSize: 40,
  },
  dollor: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
  },
  button: {
    marginHorizontal: 5,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
});

export default JobBoostPaymentSection;
