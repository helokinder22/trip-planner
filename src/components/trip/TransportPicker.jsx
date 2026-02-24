import React from "react";
import { Car, Train, Bus, Plane, Footprints, Bike, Ship, CircleDot, MapPin, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const TRANSPORT_OPTIONS = [
  { value: "car", label: "Car", icon: Car },
  { value: "train", label: "Train", icon: Train },
  { value: "bus", label: "Bus", icon: Bus },
  { value: "plane", label: "Plane", icon: Plane },
  { value: "walk", label: "Walk", icon: Footprints },
  { value: "bike", label: "Bike", icon: Bike },
  { value: "ferry", label: "Ferry", icon: Ship },
  { value: "taxi", label: "Taxi", icon: CircleDot },
];

export default function TransportPicker({ selected, onSelect, isOpen, currentLocation, previousLocation }) {
  const handleDirections = () => {
    if (!currentLocation) return;
    
    const origin = previousLocation ? encodeURIComponent(previousLocation.address || previousLocation.name) : '';
    const destination = encodeURIComponent(currentLocation.address || currentLocation.name);
    
    let url;
    if (origin) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="pt-4 pb-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Getting there by</p>
              <button
                onClick={handleDirections}
                className="flex items-center gap-1 text-xs font-medium text-[#E8725A] hover:text-[#D4594A] transition-colors"
              >
                <MapPin className="w-3 h-3" />
                Directions
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {TRANSPORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => onSelect(value)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 ${
                    selected === value
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function getTransportIcon(value) {
  const option = TRANSPORT_OPTIONS.find(o => o.value === value);
  return option ? option.icon : null;
}

export function getTransportLabel(value) {
  const option = TRANSPORT_OPTIONS.find(o => o.value === value);
  return option ? option.label : "";
}