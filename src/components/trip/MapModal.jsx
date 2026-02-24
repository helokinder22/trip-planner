import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, ExternalLink, Car, Footprints, Train, Bike } from "lucide-react";

const TRANSPORT_MODES = [
  { value: "driving", label: "Driving", icon: Car },
  { value: "walking", label: "Walking", icon: Footprints },
  { value: "transit", label: "Transit", icon: Train },
  { value: "bicycling", label: "Bicycling", icon: Bike },
];

export default function MapModal({ location, previousLocation, open, onClose }) {
  const [mode, setMode] = useState("driving");

  if (!location) return null;

  const buildMapUrl = () => {
    if (previousLocation) {
      const origin = encodeURIComponent(previousLocation.address || previousLocation.name);
      const destination = encodeURIComponent(location.address || location.name);
      return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${origin}&destination=${destination}&mode=${mode}`;
    } else {
      const query = encodeURIComponent(location.address || location.name);
      return `https://www.google.com/maps?q=${query}&output=embed`;
    }
  };

  const buildExternalUrl = () => {
    if (previousLocation) {
      const origin = encodeURIComponent(previousLocation.address || previousLocation.name);
      const destination = encodeURIComponent(location.address || location.name);
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
    } else {
      const query = encodeURIComponent(location.address || location.name);
      return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 rounded-2xl overflow-hidden border-0">
        <DialogHeader className="p-5 pb-3">
          <DialogTitle className="flex items-center gap-2 text-stone-800">
            <div className="h-7 w-7 rounded-full bg-[#E8725A]/10 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-[#E8725A]" />
            </div>
            {location.name}
          </DialogTitle>
          {location.address && (
            <p className="text-sm text-stone-400 ml-9">{location.address}</p>
          )}
          {previousLocation && (
            <p className="text-xs text-stone-400 ml-9 mt-1">From: {previousLocation.name}</p>
          )}
        </DialogHeader>
        <div className="px-5 pb-5">
          {previousLocation && (
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
                        ? "bg-[#E8725A] text-white shadow-md shadow-[#E8725A]/20"
                        : "bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="rounded-xl overflow-hidden border border-stone-100 shadow-inner">
            <iframe
              key={mode}
              src={buildMapUrl()}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${location.name}`}
            />
          </div>
          <a
            href={buildExternalUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 text-sm text-[#E8725A] hover:text-[#D4594A] font-medium transition-colors"
          >
            Open in Google Maps
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}