import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const JobCreate = ({ admin, userId }) => {
  console.log(admin);
  console.log(userId);
  const navigation = useNavigation();
  const handleCreateLater = () => {
    navigation.navigate("dashboard", { userId });
  };

  return (
    <>
      <View style={styles.jobsection}>
        <View style={styles.checking}>
          <View style={styles.checkCircle}>
            <View style={styles.done}>
              <MaterialIcons
                name="done"
                size={26}
                color="#218e67"
                style={styles.icon}
              />
            </View>
          </View>
        </View>
        <Text style={styles.almostThere}>Almost There!</Text>
        <Text style={styles.startText}>
          Start Your <Text style={styles.subText}>Djobzy</Text> Journey
        </Text>
        <Text style={styles.instructionText}>
          In order to get things done,create your first job post
        </Text>
      </View>
      <View style={styles.jobbtn}>
        {admin === 2 ? (
          <TouchableOpacity style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Create Job Post</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate("CreateJob", { userId })}
          >
            <Text style={styles.createBtnText}>Create Promoted Services</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.leterBtn} onPress={handleCreateLater}>
          <Text style={styles.nextBtnText}>Create Leter</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  jobsection: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  checking: {
    backgroundColor: "#218e67",
    height: 100,
    width: 100,
    borderRadius: 60,
    alignItems: "center",
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ebecf0ff",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    top: 9,
  },
  icon: {
    backgroundColor: "#fff",
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  almostThere: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 25,
  },
  startText: {
    fontSize: 23,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    fontSize: 24,
    color: "#FF6666",
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    width: "80%",
    padding: 5,
  },
  jobbtn: {
    gap: 10,
    marginTop: 20,
  },
  nextBtn: {
    backgroundColor: "#d98974",
    padding: 16,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
  },
  createBtn: {
    backgroundColor: "#f1eeedff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextBtnText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  createBtnText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
  },
  leterBtn: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 16,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
  },
});

export default JobCreate;
