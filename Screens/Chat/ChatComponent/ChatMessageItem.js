import React, { memo, useState, useCallback, useMemo } from "react";
import {
    View, Text, Image, StyleSheet, ActivityIndicator,
    TouchableOpacity, Alert, Modal, Pressable
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import moment from "moment";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import * as WebBrowser from "expo-web-browser";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useVideoPlayer, VideoView } from "expo-video";
import ImageViewing from "react-native-image-viewing";
import { ChatFormatDay } from "./ChatFormatTime";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MessageInfoModal from "./MessageInfoModal";
import ReplyQuote from "./ReplyQuote";

const getExt = (name = "") => name.split(".").pop()?.toLowerCase() ?? "";

const FILE_ICONS = {
    pdf: { icon: "picture-as-pdf", color: "#E5484D", label: "PDF Document" },
    doc: { icon: "description", color: "#5B8DEF", label: "Word Document" },
    docx: { icon: "description", color: "#5B8DEF", label: "Word Document" },
    xls: { icon: "table-chart", color: "#3DB87A", label: "Excel Spreadsheet" },
    xlsx: { icon: "table-chart", color: "#3DB87A", label: "Excel Spreadsheet" },
    ppt: { icon: "slideshow", color: "#E8914B", label: "PowerPoint" },
    pptx: { icon: "slideshow", color: "#E8914B", label: "PowerPoint" },
    zip: { icon: "folder-zip", color: "#9B6BD9", label: "Archive" },
    rar: { icon: "folder-zip", color: "#9B6BD9", label: "Archive" },
    txt: { icon: "article", color: "#8A99A8", label: "Text File" },
    mp3: { icon: "audiotrack", color: "#D9618B", label: "Audio" },
    wav: { icon: "audiotrack", color: "#D9618B", label: "Audio" },
};

const IMAGE_TYPES = [1];
const VIDEO_TYPES = [5];
const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif"];
const VIDEO_EXTS = ["mp4", "mkv", "avi", "mov"];

const isImageType = (t) => IMAGE_TYPES.includes(t);
const isVideoType = (t) => VIDEO_TYPES.includes(t);
const isImageExt = (name) => IMAGE_EXTS.includes(getExt(name));
const isVideoExt = (name) => VIDEO_EXTS.includes(getExt(name));

const formatBytes = (bytes) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const SENDER_MENU_OPTIONS = [
    { key: "delete", label: "Delete", icon: "trash-outline", color: "#E5484D" },
    { key: "delete-everyone", label: "Delete From Everyone", icon: "trash-outline", color: "#E5484D" },
    { key: "reply", label: "Reply", icon: "arrow-undo-outline", color: "#fff" },
    { key: "info", label: "Info", icon: "information-circle-outline", color: "#fff" },
];

const RECEIVER_MENU_OPTIONS = [
    { key: "reply", label: "Reply", icon: "arrow-undo-outline", color: "#fff" },
];

const MessageMenu = ({ visible, onClose, onSelect, isOutgoing }) => {
    if (!visible) return null;
    const insets = useSafeAreaInsets();
    const options = isOutgoing ? SENDER_MENU_OPTIONS : RECEIVER_MENU_OPTIONS;
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.menuBackdrop} onPress={onClose}>
                <View style={[styles.menuCard, { paddingBottom: insets.bottom + 16 }]}>
                    {options.map((opt, idx) => (
                        <TouchableOpacity
                            key={opt.key}
                            style={[
                                styles.menuItem,
                                idx < options.length - 1 && styles.menuItemBorder,
                            ]}
                            onPress={() => { onClose(); onSelect(opt.key); }}
                        >
                            <Ionicons name={opt.icon} size={17} color={opt.color} />
                            <Text style={[styles.menuItemText, { color: opt.color }]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Pressable>
        </Modal>
    );
};

const ThreeDotButton = ({ onPress }) => (
    <TouchableOpacity style={styles.threeDotBtn} onPress={onPress} activeOpacity={0.7}>
        <Ionicons name="ellipsis-vertical" size={15} color="#fff" />
    </TouchableOpacity>
);

const VideoPlayerModal = ({ uri, onClose }) => {
    const player = useVideoPlayer(
        { uri, headers: { Accept: "video/*, text/html, application/xhtml+xml" } },
        (p) => { p.loop = false; p.play(); }
    );

    return (
        <Modal visible={!!uri} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
            <View style={styles.videoModalBg}>
                <TouchableOpacity style={styles.videoModalClose} onPress={onClose}>
                    <MaterialIcons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <VideoView
                    player={player}
                    style={styles.videoPlayer}
                    contentFit="contain"
                    nativeControls
                    requiresLinearPlayback={false}
                />
            </View>
        </Modal>
    );
};

const VideoBubble = ({ item, onPlay, isOutgoing, onMenu }) => {
    const [thumb, setThumb] = useState(null);
    const [thumbErr, setThumbErr] = useState(false);
    const videoUri = item._localUri ?? item.message;

    const generateThumb = useCallback(async () => {
        if (!videoUri || thumbErr) return;
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time: 1000, quality: 0.6 });
            setThumb(uri);
        } catch {
            setThumbErr(true);
        }
    }, [videoUri, thumbErr]);

    React.useEffect(() => { generateThumb(); }, [generateThumb]);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => !item._sending && onPlay(videoUri)}
            disabled={item._sending}
            style={styles.mediaBubble}
        >
            {thumb && !thumbErr ? (
                <Image source={{ uri: thumb }} style={styles.mediaImage} resizeMode="cover" />
            ) : (
                <View style={styles.mediaFallback}>
                    <MaterialIcons name="videocam" size={36} color="rgba(255,255,255,0.4)" />
                </View>
            )}

            {!item._sending && (
                <View style={styles.playOverlay}>
                    <View style={styles.playBtn}>
                        <MaterialIcons name="play-arrow" size={28} color="#fff" />
                    </View>
                </View>
            )}

            {item._sending && (
                <View style={styles.mediaOverlay}><ActivityIndicator color="#fff" /></View>
            )}
            {item._failed && (
                <View style={styles.mediaOverlay}>
                    <MaterialIcons name="error-outline" size={24} color="#ff5252" />
                </View>
            )}

            {!item._sending && !item._failed && (
                <ThreeDotButton onPress={onMenu} />
            )}
        </TouchableOpacity>
    );
};

const handleView = async (url, fileName) => {
    try {
        const ext = getExt(fileName);
        const isImage = IMAGE_EXTS.includes(ext);

        if (isImage) {
            const localUri = FileSystem.cacheDirectory + fileName;
            const { uri } = await FileSystem.downloadAsync(url, localUri);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission required", "Allow access to save images to your gallery.");
                return;
            }
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert("Saved", "Image saved to your gallery.");
        } else {
            await WebBrowser.openBrowserAsync(url, {
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
            });
        }
    } catch (e) {
        console.error("View error", e);
        Alert.alert("Error", "Could not open the file.");
    }
};

const DocBubble = ({ item, isOutgoing, onMenu }) => {
    const [downloading, setDownloading] = useState(false);
    const ext = getExt(item.file_name ?? "");
    const iconInfo = FILE_ICONS[ext] ?? { icon: "insert-drive-file", color: "#8A99A8", label: "File" };

    const handleDownload = async () => {
        if (!item.message) return;
        setDownloading(true);
        await handleView(item.message, item.file_name ?? `file.${ext}`);
        setDownloading(false);
    };

    const sizeLabel = formatBytes(item.file_size);
    const subtitle = [iconInfo.label, sizeLabel].filter(Boolean).join(" · ");

    return (
        <View style={styles.docBubble}>
            <View style={[styles.docIcon, { backgroundColor: iconInfo.color + "1A" }]}>
                {item._sending ? (
                    <ActivityIndicator size="small" color={iconInfo.color} />
                ) : (
                    <MaterialIcons name={iconInfo.icon} size={24} color={iconInfo.color} />
                )}
            </View>

            <View style={styles.docInfo}>
                <Text style={styles.docName} numberOfLines={2}>
                    {item.file_name ?? "Attachment"}
                </Text>
                <Text style={styles.docSubtitle}>
                    {item._sending ? "Uploading…" : item._failed ? "Upload failed" : subtitle || ext.toUpperCase()}
                </Text>
            </View>

            {!item._sending && !item._failed && (
                <View style={styles.docActionsRow}>
                    {!isOutgoing && (
                        <TouchableOpacity onPress={handleDownload} disabled={downloading} style={styles.docMenuBtn}>
                            {downloading
                                ? <ActivityIndicator size="small" color="#fff" />
                                : <Feather name="download" size={17} color="#fff" />
                            }
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={onMenu} style={styles.docMenuBtn}>
                        <Ionicons name="ellipsis-vertical" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const ImageBubble = ({ item, isOutgoing, onPress, onMenu }) => {
    const imageUri = item._localUri ?? item.message;
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => !item._sending && onPress(imageUri)}
            disabled={item._sending}
            style={styles.mediaBubble}
        >
            <Image source={{ uri: imageUri }} style={styles.mediaImage} resizeMode="cover" />

            {item._sending && (
                <View style={styles.mediaOverlay}><ActivityIndicator color="#fff" /></View>
            )}
            {item._failed && (
                <View style={styles.mediaOverlay}>
                    <MaterialIcons name="error-outline" size={24} color="#ff5252" />
                </View>
            )}

            {!item._sending && !item._failed && (
                <ThreeDotButton onPress={onMenu} />
            )}
        </TouchableOpacity>
    );
};

const FileBubble = ({ item, isOutgoing, onImagePress, onVideoPlay, onMenu }) => {
    const showImage = isImageType(item.message_type) || isImageExt(item.file_name);
    const showVideo = isVideoType(item.message_type) || isVideoExt(item.file_name);
    const imageUri = item._localUri ?? item.message;

    if (showImage && imageUri) {
        return <ImageBubble item={item} isOutgoing={isOutgoing} onPress={onImagePress} onMenu={onMenu} />;
    }
    if (showVideo) {
        return <VideoBubble item={item} onPlay={onVideoPlay} isOutgoing={isOutgoing} onMenu={onMenu} />;
    }
    return <DocBubble item={item} isOutgoing={isOutgoing} onMenu={onMenu} />;
};

const ChatMessageItem = memo(({ item, myId, onDelete, onReply, onInfo, otherUserName, onDeleteFromEveryone }) => {
    const [previewUri, setPreviewUri] = useState(null);
    const [videoUri, setVideoUri] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [infoVisible, setInfoVisible] = useState(false);
    const navigation = useNavigation();

    if (item.type === "date") {
        return (
            <View style={styles.dateLabelWrap}>
                <Text style={styles.dateLabelText}>
                    <ChatFormatDay dateString={item.day} />
                </Text>
            </View>
        );
    }

    const numericMyId = typeof myId === "string" ? Number(myId) : myId;
    const isOutgoing =
        item.from_id === myId ||
        item.from_id === numericMyId ||
        item._sending === true;

    const sharedMessage = item.message ? item.message.split(/<br\s*\/?>/i)[0].trim() : "";
    if (item.feed_id) {
        return (
            <View style={[styles.msgRow, isOutgoing ? styles.rowRight : styles.rowLeft]}>
                <View
                    style={[
                        styles.bubble,
                        isOutgoing ? styles.bubbleOut : styles.bubbleIn,
                    ]}
                >
                    {sharedMessage ? (
                        <Text style={[styles.bubbleText, isOutgoing && styles.bubbleTextOut]}>
                            {sharedMessage}
                        </Text>
                    ) : null}
                    <TouchableOpacity
                        style={[
                            styles.feedCard,
                            isOutgoing ? styles.feedCardSent : styles.feedCardReceived,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("FeedDetailPage", { feedId: item.feed_id })}
                    >
                        <View style={styles.feedCardIcon}>
                            <Ionicons name="newspaper-outline" size={20} color="#C96B59" />
                        </View>
                        <View style={styles.feedCardBody}>
                            <Text style={styles.feedCardAction}>
                                Tap to view
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.timeContainer, isOutgoing ? styles.msgTimeRight : styles.msgTimeLeft]}>
                    <Text style={styles.msgTime}>
                        {moment(item.created_at).format("hh:mm A")}
                    </Text>
                    {isOutgoing && (
                        <MaterialIcons
                            name={item.status === 1 ? "done-all" : "check"}
                            size={14}
                            color={item.status === 1 ? "#5B8DEF" : "#B0B0B0"}
                            style={{ marginLeft: 4 }}
                        />
                    )}
                </View>

            </View>
        );
    }

    const isFile = item.message_type !== 0 && item.message_type !== undefined;

    const handleMenuSelect = (key) => {
        if (key === "delete") onDelete?.(item);
        if (key === "delete-everyone") onDeleteFromEveryone?.(item);
        if (key === "reply") onReply?.(item);
        if (key === "info") setInfoVisible(true);
    };

    return (
        <>
            <View style={[styles.msgRow, isOutgoing ? styles.rowRight : styles.rowLeft]}>
                <View style={[
                    styles.bubble,
                    isOutgoing ? styles.bubbleOut : styles.bubbleIn,
                    item._sending && styles.bubbleSending,
                    item._failed && styles.bubbleFailed,
                    isFile && (isImageType(item.message_type) || isVideoType(item.message_type))
                    && styles.bubbleMedia,
                    isFile && !isImageType(item.message_type) && !isVideoType(item.message_type)
                    && styles.bubbleDoc,
                ]}>
                    {isFile ? (
                        <View>
                            <ReplyQuote
                                replyMessage={item.reply_message}
                                isOutgoing={isOutgoing}
                                myId={myId}
                                otherUserName={otherUserName}
                            />
                            <FileBubble
                                item={item}
                                isOutgoing={isOutgoing}
                                onImagePress={(uri) => setPreviewUri(uri)}
                                onVideoPlay={(uri) => setVideoUri(uri)}
                                onMenu={() => setMenuOpen(true)}
                            />
                        </View>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onLongPress={() => setMenuOpen(true)}
                            delayLongPress={250}
                        >
                            <ReplyQuote
                                replyMessage={item.reply_message}
                                isOutgoing={isOutgoing}
                                myId={myId}
                                otherUserName={otherUserName}
                            />
                            <Text style={[styles.bubbleText, isOutgoing && styles.bubbleTextOut]}>
                                {item.message}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View
                    style={[
                        styles.timeContainer,
                        isOutgoing ? styles.msgTimeRight : styles.msgTimeLeft,
                    ]}
                >
                    <Text style={styles.msgTime}>
                        {moment(item.created_at).format("hh:mm A")}
                    </Text>

                    {isOutgoing && (
                        <>
                            {item._failed ? (
                                <Text style={styles.tick}>✕</Text>
                            ) : item._sending ? (
                                <Text style={styles.tick}>·</Text>
                            ) : (
                                <MaterialIcons
                                    name={item.status === 1 ? "done-all" : "check"}
                                    size={14}
                                    color={item.status === 1 ? "#5B8DEF" : "#B0B0B0"}
                                    style={{ marginLeft: 4 }}
                                />
                            )}
                        </>
                    )}
                </View>
            </View>

            <ImageViewing
                images={previewUri ? [{ uri: previewUri }] : []}
                imageIndex={0}
                visible={!!previewUri}
                onRequestClose={() => setPreviewUri(null)}
                swipeToCloseEnabled
                doubleTapToZoomEnabled
            />

            <VideoPlayerModal uri={videoUri} onClose={() => setVideoUri(null)} />

            <MessageMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
                onSelect={handleMenuSelect}
                isOutgoing={isOutgoing}
            />

            <MessageInfoModal
                visible={infoVisible}
                item={item}
                onClose={() => setInfoVisible(false)}
            />
        </>
    );
},
    (prev, next) =>
        prev.item.id === next.item.id &&
        prev.item.status === next.item.status &&
        prev.item._sending === next.item._sending &&
        prev.item._failed === next.item._failed &&
        prev.item.message === next.item.message &&
        prev.myId === next.myId
);

export default ChatMessageItem;

const styles = StyleSheet.create({
    dateLabelWrap: {
        alignItems: "center",
        marginVertical: 10,
    },
    dateLabelText: {
        color: "#aaa",
        fontSize: 12,
        fontFamily: "Montserrat_500Medium",
        backgroundColor: "rgba(255,255,255,0.08)",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
        overflow: "hidden",
    },
    msgRow: {
        marginVertical: 2,
        maxWidth: "80%",
    },
    rowRight: {
        alignSelf: "flex-end",
        alignItems: "flex-end",
    },
    rowLeft: {
        alignSelf: "flex-start",
        alignItems: "flex-start",
    },
    bubble: {
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 8,
        maxWidth: "100%",
    },
    bubbleOut: {
        backgroundColor: "#e87b7b",
        borderBottomRightRadius: 4,
    },
    bubbleIn: {
        backgroundColor: "#333",
        borderBottomLeftRadius: 4,
    },
    bubbleSending: {
        opacity: 0.6,
    },
    bubbleFailed: {
        opacity: 0.7,
        borderWidth: 1,
        borderColor: "#ff5252",
    },
    bubbleMedia: {
        padding: 6,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    bubbleDoc: {
        backgroundColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    bubbleText: {
        color: "#eee",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        lineHeight: 19,
    },
    bubbleTextOut: {
        color: "#fff",
    },

    mediaBubble: {
        width: 220,
        height: 220,
        borderRadius: 10,
        overflow: "hidden",
    },
    mediaImage: {
        width: "100%",
        height: "100%",
    },
    mediaFallback: {
        width: "100%",
        height: "100%",
        backgroundColor: "#1a1a1a",
        alignItems: "center",
        justifyContent: "center",
    },
    mediaOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    playBtn: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "rgba(0,0,0,0.55)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.8)",
    },

    threeDotBtn: {
        position: "absolute",
        top: 6,
        right: 6,
        width: 26,
        height: 26,
        borderRadius: 6,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },

    videoModalBg: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
    videoModalClose: {
        position: "absolute",
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 8,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 20,
    },
    videoPlayer: {
        width: "100%",
        height: 300,
    },

    docBubble: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minWidth: 230,
    },
    docIcon: {
        width: 44,
        height: 44,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    docInfo: {
        flex: 1,
    },
    docName: {
        color: "#fff",
        fontSize: 13.5,
        fontFamily: "Montserrat_500Medium",
        lineHeight: 18,
    },
    docSubtitle: {
        color: "rgba(255,255,255,0.55)",
        fontSize: 11.5,
        marginTop: 3,
        fontFamily: "Montserrat_500Medium",
    },
    docMenuBtn: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: "rgba(255,255,255,0.08)",
        alignItems: "center",
        justifyContent: "center",
    },
    docActionsRow: {
        flexDirection: "row",
        gap: 6,
    },

    menuBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-end",
    },
    menuCard: {
        backgroundColor: "#2e2e2e",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 13,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.08)",
    },
    menuItemText: {
        fontSize: 16,
        fontFamily: "Montserrat_500Medium",
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    msgTime: {
        fontSize: 11,
        color: "#888",
        marginTop: 2,
        fontFamily: "Montserrat_500Medium",
    },
    msgTimeRight: {
        alignSelf: "flex-end",
    },
    msgTimeLeft: {
        alignSelf: "flex-start",
    },
    tick: {
        marginLeft: 4,
        color: "#bbb",
    },
    feedCard: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#C96B5940",
        borderRadius: 10,
        padding: 6,
        backgroundColor: "#FFF6F4",
    },
    feedCardSent: {
        alignSelf: "flex-end",
    },
    feedCardReceived: {
        alignSelf: "flex-start",
    },
    feedCardIcon: {
        width: 35,
        height: 35,
        borderRadius: 30,
        backgroundColor: "#fde8e4",
        alignItems: "center",
        justifyContent: "center",
    },
    feedCardBody: {
        flex: 1,
    },
    feedCardLabel: {
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
        color: "#303030",
    },
    feedCardAction: {
        flexDirection: "row",
        alignItems: "center",
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
        color: "#C96B59",
        marginTop: 2,
    },
});