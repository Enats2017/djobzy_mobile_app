import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Footer from "../../components/Footer";
import { Ionicons, Feather } from "@expo/vector-icons";
import GradientButton from "../../components/GradientButton";

const ReferralWallet = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("employee");
  const [email, setEmail] = useState("");
  const [tableFilled, setTableFilled] = useState(false);
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <PageNameHeaderBar
              title="Employee Profile"
              navigation={navigation}
            />
          </View>
          <ScrollView
          
            showsVerticalScrollIndicator={false}
            
          >
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "employee" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("employee")}
              >
                <Text
                  style={
                    activeTab === "employee"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Referral Wallet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "employer" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("employer")}
              >
                <Text
                  style={
                    activeTab === "jobs" ? styles.activeTabText : styles.tabText
                  }
                >
                  Referral History
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tableCard}>
              <View style={styles.tableRow}>
                <View style={styles.tableLeftCell}>
                  <Text style={styles.tableLabel}>Date for Income</Text>
                </View>

                <View style={styles.dividerVert} />

                <View style={styles.tableRightCell}>
                  <Text style={styles.tableValue}></Text>
                </View>
              </View>

              <View style={styles.dividerHoriz} />

              <View style={styles.tableRow}>
                <View style={styles.tableLeftCell}>
                  <Text style={styles.tableLabel}>User</Text>
                </View>
                <View style={styles.dividerVert} />
                <View style={styles.tableRightCell}>
                  <View>
                    <Text style={styles.tableValue}></Text>
                  </View>
                </View>
              </View>

              <View style={styles.dividerHoriz} />

              <View style={styles.tableRow}>
                <View style={styles.tableLeftCell}>
                  <Text style={styles.tableLabel}>Contract ID</Text>
                </View>
                <View style={styles.dividerVert} />
                <View style={styles.tableRightCell}>
                  <Text style={styles.tableValue}></Text>
                </View>
              </View>

              <View style={styles.dividerHoriz} />

              <View style={styles.tableRow}>
                <View style={styles.tableLeftCell}>
                  <Text style={styles.tableLabel}>
                    My Passive Income (3.0%)
                  </Text>
                </View>
                <View style={styles.dividerVert} />
                <View style={styles.tableRightCell}>
                  <Text style={styles.tableValue}></Text>
                </View>
              </View>

              <View style={styles.dividerHoriz} />

              <View style={styles.tableRow}>
                <View style={styles.tableLeftCell}>
                  <Text style={styles.tableLabel}>ID</Text>
                </View>
                <View style={styles.dividerVert} />
                <View style={styles.tableRightCell}>
                  <Text style={styles.tableValue}></Text>
                </View>
              </View>
            </View>
            <View style={styles.rateContainer}>
              <Ionicons
                name="help-circle"
                size={16}
                color="#ffffff"
                style={{ marginBottom: 3 }}
              />
              <Text style={styles.label}>
                You can collect the income once a month
              </Text>
            </View>
            <View>
              <TouchableOpacity
                disabled={!tableFilled}
                style={[
                  styles.button,
                  { backgroundColor: tableFilled ? "#D17B68" : "#754A42" },
                ]}
              >
                <Text style={styles.buttonText}>Collect the Payments</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.big}>
              <Text style={styles.bigtext}>
                Invite your friends and get bonuses
              </Text>
            </View>
            <View style={styles.linkcontainer}>
            <Text style={styles.title}>Invite with an email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Invite with an email"
                placeholderTextColor="#8F8F8F"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="send" size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Invite with an email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Invite with an email"
                placeholderTextColor="#8F8F8F"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons name="copy" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            </View>
          </ScrollView>
        </View>
        <Footer />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
  },
  tabContainer: {
    flexDirection: "row",
    borderColor: "#c5c5c591",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 25,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  tabText: {
    color: "#c3c3c3c3",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  activeTab: {
    backgroundColor: "#C96B59",
    padding: 10,
    outlineColor: "#C96B59",
    outlineWidth: 1.5,
    borderRadius: 10,
  },

  activeTabText: {
    color: "#ffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
  },
  tableCard: {
    backgroundColor: "#00000033",
    borderRadius: 11,
    borderColor: "#00000033",
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
  },
  tableLeftCell: {
    flex: 1,
    justifyContent: "flex-start",
  },
  tableRightCell: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",

    marginLeft: 20,
  },
  tableLabel: {
    color: "#c3c3c3",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  tableValue: {
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
  },
  dividerHoriz: {
    height: 1,
    backgroundColor: "#FFFFFF33",
  },
  dividerVert: {
    width: 1,
    height: "100%",
    backgroundColor: "#39393a",
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
    paddingBottom: 20,
  },
  label: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#ffffff",
  },
  button: {
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
  big: {
    paddingTop: 25,
    paddingBottom: 15,
  },
  bigtext: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 30,
    color: "#ffffff",
  },
  inputWrapper: {
    backgroundColor: "#fff",
    height: 48,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingHorizontal: 2,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#666666",
  },
  title: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 8,
  },
  iconButton: {
    width: 43,
    height: 43,
    backgroundColor: "#46A282",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  copyButton: {
    width: 43,
    height: 43,
    backgroundColor: "#CB7767",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  linkcontainer:{
    paddingBottom:100,
  }
});

export default ReferralWallet;
