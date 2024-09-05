import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, Polygon } from 'react-native-maps';

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

// Function to calculate markers along the edges
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

// Function to calculate centroid of a polygon
const calculateCentroid = (coords) => {
  let latSum = 0;
  let lonSum = 0;
  coords.forEach((coord) => {
    latSum += coord.latitude;
    lonSum += coord.longitude;
  });
  return {
    latitude: latSum / coords.length,
    longitude: lonSum / coords.length,
  };
};

const PointMarkersPage = ({ route }) => {
  const { polygonCoords, area, lineCoords } = route.params; // Receiving polygonCoords and area
  const [edgeMarkers, setEdgeMarkers] = useState([]);
  const [innerMarkers, setInnerMarkers] = useState([]);
  const distanceInterval = 50; // Distance interval in meters

  useEffect(() => {
    const generatedEdgeMarkers = calculateMarkers(lineCoords, distanceInterval);
    setEdgeMarkers(generatedEdgeMarkers);

    // Generate markers inside the polygon
    const centroid = calculateCentroid(polygonCoords);
    const generatedInnerMarkers = polygonCoords.map((coord, index) => {
      const midLat = (coord.latitude + centroid.latitude) / 2;
      const midLon = (coord.longitude + centroid.longitude) / 2;
      return { latitude: midLat, longitude: midLon };
    });

    setInnerMarkers(generatedInnerMarkers);
  }, [lineCoords, polygonCoords]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SENSOR PLACING AREAS</Text>

      <MapView
        style={styles.map}
        mapType="satellite"
        initialRegion={{
          latitude: polygonCoords[0]?.latitude || 0,
          longitude: polygonCoords[0]?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Display Polygon */}
        {polygonCoords && polygonCoords.length > 0 && (
          <Polygon
            coordinates={polygonCoords}
            fillColor="rgba(0, 200, 0, 0.5)"
            strokeColor="green"
            strokeWidth={2}
          />
        )}

        {/* Display Polyline */}
        {lineCoords.length > 1 && (
          <Polyline
            coordinates={lineCoords}
            strokeColor="blue"
            strokeWidth={2}
          />
        )}

        {/* Display Edge Markers */}
        {edgeMarkers.map((marker, index) => (
          <Marker
            key={`edge-${index}`}
            coordinate={marker}
            pinColor="green"
            title={`Edge Point ${index + 1}`}
          />
        ))}

        {/* Display Inner Markers */}
        {innerMarkers.map((marker, index) => (
          <Marker
            key={`inner-${index}`}
            coordinate={marker}
            pinColor="orange"
            title={`Inner Point ${index + 1}`}
          />
        ))}
      </MapView>

      {/* Legend for the markers */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>POINTS</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
          <Text style={styles.legendText}>GATE VALVES</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'orange' }]} />
          <Text style={styles.legendText}>SENSOR PLACING POINTS</Text>
        </View>
      </View>
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
  legendContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
  },
});

export default PointMarkersPage;
