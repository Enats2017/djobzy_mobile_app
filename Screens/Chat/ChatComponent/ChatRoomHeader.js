import React, { useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ChatFormatLastSeen } from "./ChatFormatTime";
import ChatDefaultConfirmationModal from "./ChatDefaultConfirmationModal";
import { blockUserApi, deleteConversationApi } from "../Services/chatService";
import { toastError, toastSuccess } from "../../../utils/toast";

export default function ChatRoomHeader({ navigation, displayName, displayPhoto, isOnline, lastSeen, userId, chatToken, isBlockedByAuthUser, refreshChat }) {
    const menuBtnRef = useRef(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmationType, setConfirmationType] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const MENU_OPTIONS = [
        {
            label: isBlockedByAuthUser ? "Unblock" : "Block",
            value: "block",
        },
        {
            label: "Delete conversation",
            value: "delete",
        },
    ];

    const openMenu = () => {
        menuBtnRef.current?.measureInWindow((x, y, width, height) => {
            setDropdownPos({ top: y + height + 40, right: 15 });
            setMenuVisible(true);
        });
    };

    const handleBlockUser = async () => {
        if (!userId) return;
        const isBlocked = isBlockedByAuthUser ? "false" : "true";
        try {
            setActionLoading(true);
            const response = await blockUserApi(userId, chatToken, isBlocked);
            toastSuccess(
                response?.message ||
                (isBlocked === "true"
                    ? "User blocked successfully."
                    : "User unblocked successfully.")
            );
            return true;
        } catch (error) {
            console.log("BLOCK ERROR", error);
            toastError(
                error?.message ||
                "Unable to update block status."
            );
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteConversation = async () => {
        if (!userId) return;
        try {
            setActionLoading(true);
            const response = await deleteConversationApi(userId, chatToken);
            console.log("DELETE SUCCESS", response);
            toastSuccess(response?.message || "Deleted successfully.");
            navigation.goBack();
        } catch (error) {
            console.log("DELETE ERROR", error);
            toastError("Failed to delete conversation");
        } finally {
            setActionLoading(false);
        }
    };

    const handleShowConfirmation = (value) => {
        setMenuVisible(false);
        switch (value) {
            case "delete":
                setConfirmationType("delete");
                setConfirmationVisible(true);
                break;

            case "block":
                setConfirmationType(isBlockedByAuthUser ? "unblock" : "block");
                setConfirmationVisible(true);
                break;

            // case "clear":
            //     setConfirmationType("clear");
            //     setConfirmationVisible(true);
            //     break;

            default:
                break;
        }
    };

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.headerInfo} activeOpacity={0.8}>
                    <View style={styles.avatarWrap}>
                        {displayPhoto ? (
                            <Image source={{ uri: displayPhoto }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarFallback]}>
                                <Text style={styles.avatarInitial}>
                                    {displayName?.charAt(0)?.toUpperCase() ?? "?"}
                                </Text>
                            </View>
                        )}
                        {isOnline && <View style={styles.onlineDot} />}
                    </View>

                    <View style={styles.nameWrap}>
                        <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
                        {(isOnline || lastSeen) && (
                            <Text style={[styles.status, { color: isOnline ? "#4ade80" : "#888" }]}>
                                {isOnline ? "Online" : <ChatFormatLastSeen lastSeen={lastSeen} />}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity ref={menuBtnRef} style={styles.menuBtn} onPress={openMenu}>
                    <MaterialIcons name="more-vert" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Dropdown */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuVisible(false)} />
                <View style={[styles.dropdown, { top: dropdownPos.top, right: dropdownPos.right }]}>
                    {MENU_OPTIONS.map((opt, i) => (
                        <TouchableOpacity
                            key={opt.value}
                            style={[
                                styles.option,
                                i === MENU_OPTIONS.length - 1 && { borderBottomWidth: 0 },
                                opt.value === "delete" && styles.optionDanger,
                            ]}
                            onPress={() => handleShowConfirmation(opt.value)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.optionLabel, opt.value === "delete" && styles.optionLabelDanger]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>

            <ChatDefaultConfirmationModal
                visible={confirmationVisible}
                type={confirmationType}
                loading={actionLoading}
                onClose={() => {
                    setConfirmationVisible(false);
                    setConfirmationType("");
                }}
                onConfirm={async () => {
                    let shouldRefresh = false;
                    switch (confirmationType) {

                        case "delete":
                            await handleDeleteConversation();
                            break;

                        case "block":
                        case "unblock":
                            const success = await handleBlockUser();
                            if(success) {
                                shouldRefresh = true;
                            }
                            break;

                        default:
                            break;
                    }

                    setConfirmationVisible(false);
                    if (shouldRefresh) {
                        await refreshChat?.();
                    }
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 68,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        overflow: "hidden"
    },
    backBtn: {
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
    },
    headerInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 4,
    },
    avatarWrap: { position: "relative" },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#333",
    },
    avatarFallback: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e87b7b",
    },
    avatarInitial: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
    },
    onlineDot: {
        position: "absolute",
        bottom: 1,
        right: 1,
        width: 11,
        height: 11,
        borderRadius: 6,
        backgroundColor: "#4ade80",
        borderWidth: 2,
        borderColor: "#1a1a1a",
    },
    nameWrap: { marginLeft: 10, flex: 1 },
    name: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        letterSpacing: 0.2,
        lineHeight: 22,
    },
    status: {
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
    },
    menuBtn: { padding: 8 },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.07)",
    },

    // dropdown
    dropdown: {
        position: "absolute",
        backgroundColor: "#fff",
        width: 170,
        borderRadius: 6,
        overflow: "hidden",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    option: {
        paddingVertical: 11,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    optionDanger: {
        backgroundColor: "#fff5f5",
    },
    optionLabel: {
        fontFamily: "Montserrat_500Medium",
        fontSize: 14,
        color: "#000",
    },
    optionLabelDanger: {
        color: "#d93025",
    },
});