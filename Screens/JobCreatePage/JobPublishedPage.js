import Footer from "../../components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";

const JobPublishedPage = ({ route }) => {
  const { gig } = route.params;

  const navigation = useNavigation();
  return (
    <>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <PageNameHeaderBar navigation={navigation} title="Publish a Job" />

          <View style={styles.content}>
            <Image
              source={require("../../assets/images/Group-10.png")}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.heading}>Congratulations!</Text>
            <Text style={styles.subtitle}>
              The job has been successfully published
            </Text>
            <Text style={styles.description}>
              Bring your post to the top of the page by boosting it. The more
              you spend the more possibilities we have to advertise your job and
              bring more attention to your post.
            </Text>
            <Text style={styles.highlight}>
              The promotion will last for 1 week.
            </Text>
          </View>
          <View style={styles.sectionBtn}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#D17B68" }]}
              onPress={() => navigation.navigate("JobBoostPaymentSection", { gig : gig })}
            >
              <Text style={styles.buttonText}>Boost the Job post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { borderColor: "#ccc", borderWidth: 1 }]}
              onPress={navigation.navigate("Dashboard")}
            >
              <Text style={styles.buttonText}>Continue without boosting</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 15,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 6,
    color: "#CB7767",
  },
  subtitle: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
    marginBottom: 15,
  },
  description: {
    color: "#c3c3c3c3",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    width: 350,

    marginBottom: 15,
  },
  highlight: {
    color: "#FDBF2D",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
  },
  sectionBtn: {
    gap: 15,
    paddingBottom: 90,
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

export default JobPublishedPage;
