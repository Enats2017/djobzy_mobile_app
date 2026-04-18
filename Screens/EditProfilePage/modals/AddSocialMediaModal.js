import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    ScrollView,
    Alert
} from 'react-native';
import {
    FontAwesome,
    FontAwesome6,
    MaterialIcons,
} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../api/ApiUrl';
import { toastError, toastSuccess } from '../../../utils/toast';

const AddSocialMediaModal = ({ visible, onClose }) => {
    const insets = useSafeAreaInsets();
    const [socialMediaLoading, setSocialMediaLoading] = useState(false);
    const [links, setLinks] = useState({});

    const socialPlatforms = [
        { key: "facebook", icon: "facebook", type: "fa", placeholder: "https://www.facebook.com/your.profile" },
        { key: "linkedin", icon: "linkedin", type: "fa", placeholder: "https://www.linkedin.com/your.profile" },
        { key: "instagram", icon: "instagram", type: "fa", placeholder: "https://www.instagram.com/your.profile" },
        { key: "youtube", icon: "youtube-play", type: "fa", placeholder: "https://www.youtube.com/your.channel" },
        { key: "x", icon: "x-twitter", type: "fa6", placeholder: "https://x.com/your.profile" },
        { key: "tiktok", icon: "tiktok", type: "fa6", placeholder: "https://www.tiktok.com/your.profile" },
        { key: "telegram", icon: "telegram", type: "fa", placeholder: "https://t.me/yourusername" },
        { key: "snapchat", icon: "snapchat", type: "fa", placeholder: "https://www.snapchat.com/add/username" },
        { key: "pinterest", icon: "pinterest", type: "fa", placeholder: "https://www.pinterest.com/your.profile" },
        { key: "vk", icon: "vk", type: "fa", placeholder: "https://www.vk.com/your.profile" },
        { key: "global", icon: "globe", type: "fa", placeholder: "https://yourwebsite.com" },
    ];

    const socialPlatformsConfig = {
        facebook: { icon: "facebook", type: "fa", color: "#1877F2" },
        linkedin: { icon: "linkedin", type: "fa", color: "#0077B5" },
        instagram: { icon: "instagram", type: "fa", color: "#E4405F" },
        youtube: { icon: "youtube-play", type: "fa", color: "#FF0000" },
        x: { icon: "x-twitter", type: "fa6", color: "#000000" },
        tiktok: { icon: "tiktok", type: "fa6", color: "#000000" },
        telegram: { icon: "telegram", type: "fa", color: "#0088cc" },
        snapchat: { icon: "snapchat", type: "fa", color: "#FFFC00" },
        pinterest: { icon: "pinterest", type: "fa", color: "#E60023" },
        vk: { icon: "vk", type: "fa", color: "#4C75A3" },
        global: { icon: "globe", type: "fa", color: "#555" },
    };
    // update input value
    const updateLink = (key, value) => {
        setLinks(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // clear input when delete clicked
    const clearLink = (key) => {
        setLinks(prev => ({
            ...prev,
            [key]: ""
        }));
    };

    const saveSocialMediaLinks = async () => {
        console.log('reached');
        const payload = Object.entries(links)
            .filter(([k, v]) => v && v.trim() !== "")
            .map(([k, v]) => ({
                platform: k,
                url: v,
            }));
        console.log(payload);

        try {
            setSocialMediaLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_URL}/save-social-links`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    links: payload,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toastError(data.message);
            }

            toastSuccess("Social links saved successfully");
            onClose();
        } catch (error) {
            toastError(error.message);
        } finally {
            setSocialMediaLoading(false);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={[styles.modalOverlay]} onPress={onClose}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 16 }]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Social Links</Text>
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={onClose}
                        >
                            <MaterialIcons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        {socialPlatforms.map((item, index) => (
                            <View key={item.key}>
                                <View style={styles.linkRow}>
                                    <View style={styles.linkLeft}>
                                        <View style={styles.mediaIconCircle}>
                                            {item.type === "fa" && (
                                                <FontAwesome name={item.icon} size={16} color="#C76C59" />
                                            )}
                                            {item.type === "fa6" && (
                                                <FontAwesome6 name={item.icon} size={16} color="#C76C59" />
                                            )}
                                        </View>
                                        <TextInput
                                            style={styles.linkInput}
                                            placeholder={item.placeholder}
                                            placeholderTextColor="#9a9a9a"
                                            value={links[item.key] || ""}
                                            onChangeText={(text) => updateLink(item.key, text)}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => clearLink(item.key)}>
                                        <MaterialIcons name="delete" size={20} color="#000" />
                                    </TouchableOpacity>
                                </View>
                                {index !== socialPlatforms.length - 1 && (
                                    <View style={styles.separator} />
                                )}
                            </View>
                        ))}
                        <TouchableOpacity style={styles.addLinkBtn}>
                            <Text style={styles.addLinkText}>+ Add New Link</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <View style={styles.bottomBtns}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={saveSocialMediaLinks}
                        >
                            {
                                socialMediaLoading ? (
                                    <ActivityIndicator color="#fff" size={19} />
                                ) : (
                                    <Text style={styles.saveText}>Save</Text>
                                )
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontFamily: "Montserrat_600SemiBold",
        color: '#303030',
    },
    closeIcon: {
        flexShrink: 0,
    },
    modalContainer: {
        backgroundColor: "#fff",
        width: "100%",
        paddingBottom: 20,
        paddingTop: 10,
        paddingHorizontal: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "80%"
    },

    closeBtn: {
        position: "absolute",
        right: 15,
        top: 15,
        zIndex: 10,
    },

    linkRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },

    linkLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    mediaIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#f3f3f3",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    linkText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#333",
    },

    separator: {
        height: 1,
        backgroundColor: "#e5e5e5",
    },

    addLinkBtn: {
        marginTop: 20,
        backgroundColor: "#EFEFEF",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },

    addLinkText: {
        fontWeight: "600",
        color: "#000",
    },

    bottomBtns: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        gap: 12,
    },

    cancelBtn: {
        flex: 1,
        backgroundColor: "#DCDCDC",
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: "center",
    },

    saveBtn: {
        flex: 1,
        backgroundColor: "#C76C59",
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: "center",
    },

    cancelText: {
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        color: "#000",
    },

    saveText: {
        fontSize: 16,
        fontFamily: "Montserrat_600SemiBold",
        color: "#fff",
    },
    linkInput: {
        width: "100%"
    }
});

export default AddSocialMediaModal;