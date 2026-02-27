import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";

const { width: screenWidth } = Dimensions.get("window");

const DualDropdown = ({
  leftLabel = "Sort",
  rightLabel = "Filter",
  leftOptions = [],
  rightOptions = [],
  onLeftSelect,
  onRightSelect,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [leftSelected, setLeftSelected] = useState(leftLabel);
  const [rightSelected, setRightSelected] = useState(rightLabel);

  useEffect(() => {
    setLeftSelected(leftLabel);
  }, [leftLabel]);

  useEffect(() => {
    setRightSelected(rightLabel);
  }, [rightLabel]);

  useEffect(() => {
    setActiveDropdown(null);
  }, [leftLabel, rightLabel]);

  const renderDropdownList = (options = [], isLeft, onSelect) => (
    <View
      style={[styles.dropdownList, isLeft ? styles.leftList : styles.rightList]}
    >
      {options.map((item, index) => (
        item ? (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              index === options.filter(Boolean).length - 1 && {
                borderBottomWidth: 0,
              },
            ]}
            onPress={() => {
              onSelect(item);
              setActiveDropdown(null);
            }}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ) : null
      ))}
    </View>
  );

  return (
    <View style={{ width: "100%", position: "relative" }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.dropdownBtn, styles.leftDropdown]}
          onPress={() => setActiveDropdown(activeDropdown === 1 ? null : 1)}
        >
          <Text style={styles.dropdownText}>{leftSelected}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.dropdownBtn, styles.rightDropdown]}
          onPress={() => setActiveDropdown(activeDropdown === 2 ? null : 2)}
        >
          <Text style={styles.dropdownText}>{rightSelected}</Text>
        </TouchableOpacity>
      </View>

      {activeDropdown === 1 &&
        renderDropdownList(leftOptions, true, (item) => {
          setLeftSelected(item);
          onLeftSelect?.(item);
        })}

      {activeDropdown === 2 &&
        renderDropdownList(rightOptions, false, (item) => {
          setRightSelected(item);
          onRightSelect?.(item);
        })}
    </View>
  );
};

export default DualDropdown;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    alignItems: "center",
    height: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "100%",
    marginBottom: 10,
  },
  divider: {
    width: 1,
    height: "70%",
    backgroundColor: "#666",
  },
  dropdownBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  leftDropdown: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightDropdown: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  dropdownText: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  dropdownList: {
    position: "absolute",
    top: 45,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    zIndex: 999,
  },
  leftList: {
    width: "50%",
    right: "50%",
    borderTopLeftRadius: 8,
  },
  rightList: {
    width: "50%",
    left: "50%",
    borderTopRightRadius: 8,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomColor: "#eaeaea",
    borderBottomWidth: 1,
  },
  optionText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#000",
  },
});
