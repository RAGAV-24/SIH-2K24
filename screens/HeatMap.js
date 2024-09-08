import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Heatmap, Polygon } from 'react-native-maps'; // Ensure correct map library and component

const HeatMap = ({ route }) => {
  const { polygonCoords = [], sensorData = [] } = route.params || {};

  if (!sensorData.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No sensor data available for the heatmap</Text>
      </View>
    );
  }

  // Default to a generic region if no polygonCoords are provided
  const defaultRegion = {
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Calculate the bounds of the polygon to fit the map
  const getBounds = (coords) => {
    const lats = coords.map(coord => coord.latitude);
    const longs = coords.map(coord => coord.longitude);

    const north = Math.max(...lats);
    const south = Math.min(...lats);
    const east = Math.max(...longs);
    const west = Math.min(...longs);

    return {
      latitude: (north + south) / 2,
      longitude: (east + west) / 2,
      latitudeDelta: north - south + 0.1, // Add some padding
      longitudeDelta: east - west + 0.1, // Add some padding
    };
  };

  const region = polygonCoords.length > 0 ? getBounds(polygonCoords) : defaultRegion;

  // Convert sensorData to the format required by the heatmap library
  const heatmapData = sensorData.map(sensor => ({
    latitude: sensor.latitude ?? region.latitude, // Use default if missing
    longitude: sensor.longitude ?? region.longitude, // Use default if missing
    intensity: sensor.value ?? 0, // Use 0 if missing
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heatmap</Text>
      <MapView
        style={styles.map}
        mapType="satellite" 
        initialRegion={region}
        showsCompass={true}
        showsScale={true}
      >
        {polygonCoords.length > 0 && (
          <Polygon
            coordinates={polygonCoords}
            strokeColor="#000"
            strokeWidth={2}
            fillColor="rgba(255,0,0,0.2)" // Semi-transparent red fill
          />
        )}
        <Heatmap
          points={heatmapData}
          radius={50}
          opacity={0.7}
          gradient={{
            colors: ['blue', 'green', 'yellow', 'red'],
            startPoints: [0.1, 0.3, 0.5, 0.7],
            colorMapSize: 256,
          }}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HeatMap;
