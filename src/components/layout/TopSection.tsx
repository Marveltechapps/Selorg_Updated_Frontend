import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LocationSelector from '../features/location/LocationSelector';
import SearchBar from '../features/search/SearchBar';
import ProfileIconHome from '../icons/ProfileIconHome';
import MuteIcon from '../icons/MuteIcon';
import UnmuteIcon from '../icons/UnmuteIcon';
import { TouchableOpacity } from 'react-native';
import { useDimensions, scale, getSpacing, wp, hp } from '../utils/responsive';

// Safely import Video with error handling
// react-native-video exports as default, so we need to handle it properly
let VideoComponent: React.ComponentType<any> | null = null;
let isVideoAvailable = false;

try {
  const videoModule = require('react-native-video');
  // react-native-video v6+ exports as default
  const VideoExport = videoModule.default || videoModule;
  
  if (VideoExport) {
    VideoComponent = VideoExport as React.ComponentType<any>;
    isVideoAvailable = true;
    console.log('react-native-video loaded successfully');
  } else {
    console.warn('react-native-video module found but export is invalid');
    isVideoAvailable = false;
  }
} catch (error) {
  console.warn('react-native-video not available:', error);
  isVideoAvailable = false;
}

// Create a Video component wrapper for type safety
const Video = VideoComponent;

interface TopSectionProps {
  deliveryType?: string;
  address?: string;
  searchPlaceholder?: string;
  onLocationPress?: () => void;
  onProfilePress?: () => void;
  onSearch?: (text: string) => void;
  onLayout?: (layout: { y: number; height: number }) => void;
  isVisible?: boolean;
}

export default function TopSection({
  deliveryType = 'Delivery to Home',
  address = 'Vasantha Bhavan Hotel, 3rd floor.....',
  searchPlaceholder = 'Search for "Dal" ',
  onLocationPress,
  onProfilePress,
  onSearch,
  onLayout,
  isVisible = true,
}: TopSectionProps) {
  const { width: screenWidth, height: screenHeight } = useDimensions();
  const videoContainerRef = useRef<View>(null);
  const [videoLayout, setVideoLayout] = useState({ y: 0, height: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(!isVisible);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<any>(null);

  // Responsive video dimensions - maintain aspect ratio from design (340/381)
  const videoDimensions = useMemo(() => {
    const baseVideoHeight = (340 / 381) * screenWidth; // Maintain aspect ratio
    const videoHeight = baseVideoHeight * 1.35; // Increase by 35%
    const fadeGradientHeight = videoHeight * 0.05; // 5% fade at top of video
    const videoTopPadding = videoHeight * 0.15; // 15% padding at top of video
    const visibleVideoHeight = videoHeight * 0.85; // Show top 85% (cut bottom 15%)
    
    return {
      videoHeight,
      fadeGradientHeight,
      videoTopPadding,
      visibleVideoHeight: visibleVideoHeight - 20 + videoTopPadding,
    };
  }, [screenWidth]);

  // Reset error state when component mounts or video becomes available
  useEffect(() => {
    if (isVideoAvailable && Video) {
      setVideoError(false);
      console.log('[TopSection] Video component available, resetting error state');
    } else {
      console.warn('[TopSection] Video component not available:', {
        isVideoAvailable,
        hasVideo: !!Video,
      });
    }
  }, [isVideoAvailable]);

  // TODO: Verify react-native-video implementation - API differs from expo-video
  // Control video playback based on visibility
  useEffect(() => {
    setIsPaused(!isVisible);
  }, [isVisible]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoLayout = (event: any) => {
    const { y, height } = event.nativeEvent.layout;
    setVideoLayout({ y, height });
    if (onLayout) {
      onLayout({ y, height });
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Section - Starts from top-0, beneath content */}
      <View 
        ref={videoContainerRef}
        style={[styles.videoContainer, { 
          height: videoDimensions.visibleVideoHeight,
          paddingTop: videoDimensions.videoTopPadding 
        }]}
        onLayout={handleVideoLayout}
      >
        {isVideoAvailable && Video && !videoError ? (
          <>
            <Video
              ref={videoRef}
              source={require('../assets/images/categories/video-section-png.mp4')}
              style={[styles.backgroundVideo, { height: videoDimensions.videoHeight, top: scale(-20) }]}
              resizeMode="cover"
              repeat={true}
              paused={isPaused}
              muted={isMuted}
              playInBackground={false}
              playWhenInactive={false}
              ignoreSilentSwitch="ignore"
              onLoad={() => {
                console.log('[TopSection] Video loaded successfully');
                setVideoLoaded(true);
                setVideoError(false);
              }}
              onLoadStart={() => {
                console.log('[TopSection] Video load started');
                setVideoLoaded(false);
                setVideoError(false);
              }}
              onError={(error: any) => {
                console.error('[TopSection] Video playback error:', error);
                console.error('[TopSection] Error details:', JSON.stringify(error, null, 2));
                setVideoError(true);
                setVideoLoaded(false);
              }}
              onBuffer={(data: any) => {
                // Handle buffering if needed
                if (data?.isBuffering) {
                  console.log('[TopSection] Video buffering...');
                }
              }}
              onReadyForDisplay={() => {
                console.log('[TopSection] Video ready for display');
                setVideoLoaded(true);
                setVideoError(false);
              }}
            />

            {/* White gradient at top of video (top to 5%) */}
            <LinearGradient
              colors={['#FFFFFF', 'rgba(255, 255, 255, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.videoFadeGradient, { height: videoDimensions.fadeGradientHeight }]}
            />

            {/* Mute/Unmute Button - Bottom Right Corner */}
            <TouchableOpacity
              style={styles.muteButton}
              onPress={handleMuteToggle}
              activeOpacity={0.7}
            >
              {isMuted ? (
                <MuteIcon width={24} height={24} color="#FFFFFF" />
              ) : (
                <UnmuteIcon width={24} height={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </>
        ) : (
          // Fallback: Show placeholder image or gradient background
          <View style={[styles.backgroundVideo, { height: videoDimensions.videoHeight, top: scale(-20), backgroundColor: '#034703' }]}>
            <LinearGradient
              colors={['#FFFFFF', 'rgba(255, 255, 255, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.videoFadeGradient, { height: videoDimensions.fadeGradientHeight }]}
            />
          </View>
        )}
      </View>

      {/* Top Content Section - Input, Location & Profile - Overlay on top of video */}
      <View style={styles.topContent}>
        {/* Location and Profile Row */}
        <View style={styles.locationProfileRow}>
          <View style={styles.locationContainer}>
            <LocationSelector
              deliveryType={deliveryType}
              address={address}
              onPress={onLocationPress}
            />
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={onProfilePress}
            activeOpacity={0.7}
          >
            <ProfileIconHome />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <SearchBar placeholder={searchPlaceholder} onSearch={onSearch} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  topContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: getSpacing(14),
    paddingTop: getSpacing(17),
    paddingBottom: getSpacing(20),
    gap: getSpacing(12),
    zIndex: 10,
  },
  locationProfileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: wp(28.85), // Responsive gap (108.18/375 * 100%)
  },
  locationContainer: {
    flex: 1,
  },
  profileButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  searchBarContainer: {
    width: '100%',
  },
  videoContainer: {
    width: '100%',
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden', // Clip the top 26px of the video
  },
  backgroundVideo: {
    width: '100%',
    position: 'absolute',
    left: 0,
  },
  videoFadeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  muteButton: {
    position: 'absolute',
    bottom: getSpacing(16),
    right: getSpacing(16),
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20, // Ensure button is on top of video
  },
});

