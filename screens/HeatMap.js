import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import yourImage from '../assets/finHeatmap.png'; // Adjust the path as needed

const HeatMap = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heat Map Component</Text>
      <Image source={yourImage} style={styles.image} resizeMode="cover" />
      {/* Add more content for your HeatMap here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', // Dark background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 20,
  },
  image: {
    width: '100%', // Full width
    height: '100%', // Full height
    borderRadius: 0, // Remove border radius for full screen
  },
});

export default HeatMap;
