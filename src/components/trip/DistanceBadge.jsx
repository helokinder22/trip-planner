import React from "react";
import { ArrowDown } from "lucide-react";

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function DistanceBadge({ from, to }) {
  if (
    !from?.latitude || !from?.longitude ||
    !to?.latitude || !to?.longitude
  ) return null;

  const km = haversineKm(from.latitude, from.longitude, to.latitude, to.longitude);
  const label = km >= 1 ? `${Math.round(km)} km` : `${Math.round(km * 1000)} m`;

  return (
    <div className="flex flex-col items-center gap-0.5 my-1 select-none">
      <ArrowDown className="w-3.5 h-3.5 text-stone-300" />
      <span className="text-[11px] font-medium text-stone-400 bg-white/70 px-2 py-0.5 rounded-full border border-stone-100">
        {label}
      </span>
      <ArrowDown className="w-3.5 h-3.5 text-stone-300" />
    </div>
  );
}