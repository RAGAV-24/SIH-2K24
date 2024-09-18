import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

// Simulated weather data (replace with actual API call if needed)
const getWeatherData = async (latitude, longitude) => {
  // Simulate a weather response for rain prediction (you can use an API like OpenWeather later)
  return {
    isRaining: true, // Simulating rain condition
    rainfall: 2.5, // in cm
  };
};

const WaterMonitoring = () => {
  const route = useRoute();
  const { polygonCoords = [], sensorData = [], cropType = 'Banana' } = route.params || {};
  const [weatherData, setWeatherData] = useState(null);
  const [totalWaterContent, setTotalWaterContent] = useState(0);
  const [requiredWaterAmount, setRequiredWaterAmount] = useState(0);

  // Set a default value for ground water content if it's missing
  const defaultGroundWaterContent = 10.0; // Example: 10 liters/m²

  // Function to calculate total water content based on sensor data
  const calculateTotalWaterContent = () => {
    const totalWater = sensorData.length > 0
      ? sensorData.reduce((sum, sensor) => sum + (sensor.groundWaterLevel || defaultGroundWaterContent), 0)
      : defaultGroundWaterContent; // Use default if no sensor data available
    setTotalWaterContent(totalWater);
  };

  // Function to calculate required water amount for the crop
  const calculateRequiredWaterAmount = () => {
    // Simulate water requirement (this can vary based on crop type, region, etc.)
    const waterRequirement = cropType === 'Banana' ? 6.0 : 4.0; // in liters per square meter
    setRequiredWaterAmount(waterRequirement);
  };

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    if (polygonCoords.length > 0) {
      const { latitude, longitude } = polygonCoords[0]; // Get a representative point for weather
      const weather = await getWeatherData(latitude, longitude);
      setWeatherData(weather);
    } else {
      // Simulate a weather report if no coordinates are provided
      setWeatherData({ isRaining: true, rainfall: 2.0 }); // Example default weather data
    }
  };

  useEffect(() => {
    calculateTotalWaterContent();
    calculateRequiredWaterAmount();
    fetchWeatherData();
  }, [sensorData, polygonCoords]);

  // Calculate difference between required water and available water
  const waterDeficit = requiredWaterAmount - totalWaterContent;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Water Monitoring</Text>

      {/* Display an image related to groundwater or agriculture */}
      <Image
        source={{ uri: 'bananas.webp' }} // Replace with a valid image URL
        style={styles.image}
      />

      {/* Display total water content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Total Ground Water Content:</Text>
        <Text style={styles.sectionValue}>
          {totalWaterContent.toFixed(2)} liters/m²
        </Text>
      </View>

      {/* Display water requirement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Water Requirement for {cropType} Today:</Text>
        <Text style={styles.sectionValue}>
          {requiredWaterAmount.toFixed(2)} liters/m²
        </Text>
      </View>

      {/* Show water deficit or surplus */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {waterDeficit > 0 ? 'Water Deficit:' : 'Water Surplus:'}
        </Text>
        <Text style={styles.sectionValue}>
          {Math.abs(waterDeficit).toFixed(2)} liters/m²
        </Text>
      </View>

      {/* Weather Monitoring Section */}
      {weatherData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Monitoring:</Text>
          <Text style={styles.sectionValue}>
            {weatherData.isRaining
              ? `Rainfall Expected: ${weatherData.rainfall} cm`
              : 'No Rain Expected Today'}
          </Text>
        </View>
      )}

      {/* Add any additional button or navigation */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('Navigate to another component if needed')}
      >
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark theme background
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a8a8a8',
  },
  sectionValue: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default WaterMonitoring;
