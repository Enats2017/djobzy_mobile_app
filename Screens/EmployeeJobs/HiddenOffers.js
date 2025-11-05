import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NoJobs from "./NoJobs";

const HiddenOffer = ({hiddenOffer=[]}) => {

   if (!hiddenOffer.length) {
    return (
      <View style={styles.empty}>
        <NoJobs/>
      </View>
    );
  }
  return (
    <View style={styles.card2}>
      <View style={styles.cardHeader2}>
        <View style={styles.avatarWrapperOuter2}>
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/women/90.jpg",
            }}
            style={styles.avatarImage2}
          />
        </View>

        <View style={styles.userInfo2}>
          <View style={styles.nameStarsRow2}>
            <Text style={styles.username2}>DJOzifa02</Text>
            <View style={styles.starsRow2}>
              {[...Array(5)].map((_, i) => (
                <FontAwesome
                  key={i}
                  name="star"
                  size={10}
                  color="#EBBE56"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
          </View>

          <View style={styles.verificationRow2}>
            <MaterialIcons
              name="check-circle"
              size={16}
              color="#C3C3C3"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.verification2}>Verification Level: 2/7</Text>
          </View>
        </View>

        <View style={styles.offeredSection2}>
          <Text style={styles.offeredPriceText2}>Offered Price</Text>
          <View style={styles.cadButton2}>
            <Text style={styles.cadButtonText2}>CAD 300.00</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title2}>Graphic Designer Wanted</Text>
      <Text style={styles.posted2}>Posted 10:28 08/10/2025</Text>

      <View style={styles.sectionBox2}>
        <Text style={styles.sectionTitle2}>Introduction Letter</Text>
        <Text style={styles.sectionText2}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      </View>

      <View style={styles.sectionBox2}>
        <Text style={styles.sectionTitle2}>Job Description</Text>
        <Text style={styles.sectionText2}>
          We are seeking a talented and passionate Graphic Designer to join our
          creative team.
        </Text>
      </View>

      <View style={styles.actionRow2}>
        <TouchableOpacity style={styles.viewBtn2}>
          <Text style={styles.viewBtnText2}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card2: {
    backgroundColor: "#444444ff",
    borderRadius: 12,
    width: "100%",
    padding: 15,
  },

  cardHeader2: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarWrapperOuter2: {
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 30,
    marginRight: 2,
    width: 55,
    height: 55,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  avatarImage2: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    marginLeft: 1,
  },

  userInfo2: { flex: 1 },

  nameStarsRow2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  starsRow2: {
    flexDirection: "row",
  },

  username2: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginLeft: 8,
  },

  verificationRow2: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 8,
  },
  verification2: {
    color: "#C3C3C3",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  cadButton2: {
    backgroundColor: "#AEAEAE",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cadButtonText2: {
    fontFamily: "Montserrat_700Bold",
    color: "#000000",
    fontSize: 13,
  },

  title2: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 2,
    fontFamily: "Montserrat_700Bold",
  },
  posted2: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 12,
  },

  sectionBox2: {
    borderColor: "#ffffff33",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
  },
  sectionTitle2: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 6,
    fontFamily: "Montserrat_500Medium",
  },
  sectionText2: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Montserrat_400Regular",
  },

  actionRow2: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  viewBtn2: {
    backgroundColor: "#C96B59",
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 2,
  },
  viewBtnText2: {
    fontFamily: "Montserrat_700Bold",
    color: "#fff",
    fontSize: 15,
  },

  offeredPriceText2: {
    color: "#ffffff",
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Montserrat_500Medium",
    marginBottom: 4,
  },

  offeredSection2: {
    alignItems: "center",
  },
});

export default HiddenOffer;
