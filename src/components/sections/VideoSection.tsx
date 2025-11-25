import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDimensions, scale, getSpacing, wp } from '../utils/responsive';

// Safely import Video with error handling
let Video: any = null;
let isVideoAvailable = false;

try {
  Video = require('react-native-video').default;
  // Check if native module is available
  if (Video && typeof Video === 'function') {
    isVideoAvailable = true;
  }
} catch (error) {
  console.warn('react-native-video not available:', error);
  isVideoAvailable = false;
}

interface VideoSectionProps {
  onPress?: () => void;
}

export default function VideoSection({ onPress }: VideoSectionProps) {
  const { width: screenWidth } = useDimensions();
  
  // Calculate responsive dimensions
  const videoDimensions = useMemo(() => {
    const containerPadding = getSpacing(16) * 2; // 16px on each side
    const videoWidth = screenWidth - containerPadding;
    // Maintain aspect ratio from design (276px height for ~349px width)
    // Use responsive height that scales with width
    const aspectRatio = 276 / 349; // Original design aspect ratio
    const videoHeight = videoWidth * aspectRatio;
    
    return {
      videoWidth,
      videoHeight: Math.max(scale(200), Math.min(videoHeight, scale(400))), // Min 200, max 400
      containerPadding: getSpacing(16),
    };
  }, [screenWidth]);

  // TODO: Verify react-native-video implementation - API differs from expo-video
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {isVideoAvailable && Video ? (
          <Video
            source={require('../assets/images/categories/video-section-png.mp4')}
            style={[
              styles.video,
              {
                width: videoDimensions.videoWidth,
                height: videoDimensions.videoHeight,
              },
            ]}
            resizeMode="cover"
            repeat={true}
            paused={false}
            onError={(error: any) => {
              console.warn('Video playback error:', error);
            }}
            // TODO: Verify react-native-video props match expo-video behavior
          />
        ) : (
          // Fallback: Show placeholder
          <View
            style={[
              styles.video,
              {
                width: videoDimensions.videoWidth,
                height: videoDimensions.videoHeight,
                backgroundColor: '#EDEDED',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            {/* Video placeholder - will show when native module is fixed */}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: getSpacing(16),
    paddingTop: getSpacing(20),
    paddingBottom: getSpacing(20),
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    borderRadius: scale(8),
    backgroundColor: '#EDEDED',
  },
});

