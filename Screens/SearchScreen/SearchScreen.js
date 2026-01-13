import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import SearchedJobs from "../../components/SearchedJobs";
import SearchedEmployees from "../../components/SearchedEmployees";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { Feather, Ionicons } from "@expo/vector-icons";


const SearchScreen = () => {
  const navigation = useNavigation();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const route = useRoute();
  const {search_type} = route.params;
  console.log(search_type);
  

  const handleSearch = async (text) => {
    setKeyword(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }
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
           action: "search_result",
          search_type:"search_type"
        }),
      });

      const data = await res.json();
       setResults(data.data || []);
    } catch (err) {
      console.log("Search error", err);
    }
  };

  const jobs = results.filter((i) => i.type === "job");
  const employees = results.filter((i) => i.type === "employee");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:80}} keyboardShouldPersistTaps="handled" >
        <View style={styles.searchSection}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <Ionicons name="search" size={16} color="#aaa" />
            <TextInput
              autoFocus
              placeholder="Search jobs or people"
              placeholderTextColor="#c3c3c3c3"
              value={keyword}
              onChangeText={handleSearch}
              style={styles.input}
            />
          </View>
        </View>

        {/* RESULTS */}
        {employees.length > 0 && <SearchedEmployees data={employees} />}

        {jobs.length > 0 && <SearchedJobs data={jobs} />}


        </ScrollView>
        {keyword.length > 1 && results.length === 0 && (
          <Text style={styles.noResult}>No results found</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    paddingHorizontal: 15,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  backBtn: {
    paddingRight: 8,
    paddingVertical: 6,
  },

  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d2d2d",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 6,
    color: "#fff",
    fontSize: 14,
  },

  noResult: {
    marginTop: 20,
    textAlign: "center",
    color: "#777",
  },
});
