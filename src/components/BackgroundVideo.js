// src/components/BackgroundVideo.js
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const BackgroundVideo = ({ children, videoSource, opacity = 0.6 }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        ref={videoRef}
        source={videoSource}
        style={styles.backgroundVideo}
        resizeMode="cover"
        repeat={true}
        muted={true}
        paused={false}
        playInBackground={false}
        playWhenInactive={false}
        onLoad={() => setIsLoaded(true)}
        onError={(error) => console.log('Video error:', error)}
        posterResizeMode="cover"
      />
      
      {/* Dark Overlay (optional - improves text readability) */}
      <View style={[styles.overlay, { opacity }]} />
      
      {/* Content Layer */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default BackgroundVideo;