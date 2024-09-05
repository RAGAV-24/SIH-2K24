import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CropDetailsPage = ({ route, navigation }) => {
  // Receiving polygon coordinates and area size from the previous screen
  const { area, polygonCoords } = route.params;  
  const [cropType, setCropType] = useState('');

  const handleSubmit = () => {
    console.log('Crop Type:', cropType);
    console.log('Field Area:', area);

    // Navigate to ShapeDetailsPage and pass polygon coordinates and area
    navigation.navigate('ShapeDetails', { polygonCoords, area });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Crop Details</Text>
      
      <Text style={styles.label}>Calculated Area (in acres):</Text>
      <TextInput
        style={styles.input}
        value={area.toString()}
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
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
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
