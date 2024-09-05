import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const CropDetailsPage = ({ route, navigation }) => {
  const { area, polygonCoords } = route.params || {};
  const [cropType, setCropType] = useState('');

  useEffect(() => {
    // Debugging: Log the received parameters
    console.log('Received area:', area);
    console.log('Received polygonCoords:', polygonCoords);
  }, []);

  const handleSubmit = () => {
    if (area && polygonCoords && cropType) {
      // Navigate to ShapeDetailsPage and pass the necessary data
      navigation.navigate('ShapeDetails', { area, polygonCoords });
    } else {
      Alert.alert('Error', 'Area, Polygon Coordinates, or Crop Type is missing');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Crop Details</Text>

      <Text style={styles.label}>Calculated Area (in acres):</Text>
      <TextInput
        style={styles.input}
        value={area ? area.toString() : ''}
        editable={false}
      />

      <Text style={styles.label}>Type of Crop:</Text>
      <TextInput
        style={styles.input}
        value={cropType}
        onChangeText={setCropType}
        placeholder="Enter Crop Type"
      />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default CropDetailsPage;
