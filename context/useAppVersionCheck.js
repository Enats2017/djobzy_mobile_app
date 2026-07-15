import { useState } from "react";
import { Platform } from "react-native";
import { API_URL } from "../api/ApiUrl";
import appVersionConfig from "../utils/appVersionConfig";

const compareVersions = (current, latest) => {
    const currentParts = current.split(".").map(Number);
    const latestParts = latest.split(".").map(Number);
    const maxLength = Math.max(currentParts.length, latestParts.length);
    for (let i = 0; i < maxLength; i++) {
        const currentValue = currentParts[i] || 0;
        const latestValue = latestParts[i] || 0;

        if (currentValue < latestValue) return -1;
        if (currentValue > latestValue) return 1;
    }

    return 0;
};

export default function useAppVersionCheck() {
    const [showUpdate, setShowUpdate] = useState(false);
    const [updateInfo, setUpdateInfo] = useState({
        currentVersion: "",
        latestVersion: "",
        title: "",
        message: "",
        storeUrl: "",
        forceUpdate: false,
    });

    const checkAppVersion = async () => {
        try {
            const currentVersion = appVersionConfig.APP_VERSION;
            const response = await fetch(`${API_URL}/app-version`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (!data?.data) return;
            const platformData = Platform.OS === "android" ? data.data.android : data.data.ios;
            const result = compareVersions(currentVersion, platformData.latest_version);

            if (result === -1) {
                setUpdateInfo({
                    currentVersion,
                    latestVersion: platformData.latest_version,
                    title: data.data.title,
                    message: data.data.message,
                    storeUrl: platformData.store_url,
                    forceUpdate: platformData.force_update,
                });
                setShowUpdate(true);
            }
        } catch (error) {
            console.log("Version Check Error :", error);
        }
    };

    return {
        showUpdate,
        updateInfo,
        checkAppVersion,
        setShowUpdate,
    };
}