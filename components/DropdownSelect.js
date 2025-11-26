import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DropdownSelect({
  label,
  value,
  options = [],
  placeholder = "Select",
  onChange = () => {},
  style,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setOpen((s) => !s)}
        activeOpacity={0.85}
      >
        <Text style={styles.headerText}>{value || placeholder}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} />
      </TouchableOpacity>

      {open && (
        <View style={styles.body}>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={styles.item}
            >
              <Text style={styles.itemText}>{typeof opt === "string" ? opt : opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  label: { color: "#fff", marginBottom: 6, fontSize: 14 },
  header: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { fontSize: 16, color: "#444" },
  body: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    elevation: 4,
  },
  item: { paddingVertical: 12, paddingHorizontal: 16 },
  itemText: { fontSize: 15, color: "#222" },
});
