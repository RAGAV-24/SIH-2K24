import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

const Dashboard = ({ route, navigation }) => {
  const { gateValves, sensorCount } = route.params; // Receiving sensorCount from PointMarkersPage

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuto, setIsAuto] = useState(true);
  const [valveStates, setValveStates] = useState(gateValves.map(() => false));

  useEffect(() => {
    const loadData = async () => {
      try {
        setData({
          temperature: 22.5,
          soilMoistureReadings: [20.0, 35.0, 25.0],
          groundWaterLevel: 15.0,
          timestamp: new Date().toLocaleTimeString()
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
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

        {/* Heatmap Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Heatmap')}
        >
          <Text style={styles.buttonText}>Heatmap</Text>
        </TouchableOpacity>

        {/* Gate Valves Display */}
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

        {/* Sensors Display */}
        <View style={styles.card}>
          <Text style={styles.label}>Sensors:</Text>
          {Array.from({ length: sensorCount }, (_, index) => (
            <Text key={index} style={styles.value}>Sensor {index + 1}</Text>
          ))}
        </View>
      </ScrollView>

      {/* Toggle Switch at the Bottom */}
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
    backgroundColor: '#f4f4f8',
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
