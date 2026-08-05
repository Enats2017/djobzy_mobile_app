import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Stable per-install device identifier.
 *
 * The same id is registered against the Expo push token (see expoNotification.js)
 * and reported as chat presence, which is what lets the backend suppress a push
 * on the one device that already has the conversation open without silencing
 * the user's other devices.
 */

const STORAGE_KEY = "deviceId";

let cached = null;
let inFlight = null;

export async function getDeviceId() {
  if (cached) return cached;

  // Concurrent callers share one read/write so two callers can never mint two ids.
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      let deviceId = await AsyncStorage.getItem(STORAGE_KEY);

      if (!deviceId) {
        deviceId =
          "djobzy_" + Date.now() + "_" + Math.random().toString(36).substring(2, 15);
        await AsyncStorage.setItem(STORAGE_KEY, deviceId);
      }

      cached = deviceId;
      return deviceId;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/** Synchronous read — null until getDeviceId() has resolved at least once. */
export const getCachedDeviceId = () => cached;
