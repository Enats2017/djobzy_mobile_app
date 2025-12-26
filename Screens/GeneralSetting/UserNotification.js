import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";

const UserNotification = () => {
  const [chatMessages, setChatMessages] = useState(false);
  const [notificationSound, setNotificationSound] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const navigation = useNavigation();
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
                <GradientButton title="Save"/>
            </View>
          </View>
        </View>
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
