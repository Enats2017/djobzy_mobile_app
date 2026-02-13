import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

export default function SearchBar({
  placeholder = "Find anything",
  value = "",
  onChangeText = () => {},
  editable = true,
  showSearch = true,
  showFilter = true,
  showDots = true,
  onFilterPress = () => {},
  onDotsPress = () => {},
  containerStyle,
  searchStyle,
  iconStyle,
}) {
  return (
    <View style={[styles.topBar, containerStyle]}>
      {showSearch && (
        <View style={[styles.searchWrap, searchStyle]}>
          <Ionicons name="search" size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.6)"
            editable={editable}
            value={value}
            onChangeText={onChangeText}
            // if you want keyboard disabled lookups, set editable={false}
          />
        </View>
      )}

      {showFilter && (
        <TouchableOpacity
          style={[styles.iconBtn, iconStyle]}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="filter-list" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      {showDots && (
        <TouchableOpacity
          style={[styles.iconBtn, iconStyle]}
          onPress={onDotsPress}
          activeOpacity={0.7}
        >
          <Entypo name="dots-three-vertical" size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    gap: 10,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 42,
  },
  searchIcon: {
    color: "rgba(255,255,255,0.8)",
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily:"Montserrat_400Regular",
    color: "#fff",
    fontSize: 14,
    padding: 0,
  },
  iconBtn: {
    padding: 8,
    marginLeft: 6,
  },
});
