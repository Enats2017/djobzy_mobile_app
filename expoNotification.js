import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./api/ApiUrl";
import { navigate } from "./NavigationService";
import { getDeviceId } from "./utils/deviceId";
import { getActivePeerId } from "./Screens/Chat/Services/chatPresence";

/**
 * The backend already skips pushes for a conversation this device has open
 * (see ActiveChatPresence). This is the client-side backstop for the window
 * where the two can disagree — a push already in flight when the user opened
 * the room, or a presence heartbeat that failed to reach the server.
 */
const isForActiveChatRoom = (notification) => {
    const data = notification?.request?.content?.data ?? {};
    if (data.type !== "chat") return false;

    const activePeerId = getActivePeerId();
    return activePeerId != null && String(activePeerId) === String(data.chat_user_id);
};

Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        if (isForActiveChatRoom(notification)) {
            // The message is already visible in the open chat — show nothing.
            return {
                shouldPlaySound: false,
                shouldSetBadge: false,
                shouldShowBanner: false,
                shouldShowList: false,
            };
        }

        return {
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        };
    },
});

export async function registerForPushNotifications() {
    if (Platform.OS === "web") return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        return;
    }

    try {
        const token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        });

        const expoToken = token.data;
        // Shared with chat presence, so the backend can match "this device has
        // the room open" to "skip this device's push token".
        const deviceId = await getDeviceId();

        const response = await axios.post(`${API_URL}/register-token`, {
            token: expoToken,
            platform: Platform.OS,
            device_id: deviceId,
        });
        if (response.status === 200) {
            await AsyncStorage.setItem("expoToken", expoToken);
        }
    } catch (error) {
        console.log("Notification error:", error?.response || error.message);
    }
}

// Listener
export function notificationListener() {
    return Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response?.notification?.request?.content?.data || {};
        if (data.type === "chat") {
            navigate("ChatRoom", {
                userId: data.chat_user_id,
                isGroup: false,
            });
        }
    });
}

export function foregroundListener() {
    return Notifications.addNotificationReceivedListener((notification) => {
        if (isForActiveChatRoom(notification)) return;
        // Reserved for in-app badge handling; the realtime layer already drives
        // unread counts, so nothing more is needed here today.
    });
}
