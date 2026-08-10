import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";

import {
  CLEARED_ON_IDENTITY_CHANGE,
  STORAGE_IDENTITY_KEY,
} from "./storageKeys";

/**
 * Bump this to force a session wipe on the next launch independently of the
 * app version — e.g. when the shape of the stored `user` record changes and
 * old records would route users to the wrong dashboard.
 */
export const STORAGE_SCHEMA_VERSION = 1;

/**
 * Identity of the install that owns the current storage.
 *
 * Version + build catch an update installed over an existing app. Install time
 * catches a full uninstall/reinstall, which keeps the same version but gets a
 * new `firstInstallTime` — the marker itself can be restored from a backup,
 * the OS-reported install time cannot.
 */
const readInstallIdentity = async () => {
  let installedAt = "unknown";

  try {
    const time = await Application.getInstallationTimeAsync();
    if (time) installedAt = String(time instanceof Date ? time.getTime() : time);
  } catch (error) {
    // Not available on every platform; version + build alone still catch updates.
    console.log("Install time unavailable:", error?.message);
  }

  return [
    STORAGE_SCHEMA_VERSION,
    Application.nativeApplicationVersion ?? "0",
    Application.nativeBuildVersion ?? "0",
    installedAt,
  ].join("|");
};

/**
 * Drops session and cache keys when the running install is not the one that
 * wrote them. Run this before anything reads a token.
 *
 * On failure the marker is left unwritten so the next launch retries rather
 * than locking in a half-migrated state.
 */
export async function runStorageMigration() {
  try {
    const identity = await readInstallIdentity();
    const stored = await AsyncStorage.getItem(STORAGE_IDENTITY_KEY);

    if (stored === identity) return { cleared: false };

    await AsyncStorage.multiRemove(CLEARED_ON_IDENTITY_CHANGE);
    await AsyncStorage.setItem(STORAGE_IDENTITY_KEY, identity);

    return { cleared: true };
  } catch (error) {
    console.log("Storage migration failed:", error);
    return { cleared: false, error };
  }
}
