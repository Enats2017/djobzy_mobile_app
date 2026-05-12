import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const StarRating = ({ rating = 0, starSize = 15, starColor = '#FFC107' }) => {
    if (!rating || rating === 0) return null;
    const getStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const decimal = rating - fullStars;
        for (let i = 0; i < fullStars; i++) {
            stars.push('star');
        }
        if (decimal >= 0.6) {
            stars.push('star');
        } else if (decimal >= 0.1) {
            stars.push('star-half-o');
        }
        return stars;
    };

    const stars = getStars(rating);
    return (
        <View style={styles.starRow}>
            {stars.map((starType, i) => (
                <FontAwesome
                    key={i}
                    name={starType}
                    size={starSize}
                    color={starColor}
                    style={styles.starIcon}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        marginHorizontal: 2,
    },
});

export default StarRating;