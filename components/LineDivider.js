import { View, StyleSheet } from 'react-native';

const LineDivider = () => {
    return (
        <View style={styles.dividerLine} />
    );
};

const styles = StyleSheet.create({
    dividerLine: {
        height: 1,
        backgroundColor: "rgba(200,200,200,0.4)",
        marginHorizontal: 1,
        marginVertical: 15,
    },
});

export default LineDivider;
