import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import * as Location from 'expo-location';

// Only import MapView when not on web platform
let MapView;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
}

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        // Use browser's geolocation API for web
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              setErrorMsg(error.message);
              setLocation({
                latitude: 48.8566, // Paris latitude
                longitude: 2.3522, // Paris longitude
              });
            }
          );
        } else {
          setErrorMsg('Geolocation is not supported by this browser.');
          setLocation({
            latitude: 48.8566, // Paris latitude
            longitude: 2.3522, // Paris longitude
          });
        }
      } else {
        // Request permission for mobile
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLocation({
            latitude: 48.8566, // Paris latitude
            longitude: 2.3522, // Paris longitude
          });
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d61549.44834007715!2d${location?.longitude || 2.3522}!3d${location?.latitude || 48.8566}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1707261160301!5m2!1sen!2sus`}
          style={{
            border: 0,
            width: '100%',
            height: '100%',
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        MapView && location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});