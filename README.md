# SIH 2K24

This project is a React Native-based mobile application designed for Shape and Area Measurement with GPS support, which allows users to draw polygons, mark important locations (such as Borewells and Wells), and calculate the area of a selected region. The project is a part of Smart India Hackathon (SIH) 2024.

## Features

- **GPS-based Shape Drawing:** Draw polygons on the map representing a specific area, with real-time GPS data.
- **Area Calculation:** Calculate the area of the drawn shape (in acres).
- **Marker Placement:** Place Borewell and Well markers on the map at precise locations.
- **Line Drawing:** Draw lines between specific points with an option to undo the last drawn line.
- **Save and Submit:** Save shapes, markers, and lines, and navigate to the next screen for further processing.

## Installation

### Clone the Repository

```bash
git clone https://github.com/RAGAV-24/SIH-2K24.git
```
##Navigate to the Project Directory
Change into the project directory:
```bash
cd SIH-2K24
```
Install Dependencies
Ensure you have Node.js installed. Install all necessary packages:
```bash
npm install
```
##Install Submodules
This project uses several third-party modules that need to be installed separately. Run the following commands to install the required modules:

- **React Navigation: For handling navigation between screens.
- **React Native Maps: For integrating Google Maps and providing GPS-based mapping features.
- **React Native Elements: UI toolkit for React Native.
- **Expo Libraries: Since the project is built using Expo, ensure the required Expo packages are installed.
```bash
  npm install @react-navigation/native @react-navigation/stack
npm install react-native-maps
npm install react-native-elements
expo install react-native-screens react-native-safe-area-context
```
###Running the Application
##Start the Metro Bundler
Launch the Metro Bundler:
```bash
npx expo start
```
###Run the Project
You can use either the Android Emulator, iOS Simulator, or your physical device (through Expo Go) to run the app:

- **For Android:
```bash
npm run android
```
- **For iOS:
```bash
npm run ios
```
##Use the App
Once the app is running, you can interact with the map, draw shapes, place markers, calculate areas, and navigate between screens.
###Project Structure
- **AppNavigator.js: Handles navigation between LoginScreen, SignupScreen, ShapeDetailsPage, and MapScreen.
- **ShapeDetailsPage.js: The main page where users can draw polygons, place markers, and calculate the area of the drawn shape.
- **GPS Area Calculation: Handles the GPS-based area calculation of the drawn polygons and displays it.
##Contributing
Feel free to fork this repository and contribute via pull requests. Any improvements or feature additions are welcome!
"# formerass-app" 
