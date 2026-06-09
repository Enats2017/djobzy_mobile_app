import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Pressable, } from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

const FILTER_OPTIONS = [
  { label: "Read", value: "read" },
  { label: "Unread", value: "unread" },
  { label: "Blocked Users", value: "blocked" },
  { label: "Archived Users", value: "archived" },
];

export default function SearchBar({
  placeholder = "Find anything",
  value = "",
  onChangeText = () => { },
  editable = true,
  showSearch = true,
  showFilter = true,
  showDots = true,
  activeFilter = null,
  onFilterSelect = () => {},
  onDotsPress = () => {},
  containerStyle,
  searchStyle,
  iconStyle,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const filterBtnRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  const openDropdown = () => {
    filterBtnRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPos({
        top: y + height + 40,
        right: 0,
      });
      setDropdownVisible(true);
    });
  };

  const handleSelect = (val) => {
    setDropdownVisible(false);
    onFilterSelect(val);
  };

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
          />
        </View>
      )}

      {showFilter && (
        <TouchableOpacity
          ref={filterBtnRef}
          style={[
            styles.iconBtn,
            activeFilter && styles.iconBtnActive,
            iconStyle,
          ]}
          onPress={openDropdown}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="filter-list"
            size={22}
            color={activeFilter ? "#ff7a00" : "#fff"}
          />
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

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setDropdownVisible(false)} />
        <View style={[styles.dropdown, { top: dropdownPos.top, right: 20 }]}>
          {FILTER_OPTIONS.map((opt, i) => {
            const isActive = activeFilter === opt.value;
            const isLast = i === FILTER_OPTIONS.length - 1;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.dropdownOption,
                  isActive && styles.dropdownOptionActive,
                  isLast && { borderBottomWidth: 0 },
                ]}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownLabel,
                    isActive && styles.dropdownLabelActive,
                  ]}
                >
                  {opt.label}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark" size={14} color="#ff7a00" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
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
    fontFamily: "Montserrat_400Regular",
    color: "#fff",
    fontSize: 14,
    padding: 0,
  },
  iconBtn: {
    padding: 8,
    marginLeft: 6,
    borderRadius: 8,
  },
  iconBtnActive: {
    backgroundColor: "rgba(255, 122, 0, 0.15)",
  },

  // Dropdown
  dropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    width: 150,
    borderRadius: 6,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  dropdownOptionActive: {
    backgroundColor: "rgba(255, 122, 0, 0.06)",
  },
  dropdownLabel: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#303030",
  },
  dropdownLabelActive: {
    color: "#ff7a00",
  },
});