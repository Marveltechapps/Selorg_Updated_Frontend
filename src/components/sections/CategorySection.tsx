import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import type { RootStackNavigationProp } from '../types/navigation';
import Text from '../common/Text';
import CategoryCard from './CategoryCard';

interface Category {
  id: string;
  name: string;
  image: any;
}

interface CategorySectionProps {
  title?: string;
  onCategoryPress?: (categoryId: string) => void;
}

const categories: Category[] = [
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
];

export default function CategorySection({ title = 'Grocery & Kitchen', onCategoryPress }: CategorySectionProps) {
  const navigation = useNavigation<RootStackNavigationProp>();
  
  const handleCategoryPress = (categoryId: string) => {
    if (onCategoryPress) {
      onCategoryPress(categoryId);
    } else {
      // Find category name
      const category = categories.find((cat) => cat.id === categoryId);
      const categoryName = category?.name || 'Category';
      navigation.navigate('CategoryProducts', {
        categoryId,
        categoryName: categoryName.replace(/\n/g, ' '), // Replace newlines with spaces
      });
    }
  };

  // Group categories into rows of 3
  const rows: Category[][] = [];
  for (let i = 0; i < categories.length; i += 3) {
    rows.push(categories.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
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

      <View style={styles.categoriesContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((category) => (
              <CategoryCard
                key={category.id}
                image={category.image}
                name={category.name}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
            {/* Fill remaining slots if row has less than 3 items */}
            {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, index) => (
              <View key={`spacer-${index}`} style={styles.spacer} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16, // Changed from 12 to 16 to match Figma
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 10, // Matches Figma
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  dividerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 1,
  },
  divider: {
    width: 214, // Fixed width from Figma
    height: 1,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500', // Changed from '600' to '500' to match Figma
    lineHeight: 24, // 1.5em = 24px
    color: '#222222',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  categoriesContainer: {
    gap: 16, // Changed from 24 to 16 to match Figma (gap between rows)
  },
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: 16, // Matches Figma
  },
  spacer: {
    width: 104,
  },
});

