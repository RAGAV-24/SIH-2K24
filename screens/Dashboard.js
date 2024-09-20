import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

const Dashboard = ({ route, navigation }) => {
  const { gateValves = [], sensorCount = 0, polygonCoords = [] } = route.params || {};

  const defaultData = {
    temperature: 32.5,
    soilMoistureReadings: [55.0, 58.0, 53.0],
    groundWaterLevel: 15.0,
    timestamp: new Date().toLocaleTimeString(),
  };

  const initialSensorData = [
    { id: 1, depth: '1', temperature: defaultData.temperature + Math.random() * 5 - 2.5, soilMoisture: defaultData.soilMoistureReadings[Math.floor(Math.random() * defaultData.soilMoistureReadings.length)] },
    { id: 2, depth: '2 feet', temperature: defaultData.temperature + Math.random() * 5 - 2.5, soilMoisture: defaultData.soilMoistureReadings[Math.floor(Math.random() * defaultData.soilMoistureReadings.length)] },
    { id: 3, depth: '3 feet', temperature: defaultData.temperature + Math.random() * 5 - 2.5, soilMoisture: defaultData.soilMoistureReadings[Math.floor(Math.random() * defaultData.soilMoistureReadings.length)] },
  ];

  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [isAuto, setIsAuto] = useState(true);
  const [valveStates, setValveStates] = useState(gateValves.map(() => false));
  const [sensorData, setSensorData] = useState(initialSensorData);
  const [motorStatus, setMotorStatus] = useState(false);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setData(defaultData);
        setSensorData(initialSensorData);
        setLoading(false);
      }, 3000);
    };

    loadData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSensorData((prevData) =>
        prevData.map((sensor) => ({
          ...sensor,
          temperature: defaultData.temperature + Math.random() * 5 - 2.5,
          soilMoisture: defaultData.soilMoistureReadings[Math.floor(Math.random() * defaultData.soilMoistureReadings.length)],
        }))
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#1abc9c" />;
  }

  const groundWaterLevel = data?.groundWaterLevel ?? 'N/A';
  const timestamp = data?.timestamp ?? 'N/A';

  const handleValveToggle = (index) => {
    setValveStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const handleMotorToggle = () => {
    setMotorStatus((prevStatus) => !prevStatus);
  };

  const sortedSensorData = sensorData.sort((a, b) => a.id - b.id);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Sensor Dashboard</Text>

        {/* Soil Moisture Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moisture</Text>
          <View style={styles.rowContainer}>
            {sortedSensorData.map((sensor) => (
              <View key={sensor.id} style={styles.sensorContainer}>
                <Text style={styles.value}>{sensor.depth}</Text>
                <Text style={styles.value}>{sensor.soilMoisture.toFixed(1)} %</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Temperature Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temperature</Text>
          <View style={styles.rowContainer}>
            {sortedSensorData.map((sensor) => (
              <View key={sensor.id} style={styles.sensorContainer}>
                <Text style={styles.value}>{sensor.depth}</Text>
                <Text style={styles.value}>{sensor.temperature.toFixed(1)} °C</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Ground Water Level Section */}
        <View style={styles.card}>
          <Text style={styles.label}>Ground Water Level:</Text>
          <Text style={styles.value}>3.25 feet        36,688 lit     5% filled</Text>
        </View>
        <Text style={styles.timestamp}>Last Updated: {timestamp}</Text>

        {/* Heatmap Button */}
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
          <Text style={styles.buttonText}>View Heatmap</Text>
        </TouchableOpacity>

        {/* Motor Status Section */}
        <View style={styles.motorStatusContainer}>
          <Text style={styles.sectionTitle}>Motor Status</Text>
          <View style={styles.motorStatusRow}>
            <Switch
              value={motorStatus}
              onValueChange={handleMotorToggle}
              thumbColor={motorStatus ? '#4caf50' : '#f44336'}
              trackColor={{ false: '#767577', true: '#81c784' }}
            />
            <Text style={[styles.value, styles.motorStatusText]}>
              {motorStatus ? 'Motor is ON' : 'Motor is OFF'}
            </Text>
          </View>
        </View>

        {/* Gate Valves Section */}
        <View style={styles.gateContainer}>
          <Text style={styles.sectionTitle}>Gate Valves</Text>
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
      </ScrollView>

      {/* Mode Toggle Section */}
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
    backgroundColor: '#1e1e1e', // Dark background
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ecf0f1', // Light text color
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ecf0f1',
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#34495e', // Dark card background
    marginBottom: 10,
    borderColor: '#7f8c8d',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  value: {
    fontSize: 16,
    marginTop: 5,
    color: '#ecf0f1',
  },
  timestamp: {
    fontSize: 14,
    marginTop: 10,
    color: '#bdc3c7',
  },
  button: {
    backgroundColor: '#2980b9', // Button color
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sensorContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#34495e', // Dark sensor container background
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7f8c8d',
  },
  motorStatusContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#34495e', // Dark card background
    marginBottom: 20,
    borderColor: '#7f8c8d',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  motorStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  motorStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginLeft: 10,
  },
});

export default Dashboard;
