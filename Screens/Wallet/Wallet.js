import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Footer from "../../components/Footer";
import Incomes from "./Incomes";
import Withdrawals from "./Withdrawals";
import Pending from "./Pending";
import Expenses from "./Expenses";
import Paypal from "./PaypalWithdraw";
import CreditCard from "./CreditCardWithdraw";
import BankTransfer from "./BankWithdraw";
import GradientButton from "../../components/GradientButton";

export default function Wallet() {
  const navigation = useNavigation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select");
  const [activeTab, setActiveTab] = useState(1);
  const [showPaypalUI, setShowPaypalUI] = useState(false);
  const [showCardUI, setShowCardUI] = useState(false);
  const [showBankUI, setShowBankUI] = useState(false);

  const dropdownOptions = [
    { value: "paypal", label: "Paypal" },
    { value: "card", label: "Debit/Credit Card" },
    { value: "bank", label: "Bank Transfer" },
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option.label); // show label in UI
    setIsDropdownVisible(false);

    if (option.value === "paypal") {
      setShowPaypalUI(true);
      setShowCardUI(false);
      setShowBankUI(false);
    } else if (option.value === "card") {
      setShowCardUI(true);
      setShowPaypalUI(false);
      setShowBankUI(false);
    } else if (option.value === "bank") {
      setShowBankUI(true);
      setShowPaypalUI(false);
      setShowCardUI(false);
    }
  };

  const tabs = [
    { id: 1, title: "Incomes" },
    { id: 2, title: "Withdrawals" },
    { id: 3, title: "Expenses" },
    { id: 4, title: "Pending" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <View style={styles.headerWrapper}>
          <PageNameHeaderBar navigation={navigation} title="Wallet" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.inputSection}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>My Balance</Text>
                <TouchableOpacity style={styles.questionIcon}>
                  <MaterialCommunityIcons
                    name="help-circle"
                    size={20}
                    color="#c3c3c3"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.currencyBox}>
                  <Text style={styles.currencyText}>CAD</Text>
                </View>
                <View style={styles.verticalLine} />
                <TextInput
                  style={styles.input}
                  value="500.00"
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Withdraw Amount</Text>
                <TouchableOpacity style={styles.questionIcon}>
                  <MaterialCommunityIcons
                    name="help-circle"
                    size={20}
                    color="#c3c3c3"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.currencyBox}>
                  <Text style={styles.currencyText}>CAD</Text>
                </View>
                <View style={styles.verticalLine} />
                <TextInput
                  style={styles.input}
                  placeholder="50.00"
                  editable={true}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.dropdownSection}>
              <Text style={styles.label}>Choose Withdraw Option</Text>
              <View>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setIsDropdownVisible(!isDropdownVisible)}
                >
                  <Text
                    style={[
                      styles.dropdownButtonText,
                      selectedOption === "Select"
                        ? styles.dropdownPlaceholderText
                        : styles.dropdownSelectedText,
                    ]}
                  >
                    {selectedOption}
                  </Text>

                  <Entypo
                    name={
                      isDropdownVisible
                        ? "chevron-small-up"
                        : "chevron-small-down"
                    }
                    size={24}
                    color="#666666"
                  />
                </TouchableOpacity>

                {isDropdownVisible && (
                  <View style={styles.dropdownList}>
                    {dropdownOptions.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => handleOptionSelect(item)}
                      >
                        <Text style={styles.dropdownOptionText}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {showPaypalUI && <Paypal />}
            {showCardUI && <CreditCard />}
            {showBankUI && <BankTransfer />}

            {!showPaypalUI && !showCardUI && !showBankUI && (
              <GradientButton title="Continue" styleOverride={{ marginBottom: 25 }}/>
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.topButtonRow}>
                {tabs.map((tab) => (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}
                    style={[
                      styles.topButton,
                      activeTab === tab.id
                        ? styles.topButtonActive
                        : styles.topButtonInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.topButtonText,
                        activeTab === tab.id
                          ? styles.topButtonTextActive
                          : styles.topButtonTextInactive,
                      ]}
                    >
                      {tab.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.tabContent}>
              {activeTab === 1 && <Incomes />}
              {activeTab === 2 && <Withdrawals />}
              {activeTab === 3 && <Expenses />}
              {activeTab === 4 && <Pending />}
            </View>
          </View>
        </ScrollView>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal: 15,
    
  },
  safeArea: {
    flex: 1,
  },

  scrollView: {
    paddingBottom: 10,
  },
  contentWrapper: {
    flex: 1,
  },
  inputSection: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 8,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 8,
  },
  questionIcon: {
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2D2D2D",
  },
  currencyBox: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  currencyText: {
    color: "#D38979",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  verticalLine: {
    width: 1,
    height: 30,
    backgroundColor: "#000000",
    alignSelf: "center",
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: "#666666",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  dropdownSection: {
    marginBottom: 15,
    zIndex: 1000,
  },

  dropdownSelectedText: {
    color: "#666666",
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#666666",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  dropdownPlaceholderText: {
    color: "#666666",
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
  },
  dropdownList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2D2D2D",
    marginTop: 5,
  },
  dropdownOption: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  dropdownOptionText: {
    color: "#666666",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },

  continueButton: {
    backgroundColor: "#D17B68",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
  tabsScrollView: {
    marginBottom: 20,
  },
  tabsWrapper: {
    flexDirection: "row",
    gap: 10,
  },

  topButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },

  topButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    backgroundColor: "#ffffff1a",
  },
  tabActive: {
    backgroundColor: "#ffffff",
  },
  tabText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  topButtonActive: {
    backgroundColor: "#ffffff",
  },

  topButtonInactive: {
    backgroundColor: "#423c3c",
  },

  topButtonText: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },

  topButtonTextActive: {
    color: "#000000",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },

  topButtonTextInactive: {
    color: "#ffffff",
    fontWeight: "500",
  },

  tabTextActive: {
    color: "#000000",
  },
});
