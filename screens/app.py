from flask import Flask, jsonify
import os
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)

# Load Firebase credentials and database URL from environment variables
firebase_cert_path = os.getenv('FIREBASE_CERT_PATH')
firebase_db_url = os.getenv('FIREBASE_DB_URL')

# Check if the Firebase app is already initialized
if not firebase_admin._apps:
    if firebase_cert_path and firebase_db_url:
        cred = credentials.Certificate(firebase_cert_path)
        firebase_admin.initialize_app(cred, {
            'databaseURL': firebase_db_url
        })
    else:
        raise ValueError("Firebase credentials or database URL not set in environment variables")

# Function to fetch sensor data from Firebase
def fetch_data():
    try:
        ref = db.reference('/')  # Root reference of your Firebase database
        data = ref.get()
        if data:
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
    except Exception as e:
        print(f"Error fetching data: {e}")
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
