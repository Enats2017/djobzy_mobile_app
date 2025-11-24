import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,

} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { useNavigation } from "@react-navigation/native";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";
import { useServiceGlobalStore } from "./ServiceGlobalStore";
import * as ImagePicker from "expo-image-picker";

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

      if (!result.canceled && result.assets) {
        result.assets.forEach((asset) => addImage(asset));
      }
    } catch (err) {
      console.log("Image pick error:", err);
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
          <Text style={styles.label}>Service Title</Text>
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
          <Text style={{ color: "#fff", marginTop: 10, fontSize: 12, fontStyle: "italic", }}>
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
                  <Ionicons name="close" size={14} color="#fff" />
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

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    paddingBottom: 100
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#222222",
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
    paddingBottom: 90
  },

});
export default PromoteService;
