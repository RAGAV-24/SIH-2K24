import * as turf from '@turf/turf';

const calculatePolygonArea = (coordinates) => {
  const polygonCoords = [...coordinates, coordinates[0]];
  
  // Convert the coordinates into a format suitable for Turf.js
  const turfPolygon = turf.polygon([polygonCoords.map(coord => [coord.longitude, coord.latitude])]);
  
  // Calculate the area in square meters
  const areaInSquareMeters = turf.area(turfPolygon);
  
  // Convert the area to acres (optional)
  const areaInAcres = areaInSquareMeters / 4046.86;
  
  return areaInAcres;
};
