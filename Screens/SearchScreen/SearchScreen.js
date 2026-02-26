import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import SearchedJobs from "../../components/SearchedJobs";
import SearchedEmployees from "../../components/SearchedEmployees";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../components/Footer";
import GradientButton from "../../components/GradientButton";
import { toastError, toastSuccess } from "../../utils/toast";
import { useGlobalSearch } from "./useGlobalSearch";
import EmployerFooter from "../../components/EmployerFooter";
import LineDivider from "../../components/LineDivider";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SearchScreen = () => {
  const navigation = useNavigation();
  const debounceTimer = useRef(null);
  const latestKeywordRef = useRef("");
  const { keyword, setKeyword, reset, setUserSearchMode } = useGlobalSearch();
  const categoryCount = useGlobalSearch((state) => state.categories.length);
  const route = useRoute();
  const { search_type } = route.params ?? {};
  const [results, setResults] = useState([]);
  const [searchMode, setSearchMode] = useState(search_type ?? 0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(0);
  const insets = useSafeAreaInsets();

  const handleSearch = (text) => {
    setKeyword(text);
    latestKeywordRef.current = text;

    // Clear previous debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If text is too short, clear results immediately
    if (text.length <= 2) {
      setResults([]);
      return;
    }

    // Debounce API call
    debounceTimer.current = setTimeout(async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  const handleRequestCategory = async () => {
    if (!categoryName.trim()) {
      toastSuccess("Please enter category name");
      return;
    }
    try {
      setCategoryLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/request-category`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryName,
        }),
      });
      const data = await res.json();
      if (data.status === 200) {
        toastSuccess("Category request sent successfully");
        setCategoryName("");
        setCategoryModal(false);
      } else {
        toastError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Request category error:", error);
      toastError("Server error");
    } finally {
      setCategoryLoading(false);
    }
  };
  const handleSwitch = () => {
    const newMode = searchMode === 0 ? 2 : 0;
    setSearchMode(newMode);
    setUserSearchMode(newMode);
  };

  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    setAdmin(user?.admin);
  };
  useEffect(() => {
    loadUser();
    reset();
    setUserSearchMode(search_type);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
        <View style={styles.container}>
          {/* SEARCH BAR */}
          <View style={styles.searchSection}>
            <View style={styles.inputWrapper}>
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
                          setUserSearchMode(2)
                          setKeyword("");
                          setResults([]);
                          setShowDropdown(false);
                        }}
                      >
                        <Ionicons name="person" size={16} color="#000" />
                        <Text style={styles.dropdownItemText}>
                          Search for a people
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSearchMode(0);
                          setUserSearchMode(0)
                          setKeyword("");
                          setResults([]);
                          setShowDropdown(false);
                        }}
                      >
                        <Ionicons name="briefcase" size={16} color="#000" />
                        <Text style={styles.dropdownItemText}>
                          Search for a Jobs
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
              <View style={styles.divider} />

              <TextInput
                placeholder={
                  searchMode == 0 ? "Search for a jobs" : "Search for a people"
                }
                placeholderTextColor="#aaa"
                value={keyword}
                onChangeText={handleSearch}
                style={styles.input}
              />

              <Ionicons name="search" size={18} color="#FFFFFF"
                onPress={() => navigation.navigate("SearchResult")}
              />
            </View>

            {/* GRID ICON */}
            <TouchableOpacity
              style={styles.categoryIcon}
              onPress={() => navigation.navigate("SearchCategory")}
            >
              <Ionicons name="grid-outline" size={18} color="#fff" />

              {categoryCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{categoryCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          >
            {keyword.length > 0 && (
              <View style={styles.requestCategory}>
                <Text style={styles.categoryText}>
                  Search for a {keyword}
                </Text>
                <TouchableOpacity onPress={handleSwitch}>
                  <Text style={styles.requestText}>
                    Switch to {searchMode == 2 ? "jobs" : "Employee"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
           

            {loading ? (
              <View style={styles.resultLoader}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
              <>
                {searchMode == 0 ? (
                  <SearchedJobs data={results} />
                ) : (
                  <SearchedEmployees data={results} />
                )}

                {results.length > 0 && (
                  <View style={styles.requestCategory}>
                    <Text style={styles.categoryText}>
                      Can't find your category?
                    </Text>
                    <TouchableOpacity onPress={() => setCategoryModal(true)}>
                      <Text style={styles.requestText}>
                        Request a new category
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      <Modal
        visible={categoryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setCategoryModal(false)}
      >
        <View style={styles.deleteOverlay}>
          <View
            style={[styles.categoryContainer, { paddingBottom: insets.bottom }]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Request a new category</Text>
              <TouchableOpacity onPress={() => setCategoryModal(false)}>
                <Ionicons name="close" size={22} color="#000" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Enter Category"
              placeholderTextColor="#666666"
              style={styles.categoryinput}
              value={categoryName}
              onChangeText={setCategoryName}
            />

            <GradientButton
              title="Send"
              disabled={categoryLoading}
              loading={categoryLoading}
              onPress={handleRequestCategory}
            />
          </View>
        </View>
      </Modal>
      {admin == 2 ? <EmployerFooter /> : <Footer />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#222222",
  },
  resultLoader: {
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -5,
    minWidth: 16,
    height: 16,
    borderRadius: 9,
    backgroundColor: "#d51b1b",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
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
      fontFamily:"Montserrat_400Regular",
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
    borderBottomWidth:1.5,
    borderColor:"#ffffff1a"
  },

  categoryText: {
    color: "#fff",
    fontFamily:"Montserrat_400Regular",
    fontSize: 14,
    marginBottom:8
  },

  requestText: {
    color: "#f5b400",
    fontSize: 14,
      fontFamily:"Montserrat_400Regular",
    textDecorationLine: "underline",
    textDecorationColor: "#f5b400",
  },

  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  categoryContainer: {
    backgroundColor: "#fff",
    width: "100%",
    maxHeight: "70%",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: "#000",
  },
  categoryinput: {
    height: 46,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    fontFamily: "Montserrat_500Medium",
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#666666",
    marginBottom: 10,
  },
});

export default SearchScreen;
