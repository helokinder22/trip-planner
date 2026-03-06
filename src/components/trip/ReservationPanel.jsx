import React, { useState } from "react";
import { ExternalLink, Search } from "lucide-react";

const SEARCH_PROVIDERS = [
  {
    label: "Airbnb",
    icon: "🏠",
    url: (q) => `https://www.airbnb.com/s/${encodeURIComponent(q)}/homes`,
  },
  {
    label: "Booking",
    icon: "🏨",
    url: (q) => `https://www.booking.com/search.html?ss=${encodeURIComponent(q)}`,
  },
  {
    label: "Hotels.com",
    icon: "🛎️",
    url: (q) => `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(q)}`,
  },
];

export default function ReservationPanel({ reservationUrl, onSave, isOpen, locationName }) {
  const [url, setUrl] = useState(reservationUrl || "");
  const [query, setQuery] = useState(locationName || "");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(url.trim());
  };

  return (
    <div className="mt-3 pt-3 border-t border-white/50 space-y-3">
      {/* Search buttons */}
      <div>
        <p className="text-xs font-medium text-stone-500 mb-2">Search for accommodation</p>
        <div className="flex gap-1.5 mb-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Location or name..."
            className="flex-1 text-xs bg-white/70 border border-white/80 rounded-xl px-3 py-2 text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5DBEBD]/40"
          />
        </div>
        <div className="flex gap-1.5">
          {SEARCH_PROVIDERS.map((p) => (
            <a
              key={p.label}
              href={p.url(query || locationName || "")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/70 border border-white/80 text-xs text-stone-600 hover:bg-white hover:shadow-sm transition-all"
            >
              <span>{p.icon}</span> {p.label}
            </a>
          ))}
        </div>
      </div>

      {/* Manual link input */}
      <div>
        <p className="text-xs font-medium text-stone-500 mb-2">Paste reservation link</p>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleSave}
            placeholder="Paste your booking confirmation URL..."
            className="flex-1 text-xs bg-white/70 border border-white/80 rounded-xl px-3 py-2 text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5DBEBD]/40"
          />
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#5DBEBD] text-white text-xs font-medium hover:bg-[#4FA9D8] transition-colors"
            >
              Open <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}