// src/components/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const subtitleFadeAnim = useRef(new Animated.Value(0)).current;
  const loadingBarAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(titleFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 600,
        useNativeDriver: true,
      }),
      // Animated loading bar
      Animated.timing(loadingBarAnim, {
        toValue: 1,
        duration: 2500,
        delay: 500,
        useNativeDriver: false,
        easing: Easing.linear,
      }),
    ]).start();

    // Pulse animation for loading indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, titleFadeAnim, subtitleFadeAnim, loadingBarAnim, pulseAnim, onAnimationComplete]);

  // Calculate loading bar width
  const loadingBarWidth = loadingBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={require('../../assets/videos/splash_background.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        repeat={false}
        muted={true}
        paused={false}
        playInBackground={false}
        playWhenInactive={false}
        onError={(error) => console.log('Splash video error:', error)}
        onLoad={() => console.log('Splash video loaded successfully')}
      />
      
      {/* Dark Overlay */}
      <View style={styles.overlay} />
      
      {/* Animated Content */}
      <View style={styles.content}>
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleFadeAnim,
              transform: [
                {
                  translateY: titleFadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Jal Drishti
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: subtitleFadeAnim,
              transform: [
                {
                  translateY: subtitleFadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Fish Species Classification
        </Animated.Text>

        <Animated.View
          style={[
            styles.loaderContainer,
            {
              opacity: subtitleFadeAnim,
            },
          ]}
        >
          {/* Animated Loading Bar */}
          <View style={styles.loadingBarBackground}>
            <Animated.View 
              style={[
                styles.loadingBarFill,
                { width: loadingBarWidth }
              ]} 
            />
          </View>
          
          {/* Animated Loading Text with Dots */}
          <View style={styles.loadingTextContainer}>
            <Animated.Text style={[styles.loadingText, { transform: [{ scale: pulseAnim }] }]}>
              Loading
            </Animated.Text>
            <View style={styles.dotsContainer}>
              <Animated.View style={[styles.dot, styles.dot1]} />
              <Animated.View style={[styles.dot, styles.dot2]} />
              <Animated.View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2e3d',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  loaderContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loadingBarBackground: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  loadingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginHorizontal: 2,
    opacity: 0.3,
  },
  dot1: {
    animation: 'pulse 1.4s ease-in-out infinite',
  },
  dot2: {
    animation: 'pulse 1.4s ease-in-out 0.2s infinite',
  },
  dot3: {
    animation: 'pulse 1.4s ease-in-out 0.4s infinite',
  },
});

// Add keyframes for dot animation (for React Native, we'll use Animated API)
// The dots will animate via the parent component's animation

export default SplashScreen;