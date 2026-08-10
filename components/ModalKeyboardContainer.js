import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useKeyboardState from "../utils/useKeyboardState";

/**
 * Keeps a modal's inputs above the keyboard.
 *
 * WHY A PLAIN <KeyboardAvoidingView> DOESN'T WORK HERE
 * This app runs edge-to-edge (app.json `edgeToEdgeEnabled: true`), and under
 * edge-to-edge Android ignores windowSoftInputMode=adjustResize — the window
 * never resizes. RN's <Modal> does call setSoftInputMode(ADJUST_RESIZE) on its
 * own dialog window, but that's just as inert for the same reason. So on Android
 * a KeyboardAvoidingView with `behavior={undefined}` is a literal no-op, which is
 * exactly what this component used to be: the keyboard simply drew over the sheet.
 *
 * So Android lifts the content itself by the measured keyboard height (the same
 * approach ChatRoom already uses), while iOS keeps the native `padding` behaviour
 * because it animates in step with the keyboard. Doing both would double-count,
 * hence the platform split on `enabled`.
 *
 * HEIGHT MATH — why we subtract the bottom safe-area inset
 * Every sheet that uses this pads itself with `paddingBottom: insets.bottom + N`
 * so its content clears the nav bar / home indicator. That inset is only correct
 * while the keyboard is CLOSED — once the keyboard is up it occupies that strip
 * itself, so lifting by the full keyboard height on top of a still-applied
 * safe-area inset double-counts and leaves a visible dead gap above the keyboard.
 *
 * ChatInputBar solves the same problem by dropping its own inset to 0 while the
 * keyboard is visible. The sheets bake theirs into a style prop, so we cancel it
 * here instead — one place, rather than editing every modal.
 *
 * The subtraction is applied differently per platform because RN's own `padding`
 * behaviour overwrites `paddingBottom`, so on iOS it has to go through
 * `keyboardVerticalOffset` (which is subtracted from the keyboard's top edge,
 * and is floored at 0 inside KeyboardAvoidingView).
 *
 * USAGE
 * Wrap the modal's ROOT element, directly inside <Modal> — it needs a full-screen
 * frame to measure against. Wrapping just the input row does not work.
 * `gap` tunes the breathing room left between the keyboard and the input.
 */
export default function ModalKeyboardContainer({ children, style, enabled = true, gap = 0 }) {
    const keyboard = useKeyboardState();
    const insets = useSafeAreaInsets();

    const isIOS = Platform.OS === "ios";

    // What the sheet already reserves at its bottom and shouldn't reserve twice.
    const trim = Math.max(0, insets.bottom - gap);

    const androidLift =
        !isIOS && enabled && keyboard.visible ? Math.max(0, keyboard.height - trim) : 0;

    return (
        <KeyboardAvoidingView
            style={[styles.flex, style, { paddingBottom: androidLift }]}
            behavior={isIOS ? "padding" : undefined}
            enabled={isIOS && enabled}
            keyboardVerticalOffset={isIOS ? -trim : 0}
        >
            {children}
        </KeyboardAvoidingView>
    );
}

const styles = {
    flex: { flex: 1 },
};
