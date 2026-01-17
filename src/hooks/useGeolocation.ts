import { useState, useEffect, useCallback } from 'react';
import { MAP_CONFIG, MapPosition } from '@/config/mapConfig';

interface GeolocationState {
  position: MapPosition | null;
  message: string | null;
  messageType: 'notice' | 'error' | null;
  loading: boolean;
  isUsingDefault: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    message: null,
    messageType: null,
    loading: true,
    isUsingDefault: false,
  });

  const requestLocation = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, message: null, messageType: null }));

    if (!navigator.geolocation) {
      setState({
        position: MAP_CONFIG.defaultUserLocation,
        message: 'Location access is not supported by your browser.',
        messageType: 'notice',
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
          message: null,
          messageType: null,
          loading: false,
          isUsingDefault: false,
        });
      },
      (error) => {
        let message = 'Unable to get your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access is blocked. Using a default location.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable. Using a default location.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Using a default location.';
            break;
        }
        setState({
          position: MAP_CONFIG.defaultUserLocation,
          message,
          messageType: 'notice',
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
