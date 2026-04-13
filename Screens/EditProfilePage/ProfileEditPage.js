import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import GradientButton from "../../components/GradientButton";
import Footer from "../../components/Footer";
import { API_URL } from "../../api/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import { useNotifications } from "../../context/MessageNotificationContext";
import EditProfileBasicInfo from "./EditProfileBasicInfo";
import EditProfileCategory from "./EditProfileCategories";
import EditProfilePromotedServices from "./EditProfilePromotedServices";
import EditProfileAttachments from "./EditProfileAttachments";
import EditProfileSeeAllInformation from "./EditProfileSeeAllInformation";
import EditProfileExperience from "./EditProfileExperience";
import EditProfileInfoHeader from "./EditProfileInfoHeader";
import { useEditProfileStore } from "./useEditProfileStore";
import { toastSuccess } from "../../utils/toast";

const ProfileEditPage = () => {
  const setAllData = useEditProfileStore((state) => state.setAllData);
  const storeData = useEditProfileStore((state) => state);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { admin } = useNotifications();
  const userType = admin === 2 ? 'employer' : 'employee';
  // console.log('adaf adf a fadf ', userType);

  const fetchProfileForEdit = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/edit-profile/${userType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const user = data.editprofile || {};

      setAllData({
        userAdmin: user.admin || 0,
        profileTitle:
          userType === "employer"
            ? user.profile_title_employer || ""
            : user.profile_title_employee || "",
        description:
          userType === "employer"
            ? user.employer_about || ""
            : user.about || "",
        photoUri: user.photo || null,
        category: data.subcategory || [],
        promote: data.promote || [],
        languages: data.language || [],
        education: data.education || [],
        vehicles: data.vehicle || [],
        assets: data.assets || [],
        licenses: data.licence || [],
        certificates: data.certificate || [],
        experiences: data.experiences || [],
        dob: user.dob || "",
        years: data.years || 0,
        ageShowStatus: user.age_show_status || 0,
        moneyShowStatus:
          userType === "employer"
            ? user.money_spent_show_status || 0
            : user.money_earned_show_status || 0,
      });
      useEditProfileStore.setState({ profile: data });
      // console.log(user.admin);
    } catch (error) {
      console.log("Edit profile fetch error =>", error);
    } finally {
      setLoading(false);
    }
  }, [userType]);

  const handleApplyChanges = async () => {
    try {
      setSubmitLoading(true);
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      Object.entries(storeData.form).forEach(([key, value]) => {
        if (key === "category" || key === "promote" || key === "photoUri") return;
        if ( value === null || value === undefined || value === "") return;
        if (Array.isArray(value) || typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // 🔥 ADD THIS (no changes to your logic above)
      if (storeData.deleted) {
        formData.append("deleted", JSON.stringify(storeData.deleted));
      }

      // console.log(formData);
      const response = await fetch(`${API_URL}/profile-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.status === 200) {
        await fetchProfileForEdit();
        toastSuccess('Profile updated successfully.');
      } else {
        console.log("API Error:", result);
      }
    } catch (error) {
      console.log("Submit Error:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // if (!storeData.profile) {
        fetchProfileForEdit();
      // }
    }, [fetchProfileForEdit])
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <PageNameHeaderBar title="Edit Profile" navigation={navigation} />
          {
            loading ? (
              <Loading />
            ) : (
              <>
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 50 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.section}>
                    <View style={styles.profileCard}>
                      <EditProfileInfoHeader
                        navigation={navigation}
                      />
                      {/* === SEE ALL INFORMATION SECTION === */}
                      <EditProfileSeeAllInformation navigation={navigation} />
                    </View>
                    <EditProfileBasicInfo
                      userType={userType}
                    />
                    <EditProfileCategory
                      navigation={navigation}
                    />
                    {
                      admin === 0 && (
                        <EditProfilePromotedServices
                          navigation={navigation}
                        />
                      )
                    }
                    <EditProfileAttachments
                      navigation={navigation}
                    />
                    {
                      admin === 0 && (
                        <EditProfileExperience
                          navigation={navigation}
                        />
                      )
                    }
                  </View>
                </ScrollView>
                <View style={{ paddingBottom: 90 }}>
                  <GradientButton title="Apply Changes" onPress={handleApplyChanges} disabled={submitLoading} loading={submitLoading} />
                </View>
              </>
            )
          }
        </View>
        <Footer />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#222222"
  },
  profileCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

export default ProfileEditPage;
