import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import SearchedJobs from "../../components/SearchedJobs";
import SearchedEmployees from "../../components/SearchedEmployees";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../components/Footer";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SearchScreen = () => {
  const navigation = useNavigation();
  const debounceTimer = useRef(null);
  const latestKeywordRef = useRef("");
  const route = useRoute();
  const { search_type } = route.params;
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [searchMode, setSearchMode] = useState(search_type ?? 0);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (text) => {
    setKeyword(text);
    latestKeywordRef.current = text;

    // Clear previous debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If text is too short, clear results immediately
    if (text.length < 2) {
      setResults([]);
      return;
    }

    // Debounce API call
    debounceTimer.current = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(`${API_URL}/filter-by-keyword`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keyword: text,
            action: searchMode,
            search_type: search_type,
          }),
        });

        const data = await res.json();

        if (latestKeywordRef.current === text) {
          setResults(data?.results || []);
        }
      } catch (error) {
        console.log("Search error:", error);
      }
    }, 350);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#222" }}>
      <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
        <View style={styles.container}>
          {/* SEARCH BAR */}
          <View style={styles.searchSection}>
            <View style={styles.inputWrapper}>
              {/* DROPDOWN ICON */}
              <View style={styles.dropdownWrapper}>
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() => setShowDropdown(!showDropdown)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={searchMode == 0 ? "briefcase" : "person"}
                    size={16}
                    color="#fff"
                  />
                  <Ionicons name="chevron-down" size={14} color="#fff" />
                </TouchableOpacity>

                {/* TOOLTIP */}
                {showDropdown && (
                  <View style={styles.tooltipDropdown}>
                    {searchMode == 0 ? (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSearchMode(2);
                          setKeyword("");
                          setResults([]);
                          setShowDropdown(false);
                        }}
                      >
                        <Ionicons name="person" size={16} color="#000" />
                        <Text style={styles.dropdownItemText}>Search for a people</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSearchMode(0);
                          setKeyword("");
                          setResults([]);
                          setShowDropdown(false);
                        }}
                      >
                        <Ionicons name="briefcase" size={16} color="#000" />
                        <Text style={styles.dropdownItemText}>Search for a Jobs</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
              <View style={styles.divider} />

              {/* INPUT */}
              <TextInput
                placeholder={
                  searchMode == 0 ? "Search for a jobs" : "Search for a people"
                }
                placeholderTextColor="#aaa"
                value={keyword}
                onChangeText={handleSearch}
                style={styles.input}
              />

              <Ionicons name="search" size={18} color="#aaa" />
            </View>

            {/* GRID ICON */}
            <TouchableOpacity style={styles.categoryIcon}>
              <Ionicons name="grid-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* RESULTS */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* {results.length === 0 && keyword.length >= 2 && (
              <Text style={styles.noResult}>No results found</Text>
            )} */}

            {searchMode == 0 ? (
              <SearchedJobs data={results} />
            ) : (
              <SearchedEmployees data={results} />
            )}

            {keyword.length > 0 && (
              <View style={styles.requestCategory}>
                <Text style={styles.categoryText}>
                  Can't find your category?
                </Text>
                <TouchableOpacity>
                  <Text style={styles.requestText}>
                    Request a new category
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#222222",
  },

  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },

  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF1A",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },

  dropdownWrapper: {
    position: "relative",
  },

  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  tooltipDropdown: {
    position: "absolute",
    top: 36,
    left: 0,
    minWidth: 170,
    maxWidth: 170,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 6,
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },

  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#444",
    marginHorizontal: 8,
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },

  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "#313131",
    alignItems: "center",
    justifyContent: "center",
  },

  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  dropdownItemText: {
    color: "#000",
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },

  noResult: {
    textAlign: "center",
    color: "#777",
    marginTop: 30,
  },

  requestCategory: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoryText: {
    color: "#fff",
    fontSize: 14,
  },

  requestText: {
    color: "#f5b400",
    fontSize: 14,
    textDecorationLine: "underline",
    textDecorationColor: "#f5b400",
  },
});

export default SearchScreen;
