import React from "react";
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
import { useNavigation } from "@react-navigation/native";

const CreateFeedPost = () => {
  const navigation = useNavigation();
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar
            title="Create Feed / Post"
            navigation={navigation}
          />
          <View style={styles.headerRow}>
            <Text style={styles.name}>Nik</Text>
            <Text style={styles.role}>Designer & Developer</Text>
          </View>
          <View style={styles.textinput}>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
              underlineColorAndroid="transparent"
              textAlignVertical="top"
              placeholderTextColor="#fff"
            />
          </View>
          <Text style={styles.add}>Add</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}>
              <Image
                source={require("../../assets/images/img.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
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
          <GradientButton title="Add to your post" marginTop={20} />
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
