'use client';

import React, { useCallback, useState, useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
  Polygon,
  InfoWindow,
} from '@react-google-maps/api';
import { MAP_CONFIG, getOverlayPolygon } from '@/config/mapConfig';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapControls } from './MapControls';
import { NavigationPanel } from './NavigationPanel';
import { MapLoadingState } from './MapLoadingState';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const libraries: ('places' | 'drawing' | 'geometry')[] = ['places', 'geometry'];

export const MapContainer: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAP_CONFIG.apiKey,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const {
    position: userPosition,
    message: geoMessage,
    messageType: geoMessageType,
    loading: geoLoading,
    isUsingDefault,
    requestLocation,
  } = useGeolocation();
  
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  const pinnedLocation = MAP_CONFIG.pinnedLocation;
  const overlayPolygon = getOverlayPolygon(pinnedLocation);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleStartNavigation = useCallback(() => {
    if (!userPosition || !window.google) return;

    setIsNavigating(true);
    setNavigationError(null);

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: userPosition,
        destination: pinnedLocation,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          const leg = result.routes[0]?.legs[0];
          if (leg) {
            setRouteInfo({
              distance: leg.distance?.text || 'Unknown',
              duration: leg.duration?.text || 'Unknown',
            });
          }
        } else {
          setNavigationError('Unable to find a walking route. Try a different location.');
          setIsNavigating(false);
        }
      }
    );
  }, [userPosition, pinnedLocation]);

  const handleClearNavigation = useCallback(() => {
    setDirections(null);
    setIsNavigating(false);
    setRouteInfo(null);
    setNavigationError(null);
  }, []);

  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || MAP_CONFIG.mapOptions.zoom;
      mapRef.current.setZoom(Math.min(currentZoom + 1, MAP_CONFIG.mapOptions.maxZoom));
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || MAP_CONFIG.mapOptions.zoom;
      mapRef.current.setZoom(Math.max(currentZoom - 1, MAP_CONFIG.mapOptions.minZoom));
    }
  }, []);

  const handleCenterOnUser = useCallback(() => {
    if (mapRef.current && userPosition) {
      mapRef.current.panTo(userPosition);
      mapRef.current.setZoom(15);
    }
  }, [userPosition]);

  const handleCenterOnPin = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.panTo(pinnedLocation);
      mapRef.current.setZoom(16);
    }
  }, [pinnedLocation]);

  if (loadError) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="glass-panel-elevated p-8 text-center max-w-md">
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">Map Error</h2>
          <p className="text-muted-foreground">Failed to load Google Maps. Please check your API key.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return <MapLoadingState />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={pinnedLocation}
        zoom={MAP_CONFIG.mapOptions.zoom}
        options={{
          ...MAP_CONFIG.mapOptions,
          styles: MAP_CONFIG.mapStyles,
        }}
        onLoad={onMapLoad}
      >
        {/* Custom Polygon Overlay */}
        <Polygon
          paths={overlayPolygon}
          options={{
            fillColor: '#0d9488',
            fillOpacity: 0.25,
            strokeColor: '#0d9488',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
            geodesic: true,
          }}
        />

        {/* Pinned Location Marker */}
        <Marker
          position={pinnedLocation}
          onClick={() => setShowInfoWindow(true)}
          icon={{
            url: 'data:image/svg+xml,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
                <defs>
                  <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1e3a5f"/>
                    <stop offset="100%" style="stop-color:#0d9488"/>
                  </linearGradient>
                </defs>
                <path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 30 20 30s20-16 20-30C40 8.954 31.046 0 20 0z" fill="url(#pinGrad)"/>
                <circle cx="20" cy="18" r="8" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 50),
            anchor: new google.maps.Point(20, 50),
          }}
        />

        {/* Info Window */}
        {showInfoWindow && (
          <InfoWindow
            position={pinnedLocation}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-gray-900">Destination</h3>
              <p className="text-sm text-gray-600">
                {pinnedLocation.lat.toFixed(4)}, {pinnedLocation.lng.toFixed(4)}
              </p>
            </div>
          </InfoWindow>
        )}

        {/* User Location Marker */}
        {userPosition && !geoLoading && (
          <Marker
            position={userPosition}
            icon={{
              url: 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#3b82f6" opacity="0.3"/>
                  <circle cx="12" cy="12" r="6" fill="#3b82f6"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24),
              anchor: new google.maps.Point(12, 12),
            }}
          />
        )}

        {/* Directions Renderer */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#1e3a5f',
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>

      {/* Navigation Panel */}
      <NavigationPanel
        isNavigating={isNavigating}
        routeInfo={routeInfo}
        geoMessage={geoMessage}
        geoMessageType={geoMessageType}
        navigationError={navigationError}
        isUsingDefault={isUsingDefault}
        geoLoading={geoLoading}
        defaultLocationLabel={MAP_CONFIG.defaultLocationLabel}
        onStartNavigation={handleStartNavigation}
        onClearNavigation={handleClearNavigation}
        onRetryLocation={requestLocation}
      />

      {/* Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onCenterOnUser={handleCenterOnUser}
        onCenterOnPin={handleCenterOnPin}
        hasUserLocation={!!userPosition && !geoLoading}
      />
    </div>
  );
};
