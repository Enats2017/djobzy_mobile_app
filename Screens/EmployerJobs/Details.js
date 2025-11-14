import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import Footer from "../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { truncateWords } from "../../api/TruncateWords";
import {
  View,
  Image,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function Details() {
  const navigation = useNavigation();

  const [showPayHireModal, setShowPayHireModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  function openPayHireModal() {
    setShowPayHireModal(true);
  }
  function closePayHireModal() {
    setShowPayHireModal(false);
  }

  function openDeactivateModal() {
    setShowDeactivateModal(true);
  }

  function closeDeactivateModal() {
    setShowDeactivateModal(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#222222" }}>
      <View style={styles.container}>
        <PageNameHeaderBar navigation={navigation} title="Details" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.jobTitle}>Looking For logo designer</Text>
            <Text style={styles.postedTime}>posted 6 months ago</Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.categoriesContainer}>
              <Text style={styles.cardHeading}>Categories</Text>
              <View style={styles.chipRow}>
                {[
                  "Illustrator",
                  "Interior Design",
                  "Photoshop",
                  "Creative",
                  "Minimal",
                  "Dark Mode",
                ].map((cat, idx) => (
                  <View key={idx} style={styles.chip}>
                    <Text style={styles.chipText}>{cat}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.pricingContainer}>
              <Text style={styles.cardHeading}>Pricing</Text>
              <Text style={styles.pricingInfo}>
                Total Price:{" "}
                <Text style={styles.pricingHighlight}>CAD 100</Text>
                {"  "}
                Hourly Rate:{" "}
                <Text style={styles.pricingHighlight}>CAD 10.00</Text>
              </Text>
              <Text style={styles.projectDuration}>
                Project Length:{" "}
                <Text style={styles.pricingHighlight}>10 days</Text>
              </Text>
              <View style={styles.hourInfoRow}>
                <Text style={styles.hourInfo}>2 Hours </Text>
                <Text style={styles.isInfo}>
                  is expected for the job to be done.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.cardHeading}>Description</Text>
              <Text style={styles.cardText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod.Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod.
              </Text>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.requirementsContainer}>
              <Text style={styles.cardHeading}>Requirements</Text>
              <Text style={styles.cardText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod.
              </Text>
            </View>
          </View>

          <View style={styles.cardContainer} />

          <View style={styles.biddingsHeaderRow}>
            <Text style={styles.biddingsTitle}>Biddings</Text>
            <TouchableOpacity>
              <Text style={styles.biddingsSortBy}>Sort By</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.biddingsSubText}>
            {" "}
            6 Candidate is bidding for this job{" "}
          </Text>

          <View style={styles.biddingsGrid}>
            <View style={styles.biddingCard}>
              <View style={styles.biddingCardHeader}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/1.jpg",
                  }}
                  style={styles.avatarCircle}
                />
                <View style={styles.candidateInfo}>
                  <Text style={styles.candidateName}>John Deo</Text>
                  <View style={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={10}
                        color="#EBBE56"
                      />
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={styles.moreCircle}>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={23}
                    color="#fdbf2d"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.biddingDetailsRow}>
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Total Price</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 1,150.00</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Hourly Rate</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 11.50</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.biddingPayHireBtn}
                onPress={openPayHireModal}
              >
                <Text style={styles.biddingPayHireBtnText}>Pay & Hire</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.biddingCard}>
              <View style={styles.biddingCardHeader}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/women/10.jpg",
                  }}
                  style={styles.avatarCircle}
                />
                <View style={styles.candidateInfo}>
                  <Text style={styles.candidateName}>Maria Grey</Text>
                  <View style={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={10}
                        color="#EBBE56"
                      />
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={styles.moreCircle}>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={23}
                    color="#fdbf2d"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.biddingDetailsRow}>
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Total Price</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 900.00</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Hourly Rate</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 10.00</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.biddingPayHireBtn}
              >
                <Text style={styles.biddingPayHireBtnText}>Pay & Hire</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.biddingCard}>
              <View style={styles.biddingCardHeader}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/32.jpg",
                  }}
                  style={styles.avatarCircle}
                />
                <View style={styles.candidateInfo}>
                  <Text style={styles.candidateName}>Kevin Smith</Text>
                  <View style={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={10}
                        color="#EBBE56"
                      />
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={styles.moreCircle}>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={23}
                    color="#fdbf2d"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.biddingDetailsRow}>
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Total Price</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 1,000.00</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Hourly Rate</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 12.00</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.biddingPayHireBtn}>
                <Text style={styles.biddingPayHireBtnText}>Pay & Hire</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.biddingCard}>
              <View style={styles.biddingCardHeader}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/women/45.jpg",
                  }}
                  style={styles.avatarCircle}
                />
                <View style={styles.candidateInfo}>
                  <Text style={styles.candidateName}>Sarah Lee</Text>
                  <View style={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={10}
                        color="#EBBE56"
                      />
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={styles.moreCircle}>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={23}
                    color="#fdbf2d"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.biddingDetailsRow}>
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Total Price</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 1,300.00</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Hourly Rate</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 13.00</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.biddingPayHireBtn}
              >
                <Text style={styles.biddingPayHireBtnText}>Pay & Hire</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.biddingCard}>
              <View style={styles.biddingCardHeader}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/75.jpg",
                  }}
                  style={styles.avatarCircle}
                />
                <View style={styles.candidateInfo}>
                  <Text style={styles.candidateName}>Robert Fox</Text>
                  <View style={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={10}
                        color="#EBBE56"
                      />
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={styles.moreCircle}>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={23}
                    color="#fdbf2d"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.biddingDetailsRow}>
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Total Price</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 850.00</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Hourly Rate</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 9.00</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.biddingPayHireBtn}>
                <Text style={styles.biddingPayHireBtnText}>Pay & Hire</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.biddingCard}>
              <View style={styles.biddingCardHeader}>
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/women/72.jpg",
                  }}
                  style={styles.avatarCircle}
                />
                <View style={styles.candidateInfo}>
                  <Text style={styles.candidateName}>
                    {truncateWords(
                      "Linda Stone Linda Stone Linda Stone Linda Stone Linda Stone",
                      3
                    )}
                  </Text>
                  <View style={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={10}
                        color="#EBBE56"
                      />
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={styles.moreCircle}>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={23}
                    color="#fdbf2d"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.biddingDetailsRow}>
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Total Price</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 1,200.00</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.biddingDetailsCol}>
                  <Text style={styles.biddingDetailsLabel}>Hourly Rate</Text>
                  <Text style={styles.biddingDetailsValue}>CAD 12.50</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.biddingPayHireBtn}>
                <Text style={styles.biddingPayHireBtnText}>Pay & Hire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View>
          <TouchableOpacity
           style={styles.deactivateBtn}
           onPress={openDeactivateModal}
           >
            <Text style={styles.deactivateBtnText}>
              Deactivate & Archive this job
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonEdit}>
              <Text style={styles.buttonEditText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonBoost}>
              <Text style={styles.buttonBoostText}>Boost</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <Footer />
      <Modal
        visible={showPayHireModal}
        animationType="slide"
        transparent
        onRequestClose={closePayHireModal}
      >
        <View style={styles.payHireModalOverlay}>
          <View style={styles.payHireModalCard}>
            <View style={styles.payHireModalHeader}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/1.jpg",
                }}
                style={styles.payHireModalAvatar}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.payHireModalName}>John deo</Text>
                <View style={{ flexDirection: "row", marginTop: 2, gap: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={13}
                      color="#EBBE56"
                      style={{ marginRight: 1 }}
                    />
                  ))}
                </View>
              </View>
              <TouchableOpacity
                style={styles.moreCircle1}
              >
                <Ionicons
                  name="arrow-forward-circle"
                  size={30}
                  color="#fdbf2d"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.payHireModalRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.payHireModalLabel}>Total Price</Text>
                <Text style={styles.payHireModalValue}>CAD 1,150.00</Text>
              </View>
              <Text style={styles.payHireModalDivider} />
              <View style={{ flex: 1 }}>
                <Text style={styles.payHireModalLabel}>Hourly Rate</Text>
                <Text style={styles.payHireModalValue}>CAD 11.50</Text>
              </View>
            </View>
            <Text>
              <Text style={styles.payHireModalRedText}>100 Hours</Text>
              <Text style={styles.payHireModalText}>
                {" "}
                is expected for the job to be done.
              </Text>
            </Text>

            <Text style={styles.payHireModalBoldText}>
              Applying for 100 hours job
            </Text>
            <Text style={styles.payHireModalAgreement}>
              By hiring this employee I agree to the Djobzy Terms and Conditions
              and Policies and that I have given enough time to read it and
              understand that it contains important information about my use of
              Djobzy, like limiting liability and my agreement on how disputes
              between me and Djobzy will be handled
            </Text>
            <View style={styles.payHireModalCheckRow}>
              <TouchableOpacity>
                <Ionicons name="help-circle" size={24} color="#303030" />
              </TouchableOpacity>

              <Text style={styles.payHireModalCheckText}>
                Make sure to contact the employee via chat to arrange the
                details
              </Text>
            </View>
            <View style={styles.hireButtonRow}>
              <TouchableOpacity style={styles.payBtn}>
                <Text style={styles.payBtnEditText}>Pay & Hire</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonBoost}>
                <Text style={styles.buttonBoostText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeactivateModal}
        animationType="slide"
        transparent
        onRequestClose={closeDeactivateModal}
      >
        <View style={styles.deActivateModalOverlay}>
          <View style={styles.deActivateModalCard}>
            <View style={styles.deActivateModalHeader}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/1.jpg",
                }}
                style={styles.deActivateModalAvatar}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.DeactivateModalName}>John deo</Text>
                <View style={{ flexDirection: "row", marginTop: 2, gap: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={13}
                      color="#EBBE56"
                      style={{ marginRight: 1 }}
                    />
                  ))}
                </View>
              </View>
              <TouchableOpacity
                style={styles.moreCircle1}
              >
                <Ionicons
                  name="arrow-forward-circle"
                  size={30}
                  color="#fdbf2d"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.deActivateModalRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.deActivateModalText}>Are you sure you want to deactivate this job post</Text>
                <Text style={styles.deActivateModalbelowText}>After this action, your job will no longer be public. </Text>
              </View>
              <Text style={styles.deActivateModalDivider} />
              <View style={{ flex: 1 }}>
                <Text style={styles.deActivateModalLabel}>Hou rly Rate</Text>
                <Text style={styles.deActivateModalValue}>CAD 11.50</Text>
              </View>
            </View>
            <Text>
              <Text style={styles.deActivateModalRedText}>100 Hours</Text>
              <Text style={styles.deActivateModalText}>
                {" "}
                is expected for the job to be done.
              </Text>
            </Text>

            <Text style={styles.payHireModalBoldText}>
              Applying for 100 hours job
            </Text>
            <Text style={styles.payHireModalAgreement}>
              By hiring this employee I agree to the Djobzy Terms and Conditions
              and Policies and that I have given enough time to read it and
              understand that it contains important information about my use of
              Djobzy, like limiting liability and my agreement on how disputes
              between me and Djobzy will be handled
            </Text>
            <View style={styles.payHireModalCheckRow}>
              <TouchableOpacity>
                <Ionicons name="help-circle" size={24} color="#303030" />
              </TouchableOpacity>

              <Text style={styles.payHireModalCheckText}>
                Make sure to contact the employee via chat to arrange the
                details
              </Text>
            </View>
            <View style={styles.hireButtonRow}>
              <TouchableOpacity style={styles.payBtn}>
                <Text style={styles.payBtnEditText}>Pay & Hire</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonBoost}>
                <Text style={styles.buttonBoostText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  titleContainer: {
    marginBottom: 9,
  },
  jobTitle: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 18,
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  postedTime: {
    color: "#c3c3c3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 5,
  },

  cardContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ffffff33",
    paddingTop: 10,
    marginBottom: 8,
  },

  cardHeading: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 5,
    letterSpacing: 0.1,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    marginBottom: 5,
  },
  chip: {
    backgroundColor: "#ffffff1a",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
  },

  pricingInfo: {
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 10,
  },
  pricingHighlight: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 10,
  },
  projectDuration: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    marginBottom: 3,
  },
  cardText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Montserrat_400Regular",
    marginTop: 2,
  },
  hourInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  hourInfo: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
  },
  isInfo: {
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 90,
  },
  buttonEdit: {
    flex: 1,
    backgroundColor: "#fdbf2d",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginRight: 10,
    marginTop: 10,
  },
  buttonEditText: {
    color: "#242424",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.1,
  },
  buttonBoost: {
    flex: 1,
    backgroundColor: "#46a282",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 10,
  },
  buttonBoostText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.1,
  },
  hireButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  payBtn: {
    flex: 1,
    backgroundColor: "#cb7767",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginRight: 10,
    marginTop: 10,
  },
  payBtnEditText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.1,
  },
  biddingsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  biddingsTitle: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  biddingsSortBy: {
    color: "#fdbf2d",
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    textDecorationLine: "underline",
  },

  biddingsSubText: {
    color: "#ffffff",
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    paddingBottom: 15,
  },

  biddingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  biddingCard: {
    width: "48%",
    backgroundColor: "#ffffff1a",
    borderRadius: 12,
    padding: 11,
    marginBottom: 12,
  },
  biddingCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#c3c3c3",
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    color: "#ffffff",
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    borderRadius: 4,
    flexShrink: 1,
    flexWrap: "wrap",
  },

  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  moreCircle: {
    width: 22,
    height: 30,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  biddingDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  biddingDetailsCol: {
    flex: 1,
  },
  biddingDetailsLabel: {
    color: "#b9b9b9",
    fontFamily: "Montserrat_500Medium",
    fontSize: 10,
  },
  biddingDetailsValue: {
    color: "#fff",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 9,
  },

  biddingPayHireBtn: {
    backgroundColor: "#d17b68",
    borderRadius: 7,
    paddingVertical: 8,
    alignItems: "center",
  },
  biddingPayHireBtnText: {
    color: "#ffffff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    letterSpacing: 0.1,
  },

  deactivateBtn: {
    backgroundColor: "#e94235",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    width: "100%",
  },

  deactivateBtnText: {
    color: "#fff",
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    letterSpacing: 0.1,
  },

  verticalDivider: {
    width: 1.5,
    height: "60%",
    backgroundColor: "#dedede40",
    marginHorizontal: 10,
    alignSelf: "center",
  },

  payHireModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  payHireModalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    padding: 18,
    paddingBottom: 38,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 12,
    maxHeight: "93%",
  },
  payHireModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  payHireModalAvatar: {
    width: 58,
    height: 58,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#c3c3c3",
  },
  payHireModalName: {
    color: "#000000",
    fontSize: 18,
    fontFamily: "Montserrat_500Medium",
  },
  payHireModalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 9,
    borderWidth: 1,
    borderColor: "#00000033",
    borderRadius: 10,
  },
  payHireModalLabel: {
    color: "#000000",
    fontSize: 12,
    marginBottom: 3,
    marginTop: 4,
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
  },
  payHireModalValue: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },
  payHireModalDivider: {
    borderLeftWidth: 1,
    borderLeftColor: "#00000033",
    height: "70%",
    marginHorizontal: 12,
  },
  payHireModalRedText: {
    color: "#cb7767",
    fontSize: 12,
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 2,
  },
  payHireModalText: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#000000",
  },
  payHireModalBoldText: {
    color: "#cb7767",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginVertical: 8,
  },
  payHireModalAgreement: {
    color: "#303030",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 8,
    marginTop: 2,
    lineHeight: 18,
  },
  payHireModalCheckRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 16,
    marginTop: 6,
  },
  payHireModalCheckText: {
    color: "#303030",
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
});
