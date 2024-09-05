import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

const calculateMarkers = (lineCoords, distanceInterval) => {
  let markers = [];
  let remainingDistance = distanceInterval;
  
  for (let i = 1; i < lineCoords.length; i++) {
    const start = lineCoords[i - 1];
    const end = lineCoords[i];
    const totalSegmentDistance = calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude);

    while (remainingDistance < totalSegmentDistance) {
      const ratio = remainingDistance / totalSegmentDistance;
      const latitude = start.latitude + ratio * (end.latitude - start.latitude);
      const longitude = start.longitude + ratio * (end.longitude - start.longitude);

      markers.push({ latitude, longitude });
      remainingDistance += distanceInterval;
    }

    remainingDistance -= totalSegmentDistance;
  }

  return markers;
};

const PointMarkersPage = ({ route }) => {
  const { lineCoords } = route.params;
  const [markers, setMarkers] = useState([]);
  const distanceInterval = 50; // Distance interval in meters

  useEffect(() => {
    const generatedMarkers = calculateMarkers(lineCoords, distanceInterval);
    setMarkers(generatedMarkers);
  }, [lineCoords]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Points Marked at Equal Distances</Text>

      <MapView
        style={styles.map}
        mapType="satellite"
        initialRegion={{
          latitude: lineCoords[0]?.latitude || 0,
          longitude: lineCoords[0]?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {lineCoords.length > 1 && (
          <Polyline
            coordinates={lineCoords}
            strokeColor="blue"
            strokeWidth={2}
          />
        )}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            pinColor="green"
            title={`Point ${index + 1}`}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f8',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  map: {
    height: 400,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default PointMarkersPage;
