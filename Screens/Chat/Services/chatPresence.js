import { CHAT_API_URL } from "../../../api/ApiUrl";
import { getDeviceId } from "../../../utils/deviceId";

/**
 * Reports which chat room this device currently has open, so the backend can
 * skip the push notification for that one conversation on this one device.
 *
 * The backend entry expires after 90s without a heartbeat, so a crash or a
 * killed app can never silence a conversation permanently.
 */

const HEARTBEAT_MS = 45000; // half the server TTL, so one dropped beat is harmless

let heartbeatTimer = null;
let activePeerId = null;

const post = async (path, token, body) => {
  try {
    const res = await fetch(`${CHAT_API_URL}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (e) {
    // Presence is best-effort: a failure means the user gets a redundant push,
    // never a missing one, so it is not worth surfacing.
    console.warn(`[chatPresence] ${path} failed`, e?.message ?? e);
    return false;
  }
};

const stopHeartbeat = () => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
};

/** The chat room this device is currently reporting as open, or null. */
export const getActivePeerId = () => activePeerId;

export const enterChatRoom = async (peerId, token) => {
  if (!peerId || !token) return;

  activePeerId = Number(peerId);
  const enteredPeerId = activePeerId;

  const deviceId = await getDeviceId();

  // Another room took over while we awaited the device id — abandon this call.
  if (activePeerId !== enteredPeerId) return;

  await post("chat-presence/enter", token, {
    device_id: deviceId,
    peer_id: enteredPeerId,
  });

  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (activePeerId == null) return;
    post("chat-presence/enter", token, {
      device_id: deviceId,
      peer_id: activePeerId,
    });
  }, HEARTBEAT_MS);
};

/**
 * @param {number|null} forPeerId When given, the leave is ignored unless this
 *   room is still the active one. Navigating A -> B can deliver A's blur after
 *   B's focus; without this guard that stale leave would silently cancel B's
 *   presence and B would start pushing notifications for the open chat.
 */
export const leaveChatRoom = async (token, forPeerId = null) => {
  if (forPeerId != null && activePeerId !== Number(forPeerId)) return;

  stopHeartbeat();

  // Clear locally first so in-app suppression stops immediately, even if the
  // network call is slow or fails.
  const hadPeer = activePeerId != null;
  activePeerId = null;

  if (!hadPeer || !token) return;

  const deviceId = await getDeviceId();
  await post("chat-presence/leave", token, { device_id: deviceId });
};
