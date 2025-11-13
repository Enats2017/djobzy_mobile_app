import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons,MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";

const EmployeeVerification = () => {
  
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };
  const isSelected = (id) => selected.includes(id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PageNameHeaderBar title="Verification"/>
        <ScrollView showsVerticalScrollIndicator={false}>
           <Text style={styles.sectionTitle}>Your Verification Level</Text>
            <Text style={styles.description}>
            Higher Verification levels increase your chances of landing a job or finding employees,
            Showing you higher in search results, Enabling you to gain others trust easier, and
            enhancing your Djobzy Experience.
            </Text>
             <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.box,
            selected.includes(1) ? styles.verified : styles.unverified,
          ]}
          onPress={() => toggleSelect(1)}
        >
          <View style={styles.topRow}>
            <Text style={[
                    styles.label,
                     isSelected(1) && styles.activeText,
                  ]}>Email</Text>
            <MaterialIcons name="verified" size={18}  color={isSelected(1) ? "#fff" : "#c3c3c3"} />
          </View>
          <Text style={styles.number}>01</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.box,
            selected.includes(2) ? styles.verified : styles.unverified,
          ]}
          onPress={() => toggleSelect(2)}
        >
          <View style={styles.topRow}>
            <Text style={styles.label}>Phone Number</Text>
            <MaterialIcons name="verified" size={18} color="#c3c3c3c3" />
          </View>
          <Text style={styles.number}>02</Text>
        </TouchableOpacity>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.box,
            selected.includes(3) ? styles.verified : styles.unverified,
          ]}
          onPress={() => toggleSelect(3)}
        >
          <View style={styles.topRow}>
            <Text style={styles.label}>Social Media Accounts</Text>
            <MaterialIcons name="verified" size={18} color="#c3c3c3c3" />
          </View>
          <Text style={styles.number}>03</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.box,
            selected.includes(4) ? styles.verified : styles.unverified,
          ]}
          onPress={() => toggleSelect(4)}
        >
          <View>
            <View style={styles.topRow}>
            <Text style={styles.label}>Address</Text>
            <MaterialIcons name="verified" size={18} color="#c3c3c3c3" />
          </View>
            <Text style={styles.time}>1-2 min</Text>
          </View>
          
          <Text style={styles.number}>04</Text>
        </TouchableOpacity>
        
      </View>

      {/* Row 3 */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.box,
            selected.includes(5) ? styles.verified : styles.unverified,
          ]}
          onPress={() => toggleSelect(5)}
        >
          <View>
            <View style={styles.topRow}>
            <Text style={styles.label}>ID Card & Certificates</Text>
            <MaterialIcons name="verified" size={18} color="#c3c3c3c3" />
          </View>
            <Text style={styles.time}>1-2 min</Text>
          </View>
          <Text style={styles.number}>05</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.box,
            selected.includes(6) ? styles.verified : styles.unverified,
          ]}
          onPress={() => toggleSelect(6)}
        >
          <View>
             <View style={styles.topRow}>
            <Text style={styles.label}>Credit / Debit Card Verification</Text>
            <MaterialIcons name="verified" size={18} color="#c3c3c3c3" />
          </View>
            <Text style={styles.time}>1-2 min</Text>
          </View>
          <Text style={styles.number}>06</Text>
            
        </TouchableOpacity>
      </View>

      {/* Row 4 */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.box,
            selected.includes(7) ? styles.verified : styles.unverified,
          ]}
          onPress={() => toggleSelect(7)}
        >
          <View>
            <View style={styles.topRow}>
            <Text style={styles.label}>Interview&Background Check...</Text>
            <MaterialIcons name="verified" size={18} color="#c3c3c3c3" />
          </View>
            <Text style={styles.time}>1-2 min</Text>
          </View>
          <Text style={styles.number}>07</Text>
        </TouchableOpacity>
      </View>

            <View style={styles.addressSection}>
            <Text style={styles.addressTitle}>Address</Text>
            <Text style={styles.addressDesc}>
                Please provide your official address. Please submit an official bill
                dated within the past 3 months to verify your address.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Postal code"
                placeholderTextColor="#aaa"
            />
            </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
   
  },
  container: {
    flex: 1,
     backgroundColor: "#1c1c1c",
    paddingHorizontal: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  description: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
  },
 row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  box: {
    width: "48%",
    height: 90,
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  verified: {
    backgroundColor: "#2CA66F",
  },
  unverified: {
    backgroundColor: "#565656",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#c3c3c3c3",
    fontFamily:"Montserrat_500Medium",
    fontSize: 14,
    maxWidth:100
  },
  time: {
    color: "#A0A0A0",
    fontSize: 12,
    marginTop: 4,
  },
  number: {
    position: "absolute",
    bottom: 8,
    right: 10,
    color: "#c3c3c3c3",
    fontSize: 16,
   
  },
  timeText: {
    color: "#c3c3c3c3",
    fontSize: 11,
    marginTop: 4,
  },
  addressSection: {
    marginTop: 10,
  },
  addressTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 5,
  },
  addressDesc: {
    color: "#bbb",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#2b2b2b",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
  },
});

export default EmployeeVerification;
