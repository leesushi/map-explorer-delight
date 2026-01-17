import { useState, useEffect, useCallback } from 'react';
import { MAP_CONFIG, MapPosition } from '@/config/mapConfig';

interface GeolocationState {
  position: MapPosition | null;
  error: string | null;
  loading: boolean;
  isUsingDefault: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
    isUsingDefault: false,
  });

  const requestLocation = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState({
        position: MAP_CONFIG.defaultUserLocation,
        error: 'Geolocation is not supported by your browser',
        loading: false,
        isUsingDefault: true,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
          isUsingDefault: false,
        });
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setState({
          position: MAP_CONFIG.defaultUserLocation,
          error: errorMessage,
          loading: false,
          isUsingDefault: true,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    ...state,
    requestLocation,
  };
};
