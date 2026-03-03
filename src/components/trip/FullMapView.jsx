import React from "react";
import { MapPin, X, ExternalLink } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons for Leaflet in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createNumberedIcon = (number) =>
  L.divIcon({
    className: "",
    html: `<div style="
      background:#5DBEBD;
      color:white;
      width:28px;height:28px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "><span style="transform:rotate(45deg);font-size:11px;font-weight:bold;">${number}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });

export default function FullMapView({ locations, open, onClose }) {
  if (!open) return null;

  const validLocations = (locations || []).filter(
    (loc) => loc.latitude && loc.longitude
  );

  if (validLocations.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-white shrink-0">
          <p className="font-semibold text-stone-800 text-sm">Full Trip Route</p>
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">
          No locations with coordinates to display on the map.
        </div>
      </div>
    );
  }

  const center = [
    validLocations.reduce((s, l) => s + l.latitude, 0) / validLocations.length,
    validLocations.reduce((s, l) => s + l.longitude, 0) / validLocations.length,
  ];

  const polylinePoints = validLocations.map((l) => [l.latitude, l.longitude]);

  const buildGoogleMapsUrl = () => {
    const stops = validLocations.map((l) => encodeURIComponent(l.address || l.name)).join("/");
    return `https://www.google.com/maps/dir/${stops}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-[#5DBEBD]/10 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-[#5DBEBD]" />
          </div>
          <div>
            <p className="font-semibold text-stone-800 text-sm">Full Trip Route</p>
            <p className="text-xs text-stone-400">{validLocations.length} stops</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
        >
          <X className="w-5 h-5 text-stone-600" />
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 overflow-hidden">
        <MapContainer
          center={center}
          zoom={validLocations.length === 1 ? 14 : 10}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {validLocations.length > 1 && (
            <Polyline positions={polylinePoints} color="#5DBEBD" weight={3} dashArray="6 4" />
          )}
          {validLocations.map((loc, idx) => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={createNumberedIcon(idx + 1)}>
              <Popup>
                <strong>{loc.name}</strong>
                {loc.address && <><br /><span style={{ fontSize: "12px", color: "#666" }}>{loc.address}</span></>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-stone-100 bg-white shrink-0">
        <a
          href={buildGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-[#5DBEBD] font-medium"
        >
          Open full route in Google Maps <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}