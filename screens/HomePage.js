import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Polygon, Marker } from 'react-native-maps';
import * as turf from '@turf/turf'; // Turf is now correctly used

const HomePage = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [polygonCoords, setPolygonCoords] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleMapPress = (e) => {
    const newCoords = [...polygonCoords, e.nativeEvent.coordinate];
    setPolygonCoords(newCoords);
  };

  const calculatePolygonArea = (coordinates) => {
    // Ensure the coordinates form a closed loop by adding the first coordinate to the end
    const polygonCoords = [...coordinates, coordinates[0]];
    
    // Convert the coordinates into a format suitable for Turf.js
    const turfPolygon = turf.polygon([polygonCoords.map(coord => [coord.longitude, coord.latitude])]);
    
    // Calculate the area in square meters
    const areaInSquareMeters = turf.area(turfPolygon);
    
    // Convert the area to acres (optional)
    const areaInAcres = areaInSquareMeters / 4046.86; // 1 acre = 4046.86 square meters
    
    return areaInAcres;
  };

  const calculateArea = () => {
    if (polygonCoords.length < 3) {
      Alert.alert('Error', 'You need at least 3 points to calculate an area.');
      return;
    }
    const area = calculatePolygonArea(polygonCoords);
    Alert.alert('Area', `The estimated area is: ${area.toFixed(2)} acres`);
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          initialRegion={region}
          onPress={handleMapPress}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          )}

          {polygonCoords.length > 0 && (
            <Polygon
              coordinates={polygonCoords}
              fillColor="rgba(0, 200, 0, 0.3)"
              strokeColor="green"
              strokeWidth={2}
            />
          )}
        </MapView>
      ) : null}

      <Button title="Calculate Area" onPress={calculateArea} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default HomePage;
