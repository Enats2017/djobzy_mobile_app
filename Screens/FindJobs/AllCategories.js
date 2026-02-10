import { Feather, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";
import { useGlobalSearch } from "../SearchScreen/useGlobalSearch";
import GradientButton from "../../components/GradientButton";

const AllCategories = () => {
  const navigation = useNavigation();
  const { categories, addCategory, removeCategory } = useGlobalSearch();
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(0);

  /* ================= LOAD USER ================= */
  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    setAdmin(user?.admin || 0);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/all-category`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setServices(data?.services || []);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    fetchData();
  }, []);

  const isSelected = (subId) => categories.some((item) => item.subId === subId);

  const toggleSubCategory = (service, sub) => {
    if (isSelected(sub.subid)) {
      removeCategory(sub.subid);
    } else {
      addCategory({
        serviceId: service.id,
        subId: sub.subid,
        name: sub.subname,
      });
    }
  };
  const filteredServices = services
    .map((service) => {
      if (!search.trim()) return service;

      const matchedSubs = service.subservices?.filter((sub) =>
        sub.subname.toLowerCase().includes(search.toLowerCase()),
      );

      if (
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        matchedSubs?.length
      ) {
        return { ...service, subservices: matchedSubs };
      }
      return null;
    })
    .filter(Boolean);

  /* ================= RENDER ================= */
  if (loading) return <Loading />;

  return (
      <View style={styles.categoryContainer}>
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.searchBar}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search category"
            placeholderTextColor="#777"
            style={styles.searchInput}
          />
          <Feather name="search" size={18} color="#999" />
        </View>
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedContainer}
          >
            {categories.map((sub) => (
              <View key={sub.subId} style={styles.selectedPill}>
                <Text style={styles.selectedText}>{sub.name}</Text>
                <TouchableOpacity onPress={() => removeCategory(sub.subId)}>
                  <Entypo name="cross" size={17} color="#c3c3c3" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {filteredServices.map((service) => (
          <View key={service.id} style={styles.serviceBlock}>
            <Text style={styles.serviceTitle}>{service.name}</Text>

            <View style={styles.subContainer}>
              {service.subservices?.map((sub) => {
                const active = isSelected(sub.subid);

                return (
                  <TouchableOpacity
                    key={sub.subid}
                    style={[styles.subItem, active && styles.subItemActive]}
                    onPress={() => toggleSubCategory(service, sub)}
                  >
                    <Text
                      style={[styles.subText, active && styles.subTextActive]}
                    >
                      {sub.subname}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
               <View style={styles.dividerLine} />
          </View>
        ))}
    </ScrollView>
      
    {categories.length > 0 && (
      <View style={styles.bottomButtonWrapper}>
    
        <GradientButton   title="Next"/>
      </View>
    )}

  </View>

  );
};

export default AllCategories;
const styles = StyleSheet.create({
  categoryContainer: {
    flex: 1,
  },

  /* SEARCH */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: "#666666",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  selectedContainer: {
    flexDirection: "row",
    marginTop: 12,
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

  serviceBlock: {
    marginTop: 15,
  },
  serviceTitle: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Montserrat_600SemiBold",
    letterSpacing: 0.2,
    marginBottom: 10,
  },

  subContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subItem: {
    backgroundColor: "#353535",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",

    margin: 4,
  },
  subItemActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  subText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  subTextActive: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
   dividerLine: {
    height: 1,
    backgroundColor: "#FFFFFF1a",
    marginTop: 10,
  },
  bottomButtonWrapper: {
  position: "absolute",
   backgroundColor: "#222",
  bottom: 79,
  left: 0,
  paddingVertical:10,
  right: 0,
  
},



});
