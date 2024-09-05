import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView, { Polygon, Marker, Polyline } from 'react-native-maps';

const ShapeDetailsPage = ({ route }) => {
  const { polygonCoords = [], area = 0 } = route.params || {}; // Handle undefined values with default

  const [markers, setMarkers] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [isDrawingLine, setIsDrawingLine] = useState(false); // Toggle for drawing line
  const [lineCoords, setLineCoords] = useState([]); // Store the coordinates for the polyline

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;

    if (isDrawingLine) {
      // Add points to the line
      setLineCoords([...lineCoords, coordinate]);
    } else if (selectedType) {
      // Add markers
      setMarkers([...markers, { coordinate, type: selectedType }]);
    } else {
      Alert.alert('Error', 'Please select Borewell or Well before placing a marker, or enable drawing mode.');
    }
  };

  const toggleDrawingMode = () => {
    setIsDrawingLine(!isDrawingLine);
    if (!isDrawingLine) {
      setLineCoords([]); // Reset the line when starting a new one
    }
  };

  const undoLastLine = () => {
    if (lineCoords.length > 0) {
      setLineCoords(lineCoords.slice(0, -1)); // Remove the last coordinate
    } else {
      Alert.alert('Error', 'No line to undo.');
    }
  };

  if (!polygonCoords.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>No Polygon Data Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Shape Details</Text>
      <Text style={styles.areaText}>Area Size: {area} acres</Text>

      <MapView
        style={styles.map}
        mapType="satellite"  // Ensure mapType is set to satellite
        key={'satellite-view'}  // Force re-render by setting a key
        onPress={handleMapPress} // Handle map press to either draw line or add marker
        initialRegion={{
          latitude: polygonCoords[0]?.latitude || 0,
          longitude: polygonCoords[0]?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polygon
          coordinates={polygonCoords}
          fillColor="rgba(0, 200, 0, 0.5)"
          strokeColor="green"
          strokeWidth={2}
        />
        {markers.map((marker, index) => (
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
        )}
      </MapView>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, selectedType === 'Borewell' && styles.selectedButton]}
          onPress={() => setSelectedType('Borewell')}
        >
          <Text style={styles.buttonText}>Select Borewell</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, selectedType === 'Well' && styles.selectedButton]}
          onPress={() => setSelectedType('Well')}
        >
          <Text style={styles.buttonText}>Select Well</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isDrawingLine ? styles.selectedButton : styles.drawButton]}
          onPress={toggleDrawingMode}
        >
          <Text style={styles.buttonText}>
            {isDrawingLine ? 'Stop Drawing Line' : 'Draw Line'}
          </Text>
        </TouchableOpacity>
      </View>

      {isDrawingLine && lineCoords.length > 0 && (
        <TouchableOpacity style={[styles.button, styles.undoButton]} onPress={undoLastLine}>
          <Text style={styles.buttonText}>Undo Last Line</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={() => Alert.alert('Shape, markers, and lines saved')}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  areaText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  map: {
    height: 400,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#3498db',
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
  drawButton: {
    backgroundColor: '#e67e22',
  },
  undoButton: {
    backgroundColor: '#e74c3c',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShapeDetailsPage;
