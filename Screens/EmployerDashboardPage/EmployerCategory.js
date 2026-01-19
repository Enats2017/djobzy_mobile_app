import React from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import AllCategories from "../FindJobs/AllCategories";
import EmployerFooter from "../../components/EmployerFooter";
import { useNavigation } from "@react-navigation/native";

const EmployerCategory = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageNameHeaderBar
          title="Employer Categories"
          navigation={navigation}
        />
        <AllCategories />
      </View>
      <EmployerFooter />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
});

export default EmployerCategory;
