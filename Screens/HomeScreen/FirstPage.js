import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";


export default function FirstPage() {
  const { width, height } = useWindowDimensions();
  const isSmall = width < 380;
  const isTablet = width > 768;
  const headingSize = isSmall ? 30 : isTablet ? 52 : 43;
  const boldSize = isSmall ? 33 : isTablet ? 56 : 49;
  const subtextSize = isSmall ? 18 : isTablet ? 22 : 20;
  const padding = isSmall ? 12 : isTablet ? 30 : 20;
  const marginTop = isSmall ? 7 : isTablet ? 20 : 10;
  const buttonSize = isSmall ? 45 : isTablet ? 70 : 55;
  const iconSize = isSmall ? 18 : isTablet ? 28 : 24;

  return (
    <View style={[styles.container, { padding }]}>
      <View style={[styles.logoContainer, { marginBottom: marginTop * 2 }]}>
        <Image
          source={require("../../assets/images/Ellipse 1596.png")}
          resizeMode="contain"
          style={{
            width: width * 0.7,
            position: "absolute",
            opacity: 0.9,
            zIndex: 1,
            marginTop: 220,
            marginRight: 2,
          }}
        />
        <Image
          source={require("../../assets/images/Group.png")}
          resizeMode="contain"
          style={{
            width: width * 0.7,
            zIndex: 2,
            marginLeft: 18,
          }}
        />
      </View>
      <Text style={[styles.heading, { fontSize: headingSize }]}>
        Where{"\n"}
        <Text style={[styles.bold, { fontSize: boldSize }]}>
          Talent Meets{"\n"} Opportunity
        </Text>
      </Text>
      <Text style={[styles.subtext, { fontSize: subtextSize, marginTop }]}>
        Join a vibrant network of professionals, employers, and service seekers.
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            marginTop: marginTop * 2,
            width: buttonSize,
            borderRadius: buttonSize / 2,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
       
       
      >
        <Ionicons name="arrow-forward" size={iconSize} color="#fff" />
      </TouchableOpacity>
     
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e08888ff",
    marginBottom: 0,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
  },
  bold: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "bold",
  },
  subtext: {
    textAlign: "center",
    color: "#f5f5f5",
  },
});
