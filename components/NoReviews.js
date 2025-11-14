import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NoReviews = () => {
  return (
    <>
    <View style={styles.review}>
          <Image
            source={require("./../assets/images/nojobs.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.noContractText}>No reviews available at the moment.</Text>
          </View>
      
    </>
  )
}
const styles = StyleSheet.create({
  review: {
    flex: "1",
    justifyContent: "center",
    alignItems: "center",
  
  },

  noContractText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    paddingVertical: 10,
    fontFamily: "Montserrat_500Medium",
  },
})

export default NoReviews
