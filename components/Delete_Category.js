import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { API_URL, API_ICON } from "../api/ApiUrl";
import { useServiceGlobalStore } from "../Screens/PromoteServicesPage/ServiceGlobalStore";
import Loading from "./Loading";
import GradientButton from "./GradientButton";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Delete_Category = ({ visible, onClose, id, onDeleted, name }) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  console.log(id);


  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/deletecategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to fetch job");
      const data = await response.json();
      onDeleted(id);   // 👈 notify the parent screen  
      onClose();
      console.log(data);

    } catch (err) {
      console.log(err);

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.deleteOverlay}>
        <View style={[styles.deleteBox, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={styles.modalCloseIcon}
            onPress={() => {
              onClose();
              // setSelectedCategory(null);
            }}
          >
            <Ionicons name="close" size={22} color="#000" />
          </TouchableOpacity>
          <Image
            source={require("../assets/images/delete_warning.png")}
            style={{ width: 70, height: 70, marginBottom: 10 }}
            resizeMode="contain"
          />
          <Text style={styles.deleteTitle}>Delete Category</Text>
          <Text style={styles.deleteMsg}>
            Do you want to delete the category:{" "}
            <Text style={{ fontWeight: "700" }}>{name}</Text>?
          </Text>
          <View style={styles.deleteBtns}>
            <TouchableOpacity
              onPress={() => {
                onClose();
              }}
              style={styles.cancelBtn}
            >
              <Text style={styles.canceltext}>No, Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              //onPress={deleteCategoryApi}
              style={styles.deleteBtn}
              onPress={handleDelete}
              disabled={loading}
            //disabled={deleteLoading}
            >
              <Text style={styles.deletetext}>Yes, Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Delete_Category;

const styles = StyleSheet.create({
  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  deleteBox: {
    backgroundColor: "#fff",
    width: "100%",
    maxHeight: "70%",
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalCloseIcon: {
    position: "absolute",
    top: 12,
    right: 8,
    padding: 5,
    zIndex: 10,
  },

  deleteTitle: {
    fontSize: 22, fontFamily: "Montserrat_700Bold", marginBottom: 7,
  },
  deleteMsg: {
    fontSize: 15, marginBottom: 15, textAlign: "center", color: "#444", fontFamily: "Montserrat_500Medium",
  },
  deleteBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 13,
  },
  deletetext: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.1,
  },
  cancelBtn: {
    paddingVertical: 15,
    width: "50%",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  canceltext: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#030303",
  },
  deleteBtn: {
    paddingVertical: 15,
    width: "50%",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "red",
  },
});
