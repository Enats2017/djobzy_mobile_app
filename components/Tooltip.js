import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");
let activeSetter = null;

const HelpTooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    arrowLeft: 0,
    showAbove: false,
  });

  const iconRef = useRef(null);

  const openTooltip = () => {
    if (activeSetter && activeSetter !== setVisible) {
      activeSetter(false);
    }

    iconRef.current.measureInWindow((x, y, w, h) => {
      const tooltipWidth = 260;
      const tooltipHeight = 120;
      let left = x + w / 2 - tooltipWidth / 2;
      let top = y + h + 10;
      let showAbove = false;

      if (left < 10) left = 10;
      if (left + tooltipWidth > width - 10)
        left = width - tooltipWidth - 10;
      if (top + tooltipHeight > height - 20) {
        top = y - tooltipHeight - 10;
        showAbove = true;
      }
      const arrowLeft = x + w / 2 - left - 6;
      setPosition({ top, left, arrowLeft, showAbove });
      setVisible(true);
      activeSetter = setVisible;
    });
  };

  const closeTooltip = () => {
    setVisible(false);
    activeSetter = null;
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        ref={iconRef}
        onPress={visible ? closeTooltip : openTooltip}
        style={[
          styles.icon,
          { backgroundColor: visible ? "#f0c040" : "#ffffff" },
        ]}
      >
        <Text style={styles.iconText}>?</Text>
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={styles.overlay} onPress={closeTooltip}>
          <View
            style={[
              styles.tooltipBox,
              { top: position.top, left: position.left },
            ]}
          >
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tooltipText}>{text}</Text>
              </View>

              <Pressable onPress={closeTooltip} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <View
              style={[
                styles.arrow,
                { left: position.arrowLeft },
                position.showAbove
                  ? styles.arrowDown
                  : styles.arrowUp,
              ]}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default HelpTooltip;

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "flex-start",
  },
  icon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  iconText: {
    fontWeight: "bold",
    color: "#000",
  },
  overlay: {
    flex: 1,
  },
  tooltipBox: {
    position: "absolute",
    width: 260,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tooltipText: {
    color: "#000",
    fontSize: 14,
  },
  closeBtn: {
    position: "absolute",
    right: -8,
    top: -10,
    padding: 2,
  },
  closeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#000",
  },
  arrow: {
    position: "absolute",
    width: 0,
    height: 0,
  },
  arrowUp: {
    top: -6,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
  },
  arrowDown: {
    bottom: -6,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
  },
});