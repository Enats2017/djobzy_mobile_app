import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
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

const CreateJob = () => {
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const [timeError, setTimeError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [hourlyError, setHourlyError] = useState(false);

  const totalSteps = 7;
  const navigation = useNavigation();
  const [jobData, setJobData] = useState({ title: "", description: "" });
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [contractData, setContractData] = useState({
    requirements: [{ id: 1, value: "" }],
    languages: [{ id: 1, lang: "", level: "" }],
    address: "",
  });
  const [fileData, setFileData] = useState({ fileName: null, fileUri: null });
  const [durationData, setDurationData] = useState({
    selectedTerm: "short",
    selectedOption: "",
    customDays: "",
  });

  const [budgetData, setBudgetData] = useState({
    hourlyRate: "",
    totalPrice: "",
    expectedTime: "",
    processingFee: "",
  });

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
  const submitJob = async (finalData) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", jobData.title || "");
      formData.append("description", jobData.description || "");
      formData.append("contractType", contractData?.type || "fixed");
      formData.append("durationType", durationData?.type || "days");
      formData.append("budgetType", budgetData?.type || "fixed");
      formData.append("customDays", durationData?.customDays || "0");
      formData.append("fixedFrom", budgetData?.totalPrice || "0");
      formData.append("hourlyFrom", budgetData?.hourlyRate || "0");
      formData.append("expected", budgetData?.expectedTime || "0");

      const subservices =
        selectedSubs?.map((s) => ({
          service: s.serviceId || 0,
          id: s.subId || 0,
          name: s.name || "",
        })) || [];
      formData.append("subservices", JSON.stringify(subservices));
      formData.append(
        "requirements",
        JSON.stringify(contractData?.requirements?.map((r) => r.value) || [])
      );
      formData.append(
        "languages",
        JSON.stringify(
          contractData?.languages?.map((l) => ({
            language: l.lang || "",
            level: l.level || 2,
          })) || []
        )
      );

      if (contractData?.address)
        formData.append("address", contractData.address);
      if (fileData?.uri) {
        let uri = fileData.uri;
        if (Platform.OS === "android" && uri.startsWith("file://"))
          uri = uri.slice(7);
        formData.append("file[]", {
          uri,
          name: fileData.fileName || "file.pdf",
          type: fileData.type || "application/pdf",
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
      console.log(data);
      if (data.status === 200) {
        // Alert.alert("Success", "Job submitted successfully!");
        navigation.navigate("JobPublishedPage", { gig: data.gig });
        navigation.navigate("JobPublishedPage", { gig: data.gig });
      } else {
        console.log(data.message);


        Alert.alert("Error", data.message || "Failed to submit job");
      }
    } catch (error) {
      console.log("Error submitting job:", error);
      Alert.alert("Error", "Something went wrong while submitting job.");
    }
  };
  const handleNext = () => {
    setPriceError(false);
    setHourlyError(false);
    setTimeError(false);
    setCategoryError(false);
    setTitleError(false);
    setDescriptionError(false);

    switch (activeTab) {
      case 0:
        let errorFound = false;

        // TITLE EMPTY?
        if (!jobData.title.trim()) {
          setTitleError(true);
          errorFound = true;
        } else {
          setTitleError(false);
        }
        if (!jobData.description.trim()) {
          setDescriptionError(true);
          errorFound = true;
        } else {
          setDescriptionError(false);
        }
        if (errorFound) return;
        setActiveTab(1);
        break;

      case 1:
        let catError = false;
        if (selectedSubs.length === 0) {
          setCategoryError(true);
          catError = true;
        } else {
          setCategoryError(false);
        }
        if (catError) return;
        setActiveTab(2);
        break;

      case 2:
        setTimeError(false);
        setActiveTab(3);
        break;
      case 3:
        setTimeError(false);
        setActiveTab(4);
        break;
      case 4:
        if (!durationData.selectedOption) {
          setTimeError(true);
          return;
        }
        setTimeError(false);
        setActiveTab(5);
        break;
      case 5:
        let priceValid = budgetData.totalPrice.trim() !== "";
        let hourlyValid = budgetData.hourlyRate.trim() !== "";
        if (!priceValid) setPriceError(true);
        if (!hourlyValid) setHourlyError(true);
        if (!priceValid || !hourlyValid) return;
        setPriceError(false);
        setHourlyError(false);
        setActiveTab(6);
        break;
      case 6:
        if (!budgetData.totalPrice || budgetData.totalPrice.trim() === "") {
          setPriceError(true);
        }
        if (!budgetData.hourlyRate || budgetData.hourlyRate.trim() === "") {
          setHourlyError(true);
        }
        if (
          !budgetData.totalPrice ||
          budgetData.totalPrice.trim() === "" ||
          !budgetData.hourlyRate ||
          budgetData.hourlyRate.trim() === ""
        ) {
          return;
        }

        setPriceError(false);
        setHourlyError(false);
        const finalData = {
          title: jobData.title,
          description: jobData.description,
          categories: selectedSubs,
          requirements: contractData.requirements,
          languages: contractData.languages,
          address: contractData.address,
          file: fileData,
          duration: durationData,
          budget: budgetData,
        };

        console.log("🟢 Submitting job data:", finalData);
        submitJob(finalData);
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

          <View style={styles.contentContainer}>
            {activeTab === 0 && (
              <TitleSection
                jobData={jobData}
                setJobData={setJobData}
                titleError={titleError}
                setTitleError={setTitleError}
                descriptionError={descriptionError}
                setDescriptionError={setDescriptionError}
              />
            )}

            {activeTab === 1 && (
              <Category
                selectedSubs={selectedSubs}
                setSelectedSubs={setSelectedSubs}
                categoryError={categoryError}
                setCategoryError={setCategoryError}
              />
            )}
            {activeTab === 2 && (
              <AddressSection
                contractData={contractData}
                setContractData={setContractData}
              />
            )}
            {activeTab === 3 && (
              <FileUpload fileData={fileData} setFileData={setFileData} />
            )}
            {activeTab === 4 && (
              <TimePeriod
                durationData={durationData}
                setDurationData={setDurationData}
                timeError={timeError}
                setTimeError={setTimeError}
              />
            )}

            {activeTab === 5 && (
              <SetPrice
                budgetData={budgetData}
                setBudgetData={setBudgetData}
                priceError={priceError}
                setPriceError={setPriceError}
                hourlyError={hourlyError}
                setHourlyError={setHourlyError}
              />
            )}

            {activeTab === 6 && (
              <ReviewPage
                jobData={jobData}
                selectedSubs={selectedSubs}
                contractData={contractData}
                fileData={fileData}
                durationData={durationData}
                budgetData={budgetData}
                setActiveTab={setActiveTab}
              />
            )}
          </View>
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
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <Footer />
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
    fontWeight: '600',
    fontStyle: 'DegularDisplay_600SemiBold', // ensure this font is available in your project
    color: '#ffffff',
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
  },
  activeText: {
    color: "#F9B233",
    fontWeight: "500",
    fontFamily: "Montserrat",
    fontSize: 12,
  },
  inactiveText: {
    color: "#999999",
    fontFamily: "Montserrat",
    fontSize: 12,
  },
  completedText: {
    color: "#F9B233",
    fontFamily: "Montserrat",
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
    paddingTop: 5,
    paddingHorizontal: 15,

    paddingBottom: 100,
  },
  button: {
    marginHorizontal: 5,
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
