import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GradientButton from "../../components/GradientButton";

const EmailCheck = ({ onNext, email, onResend }) => {
  console.log(email);

  return (
    <>
      <View style={styles.heading}>
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>We Send a Password reset Link to</Text>
        <Text style={styles.sub}>{email}</Text>
        <View style={{paddingTop:20}}>

        <GradientButton title="Open email app" onPress={onNext} />
        </View>
        <View style={styles.link}>
          <Text style={styles.linktitle}>Didnt receive the email?</Text>
          <TouchableOpacity onPress={onResend}>
            <Text style={styles.textlink}>Click to Resend again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 35,
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",

  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
    marginBottom: 5,
    color: "#fff",
  },
  sub: {
    color: "#CE7462",
    fontSize: 14,
   textAlign:"center",
   fontFamily:"Montserrat_700Bold",
    marginBottom: 5,
  },

  link: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    gap: 2,
  },
  linktitle: {
    color: "#fff",
    fontFamily:"Montserrat_400Regular",
    fontSize:14
  },
  textlink: {
    color: "#f49696eb",
    textDecorationLine: "underline",
    fontFamily:"Montserrat_400Regular",
  },
});

export default EmailCheck;
