import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-av';
import { useDimensions, scale, getSpacing, wp } from '../../utils/responsive';

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

  // Use expo-av video player
  const player = useVideoPlayer(require('../../assets/images/categories/video-section-png.mp4'), (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {player ? (
          <VideoView
            player={player}
            style={[
              styles.video,
              {
                width: videoDimensions.videoWidth,
                height: videoDimensions.videoHeight,
              },
            ]}
            contentFit="cover"
            nativeControls={false}
            onError={(error: any) => {
              console.warn('Video playback error:', error);
            }}
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
            {/* Video placeholder */}
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

