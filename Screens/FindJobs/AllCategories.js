
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import Loading from "../../components/Loading";

export default function AllCategories() {
  const [categories, setCategories] = useState({});
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/all-category`);
      const json = await response.json();
      const formatted = {};
      json.services.forEach((service) => {
        const categoryName = service.name;
        const subNames = (service.subservices || []).map((sub) => sub.subname);
        formatted[categoryName] = subNames;
      });
      setCategories(formatted);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = {};
  if (searchText.trim() === "") {
    Object.assign(filteredCategories, categories);
  } else {
    Object.entries(categories).forEach(([categoryTitle, bars]) => {
      const hasMatch = bars.some((bar) =>
        bar.toLowerCase().includes(searchText.toLowerCase())
      );
      if (hasMatch) {
        filteredCategories[categoryTitle] = bars;
      }
    });
  }

  const handleOutsideTap = () => {
    Keyboard.dismiss();
    setShowSuggestions(false);
  };

  if (loading) return <Loading />;

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionHeader}>Choose the Categories</Text>

        <View style={styles.searchBar}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setShowSuggestions(text.length > 0);
            }}
            placeholder="Search any categories"
            placeholderTextColor="#666666"
            onFocus={() => {
              if (searchText.length > 0) setShowSuggestions(true);
            }}
          />
          <Feather
            name="search"
            size={20}
            color="#bcbcbc"
            style={styles.searchIcon}
          />
        </View>
        {showSuggestions && (
          <View style={styles.suggestionList}>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
              {Object.values(filteredCategories)
                .flat()
                .map((bar, index) => (
                  <TouchableOpacity
                    key={`${bar}-${index}`}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setSearchText(bar);
                      setShowSuggestions(false);
                      searchInputRef.current?.blur();
                    }}
                  >
                    <Text style={styles.suggestionText}>{bar}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}
        {Object.entries(filteredCategories).map(([categoryTitle, bars]) => (
          <React.Fragment key={categoryTitle}>
            <Text style={styles.categoryTitle}>{categoryTitle}</Text>
            <View style={styles.barsContainer}>
              {bars.map((bar) => {
                const isActiveTab =
                  bar.toLowerCase() === searchText.toLowerCase();
                return (
                  <TouchableOpacity
                    key={bar}
                    style={[styles.bar, isActiveTab && styles.activeBar]}
                    onPress={() => console.log(`${bar} clicked`)}
                  >
                    <Text
                      style={[
                        styles.barText,
                        isActiveTab && styles.activeBarText,
                      ]}
                    >
                      {bar}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.dividerLine} />
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    flex: 1,
  },
  sectionHeader: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    color: "#666666",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    backgroundColor: "transparent",
  },
  searchIcon: {
    marginLeft: 6,
    color: "#666666",
  },
  suggestionList: {
    backgroundColor: "#353535",
    borderRadius: 9,
    marginTop: 4,
    maxHeight: 320,
    overflow: "hidden",
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  suggestionText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
  },
  noResultsText: {
    color: "#bcbcbc",
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "center",
  },
  categoryTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 10,
  },

  activeBar: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
    borderWidth: 1,
  },

  activeBarText: {
    color: "#303030",
    fontFamily: "Montserrat_600SemiBold",
  },
  barsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
  },
  bar: {
    backgroundColor: "#494949",
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 40,
  },
  barText: {
    color: "#dee2e6",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    textAlign: "center",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#C5C5C5",
    marginVertical: 15,
  },
});
