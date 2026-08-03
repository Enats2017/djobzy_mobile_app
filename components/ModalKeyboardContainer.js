import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function ModalKeyboardContainer({ children }) {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {children}
        </KeyboardAvoidingView>
    );
}