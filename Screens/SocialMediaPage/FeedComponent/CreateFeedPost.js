import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import GradientButton from "../../../components/GradientButton";
import Footer from "../../../components/Footer";
import PageNameHeaderBar from "../../../components/PageNameHeaderBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../api/ApiUrl";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { toastError, toastSuccess } from "../../../utils/toast";
import { feedEvents } from "../FeedEvent/feedEvents";
import useMentionHashtag from "../FeedEvent/useMentionHashtag";
import FilterSuggestionList from "./FilterSuggestionList";
import CustomSwitch from "../../../components/CustomSwitch";

const IMAGE_MAX_BYTES = 3 * 1024 * 1024;
const VIDEO_MAX_BYTES = 20 * 1024 * 1024;
const BLOCKED_EXTENSIONS = ["svg"];

function getExtension(uri = "") {
  return uri.split(".").pop().toLowerCase().split("?")[0];
}

function isSvg(uri = "", mimeType = "") {
  return (
    getExtension(uri) === "svg" ||
    mimeType?.includes("svg")
  );
}

const CreateFeedPost = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, estimate_reach_count } = route.params || {};
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoThumb, setVideoThumb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOnProfile, setShowOnProfile] = useState(true);
  const { suggestions, suggestionType, loading: suggestionsLoading, onChangeText: onMentionChange, onSelectionChange, insertSuggestion, } = useMentionHashtag();

  const hasMedia = !!image || !!video;

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (result.canceled) return;
    const asset = result.assets[0];
    if (isSvg(asset.uri, asset.mimeType)) {
      toastError("SVG files are not supported. Please choose a different image.");
      return;
    }

    if (asset.fileSize && asset.fileSize > IMAGE_MAX_BYTES) {
      toastError("Image must be under 3 MB. Please choose a smaller file.");
      return;
    }

    setImage({
      uri: asset.uri,
      name: asset.fileName || "image.jpg",
      type: asset.mimeType || "image/jpeg",
      size: asset.fileSize,
    });
    setVideo(null);
    setVideoThumb(null);
  }, []);

  const pickVideo = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (result.canceled) return;
    const asset = result.assets[0];
    const ext = getExtension(asset.uri);
    if (BLOCKED_EXTENSIONS.includes(ext)) {
      toastError("This file type is not supported.");
      return;
    }

    if (asset.fileSize && asset.fileSize > VIDEO_MAX_BYTES) {
      toastError("Video must be under 20 MB. Please choose a smaller file.");
      return;
    }

    setVideo({
      uri: asset.uri,
      name: asset.fileName || "video.mp4",
      type: asset.mimeType || "video/mp4",
      size: asset.fileSize,
    });
    setImage(null);

    // Generate thumbnail for preview
    try {
      const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
        time: 1000,
        quality: 0.5,
      });
      setVideoThumb(thumbUri);
    } catch {
      setVideoThumb(null); // fallback to play icon
    }
  }, []);

  const clearMedia = useCallback(() => {
    setImage(null);
    setVideo(null);
    setVideoThumb(null);
  }, []);

  const submitPost = useCallback(async () => {
    if (!message.trim() && !image && !video) {
      toastError("Please write something or add media.");
      return;
    }

    // Caption required when media is attached
    if (hasMedia && !message.trim()) {
      toastError("Please add a caption for your media.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const baseHeaders = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      let res;
      if (image) {
        const form = new FormData();
        form.append("message", message);
        form.append("estimate_reach_count", estimate_reach_count ?? 0);
        form.append("image_file", {
          uri: image.uri,
          name: image.name,
          type: image.type,
        });
        body.append("show_on_profile", showOnProfile ? 1 : 0);

        res = await fetch(`${API_URL}/save-feed-image`, {
          method: "POST",
          headers: baseHeaders,
          body: form,
        });
      } else if (video) {
        // Step 1: get presigned URL from backend
        const presignRes = await fetch(`${API_URL}/wasabi/presigned-url`, {
          method: "POST",
          headers: { ...baseHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: video.name,
            content_type: video.type,
            filesize: video.size ?? 0,
          }),
        });
        const presignData = await presignRes.json();
        if (!presignData.upload_url) {
          toastError("Could not prepare video upload. Please try again.");
          return;
        }

        // Step 2: upload directly to Wasabi via presigned URL
        const videoBlob = await fetch(video.uri).then((r) => r.blob());
        await fetch(presignData.upload_url, {
          method: "PUT",
          headers: { "Content-Type": video.type },
          body: videoBlob,
        });
        // Step 3: save feed entry
        res = await fetch(`${API_URL}/save-feed-video`, {
          method: "POST",
          headers: { ...baseHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            file_url: presignData.public_url,
            s3_key: presignData.s3_key,
            estimate_reach_count: estimate_reach_count ?? 0,
            show_on_profile: showOnProfile ? 1 : 0,
          }),
        });
      } else {
        res = await fetch(`${API_URL}/save-feed-message`, {
          method: "POST",
          headers: { ...baseHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            name,
            estimate_reach_count: estimate_reach_count ?? 0,
            show_on_profile: showOnProfile ? 1 : 0,
          }),
        });
      }

      const data = await res.json();
      if (data.status === 200) {
        toastSuccess(data.message || "Your post is live.");
        feedEvents.emit("feedCreated", data.feed);
        navigation.goBack();
      } else {
        toastError(data.message || "Something went wrong.");
      }
    } catch (e) {
      console.log("Create feed error:", e);
      toastError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [message, image, video, name, estimate_reach_count, hasMedia]);

  const canSubmit = !loading && (!!message.trim() || hasMedia);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar title="Create Feed / Post" navigation={navigation} />

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Text style={styles.name}>{name}</Text>
          </View>

          <View style={styles.textinput}>
            <TextInput
              style={styles.input}
              multiline
              placeholder={
                hasMedia
                  ? "Add a caption (required)..."
                  : "Share your thoughts..."
              }
              underlineColorAndroid="transparent"
              value={message}
              onChangeText={(text) => onMentionChange(text, setMessage)}
              onSelectionChange={onSelectionChange}
              textAlignVertical="top"
              placeholderTextColor="#c3c3c3"
            />
          </View>
          <FilterSuggestionList
            suggestions={suggestions}
            type={suggestionType}
            loading={suggestionsLoading}
            onSelect={(item) => insertSuggestion(item, setMessage)}
          />

          {(image || video) && (
            <View style={styles.previewWrap}>
              {image && (
                <Image
                  source={{ uri: image.uri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              )}

              {video && (
                videoThumb ? (
                  <View style={styles.videoPreviewWrap}>
                    <Image
                      source={{ uri: videoThumb }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                    <View style={styles.playOverlay}>
                      <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.9)" />
                    </View>
                  </View>
                ) : (
                  // Fallback if thumbnail generation failed
                  <View style={styles.videoFallback}>
                    <Ionicons name="videocam" size={36} color="#c3c3c3" />
                    <Text style={styles.videoFallbackText}>Video selected</Text>
                  </View>
                )
              )}

              {/* Clear button */}
              <TouchableOpacity style={styles.clearBtn} onPress={clearMedia}>
                <Ionicons name="close-circle" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Add media row */}
          <Text style={styles.add}>Add</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Image
                source={require("../../../assets/images/img.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={pickVideo}>
              <Image
                source={require("../../../assets/images/vedio.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Image
                source={require("../../../assets/images/ai.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Generate AI {"\n"} Video</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.profileToggleLeft}>
              <CustomSwitch
                value={showOnProfile}
                onChange={setShowOnProfile}
                size={22}
              />

              <Text style={styles.profileToggleText}>
                Show on my public profile
              </Text>
            </View>

            {!!estimate_reach_count && (
              <Text style={styles.estimateText}>
                Expected Reach{" "}
                <Text style={styles.estimateCount}>
                  {estimate_reach_count}
                </Text>
              </Text>
            )}
          </View>

          <GradientButton
            title={loading ? "Publishing..." : "Add to your post"}
            marginTop={20}
            onPress={submitPost}
            disabled={!canSubmit}
          />
        </ScrollView>
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  scroll: {
    paddingBottom: 80,
  },
  headerRow: {
    paddingTop: 15,
  },
  name: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Montserrat_500Medium",
  },
  role: {
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  textinput: {
    paddingTop: 20,
    paddingBottom: 18,
  },
  input: {
    borderColor: "#ffffff",
    borderWidth: 1,
    height: 180,
    padding: 10,
    borderRadius: 10,
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
  },

  previewWrap: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: "#1c1c22",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  videoPreviewWrap: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  videoFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  videoFallbackText: {
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  clearBtn: {
    position: "absolute",
    top: 5,
    right: 5,
  },

  add: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#ffffff",
  },
  logo: {
    height: 21,
    width: 21,
    marginRight: 7,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#c3c3c3c3",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  profileToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 5,
  },
  profileToggleText: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#c3c3c3",
    flexShrink: 1,
    lineHeight: 19,
  },
  estimateText: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#c3c3c3",
  },
  estimateCount: {
    color: "#cc6952",
    fontFamily: "Montserrat_600SemiBold",
  },
});

export default CreateFeedPost;
