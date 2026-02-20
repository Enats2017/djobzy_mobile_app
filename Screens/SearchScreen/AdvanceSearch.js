import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { scale, fontScale } from "../../utils/scale";
import GradientButton from "../../components/GradientButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import { useGlobalSearch } from "../SearchScreen/useGlobalSearch";

const AdvancedSearch = () => {
  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");
  const [remote, setRemote] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const [categoryText, setCategoryText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { categories } = useGlobalSearch();

  useEffect(() => {
    if (categories && categories.length > 0) {
      const selected = categories[0];

      setSelectedCategories([
        {
          subid: selected.subId || selected.serviceId,
          subname: selected.name,
        },
      ]);
    }
  }, [categories]);

  const fetchCategories = async (text) => {
    setCategoryText(text);

    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/get-services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ service_name: text }),
      });

      const data = await res.json();

      if (data.status === 200) {
        setSuggestions(data.data);
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      console.log("API error", e);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrolcontent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Advanced Search</Text>
          <View style={{ width: 18 }} />
        </View>
        <Text style={styles.label}>Keyword</Text>
        <TextInput style={styles.input} placeholder="Keyword" />

        <Text style={styles.label}>Category</Text>
        <View style={styles.plusInput}>
          <TextInput
            style={styles.innerInput}
            placeholder="Add a Categroy"
            value={categoryText}
            onChangeText={fetchCategories}
          />
          <TouchableOpacity style={styles.inputRow}>
            <FontAwesome6 name="plus" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        {suggestions.length > 0 && (
          <View style={styles.dropdown}>
            <ScrollView>
              {suggestions.map((service) => (
                <View key={service.service_id}>
                  <Text style={styles.serviceTitle}>
                    {service.service_name}
                  </Text>

                  {service.subservices.map((sub) => (
                    <TouchableOpacity
                      key={sub.subid}
                      style={styles.dropdownItem}
                      onPress={() => {
                        if (
                          !selectedCategories.find((x) => x.subid === sub.subid)
                        ) {
                          setSelectedCategories([...selectedCategories, sub]);
                        }
                        setCategoryText("");
                        setSuggestions([]);
                      }}
                    >
                      <Text>{sub.subname}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        <View style={styles.chipRow}>
          {selectedCategories.map((item) => (
            <View key={item.subid} style={styles.chip}>
              <Text style={styles.chipText}>{item.subname}</Text>
              <TouchableOpacity
                onPress={() =>
                  setSelectedCategories(
                    selectedCategories.filter((x) => x.subid !== item.subid),
                  )
                }
              >
                <Ionicons name="close" size={14} color="#000" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text style={styles.label}>Hourly Price</Text>
        <View style={styles.offerRow}>
          <View style={styles.offerBox}>
            <View style={styles.inputContainer}>
              <Text style={styles.currency}>Form</Text>

              <TextInput
                style={styles.slideinput}
                value={String(priceRange[0])}
                onChangeText={(v) =>
                  setPriceRange([Number(v) || 0, priceRange[1]])
                }
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.offerBox}>
            <View style={styles.inputContainer}>
              <Text style={styles.currency}>to</Text>
              <TextInput
                style={styles.slideinput}
                value={String(priceRange[1])}
                onChangeText={(v) =>
                  setPriceRange([priceRange[0], Number(v) || 0])
                }
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={styles.sliderRow}>
          <MultiSlider
            values={priceRange}
            min={0}
            max={5000}
            step={50}
            sliderLength={330}
            onValuesChange={(values) => setPriceRange(values)}
            selectedStyle={{ backgroundColor: "#D17B68" }}
            unselectedStyle={{ backgroundColor: "#444" }}
            markerStyle={{
              height: 20,
              width: 20,
              borderRadius: 10,
              backgroundColor: "#D17B68",
              borderWidth: 3,
              borderColor: "#fff",
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setRemote(!remote)}
        >
          <View style={[styles.checkbox, remote && styles.checked]}>
            {remote && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>

          <Text style={styles.checkboxText}>Remote Jobs</Text>
        </TouchableOpacity>
        <View style={{ paddingBottom: 10 }}></View>
        <View style={styles.address}>
          <TextInput style={styles.input} placeholder="Address" />
          <TextInput style={styles.input} placeholder="km" />
          <GradientButton />
        </View>
      </ScrollView>
    </>
  );
};

export default AdvancedSearch;

const styles = StyleSheet.create({
  scrolcontent: {
    paddingBottom: 50,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  label: {
    color: "#fff",
    fontFamily: "Montserrat_500Medium",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    fontFamily: "Montserrat_500Medium",
    borderRadius: 8,
    padding: 12,
  },
  plusInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 3,
  },
  innerInput: {
    flex: 1,
    color: "#000",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  inputRow: {
    backgroundColor: "#666666",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    borderRadius: 20,
    width: 25,
    height: 25,
  },
  offerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  offerBox: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: scale(15),
    borderRadius: 10,
    padding: 2,
  },
  currency: {
    fontFamily: "Montserrat_400Medium",
    fontSize: fontScale(14),
    color: "#666666",
    fontStyle: "italic",
  },
  slideinput: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  priceRow: {
    flexDirection: "row",
    gap: 10,
  },

  priceInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
  },
  sliderRow: {

    alignItems: "center",
  },

  remoteRow: {

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",


  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  address: {
    flexDirection: "column",
    gap: 15,
    marginBottom: 18,
  },
  checked: {
    backgroundColor: "#ff3d3d",
    borderColor: "#ff3d3d",
  },
  checkboxText: {
    color: "#fff",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 4,
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  serviceTitle: {
    fontWeight: "bold",
    padding: 6,
    backgroundColor: "#f2f2f2",
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  chip: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: "center",
    gap: 5,
  },
  chipText: { color: "#000", fontSize: 12 },

  offerRow: { flexDirection: "row", gap: 10 },
  offerBox: { flex: 1 },

  currency: { fontSize: fontScale(14), color: "#666" },
  slideinput: { fontSize: 16, color: "#666" },



});
