import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const HomePage = () => {
  const [fieldDetails, setFieldDetails] = useState({
    fieldName: '',
    areaSize: '',
    cropType: '',
  });

  const handleChange = (name, value) => {
    setFieldDetails({
      ...fieldDetails,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log('Field Details:', fieldDetails);
    // Perform further actions, such as sending the data to a backend here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Crop Field Details</Text>
      
      <Text style={styles.label}>Field Name:</Text>
      <TextInput
        style={styles.input}
        value={fieldDetails.fieldName}
        onChangeText={(value) => handleChange('fieldName', value)}
        placeholder="Enter Field Name"
      />
      
      <Text style={styles.label}>Area Size (in acres):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={fieldDetails.areaSize}
        onChangeText={(value) => handleChange('areaSize', value)}
        placeholder="Enter Area Size"
      />

      <Text style={styles.label}>Type of Crop:</Text>
      <TextInput
        style={styles.input}
        value={fieldDetails.cropType}
        onChangeText={(value) => handleChange('cropType', value)}
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

export default HomePage;
