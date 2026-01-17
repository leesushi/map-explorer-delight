import React from 'react';
import { Plus, Minus, Locate, MapPin } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenterOnUser: () => void;
  onCenterOnPin: () => void;
  hasUserLocation: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onCenterOnUser,
  onCenterOnPin,
  hasUserLocation,
}) => {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 animate-fade-in">
      {/* Zoom Controls */}
      <div className="glass-panel-elevated flex flex-col overflow-hidden">
        <button
          onClick={onZoomIn}
          className="p-3 hover:bg-muted transition-colors border-b border-border"
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-3 hover:bg-muted transition-colors"
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Location Controls */}
      <div className="glass-panel-elevated flex flex-col overflow-hidden">
        {hasUserLocation && (
          <button
            onClick={onCenterOnUser}
            className="p-3 hover:bg-muted transition-colors border-b border-border"
            aria-label="Center on my location"
            title="My Location"
          >
            <Locate className="w-5 h-5 text-secondary" />
          </button>
        )}
        <button
          onClick={onCenterOnPin}
          className="p-3 hover:bg-muted transition-colors"
          aria-label="Center on destination"
          title="Destination"
        >
          <MapPin className="w-5 h-5 text-accent" />
        </button>
      </div>
    </div>
  );
};
