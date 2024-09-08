import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline, Polygon } from 'react-native-maps';

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

const PointMarkersPage = ({ route, navigation }) => {
  const { polygonCoords, lineCoords } = route.params;
  const [innerMarkers, setInnerMarkers] = useState([]);
  const [gateValves, setGateValves] = useState([]);
  const [isAddingGateValve, setIsAddingGateValve] = useState(false);
  const [sensorCount, setSensorCount] = useState(0); // Track the number of sensors

  useEffect(() => {
    const centroid = calculateCentroid(polygonCoords);
    const generatedInnerMarkers = polygonCoords.map((coord) => {
      const midLat = (coord.latitude + centroid.latitude) / 2;
      const midLon = (coord.longitude + centroid.longitude) / 2;
      return { latitude: midLat, longitude: midLon };
    });
    setInnerMarkers(generatedInnerMarkers);
    setSensorCount(generatedInnerMarkers.length); // Update sensor count
  }, [polygonCoords]);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;

    if (isAddingGateValve) {
      setGateValves([...gateValves, coordinate]);
      Alert.alert('Gate Valve Added', 'Gate Valve has been placed on the pipeline.');
    }
  };

  const toggleAddingGateValveMode = () => {
    setIsAddingGateValve(!isAddingGateValve);
  };

  const handleSubmit = () => {
    console.log("Submit button pressed");
    navigation.navigate('Dashboard', { gateValves, sensorCount }); // Pass sensorCount
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SENSOR PLACING AREAS</Text>
      <MapView
        style={styles.map}
        mapType="satellite"
        onPress={handleMapPress}
        initialRegion={{
          latitude: polygonCoords[0]?.latitude || 0,
          longitude: polygonCoords[0]?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {polygonCoords && polygonCoords.length > 0 && (
          <Polygon
            coordinates={polygonCoords}
            fillColor="rgba(0, 200, 0, 0.5)"
            strokeColor="green"
            strokeWidth={2}
          />
        )}

        {lineCoords.length > 1 && (
          <Polyline
            coordinates={lineCoords}
            strokeColor="blue"
            strokeWidth={2}
          />
        )}

        {gateValves.map((valve, index) => (
          <Marker
            key={`gate-valve-${index}`}
            coordinate={valve}
            pinColor="green"
            title={`Gate Valve ${index + 1}`}
          />
        ))}

        {innerMarkers.map((marker, index) => (
          <Marker
            key={`inner-${index}`}
            coordinate={marker}
            pinColor="orange"
            title={`Inner Point ${index + 1}`}
          />
        ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isAddingGateValve ? styles.selectedButton : styles.addButton]}
          onPress={toggleAddingGateValveMode}
        >
          <Text style={styles.buttonText}>
            {isAddingGateValve ? 'Stop Adding Gate Valve' : 'Add Gate Valve'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedButton: {
    backgroundColor: '#27ae60',
  },
  addButton: {
    backgroundColor: '#9b59b6',
  },
  submitButton: {
    backgroundColor: '#e74c3c',
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
