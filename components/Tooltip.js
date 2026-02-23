import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

let activeSetter = null; // only one tooltip open

const HelpTooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);

  const openTooltip = () => {
    if (activeSetter && activeSetter !== setVisible) {
      activeSetter(false); // close previous
    }
    activeSetter = setVisible;
    setVisible(true);
  };

  const closeTooltip = () => {
    setVisible(false);
    activeSetter = null;
  };

  // auto close when unmount
  useEffect(() => {
    return () => {
      if (activeSetter === setVisible) {
        activeSetter = null;
      }
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      {/* Question Icon */}
      <Pressable
        onPress={visible ? closeTooltip : openTooltip}
        style={[
          styles.icon,
          { backgroundColor: visible ? "#f0c040" : "#ffffff" },
        ]}
      >
        <Text style={styles.iconText}>?</Text>
      </Pressable>

      {/* Tooltip */}
      {visible && (
        <>
          <View style={styles.fullScreen}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeTooltip} />
          </View>

          <View style={styles.tooltipBox}>
            {/* Cross Button */}
            <Pressable style={styles.closeBtn} onPress={closeTooltip}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>

            <Text style={styles.tooltipText}>{text}</Text>

            <View style={styles.arrow} />
          </View>
        </>
      )}
    </View>
  );
};

export default HelpTooltip;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginLeft: 6,
  },

  icon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  iconText: {
    color: "#000",
    fontWeight: "bold",
  },

  tooltipBox: {
    position: "absolute",
    bottom: 35,
    left: -100,
    width: 260,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 999,
  },

  tooltipText: {
    fontSize: 14,
    color: "#000",
  },

  closeBtn: {
    position: "absolute",
    top: 6,
    right: 8,
  },

  closeText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  arrow: {
    position: "absolute",
    bottom: -8,
    left: 110,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
  },
  fullScreen: {
    position: "absolute",
    top: -1000,
    bottom: -1000,
    left: -1000,
    right: -1000,
  },
});
