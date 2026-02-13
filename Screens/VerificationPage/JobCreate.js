import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GradientButton from "../../components/GradientButton";

const JobCreate = ({ admin, userId }) => {
  console.log("admin", admin);
  console.log(userId);
  const navigation = useNavigation();
  const handleCreateLater = () => {
    if (admin == 2) {
      navigation.reset({
        index: 0,
        routes: [{ name: "EmployerDashboard", params: { userId } }],
      });
    } else {
      // Normal User
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard", params: { userId } }],
      });
    }
  };

  return (
    <>
      <View style={styles.jobsection}>
        <View style={styles.bigcircle}>
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
        </View>
        <Text style={styles.almostThere}>Almost There!</Text>
        <Text style={styles.startText}>
          Start Your <Text style={styles.subText}>Djobzy</Text> Journey
        </Text>
        {admin === 2 && (
          <Text style={styles.instructionText}>
            In order to get things done,create your first job post
          </Text>
        )}
      </View>
      <View style={styles.jobbtn}>
        {admin === 0 ? (
          <GradientButton
            title="Create Promoted Services for Free"
            textColor="#303030"
            colors={["#fff", "#fff"]}
            paddingVertical={15}
            onPress={() => navigation.navigate("PromoteService", { userId })}
          />
        ) : (
          <GradientButton
            title="Create a Job Post For Free"
            paddingVertical={15}
            onPress={() => navigation.navigate("CreateJob", { userId })}
          />
        )}
        <TouchableOpacity style={styles.leterBtn} onPress={handleCreateLater}>
          <Text style={styles.nextBtnText}>Create Later</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  jobsection: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 25,
  },
  bigcircle: {
    backgroundColor: "#39A881",
    height: 115,
    width: 115,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  checking: {
    backgroundColor: "#218E67",
    height: 100,
    width: 100,
    borderRadius: 60,
    alignItems: "center",
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ebecf0ff",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    top: 9,
  },

  done: {
    backgroundColor: "#fff",
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  almostThere: {
    fontSize: 20,
    fontFamily: "Montserrat_500Medium",
    color: "#FFFFFF",
    marginTop: 10,
    marginBottom: 14,
  },
  startText: {
    fontSize: 28,
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    textAlign: "center",
  },
  subText: {
    fontSize: 28,
    fontFamily: "Montserrat_700Bold",
    color: "#CB7767",
  },
  instructionText: {
    flex: 1,
    paddingHorizontal: 5,
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },
  jobbtn: {
    gap: 10,
    marginTop: 20,
  },
  createBtn: {
    backgroundColor: "#f1eeedff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextBtnText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    textAlign: "center",
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
