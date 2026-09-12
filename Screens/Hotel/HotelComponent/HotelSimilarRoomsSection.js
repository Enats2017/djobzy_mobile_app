import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';

const CARD_WIDTH = Dimensions.get('window').width;
const IMAGE_HEIGHT = 180;

const SimilarRoomCard = ({ room, onView }) => {
    const price = Number(room.active_price ?? room.customer_weekday_rate ?? 0);

    return (
        <View style={styles.card}>
            <Image
                source={{ uri: room.images?.[0] }}
                style={styles.cardImage}
                resizeMode="cover"
            />

            <View style={styles.cardBody}>
                <Text style={styles.roomTitle} numberOfLines={1}>
                    {room.room_type}
                </Text>
                <Text style={styles.roomsAvailable}>
                    {room.number_of_rooms} Rooms Available
                </Text>

                <View style={styles.divider} />

                <View style={styles.bottomRow}>
                    <Text style={styles.price}>${price.toFixed(2)}</Text>

                    <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() => onView?.(room)}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.viewBtnText}>View Room</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

/**
 * Props:
 *  - rooms: pricing.similar_rooms from the customer-hotel-view response
 *  - onViewRoom: called with the room object when "View Room" is tapped
 */
const HotelSimilarRoomsSection = ({ rooms = [], onViewRoom }) => {
    if (!rooms.length) return null;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other rooms at this address</Text>

            <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsRow}
                decelerationRate="fast"
            >
                {rooms.map((room) => (
                    <SimilarRoomCard key={room.id} room={room} onView={onViewRoom} />
                ))}
            </ScrollView>
        </View>
    );
};

export default HotelSimilarRoomsSection;

const styles = StyleSheet.create({
    section: {
        marginTop: 20,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginBottom: 10,
    },
    cardsRow: {
        gap: 14,
        paddingRight: 4,
    },
    card: {
        width: "100%",
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#d6d6d6',
        borderRadius: 14,
    },
    cardImage: {
        width: '100%',
        height: IMAGE_HEIGHT,
        backgroundColor: '#EFEFEF',
    },
    cardBody: {
        padding: 14,
    },
    roomTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
        color: '#303030',
        marginBottom: 4,
    },
    roomsAvailable: {
        fontSize: 13,
        lineHeight: 19,
        fontFamily: 'Montserrat_500Medium',
        color: '#303030',
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#CFCFCF',
        marginBottom: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 22,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#303030',
    },
    viewBtn: {
        backgroundColor: '#C96B59',
        borderRadius: 10,
        paddingHorizontal: 18,
        paddingVertical: 9,
    },
    viewBtnText: {
        color: '#FFFFFF',
        fontSize: 20,
        lineHeight: 28,
        fontFamily: 'Montserrat_700Bold',
    },
});
