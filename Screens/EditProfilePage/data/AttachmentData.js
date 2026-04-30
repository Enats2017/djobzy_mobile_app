import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEditProfileStore } from "../useEditProfileStore";
import { SkeletonBox } from "../../../components/SkeletonBox";
import DeleteAttachmentModal from "../modals/DeleteAttachmentModal";
import AttachmentImagePreviewModal from "./AttachmentImagePreviewModal";

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
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => {
                            setPreviewIndex(index);
                            setPreviewVisible(true);
                        }}
                    >
                        <Image
                            source={{ uri: item.small_attachment || item.uri }}
                            style={styles.thumb}
                        />
                    </TouchableOpacity>
                )}

                {isEdit && !item.loading && (
                    <TouchableOpacity
                        style={styles.removeBtn}
                        // onPress={() => handleDelete(item, index)}
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
});