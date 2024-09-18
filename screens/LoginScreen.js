// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
            
            <Button title="Login" onPress={handleSubmit} />
            <Button title="Go to Signup" onPress={() => navigation.navigate('Signup')} />
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
    backgroundColor: '#212121', // Changed to a dark gray or black color
  },
  input: {
    height: 40,
    borderColor: 'white', // Changed to a dark gray color
    borderBottomWidth: 50,
    marginBottom: 10,
    backgroundColor: '#2b2b2b', // Added a dark background color
    color: 'black', // Changed the text color to white
    borderRadius: 5, // Added a border radius for a more professional look
  },
  error: {
    color: '#ff3737', // Changed to a lighter shade of red
  },
});

export default LoginScreen;
