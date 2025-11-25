import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  PanResponder,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Dummy static data - Replace with API call later
// All onboarding pages data in a single array
const ONBOARDING_PAGES = [
  {
    id: 1,
    title: 'Clean, Healthy Food for Your Family',
    description: 'You want clean, healthy food for your family. We deliver it.',
    image: require('../assets/images/onboarding-screen-1.png'),
  },
  {
    id: 2,
    title: 'Toxin-Free Groceries',
    description: 'Most groceries contain hidden toxins. SELORG eliminates them.',
    image: require('../assets/images/onboarding-screen-2.png'),
  },
  {
    id: 3,
    title: "India's First Lab-Tested Organic App",
    description:
      "India's first lab-tested organic grocery app. We're your health guardian.",
    image: require('../assets/images/onboarding-screen-3.png'),
    ctaText: 'Begin your clean food journey',
  },
];

interface OnboardingProps {
  onComplete?: () => void;
}

/**
 * Onboarding Component
 * Single component that displays all onboarding pages
 * Only image, title, and description change between pages
 * Balance/layout remains the same
 */
const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;
  const imageScale = useRef(new Animated.Value(0.9)).current; // Image scale animation
  const titleOpacity = useRef(new Animated.Value(1)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current; // Staggered text animation
  const descriptionOpacity = useRef(new Animated.Value(1)).current;
  const descriptionTranslateY = useRef(new Animated.Value(20)).current; // Staggered text animation
  const paginationDotScales = useRef(
    ONBOARDING_PAGES.map(() => new Animated.Value(1))
  ).current;
  const paginationDotOpacities = useRef(
    ONBOARDING_PAGES.map(() => new Animated.Value(0.5))
  ).current;
  
  // Progress animation for active dot (8 seconds)
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  
  // Swipe animation
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        swipeAnim.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = SCREEN_WIDTH * 0.25;
        if (Math.abs(gestureState.dx) > swipeThreshold) {
          if (gestureState.dx < 0 && !isLastPage) {
            // Swipe left - go to next
            handleNext();
          } else if (gestureState.dx > 0 && !isFirstPage) {
            // Swipe right - go to previous
            goToPrevious();
          } else {
            // Snap back
            Animated.spring(swipeAnim, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        } else {
          // Snap back
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Auto-advance timer ref
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);
  const currentPageIndexRef = useRef(currentPageIndex);

  const currentPage = ONBOARDING_PAGES[currentPageIndex];
  const isLastPage = currentPageIndex === ONBOARDING_PAGES.length - 1;
  const isFirstPage = currentPageIndex === 0;

  // Update ref when page index changes
  useEffect(() => {
    currentPageIndexRef.current = currentPageIndex;
  }, [currentPageIndex]);

  // Go to previous page function
  const goToPrevious = () => {
    if (isFirstPage) return;
    
    // Clear auto-advance timer when manually navigating
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    // Stop progress animation
    if (progressAnimationRef.current) {
      progressAnimationRef.current.stop();
      progressAnimationRef.current = null;
    }
    
    // Animate out current content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentPageIndex(currentPageIndex - 1);
    });
  };

  // Animate card change when page index changes
  useEffect(() => {
    // Clear auto-advance timer
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }

    // Stop progress animation if running
    if (progressAnimationRef.current) {
      progressAnimationRef.current.stop();
      progressAnimationRef.current = null;
    }

    // Reset animation values
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    imageOpacity.setValue(0);
    imageScale.setValue(0.9);
    titleOpacity.setValue(0);
    titleTranslateY.setValue(20);
    descriptionOpacity.setValue(0);
    descriptionTranslateY.setValue(20);
    swipeAnim.setValue(0);
    progressAnim.setValue(0); // Reset progress animation

    // Reset pagination dots
    paginationDotScales.forEach((scale, index) => {
      scale.setValue(index === currentPageIndex ? 1.2 : 1);
    });
    paginationDotOpacities.forEach((opacity, index) => {
      opacity.setValue(index === currentPageIndex ? 1 : 0.5);
    });

    // Animate in new content
    // 1. Image scale + fade animation
    const imageAnimation = Animated.parallel([
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    // 2. Staggered text animation - title first, then description
    const titleAnimation = Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 500,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const descriptionAnimation = Animated.parallel([
      Animated.timing(descriptionOpacity, {
        toValue: 1,
        duration: 500,
        delay: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(descriptionTranslateY, {
        toValue: 0,
        duration: 500,
        delay: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    // 3. Pagination dot animation
    const paginationAnimations = ONBOARDING_PAGES.map((_, index) => {
      const isActive = index === currentPageIndex;
      return Animated.parallel([
        Animated.spring(paginationDotScales[index], {
          toValue: isActive ? 1.2 : 1,
          useNativeDriver: true,
        }),
        Animated.timing(paginationDotOpacities[index], {
          toValue: isActive ? 1 : 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
    });

    // Start all animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      imageAnimation,
      titleAnimation,
      descriptionAnimation,
      ...paginationAnimations,
    ]).start();

    // Auto-advance: After 8 seconds, go to next page (except on last page)
    if (!isLastPage) {
      // Start progress animation - animate from 0 to 1 over 8 seconds
      progressAnimationRef.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration: 8000, // 8 seconds
        easing: Easing.linear, // Linear for smooth progress
        useNativeDriver: false, // Width animation requires useNativeDriver: false
      });
      progressAnimationRef.current.start();

      autoAdvanceTimer.current = setTimeout(() => {
        const nextIndex = currentPageIndexRef.current + 1;
        if (nextIndex < ONBOARDING_PAGES.length) {
          // Animate out current content and go to next
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: -30,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setCurrentPageIndex(nextIndex);
          });
        }
      }, 8000);
    }

    // Cleanup
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = null;
      }
      if (progressAnimationRef.current) {
        progressAnimationRef.current.stop();
        progressAnimationRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageIndex, isLastPage]);

  // Handle skip button - Navigate to final card (last page) or complete onboarding
  const handleSkip = async () => {
    // Clear auto-advance timer when manually navigating
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    // Stop progress animation
    if (progressAnimationRef.current) {
      progressAnimationRef.current.stop();
      progressAnimationRef.current = null;
    }

    try {
      // TODO: Track skip action
      // await analytics.track('onboarding_skipped', {
      //   from_page: currentPageIndex + 1,
      //   timestamp: new Date().toISOString(),
      // });

      if (isLastPage) {
        // On last page, skip should complete onboarding and navigate to Login
        if (onComplete) {
          onComplete();
        } else {
          navigation.replace('Login');
        }
      } else {
        // Navigate to final card (last page) with smooth animation
        // Animate out current content
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -30,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Change page after animation completes
          setCurrentPageIndex(ONBOARDING_PAGES.length - 1);
        });
      }
    } catch (error) {
      console.error('Error handling skip:', error);
    }
  };

  // Handle next/complete button
  const handleNext = async () => {
    // Clear auto-advance timer when manually navigating
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    // Stop progress animation
    if (progressAnimationRef.current) {
      progressAnimationRef.current.stop();
      progressAnimationRef.current = null;
    }

    setLoading(true);
    try {
      if (isLastPage) {
        // Last page - Complete onboarding and navigate to Login
        // TODO: Mark onboarding as completed
        // await AsyncStorage.setItem('onboarding_completed', 'true');
        // await AsyncStorage.setItem('onboarding_completed_at', new Date().toISOString());

        // TODO: Track onboarding completion
        // await analytics.track('onboarding_completed', {
        //   completed_at: new Date().toISOString(),
        //   total_screens: ONBOARDING_PAGES.length,
        // });

        if (onComplete) {
          onComplete();
        } else {
          // Default navigation behavior - Navigate to Login screen
          navigation.replace('Login');
        }
      } else {
        // Not last page - Go to next page with smooth animation
        // TODO: Track onboarding progression
        // await analytics.track('onboarding_next_clicked', {
        //   from_page: currentPageIndex + 1,
        //   to_page: currentPageIndex + 2,
        // });

        // Animate out current content
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -30,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Change page after animation completes
          setCurrentPageIndex(currentPageIndex + 1);
        });
      }
    } catch (error) {
      console.error('Error handling next:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Skip Button - Hide on last page but maintain layout space */}
      <View style={styles.skipButtonContainer}>
        {!isLastPage && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Header Section with Image and Text */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { translateX: swipeAnim },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Image Container - Scale + Fade Animation */}
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          <Image
            source={currentPage.image}
            style={styles.image}
            resizeMode="cover"
            // Prevent background bleeding in release builds
            defaultSource={undefined}
          />
        </Animated.View>

        {/* Text Container - Staggered Animation */}
        <View style={styles.textContainer}>
          {/* Title - Animates first */}
          <Animated.View
            style={[
              styles.headingContainer,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            <Text style={styles.heading}>{currentPage.title}</Text>
          </Animated.View>
          
          {/* Description - Animates after title */}
          <Animated.View
            style={[
              styles.paragraphContainer,
              {
                opacity: descriptionOpacity,
                transform: [{ translateY: descriptionTranslateY }],
              },
            ]}
          >
            <Text style={styles.paragraph}>{currentPage.description}</Text>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Pagination Dots - Animated with Progress Bar */}
      <Animated.View
        style={[
          styles.paginationContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {ONBOARDING_PAGES.map((_, index) => {
          const isActive = index === currentPageIndex;
          
          // Interpolate width for active dot: 7px to 28px over 8 seconds
          const animatedWidth = isActive
            ? progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [7, 28], // From inactive width to active width
              })
            : 7; // Inactive dots stay at 7px

          return (
            <View key={index} style={styles.paginationDotWrapper}>
              <Animated.View
                style={[
                  {
                    width: isActive ? animatedWidth : 7, // Animate width only for active dot (JS-driven)
                    height: 7,
                    overflow: 'hidden',
                    borderRadius: 3.5, // Rounded edges for the loading bar
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.paginationDot,
                    index === currentPageIndex && styles.paginationDotActive,
                    {
                      transform: [{ scale: paginationDotScales[index] }],
                      opacity: paginationDotOpacities[index],
                    },
                  ]}
                />
              </Animated.View>
            </View>
          );
        })}
      </Animated.View>

      {/* Next/Complete Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {isLastPage
              ? currentPage.ctaText || 'Get Started'
              : 'Next'}
          </Text>
          {!isLastPage && (
            <View style={styles.nextButtonIcon}>
              <Text style={styles.nextButtonIconText}>›</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Reusable Sub-components (for easy componentization)
const PaginationDot: React.FC<{ active: boolean }> = ({ active }) => (
  <View
    style={[styles.paginationDot, active && styles.paginationDotActive]}
  />
);

const OnboardingButton: React.FC<{
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}> = ({ text, onPress, variant = 'primary', loading = false }) => (
  <TouchableOpacity
    style={[
      styles.nextButton,
      variant === 'secondary' && styles.skipButton,
      loading && styles.nextButtonDisabled,
    ]}
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.8}
  >
    <Text
      style={[
        styles.nextButtonText,
        variant === 'secondary' && styles.skipButtonText,
      ]}
    >
      {text}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  skipButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  skipButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#696969',
    borderRadius: 8.5,
    minWidth: 57.06,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22.4,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  headerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    gap: 24,
  },
  imageContainer: {
    width: '100%',
    paddingHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    height: 425,
    alignSelf: 'stretch',
    // Explicit background to prevent grey overlay in release builds
    backgroundColor: 'transparent',
    // Platform-specific shadow handling
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        // Reduced elevation to prevent grey background in release builds
        elevation: 2,
        // Add a subtle border to replace elevation shadow
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    // Ensure image fills container without background bleeding
    backgroundColor: 'transparent',
    // Prevent any default background
    ...Platform.select({
      android: {
        // Android-specific: ensure proper rendering
        overflow: 'hidden',
      },
    }),
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 20,
  },
  headingContainer: {
    width: '100%',
  },
  heading: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 32,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  paragraphContainer: {
    width: '100%',
  },
  paragraph: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 20,
  },
  paginationDotWrapper: {
    height: 7,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  paginationDot: {
    width: 28, // Full width - container will clip it
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#E8E8E8',
  },
  paginationDotActive: {
    backgroundColor: '#034703',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#034703',
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 6,
    minHeight: 48,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22.4,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  nextButtonIcon: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 1, // Slight adjustment for better visual centering
  },
  nextButtonIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 14,
    textAlign: 'center',
  },
});

export default Onboarding;

