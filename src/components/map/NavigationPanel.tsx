import React from 'react';
import { Navigation, X, AlertCircle, RefreshCw, MapPin, Clock, Route } from 'lucide-react';

interface NavigationPanelProps {
  isNavigating: boolean;
  routeInfo: { distance: string; duration: string } | null;
  geoMessage: string | null;
  geoMessageType: 'notice' | 'error' | null;
  navigationError: string | null;
  isUsingDefault: boolean;
  geoLoading: boolean;
  defaultLocationLabel: string;
  onStartNavigation: () => void;
  onClearNavigation: () => void;
  onRetryLocation: () => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  isNavigating,
  routeInfo,
  geoMessage,
  geoMessageType,
  navigationError,
  isUsingDefault,
  geoLoading,
  defaultLocationLabel,
  onStartNavigation,
  onClearNavigation,
  onRetryLocation,
}) => {
  const isNotice = geoMessageType !== 'error';
  const geoPanelClass = isNotice
    ? 'bg-accent/10 border border-accent/20'
    : 'bg-destructive/10 border border-destructive/20';
  const geoIconClass = isNotice ? 'text-accent' : 'text-destructive';
  const geoTextClass = isNotice ? 'text-foreground' : 'text-destructive';

  return (
    <div className="absolute left-4 top-4 max-w-sm animate-slide-up">
      <div className="glass-panel-elevated p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-lg text-foreground">
              Walk Navigator
            </h1>
            <p className="text-sm text-muted-foreground">
              Walking directions to your destination
            </p>
          </div>
        </div>

        {/* Location Status */}
        {geoLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Getting your location...</span>
          </div>
        )}

        {geoMessage && (
          <div className={`p-3 rounded-lg ${geoPanelClass}`}>
            <div className="flex items-start gap-2">
              <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${geoIconClass}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${geoTextClass}`}>{geoMessage}</p>
                {isUsingDefault && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Using default location ({defaultLocationLabel})
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onRetryLocation}
              className="mt-2 text-xs text-secondary hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Try again
            </button>
          </div>
        )}

        {navigationError && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{navigationError}</p>
            </div>
          </div>
        )}

        {/* Route Info */}
        {routeInfo && isNavigating && (
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">{routeInfo.distance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">{routeInfo.duration}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Walking route</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isNavigating ? (
            <button
              onClick={onStartNavigation}
              disabled={geoLoading}
              style={geoLoading ? { opacity: 1 } : undefined}
              className={`flex-1 flex items-center justify-center gap-2 ${
                geoLoading
                  ? 'map-button-secondary text-foreground cursor-not-allowed'
                  : 'map-button-primary'
              } disabled:opacity-100 disabled:text-foreground`}
            >
              <Navigation className={`w-4 h-4 ${geoLoading ? 'text-foreground' : ''}`} />
              <span>Get Directions</span>
            </button>
          ) : (
            <button
              onClick={onClearNavigation}
              className="flex-1 map-button-secondary flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Clear Route</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
