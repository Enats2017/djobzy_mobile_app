import Echo from "laravel-echo";
// Named import, not default: pusher-js's React Native build ends with
// `module.exports.Pusher = <class>` and never assigns a default, despite what
// its .d.ts advertises. A default import therefore yields the whole exports
// object, and `new {...}()` fails with "constructor is not callable" on Hermes.
import { Pusher } from "pusher-js/react-native";
import { CHAT_API_URL, PUSHER_APP_KEY, PUSHER_APP_CLUSTER } from "../../../api/ApiUrl";

/**
 * Single Echo/Pusher connection for the whole app.
 *
 * The chat backend already broadcasts every conversation event on
 * `private-user.{id}` (see ChatRepository::sendMessage), so the client only has
 * to subscribe — there is one socket, owned here, shared by every screen.
 *
 * The bearer token can be rotated without tearing the socket down: Echo asks
 * `authorizer` for a fresh token on each channel subscription, so we read it
 * from a mutable ref rather than baking it into the config.
 */

let echoInstance = null;
let currentToken = null;
let connectionState = "disconnected";

const stateListeners = new Set();

const notifyState = (state) => {
  connectionState = state;
  stateListeners.forEach((cb) => {
    try {
      cb(state);
    } catch (e) {
      console.warn("[chatEcho] state listener threw", e);
    }
  });
};

/**
 * Subscribe to connection state changes. Returns an unsubscribe function.
 * States mirror Pusher's: connecting | connected | unavailable | failed | disconnected.
 */
export const onConnectionState = (cb) => {
  stateListeners.add(cb);
  cb(connectionState);
  return () => stateListeners.delete(cb);
};

export const getConnectionState = () => connectionState;

/**
 * Create (or return) the shared Echo instance.
 *
 * @param {string} token       chat bearer token
 * @param {Function} onAuthFail called when channel auth is rejected, so the
 *                              caller can refresh the token and reconnect
 */
export const connectEcho = (token, onAuthFail) => {
  if (!token) return null;

  // Same token, socket already up — reuse it.
  if (echoInstance && currentToken === token) return echoInstance;

  // Token changed: the old socket is authenticated against a dead token.
  if (echoInstance && currentToken !== token) disconnectEcho();

  currentToken = token;

  // pusher-js reads this global in some code paths.
  global.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "pusher",
    client: new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
      forceTLS: true,
      enabledTransports: ["ws", "wss"],

      // Reconnect tuning — pusher-js retries with its own backoff, but the
      // defaults are tuned for desktop browsers and give up too readily on
      // flaky mobile networks.
      activityTimeout: 30000,
      pongTimeout: 15000,
      unavailableTimeout: 10000,

      // Channel auth goes through the chat API's Passport-guarded endpoint
      // (routes/api.php -> POST api/broadcasting/auth), not the session-guarded
      // /broadcasting/auth that the web client uses.
      authorizer: (channel) => ({
        authorize: async (socketId, callback) => {
          try {
            const res = await fetch(`${CHAT_API_URL}/broadcasting/auth`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${currentToken}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
              }),
            });

            if (res.status === 401 || res.status === 403) {
              onAuthFail?.();
              callback(new Error(`Channel auth rejected (${res.status})`), null);
              return;
            }

            if (!res.ok) {
              callback(new Error(`Channel auth failed (${res.status})`), null);
              return;
            }

            callback(null, await res.json());
          } catch (e) {
            callback(e, null);
          }
        },
      }),
    }),
  });

  const connection = echoInstance.connector.pusher.connection;
  connection.bind("state_change", ({ current }) => notifyState(current));
  connection.bind("error", (err) => {
    console.warn("[chatEcho] connection error", err?.error ?? err);
  });

  notifyState(connection.state);

  return echoInstance;
};

export const getEcho = () => echoInstance;

export const disconnectEcho = () => {
  if (!echoInstance) return;

  try {
    echoInstance.disconnect();
  } catch (e) {
    console.warn("[chatEcho] disconnect failed", e);
  }

  echoInstance = null;
  currentToken = null;
  notifyState("disconnected");
};

/**
 * Nudge the socket back up after the app returns to the foreground. Pusher
 * reconnects on its own, but an explicit connect() on an already-connected
 * socket is a no-op and shortens the gap when the OS froze the socket.
 */
export const resumeEcho = () => {
  if (!echoInstance) return;

  const connection = echoInstance.connector.pusher.connection;
  if (connection.state !== "connected" && connection.state !== "connecting") {
    echoInstance.connector.pusher.connect();
  }
};
