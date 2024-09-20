// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginScreen = ({ navigation }) => {
  const handleLogin = (values) => {
    // Handle login logic here (e.g., API call)
    Alert.alert('Login Successful', `Email: ${values.email}`);
    navigation.navigate('Home'); // Navigate to the map screen upon successful login
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor="#999"
              onChangeText={handleChange('email')}
              value={values.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
            
            <TextInput
              style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              onChangeText={handleChange('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
            
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}>Go to Signup</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#212121', // Dark background
  },
  input: {
    height: 50,
    borderColor: '#444', // Subtle border color
    borderBottomWidth: 1, // Bottom border for professional look
    marginBottom: 15,
    backgroundColor: '#2b2b2b', // Dark background for input
    color: 'white', // White text
    paddingHorizontal: 10, // Added padding inside input
    borderRadius: 5,
  },
  inputError: {
    borderColor: '#ff3737', // Border color for error state
  },
  error: {
    color: '#ff3737', // Lighter shade of red for errors
    marginBottom: 10,
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#6200EE', // Dark purple button
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#BBB', // Light gray text for "Go to Signup"
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});

export default LoginScreen;
