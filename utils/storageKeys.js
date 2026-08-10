/**
 * Every AsyncStorage key the app writes, grouped by what a fresh install or an
 * app update should do with it.
 *
 * Android Auto Backup used to restore this storage onto a supposedly clean
 * install (see `android.allowBackup` in app.json), which is how a reinstalled
 * app came back holding a token the server had already forgotten. Backup is
 * off now, but the install-identity check in ./storageMigration.js still runs
 * so devices already carrying restored data recover on their next launch.
 */

/** Signed-in state. Meaningless once the install identity changes. */
export const SESSION_KEYS = [
  "token",
  "user",
  "userToken", // legacy key written by utils/auth.js
  "chat_token",
  "expoToken",
];

/**
 * Server-derived caches. Safe to drop at any time — the screens that own them
 * refetch — and they must go with the session so an update never renders data
 * shaped for the previous build.
 */
export const CACHE_KEYS = [
  "edit-profile-storage", // zustand persist store, see useEditProfileStore
  "userCurrentLocation",
];

/**
 * Local-only and not tied to a session, so these deliberately survive the
 * wipe. `deviceId` in particular must stay stable: it is what the backend uses
 * to suppress a push on the device that already has the chat open.
 */
export const PRESERVED_KEYS = ["deviceId", "djobzy_recent_searches"];

/** Marker holding the install identity that owns the current storage. */
export const STORAGE_IDENTITY_KEY = "app_storage_identity";

export const CLEARED_ON_IDENTITY_CHANGE = [...SESSION_KEYS, ...CACHE_KEYS];
