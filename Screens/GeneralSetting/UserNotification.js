import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Text,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import CustomSwitch from "../../components/CustomSwitch";
import GradientButton from "../../components/GradientButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { toastError, toastSuccess } from "../../utils/toast";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "../../components/Footer";
import EmployerFooter from "../../components/EmployerFooter";
import { useNotifications } from "../../context/MessageNotificationContext";

const UserNotification = () => {
  const route = useRoute();
  const { user } = route.params || {};
  const [chatMessages, setChatMessages] = useState(false);
  const [notificationSound, setNotificationSound] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { admin } = useNotifications();

  useEffect(() => {
    if (!user) return;
    const message = user.inbox_message_notification === 1 ? true : false;
    const sound = user.notification_sound === 1 ? true : false;
    const emailSound = user.email_notification === 1 ? true : false;
    setChatMessages(message);
    setNotificationSound(sound);
    setEmailNotifications(emailSound);
  }, [user]);

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/settings-notification`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          inbox_message: chatMessages ? 1 : 0,
          notification_sound: notificationSound ? 1 : 0,
          email_notification: emailNotifications ? 1 : 0,
        }),
      });

      const data = await res.json();
      console.log("Notification Response:", data);

      if (data.status === 200) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        toastSuccess("Changes saved successfully");
      } else {
        toastError(data.message || "Failed to save the response");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Notifications" navigation={navigation} />
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Website Notifications</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Djobzy Chat Messages</Text>
              <CustomSwitch value={chatMessages} onChange={setChatMessages} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Notification Sound</Text>
              <CustomSwitch
                value={notificationSound}
                onChange={setNotificationSound}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Email Notifications</Text>
              <CustomSwitch
                value={emailNotifications}
                onChange={setEmailNotifications}
              />
            </View>

            <Text style={styles.infoText}>
              We strongly recommend you to keep this notifications enabled in
              order to be informed about any offers, activities and incoming
              payments.
            </Text>
            <View>
                <GradientButton
                  title="Save Changes"
                  onPress={handleSaveNotifications}
                  loading={loading}
                  disabled={loading}
                />
            </View>
          </View>
        </View>
        {admin == 2 ? <EmployerFooter /> : <Footer />}
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  label: { color: "#d5d6d7", fontSize: 16, fontFamily: "Montserrat_500Medium" },
  infoText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    marginTop: 8,
    marginBottom: 16,
  },
});
export default UserNotification;
