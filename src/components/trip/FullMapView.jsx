import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Navigation } from "lucide-react";
import { getTransportIcon, getTransportLabel } from "./TransportPicker";

export default function FullMapView({ locations, open, onClose }) {
  if (!locations || locations.length === 0) return null;

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-screen h-screen p-0 rounded-none overflow-hidden border-0 m-0">
        <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-stone-800">
              <div className="h-7 w-7 rounded-full bg-[#E8725A]/10 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#E8725A]" />
              </div>
              Full Trip Route
              <span className="text-sm text-stone-400 font-normal ml-1">• {locations.length} stops</span>
            </DialogTitle>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
            >
              <span className="text-stone-600 text-xl leading-none">×</span>
            </button>
          </div>
        </DialogHeader>
        
        <div className="w-full h-full overflow-hidden pt-16">
          <div className="grid md:grid-cols-[280px,1fr] h-full">
            {/* Sidebar with route details */}
            <div className="bg-white p-4 overflow-y-auto border-r border-stone-200 hidden md:block shadow-lg">
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                Your Route
              </h3>
              <div className="space-y-3">
                {locations.map((loc, idx) => {
                  const TransportIcon = getTransportIcon(loc.transportation);
                  return (
                    <div key={loc.id}>
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-white border-2 border-[#E8725A] flex items-center justify-center shadow-sm">
                            <span className="text-xs font-bold text-[#E8725A]">{idx + 1}</span>
                          </div>
                          {idx < locations.length - 1 && (
                            <div className="w-0.5 h-12 bg-stone-200 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <h4 className="font-semibold text-stone-800 text-sm">{loc.name}</h4>
                          {loc.address && (
                            <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{loc.address}</p>
                          )}
                          {loc.transportation && TransportIcon && (
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-stone-200 text-xs font-medium text-stone-600">
                              <TransportIcon className="w-3 h-3" />
                              {getTransportLabel(loc.transportation)}
                            </div>
                          )}
                        </div>
                      </div>
                      {idx < locations.length - 1 && loc.transportation && TransportIcon && (
                        <div className="ml-4 pl-4 py-2 border-l-2 border-stone-200">
                          <div className="flex items-center gap-2 text-xs text-stone-400">
                            <Navigation className="w-3 h-3" />
                            <span>Travel by {getTransportLabel(loc.transportation).toLowerCase()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div className="relative h-full">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}