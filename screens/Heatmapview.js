import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';

const HeatmapView = ({ route }) => {
  const { polygonCoords = [], area = 0, markers = [], lineCoords = [] } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heatmap View</Text>
      <Text style={styles.areaText}>Area Size: {area} acres</Text>

      <MapView
        style={styles.map}
        mapType="satellite" // Set mapType to satellite
        initialRegion={{
          latitude: polygonCoords[0]?.latitude || 0,
          longitude: polygonCoords[0]?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polygon
          coordinates={polygonCoords}
          fillColor="rgba(255, 0, 0, 0.5)" // Example color
          strokeColor="red"
          strokeWidth={2}
        />
        {/* Optionally render markers and lines */}
        {/* {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            pinColor={marker.type === 'Borewell' ? 'blue' : 'red'}
            title={marker.type}
          />
        ))}
        {lineCoords.length > 1 && (
          <Polyline
            coordinates={lineCoords}
            strokeColor="blue"
            strokeWidth={2}
          />
        )} */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  areaText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  map: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default HeatmapView;
