import React, { useEffect } from 'react';
import { Animated, View, Text, Image, StyleSheet, Platform } from 'react-native';

const NomadsHeader = ({ height = 35 }) => {
  const scaleValue = new Animated.Value(1);
  const translateXValue = new Animated.Value(0);
  const imageUrl = 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';

  useEffect(() => {
    // Animation combinée
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.1,
            duration: 10000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateXValue, {
            toValue: 10,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(translateXValue, {
            toValue: -10,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(translateXValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.header, { height: `${height}%` }]}>
      <Animated.View
        style={[
          styles.background,
          {
            transform: [
              { scale: scaleValue },
              { translateX: translateXValue }
            ]
          }
        ]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>

      <View style={styles.overlay} />
      
      <Text style={styles.title}>NomadsApp</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
});

export default NomadsHeader;