import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import LineDivider from "../../components/LineDivider";
import Footer from "../../components/Footer";
import GradientButton from "../../components/GradientButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import EmployerFooter from "../../components/EmployerFooter";
import { toastSuccess } from "../../utils/toast";

const PromoteServicesDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false)
  const { id, type, price_negotiable, selected_time } = route.params || [];
  const [service, setService] = useState(null);
  const [submit, setSubmit] = useState(false);
  const fetchDetails = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("id", id);
      formData.append("type", type);
      const response = await fetch(`${API_URL}/fetchDetails`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });
      const data = await response.json();
      if (data.status === 200) {
        setService(data.result);
      } else {
        Alert.alert("Error", result.message || "Unable to fetch details");
      }
    } catch (err) {
      console.log("fetchDetails error: ", err);
      Alert.alert("Error", "Network error while fetching details");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSendOffer = async () => {
  try {
    setSubmit(true);
    const token = await AsyncStorage.getItem("token");
    const isLoggedIn = !!token;
    const formData = new FormData();
    formData.append("user_check", isLoggedIn);
    formData.append("serviceId", service?.sid);
    formData.append("services_title", service?.subject);
    formData.append("hourMinimum", service?.hour_minimum ?? 0);
    formData.append("hourMaximum", service?.hour_maximum ?? 0);
    formData.append("priceMinValue", service?.fixed_minimum ?? 0);
    formData.append("priceMaxValue", service?.fixed_maximum ?? "");
    formData.append("service_selected_time", service?.selected_time ?? "no-calendar");
    formData.append("price_negotiable", service?.price_negotiable ?? 0);
    formData.append("admin_fee", 1.1);
    // convert array → comma separated
    if (service?.subcategory_ids?.length) {
      formData.append(
        "allSubcategoryIds",
        service.subcategory_ids.join(",")
      );
    }

    // if (!isLoggedIn) {
    //   formData.append("hiring_job_url", "/login");
    // }

    const response = await fetch(`${API_URL}/autoJobCreate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
       
        ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    
    if (data.status === 200) {
         await handleSelectJob(data.gid);
       
    } else {
      Alert.alert("Error", data.message || "Something went wrong");
    }

  } catch (error) {
    console.log("Send Offer error:", error);
    Alert.alert("Error", "Network error");
  } finally {
    setSubmit(false);
  }
};

const handleSelectJob = async (gid) => {
    if (!gid) {
    console.log("GID not found");
    return;
  }
  setLoading(true)
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${API_URL}/onchange-job-details`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
         id: gid,
          emp_id: service?.user_id,
      }),
    });
    const data = await res.json();
    navigation.navigate("SendJobOffer", { jobDetails: data});
  } catch (err) {
    console.log("Job details fetch error", err);
  }
};


  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Services" navigation={navigation} />
          {
            loading ?(
              <Loading/>
            ):(
              <>
              <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.card}>
                  <Text style={styles.title}> {service?.subject}</Text>
                  <Text style={styles.timeText}>
                    Time Required for the service:{" "}
                    <Text style={styles.timeValue}>
                      {" "}
                      {service?.selected_time ?? "no-calendar"}
                    </Text>
                  </Text>
                  <LineDivider />
                  <Text style={styles.sectionTitle}>Categories</Text>
                  <View style={styles.categoriesRow}>
                    {service?.subcategories?.map((item, index) => (
                      <View key={index} style={styles.chip}>
                        <Text style={styles.chipText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                  <LineDivider />
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.bodyText}>{service?.description}</Text>
                  <LineDivider />
                  <Text style={styles.sectionTitle}>Pricing</Text>
                  <Text style={styles.bodyText}>
                    Hourly rate:{" "}
                    <Text style={styles.boldText}>{service?.hour_minimum}</Text>
                    /hours
                  </Text>
                  <Text style={styles.footerNote}>
                    The price includes all taxes and charges in your jurisdiction,
                    based on taxing codes for freelancers.
                  </Text>
                </View>
              </ScrollView>
              <View style={styles.button}>
                {/* <TouchableOpacity style={styles.buttonEdit}>
                  <Text style={styles.buttonEditText}>Edit</Text>

                </TouchableOpacity> */}
                <GradientButton title="Send Offer" disabled={submit} loading={submit}  onPress={handleSendOffer}/>
              </View>
              
              </>

            )
          }
        </View>
        <EmployerFooter/>
      </SafeAreaView>
    </>
  );
};

export default PromoteServicesDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#222222",
  },

  title: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  timeText: {
    fontFamily: "Montserrat_500Medium",
    color: "#fff",
    fontSize: 14,
  },
  timeValue: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#3A3A3C",
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontFamily: "Montserrat_500Medium",
  },
  bodyText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#fff",
  },
  boldText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    color: "#fff",
  },
  footerNote: {
    fontFamily: "Montserrat_400Regular",
    fontStyle: "italic",
    fontSize: 12,
    color: "#ffff",
    marginTop: 25,
  },
  button: {
    position: "absolute",
    bottom: 90,
    gap:7,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    zIndex: 999,
  },
  buttonEdit: {
    flex: 1,
    backgroundColor: "#fdbf2d",
    borderRadius: 11,
   
    paddingVertical: 12.2,
   
    marginTop: 10,
  },
  buttonEditText: {
    color: "#242424",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.1,
  },
});
