import React from "react";
import {
  Ionicons,
  FontAwesome5,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";

import {
  View,
  StyleSheet,
  TouchableOpacity,
  CheckBox,
  Text,
  TextInput,
} from "react-native";

const SavedCard = ({ cardLast4, onEdit, onDelete }) => (
  <>
    <View style={styles.Card}>
      <View style={styles.savedCard}>
        <Text style={styles.cardTitle}>Credit / Debit Card</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="pencil" size={18} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash" size={18} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.cardNumber}>**** **** **** {cardLast4}</Text>
    </View>
  </>
);

export default SavedCard;

const styles = StyleSheet.create({
  Card: {
    backgroundColor: "#ffff",
    borderRadius: 10,
    paddingVertical:18,
    paddingHorizontal:10,
  },
  savedCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  cardTitle: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 4,
  },

  cardNumber: {
    color: "#000",
    fontSize: 13,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // if your RN version doesn’t support gap, see note below
  },
});
