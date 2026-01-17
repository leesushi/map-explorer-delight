const parseEnvNumber = (value: string | undefined, fallback: number) => {
  const parsed = value ? Number.parseFloat(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const MAP_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',

  pinnedLocation: {
    lat: parseEnvNumber(process.env.NEXT_PUBLIC_PIN_LAT, 40.7128),
    lng: parseEnvNumber(process.env.NEXT_PUBLIC_PIN_LONG, -74.0060),
  },

  defaultUserLocation: {
    lat: 21.1367,
    lng: 105.8487,
  },
  defaultLocationLabel: 'Đông Anh Hà Nội Việt Nam',

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
