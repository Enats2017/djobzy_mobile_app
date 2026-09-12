import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // make sure you have @expo/vector-icons installed

const HotelPageHeader = ({ navigation, title }) => {
    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.arrow}>
                    <Ionicons name="chevron-back" size={30} color="#D96F52" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    arrow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#CB77671A",
        width: 40,
        height: 40,
        borderRadius: 100,
    },
    headerTitle: {
        marginLeft: 10,
        fontSize: 20,
        fontFamily: 'DegularDisplay_600SemiBold',
        color: '#CB7767',
    },
});

export default HotelPageHeader;
