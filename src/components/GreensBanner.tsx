import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';

interface GreensBannerProps {
  image?: ImageSourcePropType;
  onPress?: () => void;
}

export default function GreensBanner({ image, onPress }: GreensBannerProps) {
  // Use provided image or use section-image.png as fallback
  const bannerImage = image || require('../assets/images/section-image.png');

  return (
    <View style={styles.container}>
      <View style={styles.bannerWrapper}>
        <TouchableOpacity
          style={styles.bannerContainer}
          onPress={onPress}
          activeOpacity={0.9}
        >
          <Image
            source={bannerImage}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 32,
    gap: 0,
  },
  bannerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  bannerContainer: {
    width: 349,
    height: 96,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
});
