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
    <SafeAreaView  style={{flex:1}} >
      <View style={styles.container}>
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
          <View style={styles.section}>
            <Text style={styles.heading}>Select Your </Text>
              <Text style={styles.bold}>Primary Role</Text>
            <Text style={styles.subheading}>
              You can switch between your Recruiter and Job Seeker accounts at any time
            </Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.circleButton, {backgroundColor:"#39A881"}]}  onPress={() => navigation.navigate("Login")}>
              <Image
              source={require("../../assets/images/Group-vector.png")}
               style={{marginBottom:12}}
              resizeMode="contain"
            />
              <Text style={[styles.circleText, { color: "white" }]}>I'm a Job Seeker </Text>
              <Text style={[styles.destext, { color: "white" }]}>looking for a job</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.circleButton, {backgroundColor:"#fff"}]} onPress={() => navigation.navigate("Login")}>
              <Image
              source={require("../../assets/images/Group-icon.png")}
              style={{marginBottom:12}}
              resizeMode="contain"
            />
              <Text style={[styles.circleText, { color: "#111" }]}>I'm a Recruiter</Text>
              <Text style={[styles.destext, { color: "#111" }]}>looking for a service </Text>
            </TouchableOpacity>
          </View>
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
  },
  
   baseImage:{
    position:"absolute",
    top: 50,
    left:54, 
    width:"90%",  
   },
  

  section: {
    alignItems: "center",
    paddingVertical:10,
  },
  heading: {
    fontSize: 48 ,
    fontFamily:"Montserrat_400Regular",
    color: "#ffffff",
    
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
      paddingHorizontal:5,
      
  },
   buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    
    
  },
  circleButton: {
    width: 170 ,
    height: 170,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center"
  },
 
  circleText: {
    fontSize: 13, 
    fontFamily:"Montserrat_700Bold"
  },
 
});

// Export the app component
export default FourthScreen;
