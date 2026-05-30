import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import { toastError, toastSuccess } from "../../utils/toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
    type,
    isEditingFromReview,
    reviewReturnTab,
    clearEditingFromReview,
    isRemoteJob
  } = useCreateJobGlobalStore();

  const route = useRoute();
  const gid = route.params?.gid;
  // console.log("111111", gid);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [hourlyError, setHourlyError] = useState(false);
  const [loading, setLoading] = useState(false);
  const totalSteps = 7;
  const navigation = useNavigation();
  const stepsScrollRef = useRef(null);
  const cleanedRequirements = [
    ...new Set(
      requirements
        .map((r) => r.value?.trim())
        .filter((v) => v)
    )
  ];

  const cleanedLanguages = [
    ...new Map(
      languages
        .filter((l) => l.lang && l.lang.trim() && l.level)
        .map((l) => [
          l.lang.trim().toLowerCase(),
          {
            language: l.lang.trim(),
            level: l.level,
            text: l.text,
          },
        ])
    ).values()
  ];

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
    try {
      setLoading(true);
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
      if (state.isRemoteJob === 1) {
        formData.append("isRemoteJob", "1");
      }
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
        JSON.stringify(cleanedRequirements)
      );

      formData.append(
        "languages",
        JSON.stringify(cleanedLanguages)
      );

      if (state.address) formData.append("address", state.address);

      const newFiles = state.filesData.filter((f) => f.fileUri.startsWith("file"));
      if (newFiles.length > 0) {
        newFiles.forEach((file) => {
          formData.append("file[]", {
            uri:  file.fileUri,
            name: file.fileName,
            type: file.fileType,
          });
        });
      }

      if (gid) {
        formData.append("gigId", gid);
      }
      const url =
        type === "edit"
          ? `${API_URL}/save-edit-job-data`
          : `${API_URL}/save-job-data`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });
      const data = await response.json();
      //console.log("API RESPONSE:", data);

      if (data.status === 200) {
        reset();
        if (type === "edit") {
          toastSuccess("Job updated SuccessFully");
          navigation.replace("PostJobDetails", { jobId: data.insert_slug });
        } else {
          navigation.navigate("JobPublishedPage", { gig: data.gig });
          toastSuccess("Job created SuccessFully");
        }
      } else {
        console.log(data.message);
        toastError(data.message || "Failed to submit job");
      }
    } catch (error) {
      console.log("Error submitting job:", error);
      toastError("Something went wrong while submitting job.");
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
    setAddressError(false);

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
        if (isEditingFromReview) {
          setActiveTab(reviewReturnTab);
          clearEditingFromReview();
          return;
        }
        setActiveTab(1);
        break;

      case 1:
        if (selectedSubs.length === 0) {
          setCategoryError(true);
          return;
        }
        if (isEditingFromReview) {
          setActiveTab(reviewReturnTab);
          clearEditingFromReview();
          return;
        }
        setActiveTab(2);
        break;

      case 2:
        if (!address.trim() && isRemoteJob === 0) {
          setAddressError(true);
          return;
        }
        for (let l of languages) {
          if (l.lang?.trim() && (!l.level || l.level === "")) {
            toastError(`Please select a proficiency level for ${l.lang}`);
            return;
          }
        }
        if (isEditingFromReview) {
          setActiveTab(reviewReturnTab);
          clearEditingFromReview();
          return;
        }
        setActiveTab(3);
        break;

      case 3:
        if (isEditingFromReview) {
          setActiveTab(reviewReturnTab);
          clearEditingFromReview();
          return;
        }
        setActiveTab(4);
        break;

      case 4:
        if (!selectedOption) {
          setTimeError(true);
          return;
        }

        if (
          (selectedOption === "custom" || selectedOption === "customEmp") &&
          (!customDays || customDays.trim() === "" || Number(customDays) <= 0)
        ) {
          setTimeError(true);
          return;
        }

        if (isEditingFromReview) {
          setActiveTab(reviewReturnTab);
          clearEditingFromReview();
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
        if (isEditingFromReview) {
          setActiveTab(reviewReturnTab);
          clearEditingFromReview();
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

  const isLastStep = activeTab === totalSteps - 1;
  useEffect(() => {
    const stepWidth = 100;
    stepsScrollRef.current?.scrollTo({
      x: activeTab * stepWidth,
      animated: true,
    });
  }, [activeTab]);
  const primaryButtonText = isEditingFromReview
    ? "Update"
    : isLastStep
      ? type === "edit"
        ? "Update"
        : "Publish"
      : "Next";

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#222222" }}>
        <View style={styles.container}>
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
              ref={stepsScrollRef}
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
                  // const isActive = index < activeTab;
                  // const isCompleted = index < activeTab;
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
            <KeyboardAwareScrollView
              enableOnAndroid
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
            >
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
              {activeTab === 2 && (
                <AddressSection
                  addressError={addressError}
                  setAddressError={setAddressError}
                />
              )}
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
            </KeyboardAwareScrollView>
          )}
        </View>
        <View style={styles.sectionBtn}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#D17b68" }]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>{primaryButtonText}</Text>
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
    fontStyle: "Montserrat_600SemiBold",
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
