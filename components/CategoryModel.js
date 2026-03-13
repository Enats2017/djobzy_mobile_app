import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { API_URL, API_ICON } from "../api/ApiUrl";
import { useCategoryGlobalStore } from "./CategoryGlobalStore";
import Loading from "./Loading";
import GradientButton from "./GradientButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toastError, toastSuccess } from "../utils/toast";

const CategoryModel = ({ visible, onClose, type, pageType }) => {
  const insets = useSafeAreaInsets();
  const { categories, addCategoryFromModal, removeCategoryFromModal, reset} = useCategoryGlobalStore();
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedServices, setExpandedServices] = useState({});
  const [emptyCat, setEmptyCat] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}/all-category`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        setServices(data.services || []);
      } catch (error) {
        console.log("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredServices = services.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleSelectSub = (service, sub) => {
    addCategoryFromModal({
      serviceId: service.id,
      subId: sub.subid,
      name: sub.subname,
    });
    setEmptyCat('');
  };

  const handleRemoveSub = (subId) => {
    removeCategoryFromModal(subId);
  };
  const toggleExpand = (serviceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };
  const handlePublish = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const services = categories.map((c) => c.subId).join(",");
    let formData = new FormData();
    formData.append("services", services);
    console.log("1111service", services);
    formData.append("service_type", type); // 0 = employee, 2 = promote
    formData.append("page_type", pageType);
    formData.append("source", 0);

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/save-category-service`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });
      const result = await response.json();
      console.log(result);
      if (result.status === 200) {
        toastSuccess("Categories added Successfully!");
        useCategoryGlobalStore.getState().reset();
        onClose();
      } else {
        // toastError(result.message);
        setEmptyCat(result.message);
      }
    } catch (error) {
      toastError("API Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay]}>
        <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
          <View style={styles.Choosecontainer}>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={19}
                color="#000"
                style={{ paddingHorizontal: 10 }}
              />
              <TextInput
                style={styles.input}
                placeholder="Find Categories"
                placeholderTextColor="#000"
                value={search}
                onChangeText={(text) => setSearch(text)}
              />
            </View>
            {emptyCat && (
                <View>
                  <Text style={{ color: "#d81818ff", fontSize: 15,}}> {emptyCat} </Text>
                </View>
            )}
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.selectedContainer}
              >
                {categories.map((sub) => (
                  <View key={sub.subId} style={styles.selectedPill}>
                    <Text style={styles.selectedText}>{sub.name}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSub(sub.subId)}
                    >
                      <Entypo name="cross" size={17} color="#000" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 0 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.catText}>Categories</Text>
              {filteredServices.map((service) => (
                <View key={service.id} style={styles.categoryContainer}>
                  <TouchableOpacity
                    style={styles.mainCategory}
                    onPress={() => toggleExpand(service.id)}
                  >
                    <View style={styles.iconimage}>
                      {service.icon && (
                        <Image
                          source={{
                            uri: `${API_ICON}/images/servicephoto/png-image/${service.icon}?tr=ef-grayscale`,
                          }}
                          style={styles.image}
                        />
                      )}
                    </View>

                    <Text style={styles.mainText}>{service.name}</Text>
                    <Ionicons
                      name={
                        expandedServices[service.id]
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={20}
                      color="#000"
                      style={{ marginLeft: "auto" }}
                    />
                  </TouchableOpacity>
                  {expandedServices[service.id] && (
                    <View style={styles.subCategories}>
                      {service.subservices.map((sub) => {
                        const isSelected = categories.some(
                          (s) => s.subId === sub.subid
                        );
                        return (
                          <TouchableOpacity
                            key={sub.subid}
                            style={
                              isSelected ? styles.selectedSubBox : styles.subBox
                            }
                            onPress={() => handleSelectSub(service, sub)}
                          >
                            <Text
                              style={
                                isSelected
                                  ? styles.selectedSubText
                                  : styles.subText
                              }
                            >
                              {sub.subname}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.categoryBtn}>
              <GradientButton
                loading={loading}
                title="Save"
                onPress={handlePublish}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModel;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "100%",
    maxHeight: "66%",
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  Choosecontainer: {
    height: 510,
    paddingTop: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  categoryContainer: {
    paddingVertical: 8,
  },
  catText: {
    fontFamily: "DegularDisplay_600SemiBold",
    fontSize: 22,
    paddingVertical: 12,
    color: "#0000",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: "#ecedef",
    height: 43,
  },
  input: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#000",
  },
  mainCategory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconimage: {
    backgroundColor: "#ecedef",
    padding: 8,
    borderRadius: 100,
  },
  image: {
    width: 22,
    height: 22,
  },
  mainText: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#000",
  },
  subCategories: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    marginLeft: 30,
    gap: 7,
  },

  subBox: {
    borderColor: "#ecedef",
    borderWidth: 1,
    backgroundColor: "#ecedef",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 60,
  },
  selectedSubBox: {
    borderColor: "#000",
    borderWidth: 1,
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 60,
    color: "#000",
  },

  subText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 11,
    color: "#000",
    textAlign: "center",
  },
  selectedSubText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 11,
    color: "#fff",
    textAlign: "center",
  },

  selectedContainer: {
    flexDirection: "row",
    marginVertical: 10,
    gap: 8,
  },
  selectedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecedef",
    borderColor: "#ecedef",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectedText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: "#000",
    marginRight: 5,
  },
  sectionBtn: {
    flexDirection: "column",
    gap: 15,
    marginTop: 13,
  },
});
