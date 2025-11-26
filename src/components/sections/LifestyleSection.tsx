import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, ImageSourcePropType } from 'react-native';
import LifestyleCard, { LifestyleItem } from '../LifestyleCard';
import { logger } from '@/utils/logger';

// Exact images from Figma - downloaded and ready to use
const DUMMY_LIFESTYLE_ITEMS: LifestyleItem[] = [
  {
    id: '1',
    title: 'Improve Immunity',
    image: require('../../assets/images/lifestyle/improve-immunity-49cf52.png'),
    imagePosition: { x: 0, y: 34, width: 152, height: 111 },
    titlePosition: { x: 15, y: 12, width: 122 },
  },
  {
    id: '2',
    title: 'Skin Glow',
    image: require('../../assets/images/lifestyle/skin-glow-805499.png'),
    imagePosition: { x: 29, y: 29, width: 96, height: 94 },
    titlePosition: { x: 43, y: 12, width: 67 },
  },
  {
    id: '3',
    title: 'Gut Health Basket',
    image: require('../../assets/images/lifestyle/gut-health-a137ba.png'),
    imagePosition: { x: 24, y: 26, width: 114, height: 106 },
    titlePosition: { x: 15, y: 12, width: 123 },
  },
  {
    id: '4',
    title: 'Detox & Cleanse',
    image: require('../../assets/images/lifestyle/detox-cleanse-5c5800.png'),
    imagePosition: { x: 5, y: 40, width: 145, height: 76 },
    titlePosition: { x: 21, y: 12, width: 111 },
  },
  {
    id: '5',
    title: 'Muscle Recovery',
    image: require('../../assets/images/lifestyle/muscle-recovery.png'),
    imagePosition: { x: 21, y: 20, width: 106, height: 106 },
    titlePosition: { x: 21, y: 12, width: 116 },
  },
];

interface LifestyleSectionProps {
  onItemPress?: (itemId: string) => void;
  fetchItems?: () => Promise<LifestyleItem[]>;
  headerImage?: ImageSourcePropType;
}

export default function LifestyleSection({
  onItemPress,
  fetchItems,
  headerImage,
}: LifestyleSectionProps) {
  const [items, setItems] = useState<LifestyleItem[]>(DUMMY_LIFESTYLE_ITEMS);
  const [loading, setLoading] = useState(false);

  // Use provided header image or load exact image from Figma
  const headerImg: ImageSourcePropType = headerImage || require('../../assets/images/lifestyle/lifestyle-header.png');

  // Placeholder for API integration
  useEffect(() => {
    if (fetchItems) {
      const loadItems = async () => {
        setLoading(true);
        try {
          const data = await fetchItems();
          setItems(data);
        } catch (error) {
          logger.error('Error fetching lifestyle items', error);
          // Fallback to dummy data on error
          setItems(DUMMY_LIFESTYLE_ITEMS);
        } finally {
          setLoading(false);
        }
      };
      loadItems();
    }
  }, [fetchItems]);

  const handleItemPress = (itemId: string) => {
    if (onItemPress) {
      onItemPress(itemId);
    } else {
      logger.info('Lifestyle item pressed', { itemId });
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Shape */}
      <View style={styles.backgroundShape} />

      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image source={headerImg} style={styles.headerImage} resizeMode="cover" />
      </View>

      {/* Lifestyle Cards - Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {items.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.cardWrapper,
              index === 0 && styles.firstCard,
              index === items.length - 1 && styles.lastCard,
            ]}
          >
            <LifestyleCard item={item} onPress={handleItemPress} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 317,
    position: 'relative',
    paddingHorizontal: 0,
    paddingTop: 16, // No top padding since spacing is handled by GreensBanner
    paddingBottom: 20,
    overflow: 'hidden',
  },
  backgroundShape: {
    position: 'absolute',
    left: -29,
    top: 0,
    width: 440,
    height: 317,
    backgroundColor: '#9DE8F7',
  },
  headerImageContainer: {
    position: 'absolute',
    left: 9.25,
    top: 5,
    width: 363.5,
    height: 128,
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    position: 'absolute',
    left: 8,
    top: 147.7,
    right: 0,
    height: 145,
    zIndex: 1,
  },
  scrollContent: {
    paddingRight: 16,
    paddingLeft: 0,
  },
  cardWrapper: {
    marginRight: 16,
  },
  firstCard: {
    marginLeft: 0,
  },
  lastCard: {
    marginRight: 16,
  },
});

