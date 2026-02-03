import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, fontScale } from "../../utils/scale";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FirstPage({ onNext }) {
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      {/* Images */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/Ellipse 1596.png")}
          resizeMode="contain"
          style={styles.bgCircle}
        />

        <Image
          source={require("../../assets/images/Group.png")}
          resizeMode="contain"
          style={styles.mainImage}
        />
      </View>

      {/* Heading */}
      <View style={styles.textWrapper}>
        <Text style={styles.heading}>
          Where{"\n"}
          <Text style={styles.bold}>
            Talent Meets{"\n"} Opportunity
          </Text>
        </Text>

        <Text style={styles.subtext}>
         Welcome to the services marketplace
        </Text>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Ionicons
            name="arrow-forward"
            size={fontScale(22)}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: "#C96B59",
   
    alignItems: "center",
  },


  logoContainer: {
    flex: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  bgCircle: {
    width: "70%",
    position: "absolute",
    opacity: 0.9,
  },

  mainImage: {
    width: "70%",
    zIndex: 2,
  },

  /* TEXT */
  textWrapper: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(20),
  },

  heading: {
    fontSize: fontScale(34),
    textAlign: "center",
    color: "#fff",
    fontFamily: "Montserrat_300Regular",
    
  },

  bold: {
    fontSize: fontScale(40),
    fontFamily: "Montserrat_700Bold",
    letterSpacing:0,
    
  },

  subtext: {
    fontSize: fontScale(16),
    textAlign: "center",
    fontFamily:"Montserrat_400Regular",
    color: "#f5f5f5",
    lineHeight: scale(22),
  },

  /* BUTTON */
  buttonWrapper: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },

 
});
