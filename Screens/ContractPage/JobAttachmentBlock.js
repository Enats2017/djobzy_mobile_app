import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const MAX_FILES = 10;

const FileThumb = ({ file }) => {
    const fileUrl = file?.attachment || "";
    const fileName = fileUrl.split("/").pop()?.split("?")[0] || "";
    const ext = fileName.split(".").pop()?.toLowerCase() || "";

    const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext);
    const isPdf = ext === "pdf";
    const isDoc = ["doc", "docx"].includes(ext);

    const renderContent = () => {
        if (isImage && fileUrl) {
            return (
                <Image source={{ uri: fileUrl }} style={s.thumbImage} resizeMode="cover" />
            );
        }

        if (isPdf) {
            return (
                <View style={s.thumbCard}>
                    <FontAwesome6 name="file-pdf" size={38} color="#E8251A" solid />
                    <Text style={[s.extLabel, { color: "#E8251A" }]}>.pdf</Text>
                </View>
            );
        }

        if (isDoc) {
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

    return (
        <View style={s.thumbWrapper}>
            <View style={s.thumb}>{renderContent()}</View>
        </View>
    );
};

const JobAttachmentBlock = ({ files = [] }) => {
    if (!Array.isArray(files) || !files.length) return null;

    return (
        <View style={s.section}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scroll} >
                {files.map((file) => (
                    <FileThumb key={file.id} file={file} />
                ))}
            </ScrollView>
        </View>
    );
};

const s = StyleSheet.create({
    section: {
        marginTop: 0,
    },
    scroll: {
        paddingHorizontal: 2,
        paddingVertical: 6,
        gap: 10,
        flexDirection: "row",
    },
    thumbWrapper: {
        width: 120,
        alignItems: "center",
        position: "relative",
    },
    thumb: {
        width: 120,
        height: 120,
        borderRadius: 8,
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
});

export default JobAttachmentBlock;