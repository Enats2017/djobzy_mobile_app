import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEditProfileStore } from "../useEditProfileStore";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const DeletePromoteServiceModal = ({ visible, onClose, deletePromoteService }) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    // console.log('delete promote    ', deletePromoteService);

    const handleDelete = async () => {
        if (!deletePromoteService) return;
        const { promote, deletedPromote = [] } = useEditProfileStore.getState().form;
        const updatedPromoteService = promote.filter(
            (p) => p.sid !== deletePromoteService.sid
        );
        const isPersisted = !!deletePromoteService.sid;
        const updatedDeleted = isPersisted && !deletedPromote.includes(deletePromoteService.sid)
            ? [...deletedPromote, deletePromoteService.sid]
            : deletedPromote;

        useEditProfileStore.getState().setAllData({
            promote: updatedPromoteService,
            deletedPromote: updatedDeleted,
        });

        console.log(deletedPromote);
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.deleteOverlay}>
                <View style={[styles.deleteBox, { paddingBottom: insets.bottom }]}>
                    <TouchableOpacity
                        style={styles.modalCloseIcon}
                        onPress={() => {
                            onClose();
                            // setSelectedCategory(null);
                        }}
                    >
                        <Ionicons name="close" size={22} color="#000" />
                    </TouchableOpacity>
                    <Image
                        source={require("../../../assets/images/delete_warning.png")}
                        style={{ width: 70, height: 70, marginBottom: 10 }}
                        resizeMode="contain"
                    />
                    <Text style={styles.deleteTitle}>Delete Promote Service</Text>
                    <Text style={styles.deleteMsg}>
                        Do you want to delete the service{"\n"}
                        <Text style={styles.deleteSubject}>{deletePromoteService?.subject}</Text>
                    </Text>
                    <View style={styles.deleteBtns}>
                        <TouchableOpacity
                            onPress={() => {
                                onClose();
                            }}
                            style={styles.cancelBtn}
                        >
                            <Text style={styles.canceltext}>No, Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={handleDelete}
                            disabled={loading}
                        >
                            <Text style={styles.deletetext}>Yes, Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DeletePromoteServiceModal;

const styles = StyleSheet.create({
    deleteOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    deleteBox: {
        backgroundColor: "#fff",
        width: "100%",
        maxHeight: "70%",
        paddingVertical: 25,
        paddingHorizontal: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
    },
    modalCloseIcon: {
        position: "absolute",
        top: 12,
        right: 8,
        padding: 5,
        zIndex: 10,
    },

    deleteTitle: {
        fontSize: 22, fontFamily: "Montserrat_700Bold", marginBottom: 7,
    },
    deleteSubject: {
        fontSize: 15, fontFamily: "Montserrat_700Bold",
    },
    deleteMsg: {
        fontSize: 15, marginBottom: 15, textAlign: "center", color: "#444", fontFamily: "Montserrat_500Medium",
    },
    deleteBtns: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        paddingHorizontal: 13,
    },
    deletetext: {
        color: "#ffffff",
        fontSize: 15,
        fontFamily: "Montserrat_700Bold",
        letterSpacing: 0.1,
    },
    cancelBtn: {
        paddingVertical: 15,
        width: "50%",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#ddd",
    },
    canceltext: {
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        color: "#030303",
    },
    deleteBtn: {
        paddingVertical: 15,
        width: "50%",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "red",
    },
});
