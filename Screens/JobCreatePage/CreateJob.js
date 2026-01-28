import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { API_URL } from "../../api/ApiUrl";
import TitleSection from "./TitleScetion";
import Category from "./JobCategory";
import AddressSection from "./AddressSection";
import FileUpload from "./FileUpload";
import TimePeriod from "./TimePeriod";
import SetPrice from "./SetPrice";
import ReviewPage from "./ReviewPage";
import Footer from "../../components/Footer";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../../components/Loading";
import EmployerFooter from "../../components/EmployerFooter";
import { useCreateJobGlobalStore } from "../../components/useCreateJobGlobalStore";
import { toastSuccess } from "../../utils/toast";

const CreateJob = () => {
  const {
    title,
    description,
    selectedSubs,
    requirements,
    languages,
    address,
    fileData,
    selectedTerm,
    selectedOption,
    customDays,
    hourlyRate,
    totalPrice,
    expectedTime,
    processingFee,
    reset,
    isEdit,
    activeTab,
    setActiveTab,
  } = useCreateJobGlobalStore();

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const [timeError, setTimeError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [hourlyError, setHourlyError] = useState(false);
  const [loading, setLoading] = useState(false);
  const totalSteps = 7;
  const navigation = useNavigation();

  const handleBack = () => {
    setPriceError(false);
    setHourlyError(false);
    setTimeError(false);
    setCategoryError(false);
    setTitleError(false);
    setDescriptionError(false);

    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    } else {
      navigation.goBack();
    }
  };

  const getContractType = (selectedTerm) => {
    if (selectedTerm === "short") return 1;
    if (selectedTerm === "employee") return 2;
    return 0;
  };

  const getDurationPayload = (state) => {
    const { selectedOption, customDays } = state;

    switch (selectedOption) {
      case "1":
        return { type: 1, days: 0 };

      case "1-7":
        return { type: 2, days: 0 };

      case "custom":
        return { type: 3, days: Number(customDays) || 0 };

      case "10-30":
        return { type: 4, days: 0 };

      case "30+":
        return { type: 5, days: 0 };

      case "customEmp":
        return { type: 6, days: Number(customDays) || 0 };

      default:
        return { type: 0, days: 0 };
    }
  };

  const submitJob = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const state = useCreateJobGlobalStore.getState();
      const duration = getDurationPayload(state);
      const contractType = getContractType(state.selectedTerm);
      const formData = new FormData();
      formData.append("title", state.title);
      formData.append("description", state.description);
      formData.append("contractType", contractType);
      formData.append("durationType", duration.type);
      formData.append("durationCustom", duration.days);
      formData.append("budgetType", "fixed");
      formData.append("fixedFrom", state.totalPrice);
      formData.append("hourlyFrom", state.hourlyRate);
      formData.append("expected", state.expectedTime || "0");
      formData.append(
        "subservices",
        JSON.stringify(
          state.selectedSubs.map((s) => ({
            service: s.serviceId,
            id: s.subId,
            name: s.name,
          })),
        ),
      );

      formData.append(
        "requirements",
        JSON.stringify(state.requirements.map((r) => r.value)),
      );

      formData.append(
        "languages",
        JSON.stringify(
          state.languages.map((l) => ({
            language: l.lang,
            level: l.level || 2,
          })),
        ),
      );

      if (state.address) formData.append("address", state.address);

      if (state.fileData?.fileUri) {
        formData.append("file[]", {
          uri: state.fileData.fileUri,
          name: state.fileData.fileName,
          type: state.fileData.fileType,
        });
      }
      const response = await fetch(`${API_URL}/save-job-data`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });
      const data = await response.json();
      if (data.status === 200) {
        reset();
        navigation.navigate("JobPublishedPage", { gig: data.gig });
        toastSuccess("Job created SuccessFully");
      } else {
        console.log(data.message);
        Alert.alert("Error", data.message || "Failed to submit job");
      }
    } catch (error) {
      console.log("Error submitting job:", error);
      Alert.alert("Error", "Something went wrong while submitting job.");
    } finally {
      setLoading(false);
    }
  };
  const handleNext = () => {
    setTitleError(false);
    setDescriptionError(false);
    setCategoryError(false);
    setTimeError(false);
    setPriceError(false);
    setHourlyError(false);

    switch (activeTab) {
      case 0:
        if (!title.trim()) {
          setTitleError(true);
          return;
        }
        if (!description.trim()) {
          setDescriptionError(true);
          return;
        }
        setActiveTab(1);
        break;

      case 1:
        if (selectedSubs.length === 0) {
          setCategoryError(true);
          return;
        }
        setActiveTab(2);
        break;

      case 2:
        setActiveTab(3);
        break;

      case 3:
        setActiveTab(4);
        break;

      case 4:
        if (!selectedOption) {
          setTimeError(true);
          return;
        }
        setActiveTab(5);
        break;

      case 5:
        if (!totalPrice.trim()) {
          setPriceError(true);
          return;
        }
        if (!hourlyRate.trim()) {
          setHourlyError(true);
          return;
        }
        setActiveTab(6);
        break;

      case 6:
        let hasError = false;

        if (!totalPrice || totalPrice.trim() === "") {
          setPriceError(true);
          hasError = true;
        }

        if (!hourlyRate || hourlyRate.trim() === "") {
          setHourlyError(true);
          hasError = true;
        }

        if (hasError) return;

        submitJob();
        break;
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#222222" }}>
        <View style={styles.container}>
          {/* Back Button and Title */}
          <View style={styles.dashboardHeader}>
            <TouchableOpacity onPress={handleBack}>
              <Ionicons
                name="chevron-back"
                size={30}
                color="#fff"
                style={styles.arrow}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Post a Job</Text>
          </View>
          <View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.stepsRow}>
                {[
                  "Description",
                  "Categories",
                  "Details",
                  "Attachments",
                  "Duration",
                  "Budget",
                  "Review & Publish",
                ].map((label, index, array) => {
                  const isActive = index === activeTab;
                  const isCompleted = index < activeTab;

                  return (
                    <View
                      key={index}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {/* Step Circle + Label */}

                      <View style={styles.step}>
                        <View
                          style={[
                            styles.circle,
                            isActive
                              ? styles.activeCircle
                              : isCompleted
                                ? styles.completedCircle
                                : styles.inactiveCircle,
                          ]}
                        />
                        <Text
                          style={[
                            styles.stepText,
                            isActive
                              ? styles.activeText
                              : isCompleted
                                ? styles.completedText
                                : styles.inactiveText,
                          ]}
                        >
                          {label}
                        </Text>
                      </View>

                      {/* Line Between Steps */}
                      {index < array.length - 1 && (
                        <Animated.View
                          style={[
                            styles.line,
                            isCompleted && styles.activeLine,
                            isActive && { backgroundColor: "#F9B233" },
                          ]}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#FFFFFF",
              width: "100%",
              marginTop: 30,
              marginBottom: 10,
              opacity: 0.5,
            }}
          />
          {loading ? (
            <Loading />
          ) : (
            <View style={styles.contentContainer}>
              {activeTab === 0 && (
                <TitleSection
                  titleError={titleError}
                  setTitleError={setTitleError}
                  descriptionError={descriptionError}
                  setDescriptionError={setDescriptionError}
                />
              )}

              {activeTab === 1 && (
                <Category
                  categoryError={categoryError}
                  setCategoryError={setCategoryError}
                />
              )}
              {activeTab === 2 && <AddressSection />}
              {activeTab === 3 && <FileUpload />}
              {activeTab === 4 && (
                <TimePeriod timeError={timeError} setTimeError={setTimeError} />
              )}

              {activeTab === 5 && (
                <SetPrice
                  priceError={priceError}
                  setPriceError={setPriceError}
                  hourlyError={hourlyError}
                  setHourlyError={setHourlyError}
                />
              )}

              {activeTab === 6 && <ReviewPage setActiveTab={setActiveTab} />}
            </View>
          )}
        </View>
        <View style={styles.sectionBtn}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#D17b68" }]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              {" "}
              {activeTab === totalSteps - 1 ? "Publish" : "Next"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { borderColor: "#ccc", borderWidth: 1 }]}
            onPress={handleBack}
          >
            <Text style={styles.buttonText}>
              {" "}
              {activeTab === 0 ? "Cancel the Job Post " : "Back"}
            </Text>
          </TouchableOpacity>
        </View>

        <EmployerFooter />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  dashboardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 20,
    gap: 10,
  },
  arrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#313131",
    width: 40,
    height: 40,
    borderRadius: 100,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    fontStyle: "DegularDisplay_600SemiBold", // ensure this font is available in your project
    color: "#ffffff",
  },
  container: {
    paddingHorizontal: 15,
    flex: 1,
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  step: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 100,
    marginBottom: 5,
  },
  activeCircle: {
    backgroundColor: "#F9B233",
  },
  inactiveCircle: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#c3c3c3",
    borderRadius: 100,
  },
  completedCircle: {
    backgroundColor: "#F9B233",
    width: 15,
    height: 15,
    borderRadius: 100,
    marginBottom: 5,
  },
  stepText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  activeText: {
    color: "#F9B233",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
  },
  inactiveText: {
    color: "#999999",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
  },
  completedText: {
    color: "#F9B233",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
  },
  line: {
    width: 40,
    height: 1,
    marginBottom: 20,
    backgroundColor: "#999999",
  },
  activeLine: {
    backgroundColor: "#F9B233",
  },
  dashedLine: {
    width: 40,
    height: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#999999",
  },
  sectionBtn: {
    flexDirection: "column",
    gap: 15,
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 95,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#f7f3f3ff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
});

export default CreateJob;
