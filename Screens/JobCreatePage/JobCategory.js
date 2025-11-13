import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_ICON, API_URL } from "../../api/ApiUrl";

const JobCategory = ({
  selectedSubs,
  setSelectedSubs,
  categoryError,
  setCategoryError,
}) => {
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedServices, setExpandedServices] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(`${API_URL}/create-job`, {
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
    const exists = selectedSubs.some((s) => s.subId === sub.subid);
    if (!exists) {
      setSelectedSubs([
        { serviceId: service.id, subId: sub.subid, name: sub.subname },
        ...selectedSubs,
      ]);
      setCategoryError(false);
    }
  };

  const handleRemoveSub = (subId) => {
    setSelectedSubs(selectedSubs.filter((s) => s.subId !== subId));
  };

  const toggleExpand = (serviceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#173D7A" />
      </View>
    );
  }

  return (
    <View style={styles.Choosecontainer}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={19}
          color="#FFFFFF"
          style={{ paddingHorizontal: 10 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Find Categories"
          placeholderTextColor="#fff"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>
      <View>
        {categoryError && (
          <Text style={styles.errorText}>
            *Please choose at least one category
          </Text>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectedContainer}
        >
          {selectedSubs.map((sub) => (
            <View key={sub.subId} style={styles.selectedPill}>
              <Text style={styles.selectedText}>{sub.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveSub(sub.subId)}>
                <Entypo name="cross" size={17} color="#c3c3c3" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        style={styles.scrolContainer}
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
                  expandedServices[service.id] ? "chevron-up" : "chevron-down"
                }
                size={20}
                color="#c3c3c3"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
            {expandedServices[service.id] && (
              <View style={styles.subCategories}>
                {service.subservices.map((sub) => {
                  const isSelected = selectedSubs.some(
                    (s) => s.subId === sub.subid
                  );
                  return (
                    <TouchableOpacity
                      key={sub.subid}
                      style={isSelected ? styles.selectedSubBox : styles.subBox}
                      onPress={() => handleSelectSub(service, sub)}
                    >
                      <Text
                        style={
                          isSelected ? styles.selectedSubText : styles.subText
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
    </View>
  );
};

const styles = StyleSheet.create({
  Choosecontainer: {
    height: "85%",
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
    color: "#FFFFFF",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff10",
    height: 43,
  },
  input: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#ffff",
  },
  mainCategory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconimage: {
    backgroundColor: "#ffffff",
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
    color: "#f3ededff",
  },
  subCategories: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    marginLeft: 30,
    gap: 7,
  },

  subBox: {
    borderColor: "#ffffff1a",
    borderWidth: 1,
    backgroundColor: "#ffffff1a",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 60,
  },

  selectedSubBox: {
    borderColor: "#ffffff",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 60,
    color: "#ffffff1a",
  },

  subText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 11,
    color: "#ffffff",
    textAlign: "center",
  },
  selectedSubText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 11,
    color: "#111010ff",
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
    backgroundColor: "#ffffff1A",
    borderColor: "#f3efefff",

    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectedText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: "#f7f1f1ff",
    marginRight: 5,
  },
  sectionBtn: {
    flexDirection: "column",
    gap: 15,
    marginTop: 13,
    paddingBottom: 70,
  },
  button: {
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#f7f3f3ff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  errorText: {
    color: "#FF0000",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 2,
  },
});

export default JobCategory;
