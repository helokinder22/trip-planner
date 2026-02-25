import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, ExternalLink, Car, Footprints, Train, Bike, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRANSPORT_MODES = [
  { value: "driving", label: "Driving", icon: Car },
  { value: "walking", label: "Walking", icon: Footprints },
  { value: "transit", label: "Transit", icon: Train },
  { value: "bicycling", label: "Bicycling", icon: Bike },
];

export default function MapModal({ location, previousLocation, open, onClose }) {
  const [mode, setMode] = useState("driving");
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    if (open && navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.log("Could not get location:", error);
          setLoadingLocation(false);
        }
      );
    }
  }, [open]);

  if (!location) return null;

  const buildMapUrl = () => {
    const destination = encodeURIComponent(location.address || location.name);
    const origin = userLocation 
      ? `${userLocation.lat},${userLocation.lng}`
      : 'current+location';
    return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${origin}&destination=${destination}&mode=${mode}`;
  };

  const buildExternalUrl = () => {
    const destination = encodeURIComponent(location.address || location.name);
    // Use Apple Maps URL scheme which opens native Maps app on iOS
    const modeMap = {
      driving: 'd',
      walking: 'w',
      transit: 'r',
      bicycling: 'w'
    };
    return `http://maps.apple.com/?daddr=${destination}&dirflg=${modeMap[mode]}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 rounded-2xl overflow-hidden border-0">
        <DialogHeader className="p-5 pb-3">
          <div className="flex items-start justify-between">
            <DialogTitle className="flex items-center gap-2 text-stone-800">
              <div className="h-7 w-7 rounded-full bg-[#5DBEBD]/10 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#5DBEBD]" />
              </div>
              {location.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {location.address && (
            <p className="text-sm text-stone-400 ml-9">{location.address}</p>
          )}
          <p className="text-xs text-stone-400 ml-9 mt-1">From: Your current location</p>
        </DialogHeader>
        <div className="px-5 pb-5">
          <div className="mb-4">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">
              Transportation Mode
            </p>
            <div className="grid grid-cols-4 gap-2">
              {TRANSPORT_MODES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setMode(value)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 ${
                    mode === value
                      ? "bg-[#5DBEBD] text-white shadow-md shadow-[#5DBEBD]/20"
                      : "bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden border border-stone-100 shadow-inner">
            {loadingLocation ? (
              <div className="w-full h-[400px] bg-stone-50 flex items-center justify-center">
                <div className="text-sm text-stone-400">Getting your location...</div>
              </div>
            ) : (
              <iframe
                key={`${mode}-${userLocation?.lat}-${userLocation?.lng}`}
                src={buildMapUrl()}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${location.name}`}
              />
            )}
          </div>
          <a
            href={buildExternalUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 text-sm text-[#5DBEBD] hover:text-[#4FA9D8] font-medium transition-colors"
          >
            Open in Maps
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}