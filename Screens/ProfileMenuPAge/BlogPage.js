import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Footer from "../../components/Footer";

export default function BlogPage() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selected, setSelected] = useState("Blog Categories");

  const categories = [
    "All",
    "Trends",
    "For Employee",
    "How To Guides",
    "For Employers",
    "Tips",
  ];

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
        <View>
            <PageNameHeaderBar title="Blog"/>
        </View>
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setOpenDropdown(!openDropdown)}
        >
          <Text style={styles.dropdownText}>{selected}</Text>
          <Ionicons name={openDropdown ? "chevron-up" : "chevron-down"} size={22} />
        </TouchableOpacity>

        {openDropdown && (
          <View style={styles.dropdownBody}>
            {categories.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => {
                    setSelected(item);
                    setOpenDropdown(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>

                {/* Divider Line */}
                {index !== categories.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* BLOG CARD */}
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/image1818.png")}
          style={styles.blogImage}
        />

        <View style={styles.tagBox}>
          <Text style={styles.tagText}>TIPS</Text>
        </View>

        <Text style={styles.title}>
          Best Planning Strategies for Both Personal and Business Purposes
        </Text>

        <Text style={styles.description}>
          If you have a goal without a plan, it is just a wish. Planning is the first step
          to your achievement because, while planning, you define the timeframe and the
          resources.
        </Text>
      </View>
    </View>
    <Footer/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },

  dropdownWrapper: {
    width: "100%",
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
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#222",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },

  // Blog Card
  card: {
    backgroundColor: "#ffffff1a",
    borderRadius: 12,
    marginTop: 20,
  
    paddingBottom: 20,
  },
  blogImage: {
    width: "100%",
    height: 170,
    borderRadius:10
  },
  tagBox: {
    backgroundColor: "#39c086",
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    borderRadius: 6,
    marginTop: 10,
    marginLeft: 10,
  },
  tagText: {
    color: "#fff",
    fontWeight: "600",
  },
  title: {
    fontSize: 17,
    paddingHorizontal:10,
    color: "#ffffff",
    fontFamily:"Montserrat_600SemiBold",
    marginTop: 10,
   
  },
  description: {
    fontSize: 12,
    color: "#fff",
    fontFamily:"Montserrat_400Regular",
    paddingHorizontal: 10,
    marginTop: 6,
    lineHeight: 20,
  },
});
