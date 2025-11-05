import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ReviewPage = ({
  jobData,
  selectedSubs,
  contractData,
  fileData,
  durationData,
  budgetData,
  setActiveTab,
  onBack,
}) => {
  const navigation = useNavigation();

  return (
    <View>
      <ScrollView
        style={{ marginBottom: 170 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Title</Text>
            <TouchableOpacity onPress={() => setActiveTab(0)}>
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>{jobData.title || "N/A"}</Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#Ffffff33",
            width: "100%",
            marginBottom: 10,
          }}
        />

        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TouchableOpacity onPress={() => setActiveTab(0)}>
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>{jobData.description || "N/A"}</Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#Ffffff33",
            width: "100%",
            marginBottom: 10,
          }}
        />

        {/* Pricing Section */}
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <TouchableOpacity onPress={() => setActiveTab(5)}>
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>
            Total Price:{" "}
            <Text style={styles.bold}>CAD {budgetData?.totalPrice || "0"}</Text>
          </Text>
          <Text style={styles.value}>
            Hourly Rate:{" "}
            <Text style={styles.bold}>
              CAD {budgetData?.hourlyRate || "0.00"}
            </Text>
          </Text>
          <Text style={styles.value}>
            Estimated Hours:{" "}
            <Text style={styles.bold}>{budgetData.expectedTime || "0"}h</Text>
          </Text>
          <Text style={styles.value}>
            Project Length:{" "}
            <Text style={styles.bold}>
              {durationData?.selectedOption || durationData?.customDays}
            </Text>
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#Ffffff33",
            width: "100%",
            marginBottom: 10,
          }}
        />
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => setActiveTab(1)}>
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {selectedSubs?.length > 0 ? (
              selectedSubs.map((item, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{item.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.value}>No categories selected</Text>
            )}
          </View>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#Ffffff33",
            width: "100%",
            marginBottom: 10,
          }}
        />
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Contract Details</Text>
            <TouchableOpacity onPress={() => setActiveTab(2)}>
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionText}>
            Address: <Text style={styles.bold}>{contractData?.address}</Text>
          </Text>
          <Text style={styles.sectionText}>
            Requirements:{" "}
            <Text style={styles.bold}>
              {contractData?.requirements?.map((r) => r.value).join(", ")}
            </Text>
          </Text>
          <Text style={styles.sectionText}>
            Languages:{" "}
            <Text style={styles.bold}>
              {Array.isArray(contractData?.languages) &&
              contractData.languages.length > 0
                ? contractData.languages.map((l) => l.lang?.trim()).join(", ")
                : "—"}
            </Text>
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#Ffffff33",
            width: "100%",
            marginBottom: 10,
          }}
        />

        {/* --- File Upload --- */}
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Attachment</Text>
            <TouchableOpacity onPress={() => setActiveTab(3)}>
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionText}>
            {fileData?.fileName ? fileData.fileName : "No file uploaded"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 7,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 18,
  },
  value: {
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    paddingVertical: 5,
  },
  sectionText: {
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    paddingVertical: 5,
  },
  bold: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#ffffff1a",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    margin: 3,
  },
  tagText: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 10,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  fileText: {
    color: "#ccc",
    fontSize: 13,
    marginLeft: 6,
  },
  sectionBtn: {
    flexDirection: "column",
    gap: 15,
    paddingVertical: 10,
  },
  button: {
    marginHorizontal: 5,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ebe8e8ff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
});

export default ReviewPage;
