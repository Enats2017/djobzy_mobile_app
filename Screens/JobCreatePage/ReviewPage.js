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
import { useCreateJobGlobalStore } from "../../components/useCreateJobGlobalStore";

const ReviewPage = ({ setActiveTab }) => {
  const {
    title,
    description,
    totalPrice,
    hourlyRate,
    expectedTime,
    selectedOption,
    customDays,
    selectedSubs,
    requirements,
    languages,
    address,
    fileData,
    setEditingFromReview,
  } = useCreateJobGlobalStore();
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
            <TouchableOpacity
              onPress={() => {
                setEditingFromReview(6); // review tab index
                setActiveTab(0);
              }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>{title || "N/A"}</Text>
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
            <TouchableOpacity
              onPress={() => {
                setEditingFromReview(6); // review tab index
                setActiveTab(0);
              }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>{description || "N/A"}</Text>
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
            <TouchableOpacity
              onPress={() => {
                setEditingFromReview(6); // review tab index
                setActiveTab(5);
              }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>
            Total Price:{" "}
            <Text style={styles.bold}>CAD {totalPrice || "0"}</Text>
          </Text>
          <Text style={styles.value}>
            Hourly Rate:{" "}
            <Text style={styles.bold}>CAD {hourlyRate || "0.00"}</Text>
          </Text>
          <Text style={styles.value}>
            Estimated Hours:{" "}
            <Text style={styles.bold}>{expectedTime || "0"}h</Text>
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
            <Text style={styles.sectionTitle}>Duration</Text>
            <TouchableOpacity
              onPress={() => {
                setEditingFromReview(6); // review tab index
                setActiveTab(4);
              }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>
            Project Length:{" "}
            <Text style={styles.bold}>
              {(() => {
                switch (selectedOption) {
                  case "1":
                    return "1 day or less";

                  case "1-7":
                    return "1-7 days";

                  case "custom":
                    return customDays ? `${customDays} days` : "—";

                  case "10-30":
                    return "1 month or less";

                  case "30+":
                    return "1-3 months";

                  case "customEmp":
                    return customDays ? `${customDays} months` : "—";

                  default:
                    return "—";
                }
              })()}
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
            <TouchableOpacity
              onPress={() => {
                setEditingFromReview(6); // review tab index
                setActiveTab(1);
              }}
            >
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
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Requirements</Text>

            <TouchableOpacity
              onPress={() => {
                setEditingFromReview(6); // review tab index
                setActiveTab(2);
              }}
            >
              <MaterialCommunityIcons name="pencil" size={16} color="#c3c3c3" />
            </TouchableOpacity>
          </View>

          {/* BODY */}
          {requirements.length > 1 ? (
            requirements.map((r, index) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.sectionText}>{r.value}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>—</Text>
          )}
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
            <Text style={styles.sectionTitle}>Language</Text>
            <TouchableOpacity
              onPress={() => {
                setEditingFromReview(6); // review tab index
                setActiveTab(2);
              }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          {languages.length > 1 ? (
            languages.map((l, index) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>

                <Text style={styles.sectionText}>
                  {l.lang}
                  {l.level ? ` : ${l.text}` : ""}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>—</Text>
          )}
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
            <Text style={styles.sectionTitle}>Address</Text>
            <TouchableOpacity
              onPress={() => {
                setEditingFromReview(6); // review tab index
                setActiveTab(2);
              }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionText}>{address}</Text>
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
            <TouchableOpacity
              onPress={() => {
                setEditingFromReview(6); // review tab index
                setActiveTab(3);
              }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#c3c3c3c3"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionText}>
            {fileData?.fileName || "No file uploaded"}
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
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  bullet: {
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 20,
  },
  emptyText: {
    color: "#ffffff",
  },
});

export default ReviewPage;
