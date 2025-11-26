import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Platform, Text, ScrollView, Animated, NativeScrollEvent, NativeSyntheticEvent, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { RootStackNavigationProp } from '../types/navigation';
import TopSection from '../components/layout/TopSection';
import CategorySection from '../components/sections/CategorySection';
import Banner from '../components/Banner';
import DealsSection from '../components/sections/DealsSection';
import WellbeingSection from '../components/sections/WellbeingSection';
import GreensBanner from '../components/GreensBanner';
import SectionImage from '../components/SectionImage';
import LifestyleSection from '../components/sections/LifestyleSection';
import NewDealsSection from '../components/sections/NewDealsSection';
import FreshJuiceDealsSection from '../components/sections/FreshJuiceDealsSection';
import BannerSection from '../components/sections/BannerSection';
import OrganicTaglineSection from '../components/sections/OrganicTaglineSection';
import FloatingCartBar from '../components/features/cart/FloatingCartBar';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { logger } from '@/utils/logger';

// Number of sections to animate (excluding TopSection which is already animated)
const SECTION_COUNT = 12;

export default function HomeScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [videoLayout, setVideoLayout] = useState({ y: 0, height: 0 });
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  // Staggered animations for each section
  const sectionAnimations = useRef(
    Array.from({ length: SECTION_COUNT }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  ).current;

  // Animate sections when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Screen is focused
      setIsScreenFocused(true);
      
      // Reset all animation values
      sectionAnimations.forEach((anim) => {
        anim.opacity.setValue(0);
        anim.translateY.setValue(30);
      });

      // Animate all sections with staggered delays
      const animations = sectionAnimations.map((anim, index) => {
        return Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 500,
            delay: index * 80, // 80ms delay between sections
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 0,
            duration: 500,
            delay: index * 80,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.parallel(animations).start();

      // Cleanup when screen loses focus
      return () => {
        setIsScreenFocused(false);
      };
    }, [])
  );

  const handleProfilePress = () => {
    navigation.navigate('Settings');
  };

  const handleLocationPress = () => {
    logger.info('Location selector pressed');
    // Handle location selection
  };

  const handleVideoLayout = (layout: { y: number; height: number }) => {
    setVideoLayout(layout);
    // Video is initially visible when layout is measured (at top of screen)
    if (layout.y === 0 || layout.y < 100) {
      setIsVideoVisible(true);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;
    
    // Only calculate visibility if video layout is known
    if (videoLayout.height === 0) {
      return;
    }
    
    // Calculate if video is visible
    const videoTop = videoLayout.y;
    const videoBottom = videoLayout.y + videoLayout.height;
    const visibleTop = scrollY;
    const visibleBottom = scrollY + screenHeight;
    
    // Video is visible if any part of it is in the viewport
    const isVisible = videoBottom > visibleTop && videoTop < visibleBottom;
    setIsVideoVisible(isVisible);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.animatedContainer}>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {/* Top Section with Input, Location, Profile and Video */}
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 200 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Top section unavailable</Text>
                </View>
              }
            >
              <TopSection
                deliveryType="Delivery to Home"
                address="Vasantha Bhavan Hotel, 3rd floor....."
                searchPlaceholder='Search for "Dal" '
                onLocationPress={handleLocationPress}
                onProfilePress={handleProfilePress}
                onLayout={handleVideoLayout}
                isVisible={isVideoVisible}
                isScreenFocused={isScreenFocused}
              />
            </ErrorBoundary>

          {/* Video Section */}
          {/* <VideoSection /> */}

          {/* Category Section - Animated */}
          <Animated.View
            style={{
              opacity: sectionAnimations[0].opacity,
              transform: [{ translateY: sectionAnimations[0].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Category section unavailable</Text>
                </View>
              }
            >
              <CategorySection />
            </ErrorBoundary>
          </Animated.View>

          {/* Banner Section - Animated */}
          <Animated.View
            style={{
              opacity: sectionAnimations[1].opacity,
              transform: [{ translateY: sectionAnimations[1].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Banner section unavailable</Text>
                </View>
              }
            >
              <Banner />
            </ErrorBoundary>
          </Animated.View>

          {/* Deals Section - Animated */}
          <Animated.View
            style={{
              opacity: sectionAnimations[2].opacity,
              transform: [{ translateY: sectionAnimations[2].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Deals section unavailable</Text>
                </View>
              }
            >
              <DealsSection />
            </ErrorBoundary>
          </Animated.View>

          {/* Wellbeing Section - Animated */}
          <Animated.View
            style={{
              opacity: sectionAnimations[3].opacity,
              transform: [{ translateY: sectionAnimations[3].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Wellbeing section unavailable</Text>
                </View>
              }
            >
              <WellbeingSection />
            </ErrorBoundary>
          </Animated.View>

          {/* Greens Banner Section - Animated */}
          <Animated.View
            style={{
              opacity: sectionAnimations[4].opacity,
              transform: [{ translateY: sectionAnimations[4].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Greens banner unavailable</Text>
                </View>
              }
            >
              <GreensBanner />
            </ErrorBoundary>
          </Animated.View>

          {/* Section Image - Animated */}
          <Animated.View
            style={{
              opacity: sectionAnimations[5].opacity,
              transform: [{ translateY: sectionAnimations[5].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Section image unavailable</Text>
                </View>
              }
            >
              <SectionImage />
            </ErrorBoundary>
          </Animated.View>

          {/* Lifestyle Section - Animated */}
          <Animated.View
            style={{
              opacity: sectionAnimations[6].opacity,
              transform: [{ translateY: sectionAnimations[6].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Lifestyle section unavailable</Text>
                </View>
              }
            >
              <LifestyleSection />
            </ErrorBoundary>
          </Animated.View>

          {/* New Deals Section - Animated */}
          <Animated.View
            style={{
              opacity: sectionAnimations[7].opacity,
              transform: [{ translateY: sectionAnimations[7].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>New deals section unavailable</Text>
                </View>
              }
            >
              <NewDealsSection />
            </ErrorBoundary>
          </Animated.View>

          {/* Banner Section - Animated */}
          <Animated.View
            style={{
              opacity: sectionAnimations[8].opacity,
              transform: [{ translateY: sectionAnimations[8].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Banner section unavailable</Text>
                </View>
              }
            >
              <BannerSection />
            </ErrorBoundary>
          </Animated.View>

          {/* Fresh Juice Deals Section - Animated */}
          <Animated.View
            style={{
              opacity: sectionAnimations[9].opacity,
              transform: [{ translateY: sectionAnimations[9].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Fresh juice deals unavailable</Text>
                </View>
              }
            >
              <FreshJuiceDealsSection />
            </ErrorBoundary>
          </Animated.View>

           {/* Deals Section - Animated */}
           <Animated.View
            style={{
              opacity: sectionAnimations[10].opacity,
              transform: [{ translateY: sectionAnimations[10].translateY }],
            }}
          >
            <ErrorBoundary
              fallback={
                <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>Deals section unavailable</Text>
                </View>
              }
            >
              <DealsSection />
            </ErrorBoundary>
          </Animated.View>

            {/* Organic Tagline Section - Last Item - Animated */}
            <Animated.View
              style={{
                opacity: sectionAnimations[11].opacity,
                transform: [{ translateY: sectionAnimations[11].translateY }],
              }}
            >
              <ErrorBoundary
                fallback={
                  <View style={{ padding: 16, backgroundColor: '#FFFFFF', minHeight: 100 }}>
                    <Text style={{ color: '#666', textAlign: 'center' }}>Organic tagline unavailable</Text>
                  </View>
                }
              >
                <OrganicTaglineSection />
              </ErrorBoundary>
            </Animated.View>
          </ScrollView>
        </View>

        {/* Floating Cart Bar - positioned right above bottom navigation bar */}
        <ErrorBoundary
          fallback={null} // Don't show error UI for cart bar, just fail silently
        >
          <FloatingCartBar onPress={() => navigation.navigate('Cart')} hasBottomNav={true} />
        </ErrorBoundary>
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
  animatedContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Reduced padding to prevent excessive space at bottom
  },
});
