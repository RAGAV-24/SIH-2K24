import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Heatmap, Polygon } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const HeatMap = ({ route }) => {
  const navigation = useNavigation();
  const { polygonCoords = [], sensorData = [] } = route.params || {};

  if (!sensorData.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No sensor data available for the heatmap</Text>
      </View>
    );
  }

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
      latitudeDelta: north - south + 0.1,
      longitudeDelta: east - west + 0.1,
    };
  };

  const region = polygonCoords.length > 0 ? getBounds(polygonCoords) : {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Ensure heatmap points are distributed across the polygon
  const heatmapData = sensorData.map((sensor, index) => ({
    latitude: sensor.latitude ?? polygonCoords[index % polygonCoords.length].latitude, 
    longitude: sensor.longitude ?? polygonCoords[index % polygonCoords.length].longitude, 
    intensity: sensor.groundWaterLevel ?? 0.5, // Default intensity if no value is available
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heatmap</Text>
      <MapView
        style={styles.map}
        initialRegion={region}
        mapType="satellite"
        showsCompass={true}
        showsScale={true}
      >
        {polygonCoords.length > 0 && (
          <Polygon
            coordinates={polygonCoords}
            strokeColor="#000"
            strokeWidth={2}
            fillColor="rgba(255,0,0,0.2)"
          />
        )}
        <Heatmap
          points={heatmapData}
          radius={50}
          opacity={0.7}
          gradient={{
            colors: ['red', 'green', 'yellow', 'blue'],
            startPoints: [0.1, 0.3, 0.5, 0.7],
            colorMapSize: 256,
          }}
        />
      </MapView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WaterMonitoring')}
      >
        <Text style={styles.buttonText}>Water Monitoring System</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 15,
    color: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorText: {
    fontSize: 18,
    color: '#ff3737',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HeatMap;
