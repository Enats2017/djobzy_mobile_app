
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PageNameHeaderBar from "../../components/PageNameHeaderBar";
import SearchBar from "../../components/SearchBar";
import { useNavigation } from "@react-navigation/native";

const FeedChat = () => {
    const navigation = useNavigation();
  return (
    <>
    <SafeAreaView style ={{flex:1}}>
        <View style ={styles.container}>
           
                <PageNameHeaderBar title="Chat"/>
                <SearchBar/>
            
             {/* <View style={styles.topBar}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find anything"
            placeholderTextColor="rgba(255,255,255,0.6)"
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="filter-list" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Entypo name="dots-three-vertical" size={18} color="#fff" />
        </TouchableOpacity>
      </View> */}

      {/* ---------- Row 1 ---------- */}
      <TouchableOpacity style={styles.row} onPress={()=>navigation.navigate("ChatCommunication")}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.rowText}>
          <View style={styles.rowTop}>
            <Text style={styles.name}>Gabrilla</Text>
            <Text style={styles.time}>10:00 AM</Text>
          </View>

          <View style={styles.rowBottom}>
            <Text numberOfLines={1} style={styles.subtitle}>
              Auctor urna, varius .............
            </Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* ---------- Row 2 ---------- */}
      <View style={styles.row}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.rowText}>
          <View style={styles.rowTop}>
            <Text style={styles.name}>Ozuka</Text>
            <Text style={styles.time}>Today</Text>
          </View>

          <View style={styles.rowBottom}>
            <Text numberOfLines={1} style={styles.subtitle}>
              Start messaging...
            </Text>
          </View>
        </View>
      </View>

      {/* ---------- Row 3 ---------- */}
      <View style={styles.row}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/83.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.rowText}>
          <View style={styles.rowTop}>
            <Text style={styles.name}>Victor</Text>
            <Text style={styles.time}>Today</Text>
          </View>

          <View style={styles.rowBottom}>
            <Text numberOfLines={1} style={styles.subtitle}>
              Start messaging...
            </Text>
          </View>
        </View>
      </View>

        </View>

    </SafeAreaView>
      
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingHorizontal:15
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    gap: 10,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },
  searchIcon: {
    color: "rgba(255,255,255,0.8)",
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  iconBtn: {
    padding: 8,
    marginLeft: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  rowText: { flex: 1 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    flex: 1,
  },
  badge: {
    backgroundColor: "#ff7a00",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default FeedChat
