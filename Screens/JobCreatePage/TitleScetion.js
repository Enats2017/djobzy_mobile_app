import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Entypo from "@expo/vector-icons/Entypo";
import { ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const TitleScetion = ({
  jobData,
  setJobData,
  titleError,
  setTitleError,
  descriptionError,
  setDescriptionError,
}) => {
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  const [titleModal, setTitleModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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

            <TouchableOpacity onPress={() => setTitleModal(true)}>
              <Text style={styles.templatetext}>Use Template</Text>
            </TouchableOpacity>
          </View>
          {/* TITLE */}
          <TextInput
            style={[styles.input, titleError && { borderColor: "#ff0000" }]}
            value={jobData.title}
            onChangeText={(text) => {
              setJobData({ ...jobData, title: text });
              if (text.trim().length > 0) setTitleError(false);
            }}
            placeholder="What Should be Done?"
          />

          {titleError && (
            <Text style={styles.errorText}>*Please enter a job title</Text>
          )}

          <Text style={styles.belowtext}>
            Please make your title brief and straight to the point.
          </Text>

          {/* DESCRIPTION */}
          <Text style={styles.label}>Description</Text>

          <TextInput
            style={[
              styles.input,
              descriptionError && { borderColor: "#ff0000" },
            ]}
            value={jobData.description}
            onChangeText={(text) => {
              setJobData({ ...jobData, description: text });
              if (text.trim().length > 0) setDescriptionError(false);
            }}
            placeholder="What Should be Done?"
          />

          {descriptionError && (
            <Text style={styles.errorText}>
              *Please enter a job description
            </Text>
          )}

          <Text style={styles.belowtext}>Please describe the job details.</Text>
        </View>
      </KeyboardAwareScrollView>

      <Modal
        visible={titleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setTitleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Use template to make it easy
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setSelectedTemplate(null);
                  setShowDropdown(false);
                  setTitleModal(false);
                }}
              >
                <Ionicons name="close" size={24} color="#303030" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              You can use any your previously created job post as a template
            </Text>

            <TouchableOpacity
              style={[
                styles.dropdown,
                { marginBottom: 12 },
                selectedTemplate && { borderColor: "#000000" },
              ]}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  selectedTemplate
                    ? { color: "#000000" }
                    : { color: "#666666" },
                ]}
              >
                {selectedTemplate ? selectedTemplate : "Choose Template"}
              </Text>

              <Entypo name="chevron-small-down" size={22} color="#666666" />
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownList}>
                <View style={{ maxHeight: 145 }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {[
                      "Looking for Logo Designer",
                      "Need a Website Developer",
                      "Social Media Manager Needed",
                      "Photoshop Editing Work",
                      "Need Thumbnail Designer",
                    ].map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedTemplate(item);
                          setShowDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            <TouchableOpacity
              disabled={!selectedTemplate}
              style={[
                styles.useTemplateButton,
                !selectedTemplate && { opacity: 0.5 },
              ]}
            >
              <Text style={styles.useTemplateButtonText}>Use a template</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newJobButton}
              onPress={() => {
                setSelectedTemplate(null);
                setShowDropdown(false);
                setTitleModal(false);
              }}
            >
              <Text style={styles.newJobButtonText}>Start a New Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  TextSection: {
    paddingTop: 5,
  },
  sectionBtn: {
    paddingTop: 235,

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
    color: "#ffffff",
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
    fontFamily: "Montserrat_700Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Montserrat_600SemiBold",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: "#303030",
  },
  closeIcon: {
    fontSize: 20,
    color: "#000000",
  },
  modalSubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#303030",
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#00000033",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  dropdownText: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  chevron: {
    fontSize: 16,
    color: "#666",
  },
  useTemplateButton: {
    backgroundColor: "#d17b68",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  useTemplateButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
  newJobButton: {
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  newJobButtonText: {
    color: "#000000",
    fontSize: 20,
    fontFamily: "Montserrat_600SemiBold",
  },

  dropdownList: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    marginBottom: 8,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#444",
    fontFamily: "Montserrat_500Medium",
  },

  errorText: {
    color: "#FF0000",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 2,
  },
});

export default TitleScetion;
