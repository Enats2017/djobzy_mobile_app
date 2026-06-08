import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./api/ApiUrl";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

async function getDeviceId() {
    let deviceId = await AsyncStorage.getItem("deviceId");

    if (!deviceId) {
        deviceId = "djobzy_" + Date.now() + "_" + Math.random().toString(36).substring(2, 15);
        await AsyncStorage.setItem("deviceId", deviceId);
    }

    return deviceId;
}

export async function registerForPushNotifications() {
    if (Platform.OS === "web") return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        // alert("Permission not granted!");
        return;
    }

    try {
        const token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        });

        const expoToken = token.data;
        const deviceId = await getDeviceId();
        console.log("DEVICE ID:", deviceId);
        console.log("EXPO TOKEN:", expoToken);
        const response = await axios.post(`${API_URL}/register-token`, {
            token: expoToken,
            platform: Platform.OS,
            device_id: deviceId,
        });
        if (response.status === 200) {
            await AsyncStorage.setItem("expoToken", expoToken);
            console.log(response.data);
        }
    } catch (error) {
        console.log("Notification error:", error?.response || error.message);
    }
}

// 🎯 Listener
export function notificationListener() {
    return Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification clicked:", response);
    });
}

export function foregroundListener() {
    return Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received in foreground:", notification);
    });
}