import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import ContactInfo from "../../components/ContactInfo";
import GoogleMap from "../../components/GoogleMap";
import { useNavigation, useRoute } from "@react-navigation/native";
import Footer from "../../components/Footer";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import GradientButton from "../../components/GradientButton";

const UserContactInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { details, user } = route.params || [];
  const [phone, setPhone] = useState(user?.mobile_number || "");
  const [postal, setPostal] = useState("");
  const [location, setLocation] = useState("");
  const countryCode = details?.phonecode ? `+${details.phonecode}` : "+91";
 const [loading, setLoading] = useState(false);

  console.log("PHONE:", phone);
  console.log("LOCATION:", location);
  console.log("COUNTRY ID:", user?.mobile_country_id);
  console.log(postal);

  const submitContactInfo = async () => {
    if (!phone || !location || !countryCode) {
      alert("Phone, country and location are required");
      return;
    }

    console.log("hii");
    
    const formData = new FormData();
    formData.append("phone_number", phone); // no +
    console.log("hii222", phone);
    formData.append("mobile_country_id", countryCode);
    console.log("hii222333", user?.mobile_country_id);
    formData.append("postal_code", postal);
    console.log("hii222333", postal);
    formData.append("searchInput", location);
    console.log("hii222333444", location);
    // formData.append("timezone", timezone);
    // console.log("hii2223334433333", timezone);
    console.log("SENDING DATA:", {
       phone,
      countryCode,
      postal,
      location,
      
     });

    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/contact-save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await res.json();

      if (result.status == 200) {
        alert("Contact info saved successfully");
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Network error");
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Contact Info" navigation={navigation} />
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <ContactInfo
              phoneValue={phone}
              onChangePhone={setPhone}
              countryCode={countryCode}
              postalCodeValue={postal}
              onChangePostalCode={setPostal}
              locationValue={location}
              onChangeLocation={setLocation}
            />
            <GoogleMap
              region={{
                latitude: 19.076,
                longitude: 72.8777,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            />
            <View style={{ paddingBottom: 10 }}>
              <GradientButton loading={loading} title="Send" onPress={submitContactInfo} />
            </View>
          </ScrollView>
        </View>
        <Footer />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
});

export default UserContactInfo;
