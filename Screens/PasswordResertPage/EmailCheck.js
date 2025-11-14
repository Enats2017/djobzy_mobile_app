import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const EmailCheck = ({onNext , email}) => {
  console.log(email);
  
  return (
    <>
      <View style={styles.heading}>
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>We Send a Password reset Link to</Text>
        <Text style={styles.sub}>{email}</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={onNext}>
          <Text style={styles.loginText}>Open email app</Text>
        </TouchableOpacity>
        <View style={styles.link}>
          <Text style={styles.linktitle}>Didnt receive the email?</Text>
          <TouchableOpacity >
            <Text style={styles.textlink}>Click to Resend again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    top: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "#f6f0f0ff",
    textAlign: "center",
    marginHorizontal: 20,
    padding: 10,
    top: 25,
  },
  sub: {
    color: "#ff6666",
    fontSize: 16,
    padding: 15,
    textAlign: "center",
  },
  loginBtn: {
    width: "100%",
    height: 50,
    top: 20,
    backgroundColor: "#f49696eb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  loginText: { color: "#fff", fontWeight: "bold", fontSize: 19 },
  link: {
    flexDirection: "row",
    margin: 15,
    justifyContent: "center",
    gap:2
  },
  linktitle: {
    color: "#fff",
  },
  textlink: {
    color: "#f49696eb",
    textDecorationLine:"underline"
  },
});

export default EmailCheck;
