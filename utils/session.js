import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../api/ApiUrl";
import { CLEARED_ON_IDENTITY_CHANGE } from "./storageKeys";

export const AUTH_ROUTES = {
  ONBOARDING: "SliderScreen",
  VERIFICATION: "VerificationPage",
  EMPLOYEE: "Dashboard",
  EMPLOYER: "EmployerDashboard",
};

/** Long enough for a cold network, short enough not to hang the splash. */
const VALIDATE_TIMEOUT_MS = 10000;

export async function clearSession() {
  try {
    await AsyncStorage.multiRemove(CLEARED_ON_IDENTITY_CHANGE);
  } catch (error) {
    console.log("Failed to clear session:", error);
  }
}

/**
 * A partial or restored `user` record is what let a stale install reach the
 * dashboard: `JSON.parse` succeeded, so the old code destructured it and
 * navigated. Anything without an id is not a user record.
 */
export function isUsableUser(user) {
  return (
    !!user &&
    typeof user === "object" &&
    !Array.isArray(user) &&
    user.id != null
  );
}

const readStoredUser = async () => {
  try {
    const raw = await AsyncStorage.getItem("user");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return isUsableUser(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
};

/** Same mapping the app has always used, kept in one place. */
export function routeForUser(user) {
  const { verification_count, admin } = user;

  if (verification_count >= 2 && admin == 2) return AUTH_ROUTES.EMPLOYER;
  if (verification_count >= 2 && admin == 0) return AUTH_ROUTES.EMPLOYEE;
  return AUTH_ROUTES.VERIFICATION;
}

/**
 * Asks the API whether the stored token still belongs to a user.
 *
 * `/profile-menu-list` sits behind `auth:sanctum` and returns the full user
 * model, so a revoked token answers 401 and a live one answers with the record
 * the routing decision needs. Anything else — offline, timeout, 5xx — is
 * "unknown": the server never rendered a verdict, so neither do we.
 */
const validateToken = async (token) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VALIDATE_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}/profile-menu-list`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    if (res.status === 401 || res.status === 403) return { status: "invalid" };
    if (!res.ok) return { status: "unknown" };

    const data = await res.json();

    // Authenticated but the token maps to nothing usable — treat as signed out
    // rather than handing an empty record to the dashboard.
    if (!isUsableUser(data?.user)) return { status: "invalid" };

    return { status: "valid", user: data.user };
  } catch (error) {
    return { status: "unknown" };
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Decides where a launch should land, trusting the server over storage.
 *
 * Storage alone can't be trusted: an update, or a backup restored onto a fresh
 * install, can leave behind a token the API has already invalidated — which is
 * what produced a dashboard that rendered with nothing in it. A rejected token
 * clears the session; an unreachable server falls back to storage so an
 * offline user isn't signed out for losing signal.
 */
export async function resolveLaunchRoute() {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    await clearSession();
    return { route: AUTH_ROUTES.ONBOARDING, reason: "no-token" };
  }

  const verdict = await validateToken(token);

  if (verdict.status === "invalid") {
    await clearSession();
    return { route: AUTH_ROUTES.ONBOARDING, reason: "rejected" };
  }

  if (verdict.status === "valid") {
    await AsyncStorage.setItem("user", JSON.stringify(verdict.user));
    return { route: routeForUser(verdict.user), user: verdict.user, reason: "verified" };
  }

  const storedUser = await readStoredUser();

  // Unverifiable token with no usable record behind it: the exact state that
  // used to open an empty dashboard.
  if (!storedUser) {
    await clearSession();
    return { route: AUTH_ROUTES.ONBOARDING, reason: "unverifiable" };
  }

  return { route: routeForUser(storedUser), user: storedUser, reason: "offline" };
}
