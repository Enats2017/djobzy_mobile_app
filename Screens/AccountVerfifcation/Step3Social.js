import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
const Step3Social = ({onNext}) => {
  return (
    <View style={styles.socialContainer}>
      <Text style={styles.setptext}>STEP 3</Text>
      <Text style={styles.headtext}>Connect Social Media Accounts</Text>
      <View>
        <Text style={styles.setptext}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      </View>
      <View style={styles.card}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <View style={styles.leftRow}>
            <Image
              source={require("../../assets/images/facebook.png")}
              style={styles.socialIcon}
            />

            <Text style={styles.title}>Facebook</Text>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.desc}>
          By linking your account, you agree that Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea
        </Text>
      </View>
      <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Step3Social;
const styles = StyleSheet.create({
  setptext: {
    color: "#c3c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  headtext: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    color: "#303030",
  },
  button: {
    backgroundColor: "#CB7767",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
  desc: {
    fontFamily: "Montserrat_500Medium",
    color: "#303030",
    fontSize: 12,
  },

  nextBtn: {
    backgroundColor: "#FDBF2D",
    paddingVertical:10,
    borderRadius:10,
    marginTop:20,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText:{
    color:"#000000",
    fontFamily:"Montserrat_700Bold",
    fontSize:20
  }
});
