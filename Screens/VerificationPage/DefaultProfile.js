import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";

const DefaultProfile = ({ services, filtered, onNext }) => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [filteredList, setFilteredList] = useState(filtered);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilteredList(filtered || []);
  }, [filtered]);

  useEffect(() => {
    if (!search) {
      setFilteredList(services);
    } else {
      const results = services.filter((s) =>
        s.subname.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredList(results);
    }
  }, [search, services]);
  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };
  const handleSubmit = async () => {
    if (!role) {
      Alert.alert("Error", "Please select your profile type.");
      return;
    }

    if (selectedServices.length === 0) {
      Alert.alert("Error", "Please select at least one category.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const payload = {
        type: role,
        step_flag: 2,
        service: selectedServices,
      };

      const res = await axios.post(`${API_URL}/user-default-profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.data.status === 200) {
        Alert.alert("Success", "Default profile saved successfully.");
        onNext();
      } else {
        Alert.alert("Error", res.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to submit default profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text style={styles.heading}>Choose Default Profile</Text>
      <Text style={styles.sub}>
        Depending on what is your current priority, please select one of these
        options.
      </Text>
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={[styles.card, role == 2 && styles.cardActive]}
          onPress={() => setRole(2)}
        >
          <View style={styles.cardIcon}>
            <FontAwesome5 name="user" size={20} color="#fff" />
          </View>
          <Text style={styles.cardTitle}>Employee</Text>
          <Text style={styles.cardSub}>I'm offering services</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, role == 1 && styles.cardActive]}
          onPress={() => setRole(1)}
        >
          <View style={[styles.cardIcon, { backgroundColor: "#444" }]}>
            <Ionicons name="bag" size={20} color="#fff" />
          </View>
          <Text style={[styles.cardTitle, { color: "#ddd" }]}>Employer</Text>
          <Text style={[styles.cardSub, { color: "#aaa" }]}>
            I'm employing for jobs
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtext}>
        Default profile can be changed in your settings.
      </Text>

      <Text style={[styles.heading, { marginTop: 18 }]}>Categories</Text>
      <Text style={styles.sub}>Choose categories for Your Default Profile</Text>
      <View style={styles.searchContainer}>
        <EvilIcons
          name="search"
          size={20}
          color="#ffffff"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#777"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <Text style={[styles.sub, { marginTop: 14 }]}>Suggestions:</Text>
      <View style={styles.suggestionsRow}>
        {filteredList.slice(0, 6).map((item) => (
          <TouchableOpacity
            key={item.subid}
            style={[
              styles.tag,
              selectedServices.includes(item.subid) && styles.tagSelected,
            ]}
            onPress={() => toggleService(item.subid)}
          >
            <Text
              style={{
                color: selectedServices.includes(item.subid) ? "#fff" : "#aaa",
                fontFamily: "Montserrat_400Regular",
                fontSize: 12,
              }}
            >
              {item.subname}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.sub, { marginTop: 14 }]}>Selected:</Text>
      <View style={styles.selectedRow}>
        {selectedServices.length > 0 ? (
          selectedServices.map((id) => {
            const item = services.find((s) => s.subid === id);
            return (
              <View key={id} style={styles.selectedTag}>
                <Text style={styles.selectedText}>{item?.subname}</Text>
                <TouchableOpacity onPress={() => toggleService(id)}>
                  <Ionicons
                    name="close-circle"
                    size={12}
                    color="#303030"
                    style={styles.removeIcon}
                  />
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text style={{ color: "#777" }}>No services selected.</Text>
        )}
      </View>
      <TouchableOpacity style={styles.nextBtn} onPress={handleSubmit}>
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  sub: {
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  cardRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  heading: {
    color: "#CB7767",
    fontSize: 28,
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 7,
  },
  card: {
    width: 180,
    height: 125,
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#FFFFFF0D",
    borderColor: "#FFFFFF1A",
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  cardActive: {
    borderColor: "#CB7767",
    borderWidth: 1.5,
    backgroundColor: "#CB77670D",
  },

  cardIcon: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#d98974",
    marginBottom: 8,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  cardSub: {
    color: "#ccc",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
  },
  subtext: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    fontStyle: "italic",
    color: "#c3c3c3c3",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 12,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    paddingVertical: 10,
  },
  suggestionsRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#FFFFFF0D",

    borderRadius: 20,
    padding: 8,
  },
  tagSelected: {
    borderColor: "#fff",
    borderWidth: 1,
  },
  selectedRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
    flexWrap: "wrap",
  },
  selectedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
  },
  removeIcon: {
    marginLeft: 5,
  },
  selectedText: {
    color: "#303030",
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
  },

  nextBtn: {
    backgroundColor: "#C96B59",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  nextBtnText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
  },
});

export default DefaultProfile;
