import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HORIZONTAL_MARGIN = 16;
const IMAGE_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_MARGIN * 2;
const IMAGE_HEIGHT = 200;

function HotelImageCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useCallback((e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / IMAGE_WIDTH);
    setActiveIndex(index);
  }, []);

  if (!images || images.length === 0) {
    return (
      <View style={[styles.imageWrap, styles.imagePlaceholder]}>
        <Ionicons name="image-outline" size={32} color="#B0B0B0" />
        <Text style={styles.placeholderText}>No image available</Text>
      </View>
    );
  }

  return (
    <View style={styles.imageWrap}>
      <FlatList
        data={images}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
            resizeMode="cover"
          />
        )}
      />

      {images.length > 1 && (
        <View style={styles.dotsRow}>
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

export default function FeedHotelCard({ data }) {
  if (!data) {
    // feed_data failed to parse server-side — fail gracefully, not silently blank
    return (
      <View style={styles.fallback}>
        <Ionicons name="alert-circle-outline" size={16} color="#B0B0B0" />
        <Text style={styles.fallbackText}>Hotel details unavailable</Text>
      </View>
    );
  }

  const handleViewDetails = () => {
    if (data.view_details_url) {
      Linking.openURL(data.view_details_url).catch(() => {});
    }
  };

  return (
    <View style={styles.card}>
      <HotelImageCarousel images={data.images} />

      <View style={styles.info}>
        <View style={styles.titleRow}>
          {!!data.title && (
            <Text style={styles.title} numberOfLines={2}>
              {data.title}
            </Text>
          )}
          {data.is_new && <Text style={styles.newLabel}>NEW</Text>}
        </View>

        {!!data.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color="#D96F52" style={{ marginTop: 2, padding: 0 }} />
            <Text style={styles.locationText} numberOfLines={2}>
              {data.location}
            </Text>
          </View>
        )}

        {!!data.description && (
          <Text style={styles.description} numberOfLines={4}>
            {data.description}
          </Text>
        )}

        {data.facilities?.length > 0 && (
          <View style={styles.chipWrap}>
            {data.facilities.map((facility, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{facility}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.priceRow}>
          <View style={{ flex: 1 }}>
            {data.price != null && (
              <Text style={styles.price}>
                {data.currency ? `${data.currency} ` : ''}
                {Number(data.price).toFixed(2)}
              </Text>
            )}
            {!!data.price_unit && <Text style={styles.priceUnit}>{data.price_unit}</Text>}
          </View>

          {!!data.view_details_url && (
            <TouchableOpacity
              style={styles.viewDetailsBtn}
              // onPress={handleViewDetails}
              activeOpacity={0.85}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginTop: 10,
    marginBottom: 6,
  },
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#F0F0F0',
    position: 'relative',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: '#B0B0B0',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  info: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    color: '#303030',
    marginRight: 8,
  },
  newLabel: {
    fontSize: 12,
    fontFamily: "Montserrat_700Bold",
    color: '#F5A623',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  locationText: {
    flex: 1,
    marginLeft: 4,
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: '#6B7280',
    lineHeight: 18,
  },
  description: {
    fontSize: 16,
    color: '#000',
    fontFamily: "Montserrat_500Medium",
    lineHeight: 22,
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#6C9BA1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontFamily: "Montserrat_500Medium",
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: "Montserrat_700Bold",
    color: '#D17B68',
  },
  priceUnit: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: '#9A9A9A',
    fontStyle: 'italic',
  },
  viewDetailsBtn: {
    backgroundColor: '#D17B68',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 10,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Montserrat_600SemiBold",
  },
  fallback: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  fallbackText: {
    marginLeft: 6,
    fontSize: 12.5,
    color: '#B0B0B0',
    fontFamily: "Montserrat_500Medium",
  },
});