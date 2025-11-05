import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const FourthScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
         <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/Group2.png")}
            style={styles.baseImage}
          />
          <Image
            source={require("../../assets/images/Team work.png")}
            style={styles.overlayImage}
          />
        </View>

        {/* Text Section */}
        <View style={styles.text}>
          <Text style={styles.heading}>Build Your</Text>
            <Text style={styles.bold}>Dream Team</Text>
          <Text style={styles.subheading}>
            Hire top talent for short or long-term projects.
          </Text>
        </View>

        {/* Buttons Section */}
         <View style={styles.buttons}>
          <TouchableOpacity style={[styles.circleButton, {backgroundColor:"#39A881"}]}  onPress={() => navigation.navigate("Employer")}>
             <Image
            source={require("../../assets/images/Group-vector.png")}
          
            resizeMode="contain"
          />
            <Text style={[styles.circleText, { color: "white" }]}>I'm an Employee</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.circleButton, styles.white]} onPress={() => navigation.navigate("Employee")}>
            <Image
            source={require("../../assets/images/Group-icon.png")}
            
            resizeMode="contain"
          />
            <Text style={[styles.circleText, { color: "#111" }]}>I'm an Employer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor:"#222222"
    
  },
  content: {
    alignItems: "center",
    justifyContent:"center",
    paddingBottom:50,
    
  },
  
   baseImage:{
    position:"absolute",
    top: 50,
    left:54, 
    width:"90%",  
   },
  

  text: {
    alignItems: "center",
    
    paddingVertical:20,
  },
  heading: {
    fontSize: 48 ,
    fontFamily:"Montserrat_400Regular",
    color: "#ffffff",
    textAlign: "center",
    lineHeight:45,
  },
  bold:{
    fontFamily:"Montserrat_700Bold",
    fontSize:48,
    color:"#ffffff",
  },
  subheading: {
     fontFamily:"Montserrat_400Regular",
     fontSize:18,
      color:"#ffffff",
      textAlign:"center",
      paddingHorizontal:20,
  },
   buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    paddingHorizontal:10,
    
  },
  circleButton: {
    width: 160 ,
    height: 160,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection:"column",
    gap:15,
    
   
  },
 
  white: {
    backgroundColor: "white",
  },
  circleText: {
    fontSize: width * 0.045,
    fontWeight: "600",
    textAlign: "center",
  },
});

// Export the app component
export default FourthScreen;
