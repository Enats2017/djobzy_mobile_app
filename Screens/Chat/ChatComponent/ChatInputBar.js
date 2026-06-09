import React, { memo } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";

const ChatInputBar = memo(
    ({ value, onChangeText, onSend, sending, isBlockedByAuthUser }) => {
        // Use safe area insets to add bottom padding on devices with home indicator (iPhone X+).
        // We handle this here instead of SafeAreaView so KeyboardAvoidingView works correctly.
        const insets = useSafeAreaInsets();

        return (
            <View
                style={[
                    styles.inputWrap,
                    // Add bottom safe area padding so input isn't hidden behind home indicator.
                    // When keyboard is open, KAV shifts the view up so inset is already handled.
                    { paddingBottom: insets.bottom + 8 },
                ]}
            >
                {isBlockedByAuthUser ? (
                    <View style={styles.blockedContainer}>
                        <Text style={styles.blockedText}>You have blocked this user</Text>
                    </View>
                ) : (
                    <View style={styles.inputPill}>
                        <TouchableOpacity style={styles.roundBtn} activeOpacity={0.7}>
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Send your message..."
                            placeholderTextColor="rgba(255,255,255,0.35)"
                            value={value}
                            onChangeText={onChangeText}
                            multiline
                            maxLength={2000}
                            returnKeyType="default"
                        // Prevents keyboard from dismissing when tapping outside input
                        // — handled by keyboardShouldPersistTaps="handled" on the list instead
                        />

                        <TouchableOpacity
                            style={styles.roundBtn}
                            activeOpacity={0.7}
                            onPress={onSend}
                            disabled={!value.trim() || sending}
                        >
                            <Feather
                                name="send"
                                size={20}
                                color={value.trim() ? "#fff" : "rgba(255,255,255,0.3)"}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }
);

export default ChatInputBar;

const styles = StyleSheet.create({
    inputWrap: {
        paddingHorizontal: 12,
        paddingTop: 8,
        backgroundColor: "#ffffff1a",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "rgba(255,255,255,0.1)",
    },
    inputPill: {
        flexDirection: "row",
        alignItems: "flex-end",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#fff",
        paddingHorizontal: 6,
        paddingVertical: 6,
    },
    roundBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 3,
    },
    input: {
        flex: 1,
        minHeight: 36,
        maxHeight: 110,
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        lineHeight: 19,
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlignVertical: "center",
    },
    blockedContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
    },
    blockedText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        lineHeight: 19,
    },
});