import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Footer from "../../components/Footer";
import { API_URL } from "../../api/ApiUrl";

const getVisiblePages = (current, lastPage) => {
  if (lastPage <= 3) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }
  if (current === 1) return [1, 2, 3];
  if (current === lastPage) return [lastPage - 2, lastPage - 1, lastPage];

  return [current - 1, current, current + 1];
};

export default function BlogPage() {
  const navigation = useNavigation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async (pageNo = 1) => {
    try {
      if (pageNo === 1) {
        setLoading(true);
      }
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_URL}/blog?page=${pageNo}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setCategories([{ id: 0, name: "All" }, ...data.categories]);
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (error) {
      console.log("BLOG API ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page );
  }, [page]);

  const renderBlog = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("BlogDetails", {
          slug: item.blog_slug,
        })
      }
    >
      <Image source={{ uri: item.front_image ||  "https://dummyimage.com/150x150/ccc/fff.png&text=No+Photo", }} style={styles.blogImage} resizeMode="cover" />
      <View style={styles.tagBox}>
        <Text style={styles.tagText}>{item.publisher}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>

      <Text style={styles.description} numberOfLines={3}>
        {item.meta_desc}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar title="Blog" navigation={navigation} />

        {/* ================= CATEGORY DROPDOWN ================= */}
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setOpenDropdown(!openDropdown)}
          >
            <Text style={styles.dropdownText}>{selectedCategory}</Text>
            <Ionicons
              name={openDropdown ? "chevron-up" : "chevron-down"}
              size={22}
            />
          </TouchableOpacity>

          {openDropdown && (
            <View style={styles.dropdownBody}>
              {categories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCategory(item.name);
                    setOpenDropdown(false);
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ================= BLOG LIST ================= */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={blogs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBlog}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View style={styles.pagination}>
                {/* LEFT ARROW */}
                <TouchableOpacity
                  style={[styles.arrowBtn, page === 1 && styles.disabledArrow]}
                  disabled={page === 1}
                  onPress={() => setPage(page - 1)}
                >
                  <Ionicons name="chevron-back" color="#fff" size={20} />
                </TouchableOpacity>

                {/* PAGE NUMBERS */}
                {getVisiblePages(page, pagination.last_page || 1).map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.pageBtn,
                      page === num && styles.activePageBtn,
                    ]}
                    onPress={() => setPage(num)}
                  >
                    <Text
                      style={[
                        styles.pageText,
                        page === num && styles.activePageText,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* RIGHT ARROW */}
                <TouchableOpacity
                  style={[
                    styles.arrowBtn,
                    page === pagination.last_page && styles.disabledArrow,
                  ]}
                  disabled={page === pagination.last_page}
                  onPress={() => setPage(page + 1)}
                >
                  <Ionicons name="chevron-forward" color="#fff" size={18} />
                </TouchableOpacity>
              </View>
            }
          />
        )}

        {/* ================= PAGINATION ================= */}
        {/* <View style={styles.pagination}>
          {Array.from(
            { length: pagination.last_page || 1 },
            (_, i) => renderPageButton(i + 1)
          )}
        </View> */}
      </View>

      <Footer />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },

  dropdownWrapper: {
    marginVertical: 12,
  },

  dropdownHeader: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#444",
  },
  dropdownBody: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    elevation: 4,
  },

  dropdownBody: {
    borderWidth: 1,
    borderTopWidth: 0,
    backgroundColor: "#fff",
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 0.5,
  },

  card: {
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },

  blogImage: {
    width: "100%",
    height: 170,
   
    borderRadius: 10,
  },

  tagBox: {
    backgroundColor: "#39c086",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-start",
  },

  tagText: {
    color: "#fff",
    fontSize: 12,
  },

  title: {
    fontSize: 17,

    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 10,
  },

  description: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Montserrat_400Regular",

    marginTop: 4,
    lineHeight: 20,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
  },

  pageBtn: {
    borderWidth: 0.6,
    borderColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginHorizontal: 5,
    borderRadius: 5,
  },

  activePageBtn: {
    backgroundColor: "#C96B59",
    borderWidth: 0,
  },

  pageText: {
    color: "#fff",
  },

  activePageText: {
    color: "#fff",
  },
  arrowBtn: {
    borderWidth: 0.6,
    padding: 6,
    borderColor: "#fff",
    borderRadius: 5,
    marginHorizontal: 5,
  },

  disabledArrow: {
    opacity: 0.3,
  },
});
