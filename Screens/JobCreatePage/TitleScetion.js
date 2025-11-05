import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const   TitleScetion = ({ jobData, setJobData }) => {
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");

  return (
    <>
      <KeyboardAwareScrollView
        style={{ height: "100%" }}
        extraScrollHeight={10}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.TextSection}>
          <View style={styles.template}>
            <Text style={styles.label}>Title</Text>
            <TouchableOpacity>
              <Text style={styles.templatetext}>Use Template</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={jobData.title}
            onChangeText={(text) => setJobData({ ...jobData, title: text })}
            placeholder="What Should be Done?"
          />
          <Text style={styles.belowtext}>
            Please Make Your title brief and stright to the point
          </Text>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={jobData.description}
            onChangeText={(text) => setJobData({ ...jobData, description: text })}
            placeholder="What Should be Done ?"
          />
          <Text style={styles.belowtext}>Please Describe The Job Details</Text>
            </View>
         
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  TextSection: {
    paddingTop: 5,
  
  },
  sectionBtn: {
      paddingTop:235,
      
    gap: 15,
   
  },
  template: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  templatetext: {
    color: "#ebbe56",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ebbe56",
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 17,
    backgroundColor: "#fff",
  },
  belowtext: {
    color: "#ffff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    paddingVertical: 8,
  },
  button: {
    marginHorizontal: 5,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#f7f3f3ff",
    fontSize: 20,
    fontFamily:"Montserrat_700Bold"
  
  },
});

export default TitleScetion;
