from flask import Flask, jsonify
import numpy as np
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)

# Check if the Firebase app is already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate("path-to-your-firebase-admin-sdk.json")  # Replace with your Firebase credentials file path
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://your-firebase-database-url.firebaseio.com/'  # Replace with your Firebase database URL
    })

# Function to fetch sensor data from Firebase
def fetch_data():
    ref = db.reference('/')  # Root reference of your Firebase database
    data = ref.get()
    if data:
        # Extract moisture and temperature values from Firebase
        moisture_data = [
            data['moisture']['moisture1'], 
            data['moisture']['moisture2'], 
            data['moisture']['moisture3']
        ]
        
        temp_data = [
            data['temperatures']['temp1'], 
            data['temperatures']['temp2'], 
            data['temperatures']['temp3']
        ]
        
        return moisture_data, temp_data
    return None, None

# API endpoint to fetch sensor data
@app.route('/sensor-data', methods=['GET'])
def get_sensor_data():
    moisture_data, temp_data = fetch_data()
    if moisture_data and temp_data:
        return jsonify({
            'moisture_data': moisture_data,
            'temp_data': temp_data
        }), 200
    return jsonify({'error': 'No data available'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Run the Flask app on port 5000
