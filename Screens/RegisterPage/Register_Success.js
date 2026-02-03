import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../components/GradientButton";

const Register_Success = ({ route }) => {
  const email = route?.params?.email ?? "No email found";
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/images/Signup1.png")}
            style={styles.logo}
          />
          <View style={ styles.heading}>
          <Text style={styles.title}>
            Thank You For <Text style={styles.titleAccent}>Signing Up</Text>
          </Text>
          <Text style={styles.text}>
            Please check your email to Activate your account
          </Text>

          </View>
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
            <GradientButton title="Resend Email" paddingVertical={12} />
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
        </ScrollView>
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
 
 scrollContent: {
  flexGrow: 1,
  alignItems: "center",
  justifyContent: "center",
 
},
 logo: {
    marginBottom: 10,
  },
 heading: {
  alignItems: "center",
  marginBottom: 18,
 
},

title: {
  fontSize: 30,        // slightly smaller for small phones
  lineHeight: 38,     // makes it elegant
  color: "#ffffff",
  textAlign: "center",
  fontFamily: "Montserrat_600SemiBold",
  letterSpacing: 0,
},

titleAccent: {
  color: "#CB7767",
  fontFamily: "Montserrat_700Bold",
},

text: {
  fontSize: 14,
  color: "#BFBFBF",   // softer gray
  textAlign: "center",
  marginTop: 6,
  lineHeight: 20,
  paddingHorizontal: 20,
  fontFamily: "Montserrat_400Regular",
},

 card: {
  flexDirection: "row",
  backgroundColor: "#FFFFFF0D",
  alignItems: "flex-start",
  borderRadius: 12,
  paddingVertical: 18,
  paddingHorizontal: 12,
  gap: 10,
  width: "90%",
  marginBottom:15
  
},

cardText: {
  flex: 1,
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
    
    fontFamily: "Montserrat_400Regular",
  },
  subTitle: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
 
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
