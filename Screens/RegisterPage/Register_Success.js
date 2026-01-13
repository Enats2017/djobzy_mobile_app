import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../components/GradientButton";

const Register_Success = ({ route }) => {
  const email = route?.params?.email ?? "No email found"; 
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
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

        <MaterialCommunityIcons name="email-outline" size={25}  color="#ffff"/>
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Check Your Email</Text>
          <Text style={styles.cardSubtitle}>
            Please Check Your Email To Activate Your Account
          </Text>
        </View>
      </View>
      <Text style={styles.subTitle}>Didn’t receive the email?</Text>
      <View style={{width:"90%"}}>
        <GradientButton title="Resend Email"/>
      </View>
      <Text style={styles.footerText}>
        Please check the Spam or check if the mentioned email{" "}
        <Text style={styles.emailText}>{email}</Text> is correct
      </Text>
      <TouchableOpacity>
        <Text style={[styles.footerText, styles.supportLink]}>
          Contact Customer Support Team
        </Text>
      </TouchableOpacity>
    </View>   
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal:15,
  },
  logo: {
    width: "70%",
    marginBottom:10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 31,
    color: "#ffffff",
    textAlign: "center",
    fontFamily:"Montserrat_600SemiBold",
  },
  titleAccent: {
    color: "#CB7767",
    fontFamily:"Montserrat_600SemiBold",
  },
  text: {
    fontSize: 14,
    color: "#FFFFFF",
     fontFamily:"Montserrat_600SemiBold",
    textAlign: "center",
    width:"65%",
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF0D",
    alignItems:"flex-start",
    borderRadius: 12,
    paddingVertical:18,
    paddingHorizontal:8,
    gap:10,
    marginVertical: 7,
  },
  iconbg:{
    backgroundColor:"#FFFFFF33",
    width:40,
    height:40,
    borderRadius:20,
    alignItems:"center",
    justifyContent:"center"

  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily:"Montserrat_500Medium",
    marginBottom:2,
  
  },
  cardSubtitle: { 
    color: "#ffffff", 
    fontSize: 14,
    width:"80%", 
    fontFamily:"Montserrat_400Regular" 
  },
  subTitle: {
   color: "#fff",
    fontSize: 15,
    fontFamily:"Montserrat_500Medium",
    marginBottom:2,
  },
  button1: {
    backgroundColor: "#d77a6f",
    paddingVertical: 12,
    width: "85%",
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    width:"85%", 
    fontFamily:"Montserrat_400Regular",
    color: "#fff",
    textAlign: "center",
    marginTop: 15,
    
   
  },
  emailText: {
    
    fontFamily:"Montserrat_500Medium",
   
  },
  supportLink: {
    textDecorationLine: "underline",
    color: "#ffffff",
    fontFamily:"Montserrat_600SemiBold",
    marginTop: 15,
    fontSize:14,
  },
});

export default Register_Success;
