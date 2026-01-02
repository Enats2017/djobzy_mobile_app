import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Yes",
  cancelText = "Cancel",
  loading = false,
  disabled = false,
  icon = "warning",
  iconColor = "#d64545",
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.box, { paddingBottom: insets.bottom }]}>
          {/* Close icon */}
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={onClose}
            disabled={loading}
          >
            <Ionicons name="close" size={22} color="#000" />
          </TouchableOpacity>

          {/* Icon */}
          <Ionicons
            name={icon}
            size={60}
            color={iconColor}
            style={{ marginBottom: 10 }}
          />

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>{title}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    width: "100%",
    maxHeight: "70%",
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 2,
    right: 4,
    padding: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 7,
  },
  message: {
    fontSize: 15,
    marginBottom: 15,
    color: "#030303",
    fontFamily: "Montserrat_500Medium",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 13,
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#d64545",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#030303",
  },
  confirmText: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
  },
});
