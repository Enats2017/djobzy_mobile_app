import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation } from "@react-navigation/native";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";
import { useServiceGlobalStore } from "./ServiceGlobalStore";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";

const PromoteService = () => {
  const navigation = useNavigation();

  const {
    title,
    description,
    hourlyRate,
    totalPrice,
    images,
    setField,
    addImage,
    removeImage,
   
  } = useServiceGlobalStore();
  const { expectedTime, setExpectedTime } = useServiceGlobalStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [titleModal, setTitleModal] = useState(false);
  const [templates, setTemplates] = useState([]);

  const titleLimit = 60;
  const descLimit = 500;

  const handleHourlyChange = (value) => {
    setField("hourlyRate", value);

    const total = parseInt(totalPrice);
    const hourly = parseInt(value);

    if (!total || !hourly) {
      setExpectedTime(0);
      return;
    }

    if (hourly > total) {
      Alert.alert(
        "Invalid Input",
        "Hourly rate cannot be more than total price."
      );
      setExpectedTime(0);
      return;
    }

    const expected = total / hourly;
    setExpectedTime(Math.ceil(expected));
  };

  const handleTotalPriceChange = (value) => {
    setField("totalPrice", value);

    const finalPrice = parseInt(value);
    const hourly = parseInt(hourlyRate);

    if (!hourly || !finalPrice) {
      setExpectedTime(0);
      return;
    }

    if (hourly > finalPrice) {
      Alert.alert(
        "Invalid Input",
        "Total price cannot be less than Hourly rate."
      );
      setExpectedTime(0);
      return;
    }

    const expected = finalPrice / hourly;
    setExpectedTime(Math.ceil(expected));
  };

  // ---------------------------
  // Pick Image from Gallery
  // ---------------------------
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length) {
        result.assets.forEach((asset) => {
          addImage({ uri: asset.uri });
        });
      }
    } catch (err) {
      console.log("Image pick error:", err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/get-template`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 2,
          page_type: 0,
        }),
      });
      const data = await res.json();

      if (data.status === 200) {
        setTemplates(data.result);
      }
    } catch (error) {
      console.log("Template API error:", error);
    }
  };

 const handleTemplateSelect = async (item) => {
  try {
    setSelectedTemplate(item.title);

    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${API_URL}/fetchDetails`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: item.id,
        type: 2,
      }),
    });

    const data = await res.json();

    if (data.status !== 200) return;

    const result = data.result; // ✅ DEFINE FIRST
    const store = useServiceGlobalStore.getState(); // ✅ DEFINE STORE
    store.setField("title", result.title || "");
    store.setField("description", result.description || "");
    store.setField("hourlyRate", result.hour_minimum?.toString() || "");
    store.setField("totalPrice", result.price?.toString() || "");
    store.setExpectedTime(0);


    store.clearCategories();

    result.subservice_id?.forEach((id, index) => {
      store.addCategory({
        subId: Number(id),
        name: result.subcategories?.[index],
      });
    });

    // images
    if (result.attachment?.length) {
      result.attachment.forEach((img) => {
        store.addImage({ uri: img.attach });
      });
    }

    setShowDropdown(false);
  } catch (err) {
    console.log("Template detail error:", err);
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PageNameHeaderBar
          title="Promote your services"
          navigation={navigation}
        />

        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}

          <View style={styles.template}>
            <Text style={styles.label}>Service Title</Text>

            <TouchableOpacity
              onPress={() => {
                setTitleModal(true);
                fetchTemplates();
              }}
            >
              <Text style={styles.templatetext}>Use Template</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(v) => setField("title", v)}
            maxLength={titleLimit}
            placeholder="Service title"
            placeholderTextColor="#999"
          />
          <Text style={styles.charCount}>
            {titleLimit - title.length} characters left
          </Text>

          {/* Description */}
          <Text style={styles.label}>Service Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={(v) => setField("description", v)}
            maxLength={descLimit}
            multiline
            placeholder="Give details"
            placeholderTextColor="#999"
          />
          <Text style={styles.charCount}>
            {description.length}/{descLimit}
          </Text>

          {/* Hourly Rate */}
          <View style={styles.rateContainer}>
            <Text style={styles.label}>Add hourly rate</Text>
            <Ionicons
              name="help-circle"
              size={16}
              color="#ffffff"
              style={{ marginLeft: 5, marginBottom: 5 }}
            />
          </View>

          <View style={styles.inlineInputContainer}>
            <Text style={styles.currency}>CAD</Text>
            <TextInput
              style={styles.inlineInput}
              keyboardType="numeric"
              value={hourlyRate}
              onChangeText={handleHourlyChange}
              placeholder="0 / h"
              placeholderTextColor="#999"
            />
          </View>

          {/* Total Price */}
          <View style={styles.rateContainer}>
            <Text style={styles.label}>Add total price</Text>
            <Ionicons
              name="help-circle"
              size={16}
              color="#ffffff"
              style={{ marginLeft: 5, marginBottom: 5 }}
            />
          </View>

          <View style={styles.inlineInputContainer}>
            <Text style={styles.currency}>CAD</Text>
            <TextInput
              style={styles.inlineInput}
              keyboardType="numeric"
              value={totalPrice}
              onChangeText={handleTotalPriceChange}
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
          <Text
            style={{
              color: "#fff",
              marginTop: 10,
              fontSize: 12,
              fontStyle: "italic",
            }}
          >
            Expected Time Range: {expectedTime} hours
          </Text>

          {/* Attach Image Button */}
          <TouchableOpacity style={styles.attachBtn} onPress={pickImage}>
            <Text style={styles.attachText}>Attach Image</Text>
          </TouchableOpacity>

          {/* Image Preview with Remove Button */}
          <View style={styles.imagePreviewContainer}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img.uri }} style={styles.previewImage} />

                {/* Remove Button */}
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={15} color="#d66e58" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Next Button */}
        <View style={styles.categoryBtn}>
          <GradientButton
            title="Choose Category"
            onPress={() => navigation.navigate("PromoteCategoryPage")}
          />
        </View>
      </View>
      <Modal
        visible={titleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setTitleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Use template to make it easy
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setSelectedTemplate(null);
                  setShowDropdown(false);
                  setTitleModal(false);
                }}
              >
                <Ionicons name="close" size={24} color="#303030" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              You can use any your previously created job post as a template
            </Text>

            <TouchableOpacity
              style={[
                styles.dropdown,
                { marginBottom: 12 },
                selectedTemplate && { borderColor: "#000000" },
              ]}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  selectedTemplate
                    ? { color: "#000000" }
                    : { color: "#666666" },
                ]}
              >
                {selectedTemplate ? selectedTemplate : "Choose Template"}
              </Text>

              <Entypo name="chevron-small-down" size={22} color="#666666" />
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownList}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {templates.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        handleTemplateSelect(item);
                        setShowDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              disabled={!selectedTemplate}
              style={[
                styles.useTemplateButton,
                !selectedTemplate && { opacity: 0.5 },
              ]}
              onPress={() => {
                setSelectedTemplate(null);
                setShowDropdown(false);
                setTitleModal(false);
              }}
            >
              <Text style={styles.useTemplateButtonText}>Use a template</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newJobButton}
              onPress={() => {
                setSelectedTemplate(null);
                setShowDropdown(false);
                setTitleModal(false);
              }}
            >
              <Text style={styles.newJobButtonText}>Start a New Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#222222",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 15,
    flex: 1,
    marginBottom: 15,
  },
  previewImage: {
    width: 100,
    height: 100,

    borderRadius: 8,
  },
  imageWrapper: {
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 3,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF0D",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    color: "#fff",
    fontSize: 14,
  },
  textArea: {
    height: 148,
    textAlignVertical: "top",
  },
  charCount: {
    color: "#888",
    fontSize: 12,
    textAlign: "right",
    marginVertical: 4,
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  inlineInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: "space-between",
  },
  currency: {
    color: "#aaa",
    fontSize: 14,
  },
  inlineInput: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  attachBtn: {
    borderRadius: 8,
    width: "150",
    borderColor: "#ffffff",
    borderWidth: 1,
    marginTop: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  attachText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  categoryBtn: {
    paddingBottom: 90,
  },
  template: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  templatetext: {
    color: "#ebbe56",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ebbe56",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Montserrat_600SemiBold",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: "#303030",
  },
  closeIcon: {
    fontSize: 20,
    color: "#000000",
  },
  modalSubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#303030",
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#00000033",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  dropdownText: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  chevron: {
    fontSize: 16,
    color: "#666",
  },
  useTemplateButton: {
    backgroundColor: "#d17b68",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  useTemplateButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
  newJobButton: {
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  newJobButtonText: {
    color: "#000000",
    fontSize: 20,
    fontFamily: "Montserrat_600SemiBold",
  },

  dropdownList: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    marginBottom: 8,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#444",
    fontFamily: "Montserrat_500Medium",
  },
});
export default PromoteService;
