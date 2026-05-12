import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const MAX_FILES = 10;
const IMAGE_MIMES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const isImage = (mime) => IMAGE_MIMES.includes(mime);
const isPdf = (mime) => mime === "application/pdf";
const isDoc = (mime) =>
    mime === "application/msword" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const FileThumb = ({ file, onRemove }) => {
    const mime = file.fileType || "";
    const ext = file.fileName?.split(".").pop()?.toLowerCase() || "";

    const renderContent = () => {
        if (isImage(mime) && file.fileUri) {
            return (
                <Image source={{ uri: file.fileUri }} style={s.thumbImage} resizeMode="cover" />
            );
        }

        if (isPdf(mime)) {
            return (
                <View style={s.thumbCard}>
                    <FontAwesome6 name="file-pdf" size={38} color="#E8251A" solid />
                    <Text style={[s.extLabel, { color: "#E8251A" }]}>.pdf</Text>
                </View>
            );
        }

        if (isDoc(mime)) {
            return (
                <View style={s.thumbCard}>
                    <Ionicons name="document-text" size={40} color="#185ABD" />
                    <Text style={[s.extLabel, { color: "#185ABD" }]}>.{ext}</Text>
                </View>
            );
        }

        return (
            <View style={s.thumbCard}>
                <MaterialIcons name="insert-drive-file" size={38} color="#888" />
                <Text style={[s.extLabel, { color: "#888" }]}>.{ext}</Text>
            </View>
        );
    };

    const displayName =
        file.fileName.length > 12 ? file.fileName.substring(0, 10) + "…" : file.fileName;

    return (
        <View style={s.thumbWrapper}>
            <View style={s.thumb}>{renderContent()}</View>

            {onRemove && (
                <TouchableOpacity style={s.removeBtn} onPress={() => onRemove(file.id)} hitSlop={8}>
                    <MaterialIcons name="close" size={11} color="#fff" />
                </TouchableOpacity>
            )}

            <Text style={s.thumbName} numberOfLines={1}>{displayName}</Text>
        </View>
    );
};

const JobAttachmentPreview = ({ files = [], onRemove, showCount = true }) => {
    if (!files.length) return null;

    return (
        <View style={s.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.scroll}
            >
                {files.map((file) => (
                    <FileThumb key={file.id} file={file} onRemove={onRemove} />
                ))}
            </ScrollView>

            {showCount && (
                <Text style={s.counter}>{files.length}/{MAX_FILES} files</Text>
            )}
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    scroll: {
        paddingHorizontal: 2,
        paddingVertical: 6,
        gap: 10,
        flexDirection: "row",
    },
    thumbWrapper: {
        width: 110,
        alignItems: "center",
        position: "relative",
    },
    thumb: {
        width: 110,
        height: 110,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#F2F2F2",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    thumbImage: {
        width: "100%",
        height: "100%",
    },
    thumbCard: {
        width: "100%",
        height: "100%",
        backgroundColor: "#F2F2F2",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
    extLabel: {
        fontSize: 11,
        fontFamily: "Montserrat_500Medium",
        letterSpacing: 0.3,
    },
    removeBtn: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "rgba(0,0,0,0.65)",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    thumbName: {
        marginTop: 5,
        fontSize: 11,
        color: "#c3c3c3",
        fontFamily: "Montserrat_400Regular",
        textAlign: "center",
        maxWidth: 100,
    },

    counter: {
        marginTop: 6,
        fontSize: 11,
        color: "#EBBE56",
        fontFamily: "Montserrat_400Regular",
        textAlign: "right",
        paddingRight: 2,
    },
});

export default JobAttachmentPreview;