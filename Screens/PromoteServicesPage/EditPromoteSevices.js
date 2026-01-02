import React, { useState, useEffect } from "react";
import { SafeAreaView,useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import LineDivider from "../../components/LineDivider";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import { useServiceGlobalStore } from "./ServiceGlobalStore";
import { Ionicons } from "@expo/vector-icons";

const EditPromoteSevices = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { id, type } = route.params || [];
  const [service, setService] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchDetails = async () => {
    try {
      setLoading(true);
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

  const handleEdit = () => {
    const store = useServiceGlobalStore.getState();
    store.reset();
    store.setField("title", service.title || "");
    store.setField("description", service.description || "");
    store.setField("hourlyRate", String(service.hour_minimum || ""));
    store.setField("totalPrice", String(service.price || ""));
    store.setExpectedTime(service.time_hours || 0);
    service.subcategories.forEach(sub => {
    store.addCategory({
      subId: sub.id,
      name: sub.name,
    });
  });
    // service.attachment?.forEach((img) => {
    //   store.addImage({ uri: `${API_ICON}/${img.attachment}` });
    // });
    store.setEditMode(service.sid);
    navigation.navigate("PromoteService");
  };

  const serviceId = service?.sid;
  console.log(serviceId);

  const handleDeleteService = async () => {
    try {
      setDeleting(true);
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      console.log("1111", serviceId);

      formData.append("id", serviceId);

      const response = await fetch(`${API_URL}/service-delete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status === 200) {
        Alert.alert("Deleted", "Service deleted successfully");
        setDeleteModal(false);
        navigation.navigate("EmployeeAccount")
        
      } else {
        Alert.alert("Error", data.message || "Delete failed");
      }
    } catch (error) {
      console.log("Delete error:", error);
      Alert.alert("Error", "Network error");
    } finally {
      setDeleting(false);
    }
  };

 
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Services" navigation={navigation} />
          {loading ? (
            <Loading />
          ) : (
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
                    The price includes all taxes and charges in your
                    jurisdiction, based on taxing codes for freelancers.
                  </Text>
                </View>
              </ScrollView>
              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.delete}
                  onPress={() => setDeleteModal(true)}
                >
                  <Text style={styles.deletetext}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonEdit}
                  onPress={handleEdit}
                >
                  <Text style={styles.buttonEditText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        <Modal
          visible={deleteModal}
          animationType="slide"
          transparent
          onRequestClose={() => setDeleteModal(false)}
        >
          <View style={styles.deleteOverlay}>
            <View  style={[
                  styles.deleteBox,
                  { paddingBottom: insets.bottom },
                ]}>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={() => setDeleteModal(false)}
                disabled={deleting}
              >
                <Ionicons name="close" size={22} color="#000" />
              </TouchableOpacity>
              <Ionicons
                name="warning"
                size={60}
                color="#d64545"
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.deleteTitle}>Delete Category</Text>
              <Text style={styles.deleteMsg}>
                Are you Sure you Want To Delete The Services ?
              </Text>
              <View style={styles.deleteBtns}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setDeleteModal(false)}
                  disabled={deleting}
                >
                  <Text style={styles.canceltext}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={handleDeleteService}
                  disabled={deleting}
                >
                  <Text style={styles.deletetext}>Yes, Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Footer />
      </SafeAreaView>
    </>
  );
};

export default EditPromoteSevices;
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
    flexDirection: "row",
    bottom: 90,
    gap: 7,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    zIndex: 999,
  },
  buttonEdit: {
    flex: 1,
    backgroundColor: "#fdbf2d",
    borderRadius: 11,
    alignItems: "center",
    paddingVertical: 12.2,
    marginTop: 10,
  },
  delete: {
    flex: 1,
    backgroundColor: "#E94235",
    borderRadius: 11,
    alignItems: "center",
    paddingVertical: 12.2,
    marginTop: 10,
  },
  buttonEditText: {
    color: "#242424",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.1,
  },
  deletetext: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.1,
  },
  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  deleteBox: {
    backgroundColor: "#fff",
    width: "100%",
    maxHeight: "70%",
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalCloseIcon: {
    position: "absolute",
    top: 2,
    right: 4,
    padding: 5,
    zIndex: 10,
  },
  deleteTitle: {
    fontSize: 22,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 7,
  },
  deleteMsg: {
    fontSize: 15,
    marginBottom: 15,
    color: "#030303",
    fontFamily: "Montserrat_500Medium",
  },
  deleteBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    
    gap: 10,
    paddingHorizontal:13,
  },
  cancelBtn: {
    paddingVertical: 15,
    width:"50%",
    alignItems:"center",
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  deleteBtn: {
    paddingVertical: 15,
    width:"50%",
    alignItems:"center",
    borderRadius: 10,
    backgroundColor: "red",
  },
  canceltext: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#030303",
  },
});
