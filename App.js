import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Screens/HomeScreen/Home";
import SliderScreen from "./Screens/HomeScreen/SliderScreen";
import FourthScreen from "./Screens/HomeScreen/FourthScreen";
import Login from "./Screens/LoginPage/Login";
import Signup from "./Screens/RegisterPage/Signup";
import Dashboard from "./Screens/DashboardPage/Dashboard";
import CreateJob from "./Screens/JobCreatePage/CreateJob";
import JobProfile from "./Screens/JobProfile/JobProfile";
import JobApplyPage from "./Screens/JobProfile/JobApplyPage";
import MyJobPage from "./Screens/EmployeeJobs/MyJobPage";
import MyFindJobs from "./Screens/FindJobs/MyFindJobs";
import JobPublishedPage from "./Screens/JobCreatePage/JobPublishedPage";
import JobBoostPaymentSection from "./Screens/JobCreatePage/JobBoostPaymentSection";
import EmployerDashboard from "./Screens/EmployerDashboardPage/EmployerDashboard";
import EmployerContracts from "./Screens/EmployerJobs/EmployerContracts";
import EmployerJobPost from "./Screens/EmployerJobs/EmployerJobPost";
import DeactivatedJobs from "./Screens/EmployerJobs/DeactivatedJobs";
import Wallet from "./Screens/Wallet/Wallet";
import MyCurrentBiddingProfile from "./Screens/EmployeeJobs/MyCurrentBiddingProfile";
import ChangeMyOffer from "./Screens/EmployeeJobs/ChangeMyOffer";
import ViewCompletedJobPost from "./Screens/EmployeeJobs/ViewCompletedJobPost";
import CompletedJobPaymentPage from "./Screens/EmployeeJobs/CompletedJobPaymentPage";
import ViewReceivedOffer from "./Screens/EmployeeJobs/ViewReceivedOffer";
import MakeNewOffer from "./Screens/EmployeeJobs/MakeNewOffer";
import AcceptReceivedOfferPage from "./Screens/EmployeeJobs/AcceptReceivedOfferPage";
import ViewCurrentJobPost from "./Screens/EmployeeJobs/ViewCurrentJobPost";
import CurrentJobPaymentPage from "./Screens/EmployeeJobs/CurrentJobPaymentPage";
import Details from "./Screens/EmployerJobs/Details";
import VerificationPage from "./Screens/VerificationPage/VerificationPage";
import PasswordResert from "./Screens/PasswordResertPage/PasswordResert";
import ProfileMenu from "./Screens/ProfileMenuPAge/ProfileMenu";
import PromoteService from "./Screens/PromoteServicesPage/PromoteService";
import PromoteCategoryPage from "./Screens/PromoteServicesPage/PromoteCategoryPage";
import EmployeeAccount from "./Screens/PromoteServicesPage/EmployeeAccount";
import EmployeeVerification from "./Screens/PromoteServicesPage/EmployeeVerification";
import ProfileReviewPage from "./Screens/ProfileMenuPAge/ProfileReviewPage";
import ReferralWallet from "./Screens/ProfileMenuPAge/ReferralWallet";
import BlogPage from "./Screens/ProfileMenuPAge/BlogPage";
import PostJobDetails from "./Screens/ContractPage/PostJobDetails";
import ReceiveApplication from "./Screens/ContractPage/ReceiveApplication";
import EmployerSentOffer from "./Screens/ContractPage/EmployerSentOffer";
import ActiveContract from "./Screens/ContractPage/ActiveContract";
import ProfileEditPage from "./Screens/ProfileMenuPAge/ProfileEditPage";
import ProfileBoostPage from "./Screens/ProfileMenuPAge/ProfileBoostPage";
import GeneralSetting from "./Screens/ProfileMenuPAge/GeneralSetting";
import IdentityVerification from "./Screens/GeneralSetting/IdentityVerification";
import AccountSetting from "./Screens/GeneralSetting/AccountSetting";
import UserContactInfo from "./Screens/GeneralSetting/UserContactInfo";
import UserPaymentPage from "./Screens/GeneralSetting/UserPaymentPage";
import UserNotification from "./Screens/GeneralSetting/UserNotification";
import UserSecurity from "./Screens/GeneralSetting/UserSecurity";
import IDVerificationUploadScreen from "./Screens/GeneralSetting/IDVerificationUploadScreen";
import EmployerProfilePage from "./Screens/EmployerHirePage/EmployerProfilePage";
import ViewHirePage from "./Screens/EmployerHirePage/ViewHirePage";
import FeedChat from "./Screens/SocialMediaPage/FeedChat";
import ChatCommunication from "./Screens/SocialMediaPage/ChatCommunication";
import CreateFeedPost from "./Screens/SocialMediaPage/CreateFeedPost";
import NotificationScreen from "./Screens/Notification/NotificationScreen";
import Followers from "./Screens/SocialMediaPage/Followers";
import SendJobOffer from "./Screens/EmployerHirePage/SendJobOffer";
import DeactivedDetailsPage from "./Screens/ContractPage/DeactivedDetailsPage";
import ViewBoostJobs from "./Screens/ContractPage/ViewBoostJobs";
import ProfileSetting from "./Screens/GeneralSetting/ProfileSetting";
import EmployerAccount from "./Screens/Employer/EmployerAccount";
import PublicEmployeeProfile from "./Screens/Employee/PublicEmployeeProfile";
import PromoteServicesDetails from "./Screens/PromoteServicesPage/PromoteServicesDetails";
import EditPromoteSevices from "./Screens/PromoteServicesPage/EditPromoteSevices";

const Stack = createStackNavigator();
const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_800ExtraBold,
    Montserrat_700Bold,
    Montserrat_500Medium,
  });
  useEffect(() => {
    if (fontsLoaded) {
      setAppIsReady(true);
    }
  }, [fontsLoaded]);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SliderScreen" component={SliderScreen} />
          <Stack.Screen name="FourthScreen" component={FourthScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="CreateJob" component={CreateJob} />
          <Stack.Screen name="JobProfile" component={JobProfile} />
          <Stack.Screen name="JobApply" component={JobApplyPage} />
          <Stack.Screen name="MyJobPage" component={MyJobPage} />
          <Stack.Screen name="EmployerDashboard" component={EmployerDashboard} />
          <Stack.Screen name="EmployerContracts" component={EmployerContracts} />
          <Stack.Screen name="EmployerJobPost" component={EmployerJobPost} />
          <Stack.Screen name="DeactivatedJobs" component={DeactivatedJobs} />
          <Stack.Screen name="Wallet" component={Wallet} />
          <Stack.Screen name="MyFindJobs" component={MyFindJobs} />
          <Stack.Screen name="JobPublishedPage" component={JobPublishedPage} />
          <Stack.Screen name="JobBoostPaymentSection" component={JobBoostPaymentSection} />
          <Stack.Screen name="MyCurrentBiddingProfile" component={MyCurrentBiddingProfile} />
          <Stack.Screen name="ChangeMyOffer" component={ChangeMyOffer} />
          <Stack.Screen name="ViewCompletedJobPost" component={ViewCompletedJobPost} />
          <Stack.Screen name="CompletedJobPaymentPage" component={CompletedJobPaymentPage} />
          <Stack.Screen name="ViewReceivedOffer" component={ViewReceivedOffer} />
          <Stack.Screen name="MakeNewOffer" component={MakeNewOffer} />
          <Stack.Screen name="AcceptReceivedOfferPage" component={AcceptReceivedOfferPage} />
          <Stack.Screen name="ViewCurrentJobPost" component={ViewCurrentJobPost} />
          <Stack.Screen name="CurrentJobPaymentPage" component={CurrentJobPaymentPage} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="VerificationPage" component={VerificationPage} />
          <Stack.Screen name="PasswordResert" component={PasswordResert} />
          <Stack.Screen name="ProfileMenu" component={ProfileMenu} />
          <Stack.Screen name="PromoteService" component={PromoteService} />
          <Stack.Screen name="PromoteCategoryPage" component={PromoteCategoryPage} />
          <Stack.Screen name="EmployeeAccount" component={EmployeeAccount} />
          <Stack.Screen name="EmployeeVerification" component={EmployeeVerification} />
          <Stack.Screen name="ProfileReviewPage" component={ProfileReviewPage} />
          <Stack.Screen name="ReferralWallet" component={ReferralWallet} />
          <Stack.Screen name="BlogPage" component={BlogPage} />
          <Stack.Screen name="PostJobDetails" component={PostJobDetails} />
          <Stack.Screen name="ReceiveApplication" component={ReceiveApplication} />
          <Stack.Screen name="EmployerSentOffer" component={EmployerSentOffer} />
          <Stack.Screen name="ProfileEditPage" component={ProfileEditPage} />
          <Stack.Screen name="ProfileBoostPage" component={ProfileBoostPage} />
          <Stack.Screen name="GeneralSetting" component={GeneralSetting} />
          <Stack.Screen name="IdentityVerification" component={IdentityVerification} />
          <Stack.Screen name="AccountSetting" component={AccountSetting} />
          <Stack.Screen name="UserContactInfo" component={UserContactInfo} />
          <Stack.Screen name="UserPaymentPage" component={UserPaymentPage} />
          <Stack.Screen name="UserNotification" component={UserNotification} />
          <Stack.Screen name="UserSecurity" component={UserSecurity} />
          <Stack.Screen name="IDVerificationUploadScreen" component={IDVerificationUploadScreen} />
          <Stack.Screen name="EmployerProfilePage" component={EmployerProfilePage} />
          <Stack.Screen name="ViewHirePage" component={ViewHirePage} />
          <Stack.Screen name="FeedChat" component={FeedChat} />
          <Stack.Screen name="ChatCommunication" component={ChatCommunication} />
          <Stack.Screen name="CreateFeedPost" component={CreateFeedPost} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="Followers" component={Followers} />
          <Stack.Screen name="SendJobOffer" component={SendJobOffer} />
          <Stack.Screen name="DeactivedDetailsPage" component={DeactivedDetailsPage} />
          <Stack.Screen name="ActiveContract" component={ActiveContract} />
          <Stack.Screen name="ViewBoostJobs" component={ViewBoostJobs} />
          <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
          <Stack.Screen name="EmployerAccount" component={EmployerAccount} />
          <Stack.Screen name="PublicEmployeeProfile" component={PublicEmployeeProfile} />
          <Stack.Screen name="PromoteServicesDetails" component={PromoteServicesDetails} />
          <Stack.Screen name="EditPromoteSevices" component={EditPromoteSevices} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
