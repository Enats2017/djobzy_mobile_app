import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { Header } from "@react-navigation/stack";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api/ApiUrl";
import * as ImagePicker from "expo-image-picker";

const CreateFeedPost = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const { name } = route.params || {};
  console.log(name);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage({
        uri: result.assets[0].uri,
        name: "image.jpg",
        type: "image/jpeg",
      });
      setVideo(null);
    }
  };
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      setVideo({
        uri: result.assets[0].uri,
        name: "video.mp4",
        type: "video/mp4",
      });
      setImage(null);
    }
  };

  const submitPost = async () => {
    if (!message.trim() && !image && !video) {
      alert("Please write something or add media");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      let url = "";
      let body;
      let headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      if (message && !image && !video) {
        url = `${API_URL}/feed-message`;
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({ message, name });
      } else if (image) {
        url = `${API_URL}/feed-image`;
        body = new FormData();
        body.append("name", name);
        body.append("message", message);
        body.append("image_file", image);
      } else if (video) {
        url = `${API_URL}/feed-video`;
        body = JSON.stringify({
          name,
          message,
          file_url:video,
          s3_key: s3Key,
        });
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      const data = await res.json();

      if (data.status === 200) {
        alert("Post created successfully");
        navigation.goBack();
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.log("Create feed error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar
            title="Create Feed / Post"
            navigation={navigation}
          />
          <View style={styles.headerRow}>
            <Text style={styles.name}>{name}</Text>
          </View>
          <View style={styles.textinput}>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
              underlineColorAndroid="transparent"
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
              placeholderTextColor="#fff"
            />
          </View>
          <Text style={styles.add}>Add</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Image
                source={require("../../assets/images/img.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickVideo}>
              <Image
                source={require("../../assets/images/vedio.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image
                source={require("../../assets/images/ai.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Generate AI {"\n"} Video</Text>
            </TouchableOpacity>
          </View>
          <GradientButton
            title="Add to your post"
            marginTop={20}
            onPress={submitPost}
          />
        </View>
        <Footer />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
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
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#c3c3c3c3",
  },
});

export default CreateFeedPost;
