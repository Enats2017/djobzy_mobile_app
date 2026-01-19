import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../components/GradientButton";

const Register_Success = ({ route }) => {
  const email = route?.params?.email ?? "No email found";
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headingsection}>
          <Image
            source={require("../../assets/images/Signup1.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>
            Thank You For <Text style={styles.titleAccent}>Signing Up</Text>
          </Text>
          <Text style={styles.text}>
            Please check your email to Activate your account
          </Text>
          <View style={styles.card}>
            <View style={styles.iconbg}>
              <MaterialCommunityIcons
                name="email-outline"
                size={25}
                color="#ffff"
              />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Check Your Email</Text>
              <Text style={styles.cardSubtitle}>
                Please Check Your Email To Activate Your Account
              </Text>
            </View>
          </View>
          <Text style={styles.subTitle}>Didn't Receive An Email?</Text>
          <View style={{ width: "90%" }}>
            <GradientButton title="Resend Email"  paddingVertical={15}/>
          </View>
        <Text style={styles.footerText}>
         Please check the spam or check if the mentioned{" "}
          <Text style={styles.emailText}>({email})</Text> Is Correct
        </Text>
        <TouchableOpacity>
          <Text style={[styles.footerText, styles.supportLink]}>
            Contact Customer Support Team
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",

    paddingHorizontal: 15,
  },
  logo: {
    marginBottom: 10,
  },
  headingsection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    color: "#ffffff",
    textAlign: "center",
    marginBottom:5,
    fontFamily: "Montserrat_600SemiBold",
  },
  titleAccent: {
    color: "#CB7767",
    fontFamily: "Montserrat_600SemiBold",
  },
  text: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF0D",
    alignItems: "flex-start",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal:16,
    gap: 10,
    marginVertical: 15,
  },
  iconbg: {
    backgroundColor: "#FFFFFF33",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 2,
  },
  cardSubtitle: {
    color: "#ffffff",
    fontSize: 14,
    width: "80%",
    fontFamily: "Montserrat_400Regular",
  },
  subTitle: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 2,
  },

  footerText: {
    fontSize: 14,
 
    fontFamily: "Montserrat_400Regular",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  emailText: {
    fontFamily: "Montserrat_500Medium",
  },
  supportLink: {
    textDecorationLine: "underline",
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 15,
    fontSize: 14,
  },
});

export default Register_Success;
