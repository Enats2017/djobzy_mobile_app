import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import QuestionMark from "../../components/QuestionMark";
import { tooltipMessage } from "../../components/TooltipMessage";

const parseImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getStartingPrice = (item) => {
  const weekday = parseFloat(item?.weekday_rate);
  if (isNaN(weekday)) return null;
  return weekday;
};

export default function ProfileHotelRoomsSection({ hotelBookings = [], onViewRoom }) {
  return (
    <View style={styles.section}>
      <View style={styles.label}>
        <QuestionMark
          title="Rooms"
          iconColor="#fff"
          tooltipMessage={tooltipMessage.hotel_room_tooltip}
        />
      </View>

      {hotelBookings?.length > 0 && (
        <ScrollView
          horizontal
          contentContainerStyle={styles.wrapperRow}
          showsHorizontalScrollIndicator={false}
        >
          {hotelBookings.map((item, index) => {
            const images = parseImages(item.images);
            const firstImage = images[0];
            const startingPrice = getStartingPrice(item);

            return (
              <View key={item.id ?? index} style={styles.card}>
                <View style={styles.imageWrap}>
                  {firstImage ? (
                    <Image
                      source={{ uri: firstImage }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                      <Text style={styles.placeholderText}>No image</Text>
                    </View>
                  )}
                </View>

                <View style={styles.info}>
                  <Text style={styles.roomType} numberOfLines={1}>
                    {item.room_type}
                  </Text>

                  {startingPrice != null && (
                    <>
                      <Text style={styles.price}>
                        CAD {startingPrice.toFixed(2)}
                        <Text style={styles.priceUnit}> /night</Text>
                      </Text>
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.viewDetailsBtn}
                    onPress={() => onViewRoom?.(item.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.viewDetailsText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const CARD_WIDTH = 170;
const IMAGE_HEIGHT = 100;

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  label: {
    marginBottom: 10,
  },
  wrapperRow: {
    paddingRight: 8,
  },
  card: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#ffffff1a',
    backgroundColor: '#ffffff1a',
    width: CARD_WIDTH,
    marginRight: 12,
    overflow: 'hidden',
    padding: 6,
  },
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 11,
    fontFamily: 'Montserrat_400Regular',
    color: 'rgba(255,255,255,0.5)',
  },
  info: {
    width: '100%',
    alignItems: 'flex-start',
  },
  roomType: {
    fontSize: 12,
    fontFamily: 'Montserrat_500Medium',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#d17b68',
    marginBottom: 10,
  },
  priceUnit: {
    fontSize: 10,
    fontFamily: 'Montserrat_500Medium',
    color: '#FFFFFFB3',
    fontStyle: 'italic',
  },
  viewDetailsBtn: {
    backgroundColor: '#C96B59',
    borderRadius: 10,
    padding: 14,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 16,
    fontFamily: 'Montserrat_700Bold',
  },
});
