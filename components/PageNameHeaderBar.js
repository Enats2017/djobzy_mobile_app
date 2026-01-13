import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // make sure you have @expo/vector-icons installed

const PageNameHeaderBar = ({ navigation, title, activeTab = null, setActiveTab = null, paddingTop=20, marginBottom=20, }) => {
     const handleBackPress = () => {
    // Case 1: If component has tab props → go to previous tab
    if (activeTab !== null && setActiveTab && activeTab > 0) {
      setActiveTab(0);
      return;
    }
    // Case 2: Normal navigation back
    if (navigation) {
      navigation.goBack();
    }
  };

    return (
        <TouchableOpacity
            style={[styles.dashboardHeader, {paddingTop}]}
            onPress={handleBackPress}
        >
            <View style={styles.arrow}>
                <Ionicons name="chevron-back" size={30} color="#ffffff" />
            </View>

            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    dashboardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        paddingTop: 20,
        gap: 10,
    },
    arrow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#313131",
        width: 40,
        height: 40,
        borderRadius: 100,
    },
    title: {
        fontSize: 20,
        
        fontStyle: 'DegularDisplay_600SemiBold', // ensure this font is available in your project
        color: '#ffffff',
    },
});

export default PageNameHeaderBar;
