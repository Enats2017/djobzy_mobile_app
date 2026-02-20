import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Pressable,
  Keyboard,
  Dimensions
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { scale, fontScale } from "../../utils/scale";
import GradientButton from "../../components/GradientButton";
import { API_URL } from "../../api/ApiUrl";
import { useGlobalSearch } from "./useGlobalSearch";
const AdvancedSearch = ({ onClose }) => {
  const [remote, setRemote] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [radius, setRadius] = useState(1);

  const [categoryText, setCategoryText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef(null);
  const screenWidth = Dimensions.get("window").width;

  const {
    keyword,
    setKeyword,
    setField,
    addCategory,
    removeCategory,
    categories,
    reset,
    triggerSearch
  } = useGlobalSearch();

  const fetchCategories = async (text) => {
    setCategoryText(text);
    setShowDropdown(true);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/get-services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ service_name: text || "" }),
        });

        const data = await res.json();
        setSuggestions(data.status === 200 ? data.data : []);
      } catch (e) {
        console.log("API error", e);
      }
    }, 300);
  };

  const applyAdvancedSearch = () => {
    let remoteJob = remote ? 1 : 0;
    setKeyword(keyword);
    setField("low_price", priceRange[0]);
    setField("high_price", priceRange[1]);
    setField("radius", radius);
    setField('isRemoteJob', remoteJob);
    triggerSearch();
    onClose?.();
    console.log("ADVANCED SEARCH DATA →", {
      keyword,
      priceRange,
      radius,
      remote,
    });
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrolcontent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Advanced Search</Text>
          <View style={{ width: 18 }} />
        </View>
        <Text style={styles.label}>Keyword</Text>
        <TextInput
          style={styles.input}
          placeholder="Keyword"
          placeholderTextColor="#666666"
          value={keyword || ""}
          onChangeText={setKeyword}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.plusInput}>
          <TextInput
            style={styles.innerInput}
            placeholder="Add a Category"
            placeholderTextColor="#666666"
            value={categoryText}
            onChangeText={fetchCategories}
            onFocus={() => {
              setShowDropdown(true);
              fetchCategories(categoryText);
            }}
          />
          <TouchableOpacity style={styles.inputRow}>
            <FontAwesome6 name="plus" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        {showDropdown && suggestions.length > 0 && (
          <View style={styles.dropdown}>
            <ScrollView showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
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
                        addCategory({
                          serviceId: service.service_id,
                          subId: sub.subid,
                          name: sub.subname,
                        });

                        setCategoryText("");
                        setSuggestions([]);
                        setShowDropdown(false);
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
          {categories.map((item) => (
            <View key={item.subId} style={styles.chip}>
              <Text style={styles.chipText}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => removeCategory(item.subId)}
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
                placeholderTextColor="#666666"
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
                placeholderTextColor="#666666"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={styles.sliderRow}>
          <MultiSlider
            values={priceRange}
            min={0}
            max={9999}
            step={1}
            sliderLength={screenWidth - 80}
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
          <TextInput style={styles.input} placeholder="km" keyboardType="numeric" onChangeText={(v) => setRadius(Number(v) || 0)} />
          <GradientButton title="Apply" onPress={applyAdvancedSearch} />
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
    paddingHorizontal: 12,
    paddingVertical: 3,
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
    width: "100%",
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
    marginBottom: 10,
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
    maxHeight: 250,
    backgroundColor: "#fff",
    borderRadius: 4,
    marginTop: 5,
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
