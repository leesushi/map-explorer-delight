import React from 'react';
import { Map } from 'lucide-react';

export const MapLoadingState: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="glass-panel-elevated p-8 text-center animate-fade-in">
        <div className="inline-flex p-4 rounded-full gradient-primary mb-4">
          <Map className="w-8 h-8 text-primary-foreground animate-pulse-soft" />
        </div>
        <h2 className="text-xl font-display font-semibold text-foreground mb-2">
          Loading Map
        </h2>
        <p className="text-muted-foreground">
          Preparing your navigation experience...
        </p>
        <div className="mt-4 flex justify-center gap-1">
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
