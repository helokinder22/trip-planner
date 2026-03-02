import React from "react";
import { MapPin, Navigation, X } from "lucide-react";
import { getTransportIcon, getTransportLabel } from "./TransportPicker";

export default function FullMapView({ locations, open, onClose }) {
  if (!locations || locations.length === 0 || !open) return null;

  // Build Google Maps URL with all locations
  const buildMapUrl = () => {
    if (locations.length === 1) {
      const query = encodeURIComponent(locations[0].address || locations[0].name);
      return `https://www.google.com/maps?q=${query}&output=embed`;
    }

    // For multiple locations, create a directions URL
    const origin = encodeURIComponent(locations[0].address || locations[0].name);
    const destination = encodeURIComponent(locations[locations.length - 1].address || locations[locations.length - 1].name);
    
    // Add waypoints for middle locations
    const waypoints = locations.slice(1, -1)
      .map(loc => encodeURIComponent(loc.address || loc.name))
      .join('|');
    
    const waypointParam = waypoints ? `&waypoints=${waypoints}` : '';
    
    return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${origin}&destination=${destination}${waypointParam}&mode=driving`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-[#5DBEBD]/10 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-[#5DBEBD]" />
          </div>
          <div>
            <p className="font-semibold text-stone-800 text-sm">Full Trip Route</p>
            <p className="text-xs text-stone-400">{locations.length} stops</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
        >
          <X className="w-5 h-5 text-stone-600" />
        </button>
      </div>

      {/* Map fills remaining space */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={buildMapUrl()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Full trip route"
        />
      </div>
    </div>
  );
}