import { useEffect, useState } from "react";
import { Dimensions, Keyboard, Platform } from "react-native";

/**
 * Tracks keyboard visibility and height, and — critically — guarantees the
 * state returns to { visible: false, height: 0 } when the keyboard closes.
 *
 * Why this exists: this app runs edge-to-edge (`edgeToEdgeEnabled: true`), and
 * under edge-to-edge Android ignores windowSoftInputMode=adjustResize — the
 * window never resizes, so screens must lift their own content by the keyboard
 * height and release it again on close.
 *
 * Measuring that height is the subtle part. `endCoordinates.height` can exclude
 * the navigation-bar strip under edge-to-edge, which lifts the input only part
 * of the way and leaves it half covered. `endCoordinates.screenY` is the
 * keyboard's top edge in absolute screen coordinates, so measuring from there
 * down to the bottom of the screen is correct regardless. We take whichever of
 * the two is larger so we can never under-lift.
 *
 * Platform notes:
 *  - iOS emits keyboardWill* before the animation, so layout moves in step with
 *    the keyboard instead of snapping after it.
 *  - Android only reliably emits keyboardDid*.
 *  - Both emit a fresh show event when the keyboard *changes* height (emoji
 *    keyboard, autocomplete bar, language switch), so height is re-read from
 *    every show event, not just the first.
 */

/** Sanity ceiling: a keyboard never covers more than this fraction of screen. */
const MAX_KEYBOARD_FRACTION = 0.8;

const measureHeight = (event) => {
  const end = event?.endCoordinates;
  if (!end) return 0;

  const byHeight = end.height ?? 0;

  const screenHeight = Dimensions.get("screen").height;
  const byScreenY = end.screenY != null ? screenHeight - end.screenY : 0;

  // Ignore an implausible screenY (rotation mid-event, bogus report).
  const trusted =
    byScreenY > 0 && byScreenY < screenHeight * MAX_KEYBOARD_FRACTION ? byScreenY : 0;

  return Math.max(byHeight, trusted);
};

export const useKeyboardState = () => {
  const [state, setState] = useState({ visible: false, height: 0 });

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e) => {
      const height = measureHeight(e);

      if (__DEV__) {
        const end = e?.endCoordinates ?? {};
      }

      // Functional update so rapid show/hide/show cannot commit a stale height.
      setState((prev) =>
        prev.visible && prev.height === height ? prev : { visible: true, height }
      );
    };

    const onHide = () => {
      // Unconditional reset — this is the line that releases the reserved space.
      setState((prev) => (prev.visible || prev.height ? { visible: false, height: 0 } : prev));
    };

    const subs = [
      Keyboard.addListener(showEvent, onShow),
      Keyboard.addListener(hideEvent, onHide),
    ];

    // iOS can swap keyboard types without a hide/show pair.
    if (Platform.OS === "ios") {
      subs.push(Keyboard.addListener("keyboardWillChangeFrame", onShow));
    }

    return () => {
      subs.forEach((s) => s.remove());
      // Unmounting while the keyboard is open (e.g. navigating back) must not
      // leave the next mount inheriting an "open" layout.
      setState({ visible: false, height: 0 });
    };
  }, []);

  return state;
};

export default useKeyboardState;
