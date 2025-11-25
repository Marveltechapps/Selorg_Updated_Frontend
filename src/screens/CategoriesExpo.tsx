import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import type { RootStackNavigationProp } from '../types/navigation';
import SearchIcon from '../components/icons/SearchIcon';
import Text from '../components/common/Text';
import CategoryCard from '../components/CategoryCard';
import FloatingCartBar from '../components/FloatingCartBar';
import { useDimensions, getSpacing, scale } from '../utils/responsive';

// Dummy static data - ready for API replacement
interface Category {
  id: string;
  name: string;
  image: any;
}

interface CategoryGroup {
  id: string;
  title: string;
  categories: Category[];
}

// Dummy categories data - organized in groups
const DUMMY_CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: '1',
    title: 'Grocery & Kitchen',
    categories: [
      { id: '1', name: 'Fresh Vegetables', image: require('../assets/images/categories/fresh-vegetables.png') },
      { id: '2', name: 'Fresh Fruits', image: require('../assets/images/categories/fresh-fruits.png') },
      { id: '3', name: 'Dairy, Bread\nand Eggs', image: require('../assets/images/categories/dairy-bread-eggs.png') },
      { id: '4', name: 'Atta, Rice and Dal', image: require('../assets/images/categories/atta-rice-dal.png') },
      { id: '5', name: 'Oil and Ghee', image: require('../assets/images/categories/oil-ghee.png') },
      { id: '6', name: 'Masalas and\nWhole Spices', image: require('../assets/images/categories/masalas-spices.png') },
      { id: '7', name: 'Salt, Sugar\nand Jaggery', image: require('../assets/images/categories/salt-sugar-jaggery.png') },
      { id: '8', name: 'Dry Fruits\nand Seeds', image: require('../assets/images/categories/dry-fruits-seeds.png') },
      { id: '9', name: 'Sauces and spreads', image: require('../assets/images/categories/sauces-spreads.png') },
      { id: '10', name: 'Tea and coffee', image: require('../assets/images/categories/tea-coffee.png') },
      { id: '11', name: 'Vermicelli\nand Noodles', image: require('../assets/images/categories/vermicelli-noodles.png') },
    ],
  },
];

interface CategoriesScreenProps {
  fetchCategories?: () => Promise<CategoryGroup[]>;
  onCategoryPress?: (categoryId: string) => void;
  onSearchPress?: () => void;
}

export default function CategoriesScreen({
  fetchCategories,
  onCategoryPress,
  onSearchPress,
}: CategoriesScreenProps) {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>(DUMMY_CATEGORY_GROUPS);
  const [loading, setLoading] = useState(false);
  
  // Calculate responsive card width for 3-column grid
  const { width: screenWidth } = useDimensions();
  const containerPadding = getSpacing(16) * 2; // Left and right padding
  const gapBetweenCards = getSpacing(16); // Gap between cards in a row
  const totalGaps = gapBetweenCards * 2; // 2 gaps for 3 cards
  const cardWidth = (screenWidth - containerPadding - totalGaps) / 3;

  // Animation for header
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;

  // Calculate total number of category cards for animations
  const totalCategories = categoryGroups.reduce((sum, group) => sum + group.categories.length, 0);
  
  // Create animation refs for each category card
  const cardAnimations = useRef(
    Array.from({ length: totalCategories }, () => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.9),
    }))
  ).current;

  // Placeholder for API integration
  useEffect(() => {
    if (fetchCategories) {
      const loadCategories = async () => {
        setLoading(true);
        try {
          const data = await fetchCategories();
          setCategoryGroups(data);
        } catch (error) {
          console.error('Error fetching categories:', error);
          // Fallback to dummy data on error
          setCategoryGroups(DUMMY_CATEGORY_GROUPS);
        } finally {
          setLoading(false);
        }
      };
      loadCategories();
    }
  }, [fetchCategories]);

  // Animate header and cards when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Reset animation values
      headerOpacity.setValue(0);
      headerTranslateY.setValue(-20);
      cardAnimations.forEach((anim) => {
        anim.opacity.setValue(0);
        anim.scale.setValue(0.9);
      });

      // Header animation
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Staggered card animations
      cardAnimations.forEach((anim, index) => {
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            delay: index * 40, // 40ms delay between cards
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: 400,
            delay: index * 40,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, [])
  );

  const handleSearch = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      navigation.navigate('Search');
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    if (onCategoryPress) {
      onCategoryPress(categoryId);
    } else {
      // Find category name from dummy data
      const category = DUMMY_CATEGORY_GROUPS[0]?.categories.find((cat) => cat.id === categoryId);
      const categoryName = category?.name || 'Category';
      navigation.navigate('CategoryProducts', {
        categoryId,
        categoryName: categoryName.replace(/\n/g, ' '), // Replace newlines with spaces
      });
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header - Animated */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          {/* Title Container */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>All Categories</Text>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.7}
          >
            <View style={styles.searchButtonIcon}>
              <SearchIcon />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Category Groups */}
          {categoryGroups.map((group, groupIndex) => {
            // Group categories into rows of 3
            const rows: Category[][] = [];
            for (let i = 0; i < group.categories.length; i += 3) {
              rows.push(group.categories.slice(i, i + 3));
            }

            // Calculate starting card index for this group
            let cardIndex = 0;
            for (let i = 0; i < groupIndex; i++) {
              cardIndex += categoryGroups[i].categories.length;
            }

            return (
              <View key={group.id} style={styles.categoryGroup}>
                {/* Header Container */}
                <View style={styles.headerContainer}>
                  <View style={styles.groupTitleContainer}>
                    <Text style={styles.groupTitle}>{group.title}</Text>
                  </View>
                  <View style={styles.dividerContainer}>
                    <LinearGradient
                      colors={['rgba(121, 121, 121, 1)', 'rgba(245, 245, 245, 1)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.divider}
                    />
                  </View>
                </View>

                {/* Category Container */}
                <View style={styles.categoriesContainer}>
                  {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                      {row.map((category, categoryIndexInRow) => {
                        const currentCardIndex = cardIndex + rowIndex * 3 + categoryIndexInRow;
                        const anim = cardAnimations[currentCardIndex];
                        return (
                          <Animated.View
                            key={category.id}
                            style={{
                              opacity: anim.opacity,
                              transform: [{ scale: anim.scale }],
                            }}
                          >
                            <CategoryCard
                              image={category.image}
                              name={category.name}
                              onPress={() => handleCategoryPress(category.id)}
                              width={cardWidth}
                            />
                          </Animated.View>
                        );
                      })}
                      {/* Fill remaining slots if row has less than 3 items */}
                      {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, index) => (
                        <View key={`spacer-${index}`} style={[styles.spacer, { width: cardWidth }]} />
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Floating Cart Bar - 4px above bottom nav bar */}
        <FloatingCartBar onPress={() => navigation.navigate('Cart')} hasBottomNav={true} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28, // 1.4 * 20
    color: '#1A1A1A',
    textAlign: 'left',
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: 52,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  searchButtonIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Add padding to prevent content from being hidden behind bottom nav
    paddingTop: 0,
    gap: 0,
  },
  categoryGroup: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
    alignSelf: 'stretch',
    marginBottom: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 10,
  },
  groupTitleContainer: {
    flexShrink: 0,
  },
  groupTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24, // 1.5 * 16
    color: '#222222',
  },
  dividerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
  },
  categoriesContainer: {
    gap: 24, // Gap between rows
  },
  row: {
    flexDirection: 'row',
    gap: 16, // Gap between cards
    width: '100%',
  },
  spacer: {
    // Width will be set dynamically via inline style
  },
});

