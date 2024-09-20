import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
      <Text style={styles.value}>{area ? area.toString() : 'N/A'}</Text>

      <Text style={styles.label}>Type of Crop:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={cropType}
          onValueChange={(itemValue) => setCropType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Crop" value="" />
          <Picker.Item label="Coconut" value="Coconut" />
          <Picker.Item label="Banana" value="Banana" />
          <Picker.Item label="Sugarcane" value="Sugarcane" />
        </Picker>
      </View>

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#212121', // Added a dark background color
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white', // Changed the text color to white
  },
  value: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    backgroundColor: '#333',
    marginBottom: 20,
  },
  picker: {
    color: '#ffffff', // Changed the text color to white
    height: 50,
  },
});

export default CropDetailsPage;
