
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../../components/Footer";
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from "../../context/MessageNotificationContext";

export default function ChatList() {
  const navigation = useNavigation();
  const { messageCount, notifications, loading } = useNotifications();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={styles.arrow}>
                <Ionicons name="chevron-back" size={30} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
              style={styles.headerAvatar}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.headerName}>Gabrilla</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.7} style={styles.headerIcon}>
            <MaterialIcons name="more-vert" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <ScrollView
          style={styles.messagesWrap}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Date label */}
          <View style={styles.dateLabelWrap}>
            <Text style={styles.dateLabelText}>Today, 11:03 AM</Text>
          </View>

          <View style={styles.rowLeft}>
            <View style={styles.bubbleLeftWrapper}>
              <View style={styles.bubbleLeft}>
                <Text style={styles.bubbleLeftText}>
                  Auctor urna, varius duis suspendisse mi in dictum. Interdum
                  egestas ut porttitor tortor aliquet massa.
                </Text>
              </View>
            </View>

            <Text style={styles.msgTimeLeft}>08:23 AM</Text>
          </View>

          {/* === RIGHT: outgoing bubble === */}
          <View style={styles.rowRight}>
            <View style={styles.bubbleRightWrapper}>
              <View style={styles.bubbleRight}>
                <Text style={styles.bubbleRightText}>
                  Auctor urna, varius duis suspendisse mi in dictum
                </Text>
              </View>
            </View>

            <Text style={styles.msgTimeRight}>09:00 AM</Text>
          </View>

          {/* === LEFT small bubble (incoming) === */}
          <View style={styles.rowLeft}>
            <View style={styles.bubbleLeftWrapper}>
              <View style={styles.bubbleLeftSmall}>
                <Text style={styles.bubbleLeftText}>
                  Auctor urna, varius duis suspendisse mi in
                </Text>
              </View>
            </View>
            <Text style={styles.msgTimeLeft}>10:00 AM</Text>

          </View>
          <View style={styles.rowRight}>
            <View style={styles.bubbleRightWrapper}>
              <View style={styles.bubbleRight}>
                <Text style={styles.bubbleRightText}>
                  Auctor urna, varius duis suspendisse mi in dictum
                </Text>
              </View>
              <Text style={styles.msgTimeRight}>09:00 AM</Text>
            </View>
          </View>
        </ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={90}
        >
          <View style={styles.inputWrap}>
            <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Send your message..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              editable={true}
            // hard-coded placeholder; you may connect state if desired
            />
            <TouchableOpacity style={styles.sendBtn} activeOpacity={0.7}>
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

/* Styles tuned to match upload-screen-short look and to place reaction chips centered on bubble border */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
  },
  arrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 25,
    borderRadius: 100,
  },
  header: {
    height: 78,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
  headerAvatar: { marginLeft: 10, width: 44, height: 44, borderRadius: 22 },
  headerName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  headerStatus: { color: "#2dd36f", fontSize: 12, marginTop: 2 },
  headerIcon: { padding: 8 },
  divider: { height: 1, backgroundColor: "#ffffff1e" },

  messagesWrap: { flex: 1 },

  dateLabelWrap: { alignItems: "center", marginBottom: 12 },
  dateLabelText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  bubbleLeftWrapper: {
    position: "relative",
    maxWidth: "78%",
  },
  bubbleLeft: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  bubbleLeftSmall: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderBottomLeftRadius: 4,
  },
  bubbleLeftText: { color: "#111", fontSize: 14, lineHeight: 20 },
  centerReactionLeft: {
    position: "absolute",
    bottom: -12,
    left: "50%",
    transform: [{ translateX: -50 }],
    flexDirection: "row",
    alignItems: "center",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 18,
  },
  bubbleRightWrapper: {
    position: "relative",
    maxWidth: "78%",
    alignItems: "flex-end",
  },
  bubbleRight: {
    backgroundColor: "#ea8b8b",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  bubbleRightText: { color: "#fff", fontSize: 10, lineHeight: 20 },
  centerReactionRight: {
    position: "absolute",
    bottom: -12,
    left: "50%",
    transform: [{ translateX: -50 }],
    flexDirection: "row",
    alignItems: "center",
  },
  reactionChip: {
    backgroundColor: "#f2f2f2",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  reactionChipRight: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  reactionEmoji: { fontSize: 14 },

  msgTimeLeft: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    marginLeft: 10,
    marginTop: 6,
  },
  msgTimeRight: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    marginLeft: 8,
    marginTop: 6,
  },

  inputWrap: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    height: 56,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.03)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#fff",
    fontSize: 14,
    paddingVertical: 10,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
