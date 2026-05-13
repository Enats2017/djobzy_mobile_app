import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, FlatList, Linking, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEditProfileStore } from "../useEditProfileStore";
import { SkeletonBox } from "../../../components/SkeletonBox";
import DeleteAttachmentModal from "../modals/DeleteAttachmentModal";
import AttachmentImagePreviewModal from "./AttachmentImagePreviewModal";
import * as WebBrowser from "expo-web-browser";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
const getExtension = (url) => {
    if (!url) return "";
    const path = url.split("?")[0];
    return path.split(".").pop().toLowerCase();
};

const isImageFile = (url) => IMAGE_EXTENSIONS.includes(getExtension(url));

const DOC_ICON_MAP = {
    pdf: { icon: "picture-as-pdf", color: "#E53935", label: "PDF" },
    doc: { icon: "description", color: "#1565C0", label: "DOC" },
    docx: { icon: "description", color: "#1565C0", label: "DOCX" },
    xls: { icon: "table-chart", color: "#2E7D32", label: "XLS" },
    xlsx: { icon: "table-chart", color: "#2E7D32", label: "XLSX" },
    ppt: { icon: "slideshow", color: "#E65100", label: "PPT" },
    pptx: { icon: "slideshow", color: "#E65100", label: "PPTX" },
};

const DocumentThumb = ({ url }) => {
    const ext = getExtension(url);
    const config = DOC_ICON_MAP[ext] || { icon: "attach-file", color: "#546E7A", label: ext.toUpperCase() || "FILE" };

    return (
        <View style={styles.docSection}>
            <MaterialIcons name={config.icon} size={48} color={config.color} />
            <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
        </View>
    );
};

const AttachmentData = ({ isEdit = true }) => {
    const attachments = useEditProfileStore((state) => state.form.attachments);
    const deleteItem = useEditProfileStore((s) => s.deleteItem);
    const setField = useEditProfileStore((state) => state.setField);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);
    if (!attachments || attachments.length === 0) return null;
    // console.log("Before delete:", attachments);

    const handleDelete = () => {
        if (!selectedItem) return;
        if (selectedItem.tempId) {
            setField("attachments", attachments.filter((a) => a.tempId !== selectedItem.tempId));
            console.log("Deleted item from TempID:", selectedItem);
        } else {
            console.log("Deleted item:", selectedItem);
            deleteItem("attachments", selectedItem, selectedIndex);
        }
        setDeleteModalVisible(false);
        setSelectedItem(null);
        setSelectedIndex(null);
    };

    const onClose = () => {
        setDeleteModalVisible(false);
        setSelectedItem(null);
        setSelectedIndex(null);
    };

    const renderItem = ({ item, index }) => {
        const url = item.small_attachment || item.uri;
        const isImage = isImageFile(url);
        return (
            <View style={styles.thumbWrap}>
                {item.loading ? (
                    <>
                        <Image
                            source={{ uri: item.uri }}
                            style={[styles.thumb, { opacity: 0.3 }]}
                        />
                        <View style={StyleSheet.absoluteFill}>
                            <SkeletonBox width={150} height={150} />
                        </View>
                    </>
                ) : isImage ? (
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => {
                            setPreviewIndex(index);
                            setPreviewVisible(true);
                        }}
                    >
                        <Image
                            source={{ uri: url }}
                            style={styles.thumb}
                        />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => WebBrowser.openBrowserAsync(item.attachment)}
                    >
                        <DocumentThumb url={url} />
                    </TouchableOpacity>
                )}

                {isEdit && !item.loading && (
                    <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => {
                            setSelectedItem(item);
                            setSelectedIndex(index);
                            setDeleteModalVisible(true);
                        }}
                    >
                        <MaterialIcons name="delete" size={20} color="#d91212" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.section}>
            <FlatList
                data={attachments}
                renderItem={renderItem}
                keyExtractor={(item) => (item.id ? item.id.toString() : item.tempId)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.previewGrid}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
            />
            <DeleteAttachmentModal
                visible={deleteModalVisible}
                onClose={onClose}
                onConfirm={handleDelete}
            />
            <AttachmentImagePreviewModal
                visible={previewVisible}
                attachments={attachments}
                initialIndex={previewIndex}
                onClose={() => setPreviewVisible(false)}
            />
        </View>
    );
};

export default AttachmentData;

const styles = StyleSheet.create({
    section: {
        flex: 1,
        marginTop: 10,
    },
    previewGrid: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    thumbWrap: { position: "relative", width: 150, height: 150 },
    thumb: {
        width: 150,
        height: 150,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    removeBtn: {
        position: "absolute",
        top: 5,
        right: 5,
        width: 25,
        height: 25,
        borderRadius: 50,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    docSection: {
        width: 150,
        height: 150,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontFamily: "Montserrat_700Bold",
        letterSpacing: 0.5,
    },
});