import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, ExternalLink } from "lucide-react";

export default function MapModal({ location, open, onClose }) {
  if (!location) return null;

  const query = encodeURIComponent(location.address || location.name);
  const embedUrl = `https://www.google.com/maps?q=${query}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden border-0">
        <DialogHeader className="p-5 pb-0">
          <DialogTitle className="flex items-center gap-2 text-stone-800">
            <div className="h-7 w-7 rounded-full bg-[#E8725A]/10 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-[#E8725A]" />
            </div>
            {location.name}
          </DialogTitle>
          {location.address && (
            <p className="text-sm text-stone-400 ml-9">{location.address}</p>
          )}
        </DialogHeader>
        <div className="p-5 pt-4">
          <div className="rounded-xl overflow-hidden border border-stone-100 shadow-inner">
            <iframe
              src={embedUrl}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${location.name}`}
            />
          </div>
          <a
            href={mapsUrl}
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