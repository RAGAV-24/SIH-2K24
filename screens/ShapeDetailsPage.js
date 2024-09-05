import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';

const ShapeDetailsPage = ({ route }) => {
  const { polygonCoords, area } = route.params;  // Receiving the passed data

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Shape Details</Text>
      <Text>Area Size: {area} acres</Text>

      {/* Display the shape on the map */}
      <MapView style={styles.map}>
        {polygonCoords && (
          <Polygon
            coordinates={polygonCoords}
            fillColor="rgba(0, 200, 0, 0.5)" // Customize fill color
            strokeColor="green"
            strokeWidth={2}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  map: {
    height: 400, // Adjust as needed
  },
});

export default ShapeDetailsPage;
