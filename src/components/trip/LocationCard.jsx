import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, StickyNote, Trash2, Map, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotesPanel from "./NotesPanel";

const CARD_COLORS = [
  { bg: "bg-gradient-to-br from-amber-100 to-orange-200", accent: "border-l-amber-500" },
  { bg: "bg-gradient-to-br from-sky-100 to-blue-200", accent: "border-l-sky-500" },
  { bg: "bg-gradient-to-br from-emerald-100 to-green-200", accent: "border-l-emerald-500" },
  { bg: "bg-gradient-to-br from-violet-100 to-purple-200", accent: "border-l-violet-500" },
  { bg: "bg-gradient-to-br from-rose-100 to-pink-200", accent: "border-l-rose-500" },
  { bg: "bg-gradient-to-br from-teal-100 to-cyan-200", accent: "border-l-teal-500" },
];

export default function LocationCard({ location, index, onUpdate, onDelete, onShowMap, previousLocation }) {
  const [activePanel, setActivePanel] = useState(null);
  const colorScheme = CARD_COLORS[index % CARD_COLORS.length];

  const togglePanel = (panel) => {
    setActivePanel(prev => prev === panel ? null : panel);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`${colorScheme.bg} rounded-2xl border border-white/80 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-l-4 ${colorScheme.accent}`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <span className="text-[11px] font-bold text-stone-300">{String(index + 1).padStart(2, '0')}</span>
              <div className="h-6 w-px bg-stone-200" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-stone-800 text-lg leading-tight truncate">
                {location.name}
              </h3>
              {location.address && (
                <p className="text-sm text-stone-600 mt-1 truncate">{location.address}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(location.id)}
            className="text-stone-300 hover:text-red-400 hover:bg-red-50 rounded-xl h-8 w-8 -mt-1 -mr-1"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <ActionButton
            icon={Map}
            label="Map"
            active={false}
            onClick={() => onShowMap(location, previousLocation)}
          />
          <ActionButton
            icon={Car}
            label="Uber"
            active={false}
            onClick={() => {
              let uberUrl = 'https://m.uber.com/ul/?action=setPickup';
              
              if (location.latitude && location.longitude) {
                uberUrl += `&dropoff[latitude]=${location.latitude}&dropoff[longitude]=${location.longitude}`;
              }
              
              const formattedAddress = encodeURIComponent(location.address || location.name);
              uberUrl += `&dropoff[formatted_address]=${formattedAddress}`;
              
              window.open(uberUrl, '_blank');
            }}
          />
          <ActionButton
            icon={StickyNote}
            label="Notes"
            active={activePanel === "notes"}
            hasContent={!!location.notes}
            onClick={() => togglePanel("notes")}
          />
        </div>

        {/* Expandable panels */}
        <NotesPanel
          notes={location.notes}
          onSave={(notes) => onUpdate(location.id, { notes })}
          isOpen={activePanel === "notes"}
        />
      </div>
    </motion.div>
  );
}

function ActionButton({ icon: Icon, label, active, hasContent, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-stone-800 text-white shadow-md"
          : "bg-white/60 text-stone-500 hover:bg-white hover:text-stone-700 hover:shadow-sm border border-white/80"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      {hasContent && !active && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#E8725A]" />
      )}
    </button>
  );
}