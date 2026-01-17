// Map configuration with environment variable support
// In Vite, env vars must be prefixed with VITE_ to be exposed to the client

export const MAP_CONFIG = {
  // Google Maps API Key
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDWuA8K4g26AdBvrZpb4dncpgMLIwX1moM',
  
  // Pinned location from environment variables (with defaults)
  pinnedLocation: {
    lat: parseFloat(import.meta.env.VITE_PIN_LAT || '40.7128'),
    lng: parseFloat(import.meta.env.VITE_PIN_LONG || '-74.0060'),
  },
  
  // Default fallback location (New York City) when geolocation is unavailable
  defaultUserLocation: {
    lat: 40.7580,
    lng: -73.9855,
  },
  
  // Map styling options
  mapOptions: {
    zoom: 14,
    minZoom: 3,
    maxZoom: 20,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  },
  
  // Custom map styles for a cleaner look
  mapStyles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'simplified' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#a8d5e5' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#e0e0e0' }],
    },
  ] as google.maps.MapTypeStyle[],
};

// Polygon overlay coordinates (relative to the pinned location)
export const getOverlayPolygon = (center: google.maps.LatLngLiteral) => {
  const offset = 0.003; // Approximately 300 meters
  return [
    { lat: center.lat + offset, lng: center.lng - offset },
    { lat: center.lat + offset, lng: center.lng + offset },
    { lat: center.lat - offset * 0.5, lng: center.lng + offset * 1.2 },
    { lat: center.lat - offset, lng: center.lng },
    { lat: center.lat - offset * 0.5, lng: center.lng - offset * 1.2 },
  ];
};

export type MapPosition = google.maps.LatLngLiteral;
