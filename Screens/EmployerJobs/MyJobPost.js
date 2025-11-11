import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";

export default function MyJobPost() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.jobpostcontainer}>
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <PageNameHeaderBar navigation={navigation} title="My Job Posts" />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.viewBoostedJobsBtn}>
            <Text style={styles.viewBoostedJobsText}>View Boosted Jobs</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.jobCard}>
          <View style={styles.topInfoContainer}>
            <View style={styles.leftInfo}>
              <Text style={styles.jobTitle}>
                Looking For logo designer Looking For logo designer
              </Text>
              <Text style={styles.jobId}>Posted 10:24 04/10/2025</Text>
            </View>
            <View style={styles.rightInfo}>
              <View style={styles.proposalsRow}>
                <Text style={styles.proposalsLabel}>Proposals</Text>
                <Text style={styles.proposalsCount}>1200</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Total Price :</Text>
                <Text style={styles.detailValue}>CAD 20000.00</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Hourly Rate :</Text>
                <Text style={styles.detailValue}>CAD 20000.00</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Expected Hours :</Text>
              <Text style={styles.detailValue}>20000</Text>
            </View>
          </View>

          <View style={styles.jobDescriptionCard}>
            <Text style={styles.jobDescriptionLabel}>Job Description</Text>
            <Text style={styles.jobDescriptionText}>
              I am looking for a professional logo designer for my website we
              are making an Munchrise. I am looking for a professional logo
              designer for my website we are making an Munchrise. I am looking
              for a professional logo designer for my website we are making an
              Munchrise.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boostBtn}>
              <Text style={styles.boostBtnText}>Boost</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.jobCard}>
          <View style={styles.topInfoContainer}>
            <View style={styles.leftInfo}>
              <Text style={styles.jobTitle}>
                Looking For logo designer Looking For logo designer logo
                designerlogo designerlogo designer
              </Text>
              <Text style={styles.jobId}>Posted 10:24 04/10/2025</Text>
            </View>
            <View style={styles.rightInfo}>
              <View style={styles.proposalsRow}>
                <Text style={styles.proposalsLabel}>Proposals</Text>
                <Text style={styles.proposalsCount}>100000</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Total Price :</Text>
                <Text style={styles.detailValue}>CAD 20.00</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Hourly Rate :</Text>
                <Text style={styles.detailValue}>CAD 20.00</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Expected Hours :</Text>
              <Text style={styles.detailValue}>20</Text>
            </View>
          </View>

          <View style={styles.jobDescriptionCard}>
            <Text style={styles.jobDescriptionLabel}>Job Description</Text>
            <Text style={styles.jobDescriptionText}>
              I am looking for a professional logo designer for my website we
              are making an Munchrise.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boostBtn}>
              <Text style={styles.boostBtnText}>Boost</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.jobCard}>
          <View style={styles.topInfoContainer}>
            <View style={styles.leftInfo}>
              <Text style={styles.jobTitle}>
                Looking For logo designer Looking For logo designer
              </Text>
              <Text style={styles.jobId}>Posted 10:24 04/10/2025</Text>
            </View>
            <View style={styles.rightInfo}>
              <View style={styles.proposalsRow}>
                <Text style={styles.proposalsLabel}>Proposals</Text>
                <Text style={styles.proposalsCount}>10000</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Total Price :</Text>
                <Text style={styles.detailValue}>CAD 200.00</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Hourly Rate :</Text>
                <Text style={styles.detailValue}>CAD 200.00</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Expected Hours :</Text>
              <Text style={styles.detailValue}>2000</Text>
            </View>
          </View>

          <View style={styles.jobDescriptionCard}>
            <Text style={styles.jobDescriptionLabel}>Job Description</Text>
            <Text style={styles.jobDescriptionText}>
              I am looking for a professional logo designer for my website we
              are making an Munchrise. I am looking for a professional logo
              designer for my website we are making an Munchrise.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boostBtn}>
              <Text style={styles.boostBtnText}>Boost</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.jobCard}>
          <View style={styles.topInfoContainer}>
            <View style={styles.leftInfo}>
              <Text style={styles.jobTitle}>Looking For logo designer</Text>
              <Text style={styles.jobId}>Posted 10:24 04/10/2025</Text>
            </View>
            <View style={styles.rightInfo}>
              <View style={styles.proposalsRow}>
                <Text style={styles.proposalsLabel}>Proposals</Text>
                <Text style={styles.proposalsCount}>10</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Total Price :</Text>
                <Text style={styles.detailValue}>CAD 20.00</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Hourly Rate :</Text>
                <Text style={styles.detailValue}>CAD 20.00</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Expected Hours :</Text>
              <Text style={styles.detailValue}>20</Text>
            </View>
          </View>

          <View style={styles.jobDescriptionCard}>
            <Text style={styles.jobDescriptionLabel}>Job Description</Text>
            <Text style={styles.jobDescriptionText}>
              I am looking for a professional logo designer for my website we
              are making an Munchrise.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boostBtn}>
              <Text style={styles.boostBtnText}>Boost</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  jobpostcontainer: {
    flex: 1,
    backgroundColor: "#222222",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 10,
  },
  viewBoostedJobsBtn: {
    backgroundColor: "#FDBF2D",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  viewBoostedJobsText: {
    color: "#000000",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  jobCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  topInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  leftInfo: {
    flex: 1,
  },
  jobTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  jobId: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Montserrat_400Regular",
    marginTop:4,
  },
  rightInfo: {
    alignItems: "flex-end",
    justifyContent: "center",
    // marginLeft: 10,
  },
  proposalsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },

  proposalsLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  proposalsCount: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  detailsCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF33",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
    flexWrap: "wrap",
  },

  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 1,
    flexWrap: "wrap",
  },

  detailLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  detailValue: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  jobDescriptionCard: {
    backgroundColor: "#ffffff1a",
    borderRadius: 8,
    borderColor: "#FFFFFF33",
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
  },
  jobDescriptionLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 5,
  },
  jobDescriptionText: {
    color: "#ffffff",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Montserrat_400Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  viewBtn: {
    flex: 1,
    backgroundColor: "#D17B68",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  viewBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
  boostBtn: {
    flex: 1,
    backgroundColor: "#46A282",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  boostBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
});
