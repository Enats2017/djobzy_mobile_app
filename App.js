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
import Employer from "./Screens/Employer/Employer";
import Employee from "./Screens/Employee/Employee";
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
import MyCurrentBiddingProfile from "./Screens/EmployeeJobs/MyCurrentBiddingProfile";
import ChangeMyOffer from "./Screens/EmployeeJobs/ChangeMyOffer";
import ViewCompletedJobPost from "./Screens/EmployeeJobs/ViewCompletedJobPost";
import CompletedJobPaymentPage from "./Screens/EmployeeJobs/CompletedJobPaymentPage";
import ViewReceivedOffer from "./Screens/EmployeeJobs/ViewReceivedOffer";
import MyNewReceiveOfferPage from "./Screens/EmployeeJobs/MyNewReceiveOfferPage";
import AcceptReceivedOfferPage from "./Screens/EmployeeJobs/AcceptReceivedOfferPage";
import VerificationPage from "./Screens/VerificationPage/VerificationPage";
import PasswordResert from "./Screens/PasswordResertPage/PasswordResert";
import EmployeeProfileMenu from "./Screens/ProfileMenuPAge/EmployeeProfileMenu";
import PromoteService from "./Screens/PromoteServicesPage/PromoteService";
import PromoteCategoryPage from "./Screens/PromoteServicesPage/PromoteCategoryPage";
import EmployeeAccount from "./Screens/PromoteServicesPage/EmployeeAccount";
import EmployeeVerification from "./Screens/PromoteServicesPage/EmployeeVerification";

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
          <Stack.Screen name="Employer" component={Employer} />
          <Stack.Screen name="Employee" component={Employee} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="CreateJob" component={CreateJob} />
          <Stack.Screen name="JobProfile" component={JobProfile} />
          <Stack.Screen name="JobApply" component={JobApplyPage} />
          <Stack.Screen name="MyJobPage" component={MyJobPage} />
          <Stack.Screen name="MyFindJobs" component={MyFindJobs} />
          <Stack.Screen name="JobPublishedPage" component={JobPublishedPage} />
          <Stack.Screen
            name="JobBoostPaymentSection"
            component={JobBoostPaymentSection}
          />
          <Stack.Screen
            name="MyCurrentBiddingProfile"
            component={MyCurrentBiddingProfile}
          />
          <Stack.Screen name ="ChangeMyOffer" component={ChangeMyOffer} />
          <Stack.Screen name ="ViewCompletedJobPost" component={ViewCompletedJobPost}/>
          <Stack.Screen name ="CompletedJobPaymentPage" component={CompletedJobPaymentPage} />
          <Stack.Screen name ="ViewReceivedOffer" component={ViewReceivedOffer} />
          <Stack.Screen name = "MyNewReceiveOfferPage" component={MyNewReceiveOfferPage}/>
          <Stack.Screen name = "AcceptReceivedOfferPage" component={AcceptReceivedOfferPage}/>
          <Stack.Screen name = "VerificationPage" component={VerificationPage} />
          <Stack.Screen name= "PasswordResert" component={PasswordResert} />
          <Stack.Screen name = "EmployeeProfileMenu" component={EmployeeProfileMenu} />
          <Stack.Screen name = "PromoteService" component={PromoteService} />
          <Stack.Screen name = "PromoteCategoryPage" component={PromoteCategoryPage} />
          <Stack.Screen name = "EmployeeAccount" component={EmployeeAccount} />
          <Stack.Screen name = "EmployeeVerification" component={EmployeeVerification} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
