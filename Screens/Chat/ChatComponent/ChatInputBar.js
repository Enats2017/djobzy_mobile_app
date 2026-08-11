import React, { memo, useState, useCallback } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    Modal,
    FlatList,
    Image,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { toastError } from "../../../utils/toast";

const FILE_ICONS = {
    pdf: { icon: "picture-as-pdf", color: "#E53935" },
    doc: { icon: "description", color: "#1565C0" },
    docx: { icon: "description", color: "#1565C0" },
    xls: { icon: "table-chart", color: "#2E7D32" },
    xlsx: { icon: "table-chart", color: "#2E7D32" },
    ppt: { icon: "slideshow", color: "#E65100" },
    pptx: { icon: "slideshow", color: "#E65100" },
    zip: { icon: "folder-zip", color: "#6A1B9A" },
    rar: { icon: "folder-zip", color: "#6A1B9A" },
    txt: { icon: "article", color: "#546E7A" },
    mp4: { icon: "videocam", color: "#00838F" },
    mkv: { icon: "videocam", color: "#00838F" },
    avi: { icon: "videocam", color: "#00838F" },
    mov: { icon: "videocam", color: "#00838F" },
    mp3: { icon: "audiotrack", color: "#AD1457" },
    wav: { icon: "audiotrack", color: "#AD1457" },
};

const getExt = (name = "") => name.split(".").pop()?.toLowerCase() ?? "";

const FileThumb = ({ file, onRemove, uploading }) => {
    const ext = getExt(file.name);
    const isImage = ["jpg", "jpeg", "png", "gif"].includes(ext);
    const iconInfo = FILE_ICONS[ext] ?? { icon: "insert-drive-file", color: "#78909C" };

    return (
        <View style={styles.thumbWrap}>
            {isImage ? (
                <Image source={{ uri: file.uri }} style={styles.thumbImage} />
            ) : (
                <View style={[styles.thumbDoc, { borderColor: iconInfo.color }]}>
                    <MaterialIcons name={iconInfo.icon} size={24} color={iconInfo.color} />
                    <Text style={styles.thumbExt} numberOfLines={1}>{ext.toUpperCase()}</Text>
                </View>
            )}

            {uploading && (
                <View style={styles.thumbOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                </View>
            )}

            {!uploading && (
                <TouchableOpacity style={styles.thumbRemove} onPress={() => onRemove(file.tempId)}>
                    <Ionicons name="close" size={12} color="#000" />
                </TouchableOpacity>
            )}

            <Text style={styles.thumbName} numberOfLines={1}>
                {file.name?.length > 10 ? file.name.slice(0, 10) + "…" : file.name}
            </Text>
        </View>
    );
};

const ATTACH_OPTIONS = [
    { key: "camera", label: "Camera", icon: "camera-outline", color: "#e87b7b" },
    { key: "gallery", label: "Gallery", icon: "images-outline", color: "#e87b7b" },
    { key: "document", label: "Document", icon: "document-outline", color: "#e87b7b" },
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 20 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
const VIDEO_EXTS = ["mp4", "mkv", "avi", "mov"];

const AttachSheet = ({ visible, onClose, onPick }) => {
    const insets = useSafeAreaInsets();
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.sheetBackdrop} onPress={onClose} />
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>Send attachment</Text>
                <View style={styles.sheetOptions}>
                    {ATTACH_OPTIONS.map((opt) => (
                        <TouchableOpacity
                            key={opt.key}
                            style={styles.sheetOption}
                            activeOpacity={0.7}
                            onPress={() => { onClose(); onPick(opt.key); }}
                        >
                            <View style={styles.sheetOptionIcon}>
                                <Ionicons name={opt.icon} size={26} color={opt.color} />
                            </View>
                            <Text style={styles.sheetOptionLabel}>{opt.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const getReplyPreviewLabel = (msg) => {
    if (!msg) return "";
    const isFile = msg.message_type !== 0 && msg.message_type !== undefined;
    if (!isFile) return msg.message ?? "";

    const ext = (msg.file_name ?? "").split(".").pop()?.toLowerCase() ?? "";
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "📷 Photo";
    if (["mp4", "mkv", "avi", "mov"].includes(ext)) return "🎥 Video";
    return `📄 ${msg.file_name ?? "Document"}`;
};

const ChatInputBar = memo(({ value, onChangeText, onSend, onSendFiles, sending, isBlockedByAuthUser, replyMessage, onCancelReply, keyboardVisible = false, }) => {
    const insets = useSafeAreaInsets();

    // While the keyboard is up it covers the gesture bar / nav bar, so the
    // safe-area inset must collapse to 0 — otherwise that reserved space stays
    // behind as a dead gap above the keyboard, and again after it closes.
    const bottomInset = keyboardVisible ? 0 : insets.bottom;
    const [sheetOpen, setSheetOpen] = useState(false);
    const [pendingFiles, setPendingFiles] = useState([]);
    // True only for the attachment leg of a send. The field is locked for that
    // window so the text handed to onSend() is exactly what was on screen when
    // Send was tapped — anything typed meanwhile would be wiped by the clear.
    const [uploading, setUploading] = useState(false);

    const removeFile = useCallback((tempId) => {
        setPendingFiles((prev) => prev.filter((f) => f.tempId !== tempId));
    }, []);

    const formatBytes = (bytes, decimals = 0) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const validateFileSize = (file, pickerType) => {
        const size = file.fileSize ?? file.size ?? 0;
        if (!size) {
            console.warn(`Could not determine file size for: ${file.name}`);
            return null;
        }
        const mime = file.mimeType ?? "";
        const isVideo = mime.startsWith("video/");
        const isImage = mime.startsWith("image/");

        if (pickerType === "document") {
            if (size > MAX_DOCUMENT_SIZE) {
                return `${file.name} exceeds the ${formatBytes(MAX_DOCUMENT_SIZE)} limit for documents.`;
            }
            return null;
        }

        if (isVideo && size > MAX_VIDEO_SIZE) {
            return `${file.name} exceeds the ${formatBytes(MAX_VIDEO_SIZE)} limit for videos.`;
        }

        if (isImage && size > MAX_IMAGE_SIZE) {
            return `${file.name} exceeds the ${formatBytes(MAX_IMAGE_SIZE)} limit for images.`;
        }

        if (size > MAX_IMAGE_SIZE) {
            return `${file.name} exceeds the maximum allowed file size of ${formatBytes(MAX_IMAGE_SIZE)}.`;
        }

        return null;
    };

    const handlePick = useCallback(async (type) => {
        let picked = [];
        let errors = [];

        if (type === "camera") {
            const perm = await ImagePicker.requestCameraPermissionsAsync();
            if (!perm.granted) return;
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (!result.canceled) {
                result.assets.forEach((a) => {
                    const file = {
                        tempId: `tmp_${Date.now()}_${Math.random()}`,
                        uri: a.uri,
                        name: a.fileName ?? `photo_${Date.now()}.jpg`,
                        mimeType: a.mimeType ?? "image/jpeg",
                        fileSize: a.fileSize,
                        uploading: false,
                    };
                    const err = validateFileSize(file, "camera");
                    if (err) errors.push(err);
                    else picked.push(file);
                });
            }
        } else if (type === "gallery") {
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!perm.granted) return;
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 0.8,
                allowsMultipleSelection: true,
            });
            if (!result.canceled) {
                result.assets.forEach((a) => {
                    const file = {
                        tempId: `tmp_${Date.now()}_${Math.random()}`,
                        uri: a.uri,
                        name: a.fileName ?? `media_${Date.now()}.jpg`,
                        mimeType: a.mimeType ?? "image/jpeg",
                        fileSize: a.fileSize,
                        uploading: false,
                    };

                    const err = validateFileSize(file, "gallery");
                    if (err) errors.push(err);
                    else picked.push(file);
                });
            }
        } else if (type === "document") {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                multiple: true,
                copyToCacheDirectory: true,
            });
            if (!result.canceled) {
                result.assets.forEach((a) => {
                    const file = {
                        tempId: `tmp_${Date.now()}_${Math.random()}`,
                        uri: a.uri,
                        name: a.name,
                        mimeType: a.mimeType ?? "application/octet-stream",
                        fileSize: a.size,
                        uploading: false,
                    };
                    const err = validateFileSize(file, "document");
                    if (err) errors.push(err);
                    else picked.push(file);
                });
            }
        }

        if (errors.length > 0) {
            toastError(errors.join("\n"));
        }

        if (picked.length > 0) {
            setPendingFiles((prev) => [...prev, ...picked]);
        }
    }, []);

    /**
     * We have no caption field, so an attachment + typed text is sent as two
     * messages from a single tap: the file first, then the text right after it.
     * The text is deliberately NOT fired in parallel — it only goes out once the
     * attachment has actually landed, otherwise a failed upload would leave an
     * orphan text message reading like a caption for something that never sent.
     */
    const handleSend = useCallback(async () => {
        if (sending || uploading) return;

        const hasText = value.trim().length > 0;
        const files = pendingFiles;

        if (files.length === 0) {
            if (hasText) onSend();
            return;
        }

        setPendingFiles((prev) => prev.map((f) => ({ ...f, uploading: true })));
        setUploading(true);
        try {
            const result = await onSendFiles(files, () => setPendingFiles([]));
            // On failure the composer keeps the typed text (and the caller has
            // toasted the error), so nothing the user wrote is silently dropped.
            if (hasText && result?.ok) onSend();
        } finally {
            setUploading(false);
        }
    }, [sending, uploading, value, pendingFiles, onSend, onSendFiles]);

    const hasContent = value.trim() || pendingFiles.length > 0;

    return (
        <View style={[styles.inputWrap, { paddingBottom: bottomInset + 8 }]}>
            {isBlockedByAuthUser ? (
                <View style={styles.blockedContainer}>
                    <Text style={styles.blockedText}>You have blocked this user</Text>
                </View>
            ) : (
                <>
                    {pendingFiles.length > 0 && (
                        <FlatList
                            data={pendingFiles}
                            horizontal
                            keyExtractor={(f) => f.tempId}
                            style={styles.previewStrip}
                            contentContainerStyle={styles.previewContent}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <FileThumb
                                    file={item}
                                    onRemove={removeFile}
                                    uploading={item.uploading}
                                />
                            )}
                        />
                    )}

                    {replyMessage && (
                        <View style={styles.replyContainer}>
                            <View style={styles.replyBar} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.replyTitle}>
                                    Replying to {replyMessage.from_id === undefined ? "yourself" : ""}
                                </Text>
                                <Text numberOfLines={1} style={styles.replyText}>
                                    {getReplyPreviewLabel(replyMessage)}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onCancelReply} style={{ flexShrink: 0, padding: 4 }}>
                                <Ionicons name="close" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.inputPill}>
                        <TouchableOpacity
                            style={styles.roundBtn}
                            activeOpacity={0.7}
                            onPress={() => setSheetOpen(true)}
                        >
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Send your message..."
                            placeholderTextColor="rgba(255,255,255,0.35)"
                            value={value}
                            onChangeText={onChangeText}
                            editable={!uploading}
                            multiline
                            maxLength={2000}
                            returnKeyType="default"
                        />

                        <TouchableOpacity
                            style={styles.roundBtn}
                            activeOpacity={0.7}
                            onPress={handleSend}
                            disabled={!hasContent || sending || uploading}
                        >
                            {uploading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Feather
                                    name="send"
                                    size={20}
                                    color={hasContent ? "#fff" : "rgba(255,255,255,0.3)"}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <AttachSheet
                visible={sheetOpen}
                onClose={() => setSheetOpen(false)}
                onPick={handlePick}
            />
        </View>
    );
});

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

    previewStrip: {
        marginBottom: 8,
    },
    previewContent: {
        gap: 8,
    },
    thumbWrap: {
        width: 72,
        alignItems: "center",
    },
    thumbImage: {
        width: 72,
        height: 72,
        borderRadius: 10,
        backgroundColor: "#333",
    },
    thumbDoc: {
        width: 72,
        height: 72,
        borderRadius: 10,
        borderWidth: 1.5,
        backgroundColor: "#2a2a2a",
        alignItems: "center",
        justifyContent: "center",
    },
    thumbExt: {
        fontSize: 9,
        color: "#aaa",
        marginTop: 2,
        fontFamily: "Montserrat_500Medium",
    },
    thumbOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: 72,
        height: 72,
    },
    thumbRemove: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    thumbName: {
        fontSize: 9,
        color: "#aaa",
        marginTop: 3,
        maxWidth: 72,
        fontFamily: "Montserrat_500Medium",
    },

    // bottom sheet
    sheetBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    sheet: {
        backgroundColor: "#2a2a2a",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    sheetHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignSelf: "center",
        marginBottom: 16,
    },
    sheetTitle: {
        color: "#fff",
        fontSize: 15,
        fontFamily: "Montserrat_500Medium",
        marginBottom: 20,
        textAlign: "center",
    },
    sheetOptions: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 8,
    },
    sheetOption: {
        alignItems: "center",
        gap: 8,
    },
    sheetOptionIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(232,123,123,0.12)",
        borderWidth: 1,
        borderColor: "rgba(232,123,123,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    sheetOptionLabel: {
        color: "#ccc",
        fontSize: 12,
        fontFamily: "Montserrat_500Medium",
    },
    replyContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 8,
        gap: 8,
    },
    replyBar: {
        width: 3,
        height: "100%",
        borderRadius: 2,
        backgroundColor: "#e87b7b",
    },
    replyTitle: {
        color: "#e87b7b",
        fontSize: 11,
        fontFamily: "Montserrat_500Medium",
        marginBottom: 2,
    },
    replyText: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 12.5,
        fontFamily: "Montserrat_500Medium",
    },
});