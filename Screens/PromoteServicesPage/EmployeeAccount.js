import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import LineDivider from "../../components/LineDivider";
import Footer from "../../components/Footer";

const EmployeeAccount = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <PageNameHeaderBar title="My Account" />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileCard}>
            <View style={styles.profileinfo}>
              <View style={styles.profileRow}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/women/44.jpg",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.profileInfoRow}>
                  <Text style={styles.name}>Gabrilla</Text>
                  <View style={styles.iconbox}>
                  <Octicons name="clock-fill" size={12} color="#c3c3c3c3" />
                  <Text style={styles.infoText}>GMT+05:30</Text>
                  </View>
                  <View style={styles.iconbox}>
                  <MaterialIcons name="verified" size={14} color="#c3c3c3c3" />
                  <Text style={styles.infoText}>Verification Level: 3/7</Text>
                  </View>
                   <View style={styles.iconbox}>
                   <Entypo name="location-pin" size={14} color="#c3c3c3c3" />
                  <Text style={styles.infoText}>USA</Text>
                  </View>
                </View>
              </View>
            </View>
              <LineDivider/>
            <View style={styles.iconRow}>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="copy" size={20} color="#ffffff" />
                <Text style={styles.iconText}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBtn}>
               <FontAwesome name="share-square-o" size={20} color="#ffffff" />
                <Text style={styles.iconText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBtn}>
                <MaterialIcons name="download" size={20} color="#ffffff" />
                <Text style={styles.iconText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="rocket" size={20} color="#ffffff" />
                <Text style={styles.iconText}>Boost</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBtn}>
                <Feather name="edit-3" size={20} color="#fff" />
                <Text style={styles.iconText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>Number of Jobs</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>000</Text>
                <Text style={styles.statLabel}>Money Earned</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>My Followers</Text>
              </View>
            </View>
            </ScrollView>
          </View>
          <View style={styles.infoBox}>
            <View style={styles.iconbox}>
            <Text style={styles.infoTitle}>Profile Title</Text>
            <FontAwesome name="question-circle" size={16} color="#ffffff" style={{marginLeft:5}} />
            </View>
            <Text style={styles.infoText2}>Designer & Developer</Text>
          </View>
          <View style={styles.infoBox}>
            <View style={styles.iconbox}>
            <Text style={styles.infoTitle}>About Me</Text>
            <FontAwesome name="question-circle" size={16} color="#ffffff" style={{marginLeft:5}} />
            </View>
            <Text style={styles.infoText2}>
              Hi I am Gabrilla from USA and I am UI/UX and Graphic Designer and
              also I am Developer. So let’s do work.
            </Text>
          </View>
          <View style={styles.calendarBox}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>My Services Calendar</Text>
              <Text style={styles.calendarTimezone}>GMT+05:30</Text>
            </View>

            <View style={styles.dateBox}>
              <Text style={styles.dateText}>September 23, 2025</Text>
            </View>

            <View style={styles.timeSlots}>
              {["01:00", "02:00", "03:00", "04:00"].map((time, index) => (
                <Text key={index} style={styles.timeText}>
                  {time}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <Footer/>
    </SafeAreaView>
  );
};

export default EmployeeAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  profileCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 15,
     paddingVertical: 20,
    paddingHorizontal: 20,
  },
  profileinfo:{
    flexDirection: "row",
    alignItems: "center",  
  },
  profileRow: { 
    flexDirection:"row",
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 60,
    marginRight: 12,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontFamily:"Montserrat_500Medium",
    marginBottom:7

  },
   iconbox:{
    flexDirection:"row",
    gap:6,
    paddingVertical:2,
   },
  infoText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    fontFamily:"Montserrat_400Regular"
  },
   iconRow: {
    flexDirection: "row",
    alignItems:"center",
    justifyContent:"space-between",
  },
  iconBtn: {
    alignItems:"center" 
  },
  iconText: {
    color: "#fff",
    fontSize: 14,
    fontFamily:"Montserrat_500Medium",
    marginTop: 5,
  },
   statsRow: {
    flexDirection: "row",
    gap:10,
    marginTop: 18,
  },
  statBox: {
    backgroundColor: "#C97863",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center", 
  },
   statValue: {
    color: "#fff",
    fontSize: 22,
   fontFamily:"Montserrat_700Bold"
  },
  statLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily:"Montserrat_500Medium",
    marginTop: 2,
  },
   infoBox: {
    paddingTop:17,
    
  },
  infoTitle: {
    color: "#fff",
    fontSize:16,
    fontFamily:"Montserrat_700Bold",
   
  },
  infoText2: {
    color: "#c3c3c3c3",
    fontSize: 14,
    fontFamily:"Montserrat_400Regular",
    lineHeight: 18,
  },
});
