import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Simulated weather data (replace with actual API call if needed)
const getWeatherData = async (latitude, longitude) => {
  return {
    isRaining: true, // Simulated for notification
    rainfall: 10,    // Simulated for notification
  };
};

// Function to generate random weather conditions
const getRandomWeatherCondition = () => {
  const conditions = [
    { status: 'Sunny', temperature: Math.floor(Math.random() * 10) + 30, humidity: Math.floor(Math.random() * 20) + 40 },
    { status: 'Partly Cloudy', temperature: Math.floor(Math.random() * 10) + 28, humidity: Math.floor(Math.random() * 20) + 45 },
    { status: 'Cloudy', temperature: Math.floor(Math.random() * 10) + 25, humidity: Math.floor(Math.random() * 20) + 50 },
    { status: 'Rainy', temperature: Math.floor(Math.random() * 10) + 20, humidity: Math.floor(Math.random() * 20) + 60 },
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

const WaterMonitoring = () => {
  const route = useRoute();
  const { polygonCoords = [], cropType = 'Coconut', totalCrop = 70 } = route.params || {};

  const [weatherData, setWeatherData] = useState(null);
  const [availableWater, setAvailableWater] = useState(915870);
  const [waterPerCrop, setWaterPerCrop] = useState(700);
  const [totalWaterRequired, setTotalWaterRequired] = useState(0);
  const [waterDeficit, setWaterDeficit] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('Over Watered');
  const [nextWatering, setNextWatering] = useState('5 days');
  const [motorStatus, setMotorStatus] = useState('On');
  const [groundWaterStatus, setGroundWaterStatus] = useState('Normal');
  const [upcomingClimate, setUpcomingClimate] = useState([]);

  const evaporationRate = 6;
  const humidity = 53;
  const temperature = 35;

  const calculateTotalWaterRequired = () => {
    const totalRequired = totalCrop * waterPerCrop;
    setTotalWaterRequired(totalRequired);
  };

  const fetchWeatherData = async () => {
    if (polygonCoords.length > 0) {
      const { latitude, longitude } = polygonCoords[0];
      const weather = await getWeatherData(latitude, longitude);
      setWeatherData(weather);
    } else {
      setWeatherData({ isRaining: false, rainfall: 0 });
    }
  };

  useEffect(() => {
    calculateTotalWaterRequired();
    fetchWeatherData();
  }, [totalCrop, polygonCoords]);

  useEffect(() => {
    setWaterDeficit(totalWaterRequired - availableWater);
  }, [totalWaterRequired, availableWater]);

  useEffect(() => {
    const climateForecast = Array.from({ length: 3 }, (_, index) => {
      return {
        day: `Day ${index + 1}`,
        ...getRandomWeatherCondition(),
      };
    });
    setUpcomingClimate(climateForecast);
  }, []);

  const checkGroundWaterAndMotorStatus = () => {
    setGroundWaterStatus('High');
    if (motorStatus === 'On') {
      console.log('Motor is currently On');
    }

    if (groundWaterStatus === 'High' && weatherData?.isRaining) {
      alert('Moisture is High and Rain is expected today!');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkGroundWaterAndMotorStatus, 120000);
    return () => clearInterval(intervalId);
  }, [motorStatus, weatherData]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌱 Water Monitoring System</Text>

      <Image
        source={{ uri: 'https://example.com/coconut.jpg' }} // Replace with a valid image URL
        style={styles.image}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💧 Total Available Water:</Text>
        <Text style={styles.sectionValue}>{availableWater.toFixed(2)} liters</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌿 Total Water Requirement for {cropType}:</Text>
        <Text style={styles.sectionValue}>{totalWaterRequired.toFixed(2)} liters</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {waterDeficit > 0 ? '⚠️ Water Deficit:' : '✅ Water Surplus:'}
        </Text>
        <Text style={styles.sectionValue}>
          {Math.abs(waterDeficit).toFixed(2)} liters
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Current Status:</Text>
        <Text style={styles.sectionValue}>{currentStatus}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔌 Motor Status:</Text>
        <Text style={styles.sectionValue}>{motorStatus}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏰ Next Watering:</Text>
        <Text style={styles.sectionValue}>{nextWatering}</Text>
      </View>

      {weatherData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌤️ Weather Monitoring:</Text>
          <Text style={styles.sectionValue}>
            {weatherData.isRaining
              ? `Rainfall Expected: ${weatherData.rainfall} cm`
              : '🌞 No Rain Expected Today'}
          </Text>
          <Text style={styles.sectionValue}>
            🌧️ Evaporation Rate: {evaporationRate} mm/day
          </Text>
          <Text style={styles.sectionValue}>
            🌬️ Humidity: {humidity}%
          </Text>
          <Text style={styles.sectionValue}>
            🌡️ Temperature: {temperature} °C
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌦️ Weather Station:</Text>
        <Text style={styles.sectionValue}>🌡️ Temperature: 35.6 °C</Text>
        <Text style={styles.sectionValue}>💧 Humidity: 56%</Text>
        <Text style={styles.sectionValue}>🌧️ Rain Water: 10 mm</Text>
        <Text style={styles.sectionValue}>💦 Rain Volume: 40,046 liters</Text>
        <Text style={styles.sectionValue}>☁️ Current Climate: Cloudy</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Upcoming Climate Status:</Text>
        {upcomingClimate.map((day) => (
          <Text key={day.day} style={styles.sectionValue}>
            {day.day}: {day.status}, Temp: {day.temperature} °C, Humidity: {day.humidity}%
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('Navigate to another component if needed')}
      >
        <Icon name="arrow-right" size={20} color="#fff" />
        <Text style={styles.buttonText}> Go to Dashboard </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 10, // Reduced top padding
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: 10, // Reduced margin between title and sections
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10, // Reduced space between image and sections
  },
  section: {
    marginBottom: 10, // Reduced space between sections
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default WaterMonitoring;
