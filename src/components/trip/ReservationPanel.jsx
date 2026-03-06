import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

export default function ReservationPanel({ reservationUrl, onSave, isOpen }) {
  const [url, setUrl] = useState(reservationUrl || "");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(url.trim());
  };

  return (
    <div className="mt-3 pt-3 border-t border-white/50">
      <p className="text-xs font-medium text-stone-500 mb-2">Reservation Link</p>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={handleSave}
          placeholder="Paste Airbnb, hotel, or booking link..."
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
  );
}