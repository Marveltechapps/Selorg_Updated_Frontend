import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '../types/navigation';

interface SectionImageProps {
  image?: ImageSourcePropType;
  onPress?: () => void;
}

export default function SectionImage({ image, onPress }: SectionImageProps) {
  const navigation = useNavigation<RootStackNavigationProp>();
  // Use provided image or use section-image.png from Figma
  const imageSource = image || require('../assets/images/section-image.png');

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to tiny-timmies page when clicked
      navigation.navigate('TinyTimmies');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  imageContainer: {
    width: '100%',
    borderRadius: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: undefined,
    resizeMode: 'cover',
  },
});

