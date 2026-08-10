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
  Pressable,
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
import QuestionMark from "../../components/QuestionMark";
import { tooltipMessage } from "../../components/TooltipMessage";
import NoJobAndServiceModal from "../../components/NoJobAndServiceModal";
import { toastError } from "../../utils/toast";

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
    unique_id
  } = useServiceGlobalStore();
  // console.log("EDIT MODE ID:", unique_id);
  const { expectedTime, setExpectedTime } = useServiceGlobalStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [titleModal, setTitleModal] = useState(false);
  const [freshServiceModal, setFreshServiceModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    hourlyRate: "",
    totalPrice: "",
  });

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
    if (hourly && total) {
      if (hourly > total) {
        toastError("Hourly rate cannot be more than total price.");
        setExpectedTime(0);
        return;
      }
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
    const expected = finalPrice / hourly;
    setExpectedTime(Math.ceil(expected));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
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

  const handleNext = () => {
    let newErrors = {};
    if (!title || title.trim() === "") {
      newErrors.title = "Service title is required";
    }
    if (!description || description.trim() === "") {
      newErrors.description = "Service description is required";
    }
    if (!hourlyRate || Number(hourlyRate) <= 0) {
      newErrors.hourlyRate = "Enter valid hourly rate";
    }
    if (!totalPrice || Number(totalPrice) <= 0) {
      newErrors.totalPrice = "Enter valid total price";
    }
    if (Number(hourlyRate) > Number(totalPrice)) {
      newErrors.totalPrice = "Total price must be greater than hourly rate";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    navigation.navigate("PromoteCategoryPage");
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
        setTitleModal(true);
        setTemplates(data.result);
      } else {
        if (data.result.length === 0) {
          setFreshServiceModal(true);
        }
      }
    } catch (error) {
      console.log("Template API error:", error);
    }
  };

  const handleTemplateSelect = async (item) => {
    console.log(item.id);
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
      const result = data.result;
      const store = useServiceGlobalStore.getState();
      store.setField("title", result.title || "");
      store.setField("description", result.description || "");
      store.setField("hourlyRate", result.hour_minimum?.toString() || "");
      store.setExpectedTime((result.selected_time == "no-calendar" ? 1 : result.selected_time) || 0,);
      store.clearCategories();
      result.subservice_id?.forEach((id, index) => {
        store.addCategory({
          subId: Number(id),
          name: result.subcategories?.[index],
        });
      });

      if (result.attachment?.length) {
        result.attachment.forEach((img) => {
          store.addImage({ uri: img.attach });
        });
      }

      setShowDropdown(false);
      setTimeout(() => {
        setErrors({
          title: "",
          description: "",
          hourlyRate: "",
          totalPrice: "",
        });
      }, 500);
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
          <View style={styles.template}>
            <Text style={styles.label}>Service Title</Text>
            <TouchableOpacity
              onPress={() => {
                fetchTemplates();
              }}
            >
              <Text style={styles.templatetext}>Use Template</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(v) => {
              setField("title", v);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            maxLength={titleLimit}
            placeholder="Service title"
            placeholderTextColor="#999"
          />
          {errors.title ? (
            <Text style={styles.errorText}>{errors.title}</Text>
          ) : null}
          <Text style={styles.charCount}>
            {titleLimit - title.length} characters left
          </Text>

          {/* Description */}
          <Text style={styles.label}>Service Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={(v) => {
              setField("description", v);
              setErrors((prev) => ({ ...prev, description: " " }));
            }}
            maxLength={descLimit}
            multiline
            placeholder="Give details"
            placeholderTextColor="#999"
          />
          {errors.description ? (
            <Text style={styles.errorText}>{errors.description}</Text>
          ) : null}
          <Text style={styles.charCount}>
            {description.length}/{descLimit}
          </Text>

          {/* Hourly Rate */}
          <View style={styles.label}>
            <QuestionMark title="Add hourly rate" iconColor="#fff" tooltipMessage={tooltipMessage.tooltip_servicepack_prices} />
          </View>

          <View style={styles.inlineInputContainer}>
            <Text style={styles.currency}>CAD</Text>
            <TextInput
              style={styles.inlineInput}
              keyboardType="numeric"
              value={hourlyRate}
              onChangeText={(v) => {
                handleHourlyChange(v);
                setErrors((prev) => ({ ...prev, hourlyRate: "" }));
              }}
              placeholder="0 / h"
              placeholderTextColor="#999"
            />
          </View>
          {errors.hourlyRate ? (
            <Text style={styles.errorText}>{errors.hourlyRate}</Text>
          ) : null}

          {/* Total Price */}
          <View style={styles.label}>
            <QuestionMark title="Add Total rate" iconColor="#fff" tooltipMessage={tooltipMessage.tooltip_servicepack_prices} />
          </View>

          <View style={styles.inlineInputContainer}>
            <Text style={styles.currency}>CAD</Text>
            <TextInput
              style={styles.inlineInput}
              keyboardType="numeric"
              value={totalPrice}
              onChangeText={(v) => {
                handleTotalPriceChange(v);
                setErrors((prev) => ({ ...prev, totalPrice: "" }));
              }}
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
          {errors.totalPrice ? (
            <Text style={styles.errorText}>{errors.totalPrice}</Text>
          ) : null}
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

        <View style={styles.categoryBtn}>
          <GradientButton title="Choose Category" onPress={handleNext} />
        </View>
      </View>

      <NoJobAndServiceModal
        visible={freshServiceModal}
        url={require("../../assets/images/fresh-start.png")}
        text="“No prompt service created yet. Please create one first.”"
        onClose={() => setFreshServiceModal(false)}
      />

      <Modal
        visible={titleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setTitleModal(false)}
      >
        <View style={styles.modalOverlay} onPress={() => setTitleModal(false)}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setTitleModal(false)} />
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
                <ScrollView showsVerticalScrollIndicator={true}>
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
              <Text style={styles.newJobButtonText}>Create a New Service</Text>
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
    borderWidth: 1,
    borderColor: "#c5c5c5",
    borderRadius: 5,
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
    justifyContent: "space-between",
    backgroundColor: "#2A2A2D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currency: {
    color: "#aaa",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  inlineInput: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
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
    height: 250,
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
  errorText: {
    color: "#f50808",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Montserrat_400Regular",
  },
});
export default PromoteService;
