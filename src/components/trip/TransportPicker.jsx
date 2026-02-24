import React from "react";
import { Car, Train, Bus, Plane, Footprints, Bike, Ship, CircleDot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function TransportPicker({ selected, onSelect, isOpen }) {
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
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Getting there by</p>
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