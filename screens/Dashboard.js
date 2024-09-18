import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

const Dashboard = ({ route, navigation }) => {
  const { gateValves = [], sensorCount = 0, polygonCoords = [] } = route.params || {};

  // Default values for data
  const defaultData = {
    temperature: 22.5,
    soilMoistureReadings: [20.0, 35.0, 25.0],
    groundWaterLevel: 15.0,
    timestamp: new Date().toLocaleTimeString()
  };

  const initialSensorData = Array.from({ length: sensorCount }, (_, index) => ({
    id: index + 1,
    temperature: defaultData.temperature + Math.random() * 5 - 2.5, // Example variation
    soilMoisture: defaultData.soilMoistureReadings[Math.floor(Math.random() * defaultData.soilMoistureReadings.length)],
    groundWaterLevel: defaultData.groundWaterLevel + Math.random() * 3 - 1.5 // Example variation
  }));

  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [isAuto, setIsAuto] = useState(true);
  const [valveStates, setValveStates] = useState(gateValves.map(() => false));
  const [sensorData, setSensorData] = useState(initialSensorData);

  useEffect(() => {
    // Simulate a data fetch
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setData(defaultData); // Use default values
        setSensorData(initialSensorData); // Use default sensor data
        setLoading(false);
      }, 1000); // Simulate network delay
    };

    loadData();
  }, []);

  useEffect(() => {
    // Update sensor data every second
    const intervalId = setInterval(() => {
      setSensorData(prevData =>
        prevData.map(sensor => ({
          ...sensor,
          temperature: defaultData.temperature + Math.random() * 5 - 2.5, // Example variation
          soilMoisture: defaultData.soilMoistureReadings[Math.floor(Math.random() * defaultData.soilMoistureReadings.length)],
          groundWaterLevel: defaultData.groundWaterLevel + Math.random() * 3 - 1.5 // Example variation
        }))
      );
    }, 1000); // 1 second interval

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  const temperature = data?.temperature ?? 'N/A';
  const groundWaterLevel = data?.groundWaterLevel ?? 'N/A';
  const timestamp = data?.timestamp ?? 'N/A';

  const averageSoilMoisture = data?.soilMoistureReadings.length > 0
    ? (data.soilMoistureReadings.reduce((sum, value) => sum + value, 0) / data.soilMoistureReadings.length).toFixed(2)
    : 'N/A';

  const handleValveToggle = (index) => {
    setValveStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Sensor Dashboard</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Temperature:</Text>
          <Text style={styles.value}>{temperature} °C</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Soil Moisture (Avg):</Text>
          <Text style={styles.value}>{averageSoilMoisture} %</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Ground Water Level:</Text>
          <Text style={styles.value}>{groundWaterLevel} meters</Text>
        </View>
        <Text style={styles.timestamp}>Last Updated: {timestamp}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (polygonCoords.length > 0 && sensorData.length > 0) {
              navigation.navigate('HeatMap', { polygonCoords, sensorData });
            } else {
              console.log('No polygonCoords or sensorData available');
            }
          }}
        >
          <Text style={styles.buttonText}>Heatmap</Text>
        </TouchableOpacity>

        <View style={styles.gateContainer}>
          <Text style={styles.label}>Gate Valves:</Text>
          {gateValves.map((valve, index) => (
            <View key={`gate-valve-${index}`} style={styles.gateRow}>
              <Text style={styles.value}>Gate Valve {index + 1}:</Text>
              {isAuto ? (
                <Text style={[styles.value, styles.gateStatus]}>Off</Text>
              ) : (
                <Switch
                  value={valveStates[index]}
                  onValueChange={() => handleValveToggle(index)}
                  thumbColor={valveStates[index] ? '#4caf50' : '#f44336'}
                  trackColor={{ false: '#767577', true: '#81c784' }}
                />
              )}
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Sensors:</Text>
          {sensorData.map((sensor) => (
            <Text key={sensor.id} style={styles.value}>Sensor {sensor.id} - Temp: {sensor.temperature.toFixed(1)} °C, Soil Moisture: {sensor.soilMoisture.toFixed(1)} %, Ground Water Level: {sensor.groundWaterLevel.toFixed(1)} meters</Text>
          ))}
        </View>
      </ScrollView>

      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Mode:</Text>
        <Switch
          value={isAuto}
          onValueChange={(value) => setIsAuto(value)}
          thumbColor={isAuto ? '#4caf50' : '#f44336'}
          trackColor={{ false: '#767577', true: '#81c784' }}
        />
        <Text style={styles.value}>{isAuto ? 'Auto' : 'Manual'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
  timestamp: {
    fontSize: 14,
    marginTop: 10,
    color: '#777',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  gateContainer: {
    marginTop: 20,
  },
  gateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gateStatus: {
    fontSize: 16,
    color: '#e74c3c',
    marginLeft: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default Dashboard;
