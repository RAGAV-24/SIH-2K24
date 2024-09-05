import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Polygon, Marker } from 'react-native-maps';
import * as turf from '@turf/turf'; // Import turf for geospatial calculations

const HomePage = ({ navigation }) => {
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
    if (coordinates.length < 3) {
      return 0; // Can't calculate area with less than 3 points
    }

    // Ensure the polygon is closed
    const closedCoords = [...coordinates, coordinates[0]];

    // Convert coordinates to the format required by turf.js
    const turfPolygon = turf.polygon([closedCoords.map(coord => [coord.longitude, coord.latitude])]);

    // Calculate the area in square meters
    const areaInSquareMeters = turf.area(turfPolygon);

    // Convert the area to acres (optional)
    const areaInAcres = areaInSquareMeters / 4046.86;

    return areaInAcres;
  };

  const calculateArea = () => {
    const area = calculatePolygonArea(polygonCoords);
    if (area && polygonCoords.length > 0) {
      navigation.navigate('CropDetails', { area: area.toFixed(2), polygonCoords });
    } else {
      Alert.alert('Error', 'Please select an area on the map first.');
    }
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          mapType="satellite" // Set mapType to "satellite" for satellite view
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
