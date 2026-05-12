import * as DocumentPicker from "expo-document-picker";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useCreateJobGlobalStore } from "../../components/useCreateJobGlobalStore";
import JobAttachmentPreview from "./JobAttachmentPreview";
import { toastError, toastSuccess } from '../../utils/toast';

const MAX_FILES = 10;
const MAX_IMAGE_SIZE_MB = 3;
const MAX_DOC_SIZE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_DOC_BYTES = MAX_DOC_SIZE_MB * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx"];
const IMAGE_MIMES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const isImage = (mime) => IMAGE_MIMES.includes(mime);

const validateFile = (file) => {
  const mime = file.mimeType || "";
  const ext = (file.name || "").split(".").pop()?.toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(mime) && !ALLOWED_EXTENSIONS.includes(ext)) {
    return `"${file.name}" format is not supported.`;
  }
  if (isImage(mime)) {
    if (file.size > MAX_IMAGE_BYTES)
      return `"${file.name}" exceeds the ${MAX_IMAGE_SIZE_MB} MB limit for images.`;
  } else {
    if (file.size > MAX_DOC_BYTES)
      return `"${file.name}" exceeds the ${MAX_DOC_SIZE_MB} MB limit for documents.`;
  }
  return null;
};

const FileUpload = () => {
  const { filesData, setField } = useCreateJobGlobalStore();
  const pickDocuments = async () => {
    if (filesData.length >= MAX_FILES) {
      toastError(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ALLOWED_MIME_TYPES,
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const picked = res.assets || [];
      const errors = [];
      const valid = [];

      for (const asset of picked) {
        const err = validateFile({ name: asset.name, mimeType: asset.mimeType, size: asset.size });
        if (err) {
          errors.push(err);
        } else {
          valid.push({
            id: `${Date.now()}-${Math.random()}`,
            fileName: asset.name,
            fileUri: asset.uri,
            fileType: asset.mimeType,
            fileSize: asset.size,
          });
        }
      }

      if (errors.length) {
        toastError(errors.join("\n"));
      }

      if (valid.length) {
        const merged = [...filesData, ...valid].slice(0, MAX_FILES);
        setField("filesData", merged);
      }
    } catch (e) {
      console.error("DocumentPicker error:", e);
    }
  };

  const removeFile = (id) => {
    setField("filesData", filesData.filter((f) => f.id !== id));
  };

  return (
    <View style={styles.upload}>
      <TouchableOpacity style={styles.fileinput} onPress={pickDocuments}>
        <View style={styles.innerContent}>
          <MaterialIcons name="insert-drive-file" size={32} color="#Ebbe56" />
          <Text style={styles.addText}>Add Attachment</Text>
        </View>
        <Text style={styles.optionalText}>Optional</Text>
      </TouchableOpacity>

      <JobAttachmentPreview files={filesData} onRemove={removeFile} />

      <View style={styles.notesContainer}>
        <Text style={styles.note}>• The maximum file size is 30 MB.</Text>
        <Text style={styles.note}>
          • The accepted formats are jpg, jpeg, doc, docx, pdf, png.
        </Text>
        <Text style={styles.note}>
          • The following formats are not accepted: svg, mp4, mov, and mkv.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fileinput: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#A0A0A0",
    borderRadius: 8,
    height: 120,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff1a",
  },
  innerContent: {
    alignItems: "center",
  },
  addText: {
    marginTop: 8,
    fontFamily: "Montserrat_500Medium",
    color: "#EBBE56",
    fontSize: 16,
    fontWeight: "500",
  },
  optionalText: {
    position: "absolute",
    fontFamily: "Montserrat_400Regular",
    bottom: -23,
    right: 4,
    color: "#c3c3c3",
    fontSize: 13,
  },
  notesContainer: {
    marginTop: 20,
    paddingHorizontal: 5,
  },
  note: {
    fontSize: 12,
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    paddingVertical: 3,
  },
  sectionBtn: {
    flexDirection: "column",
    gap: 15,
    paddingTop: 160,
  },
  button: {
    marginHorizontal: 5,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ebe8e8ff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
});

export default FileUpload;