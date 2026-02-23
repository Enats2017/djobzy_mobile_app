import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-native";

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
  const containerRef = useRef(null);

  useEffect(() => {
    setLeftSelected(leftLabel);
  }, [leftLabel]);

  useEffect(() => {
    setRightSelected(rightLabel);
  }, [rightLabel]);

  const renderDropdownList = (options, isLeft, selectedValue, onSelect) => (
    <Modal 
      transparent 
      animationType="fade" 
      visible={true}
      onRequestClose={() => setActiveDropdown(null)}
    >
      <Pressable 
        style={StyleSheet.absoluteFillObject}
        onPress={() => setActiveDropdown(null)}
      >
        <View style={[
          styles.dropdownList,
          isLeft ? styles.leftList : styles.rightList
        ]}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={`${isLeft ? 'left' : 'right'}-${index}`}
              style={styles.option}
              onPress={() => {
                onSelect(item);
                setActiveDropdown(null);
              }}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={{ width: "100%" }} ref={containerRef}>
      <Pressable
        style={{ width: "100%" }}
        onPress={() => {
          setActiveDropdown(null);
        }}
      >
        <View style={styles.container}>
          {/* LEFT DROPDOWN */}
          <TouchableOpacity
            style={[styles.dropdownBtn, styles.leftDropdown]}
            onPress={() =>
              setActiveDropdown(activeDropdown === "left" ? null : "left")
            }
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownText}>{leftSelected}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* RIGHT DROPDOWN */}
          <TouchableOpacity
            style={[styles.dropdownBtn, styles.rightDropdown]}
            onPress={() =>
              setActiveDropdown(activeDropdown === "right" ? null : "right")
            }
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownText}>{rightSelected}</Text>
          </TouchableOpacity>
        </View>
      </Pressable>

      {/* LEFT DROPDOWN LIST */}
      {activeDropdown === "left" && renderDropdownList(
        leftOptions, 
        true, 
        leftSelected, 
        (item) => {
          setLeftSelected(item);
          onLeftSelect?.(item);
        }
      )}

      {/* RIGHT DROPDOWN LIST */}
      {activeDropdown === "right" && renderDropdownList(
        rightOptions, 
        false, 
        rightSelected, 
        (item) => {
          setRightSelected(item);
          onRightSelect?.(item);
        }
      )}
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
    top: 247, // Exactly dropdown height + 8px gap
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    maxHeight: 220,
    overflow: "hidden",
  },
  leftList: {
    width: "45%",
    right: "50%",
    borderTopLeftRadius: 8,
  },
  rightList: {
    width: "45%",
    left: "50%",
    borderTopRightRadius: 8,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  optionText: {
    color: "#333",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
});
