import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline, Polygon } from 'react-native-maps';

// Function to calculate the midpoint of two coordinates
const calculateMidpoint = (coord1, coord2) => {
  return {
    latitude: (coord1.latitude + coord2.latitude) / 2,
    longitude: (coord1.longitude + coord2.longitude) / 2,
  };
};

// Ray-casting algorithm to check if a point is inside a polygon
const isPointInPolygon = (point, polygon) => {
  let x = point.latitude;
  let y = point.longitude;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].latitude, yi = polygon[i].longitude;
    let xj = polygon[j].latitude, yj = polygon[j].longitude;

    let intersect = ((yi > y) !== (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const PointMarkersPage = ({ route, navigation }) => {
  const { polygonCoords, lineCoords } = route.params;
  const [innerMarkers, setInnerMarkers] = useState([]);
  const [gateValves, setGateValves] = useState([]);
  const [isAddingGateValve, setIsAddingGateValve] = useState(false);
  const [sensorCount, setSensorCount] = useState(0); // Track the number of sensors

  useEffect(() => {
    // Generate midpoints of polygon edges
    const generatedInnerMarkers = polygonCoords.map((coord, index) => {
      const nextIndex = (index + 1) % polygonCoords.length; // To form a closed loop
      const midpoint = calculateMidpoint(coord, polygonCoords[nextIndex]);

      // Check if the midpoint is inside the polygon (optional check for extra safety)
      if (isPointInPolygon(midpoint, polygonCoords)) {
        return midpoint;
      }
      return null;
    }).filter(Boolean); // Remove null values

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
    // Pass polygonCoords along with gateValves and sensorCount to Dashboard
    navigation.navigate('Dashboard', { gateValves, sensorCount, polygonCoords });
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
            title={`Sensor Point ${index + 1}`}
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
          style={styles.buttonText}
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
    backgroundColor: 'black',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  map: {
    height: 400,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
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
