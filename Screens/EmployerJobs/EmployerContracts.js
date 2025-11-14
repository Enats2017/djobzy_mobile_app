import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmployerContracts() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.contractcontainer}>
      <View style={styles.headerWrapper}>
        <PageNameHeaderBar navigation={navigation} title="Contracts" />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("MyJobPost")}
        >
          <Text style={styles.menuText}>My Job Post</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Active contracts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Received Application</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Sent Offers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Completed Contracts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("DeactivatedJobs")}
        >
          <Text style={styles.menuText}>Deactivated Jobs</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contractcontainer: {
    flex: 1,
    backgroundColor: "#222222",
  },
  headerWrapper: {
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 22,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  menuItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff33",
  },
  menuText: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
  },
});
