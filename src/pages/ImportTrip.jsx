import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Check, Loader2, Download } from "lucide-react";
import CategoryIcon from "@/components/trip/CategoryIcon";
import { createPageUrl } from "@/utils";

const CARD_COLORS = [
  { bg: "bg-gradient-to-br from-amber-100 to-orange-200", accent: "border-l-amber-500" },
  { bg: "bg-gradient-to-br from-sky-100 to-blue-200", accent: "border-l-sky-500" },
  { bg: "bg-gradient-to-br from-emerald-100 to-green-200", accent: "border-l-emerald-500" },
  { bg: "bg-gradient-to-br from-violet-100 to-purple-200", accent: "border-l-violet-500" },
  { bg: "bg-gradient-to-br from-rose-100 to-pink-200", accent: "border-l-rose-500" },
  { bg: "bg-gradient-to-br from-teal-100 to-cyan-200", accent: "border-l-teal-500" },
];

export default function ImportTrip() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  const { data: exports = [], isLoading } = useQuery({
    queryKey: ["tripExport", token],
    queryFn: () => base44.entities.TripExport.filter({ export_token: token }),
    enabled: !!token,
  });

  const exportRecord = exports[0];
  const locations = exportRecord ? JSON.parse(exportRecord.locations_data) : [];

  const handleImport = async () => {
    setImporting(true);
    try {
      const user = await base44.auth.me().catch(() => null);
      if (!user) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }
      await base44.entities.TripLocation.bulkCreate(
        locations.map((loc, i) => ({ ...loc, order: i + 1 }))
      );
      setImported(true);
    } finally {
      setImporting(false);
    }
  };

  if (!token) {
    return <div className="flex items-center justify-center min-h-screen text-stone-400">Invalid link.</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#5DBEBD]/5 via-white to-[#4FA9D8]/5 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-xl px-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-stone-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!exportRecord) {
    return <div className="flex items-center justify-center min-h-screen text-stone-400">Export not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5DBEBD]/5 via-white to-[#4FA9D8]/5">
      <header className="border-b-2 border-[#5DBEBD] bg-white flex items-center justify-between px-5 py-4">
        <span className="text-xl font-bold tracking-widest text-[#5DBEBD] uppercase">Trip Planner</span>
        <button
          onClick={() => base44.auth.redirectToLogin(window.location.href)}
          className="text-sm text-[#5DBEBD] font-medium border border-[#5DBEBD] rounded-xl px-4 py-1.5 hover:bg-[#5DBEBD]/10 transition-colors"
        >
          Sign up / Log in
        </button>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-stone-400">{locations.length} destination{locations.length !== 1 ? "s" : ""} shared with you</p>
          {imported ? (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium">
              <Check className="w-4 h-4" />
              Added to your trip!
            </div>
          ) : (
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5DBEBD] text-white text-sm font-medium hover:bg-[#4FA9D8] transition-colors disabled:opacity-70"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Add to my trip
            </button>
          )}
        </div>

        {locations.map((loc, idx) => {
          const colorScheme = CARD_COLORS[idx % CARD_COLORS.length];
          return (
            <div
              key={idx}
              className={`${colorScheme.bg} rounded-2xl border border-white/80 shadow-sm overflow-hidden border-l-4 ${colorScheme.accent}`}
            >
              <div className="p-5 flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <span className="text-[11px] font-bold text-stone-300">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="h-6 w-px bg-stone-200" />
                </div>
                <CategoryIcon category={loc.category} size="sm" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg leading-tight truncate text-stone-800">{loc.name}</h3>
                  {loc.address && <p className="text-sm text-stone-600 mt-1 truncate">{loc.address}</p>}
                  {loc.notes && <p className="text-xs text-stone-500 mt-2 italic">{loc.notes}</p>}
                </div>
              </div>
            </div>
          );
        })}

        {locations.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 text-[#5DBEBD]">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#5DBEBD]" />
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">{locations.length} stops</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#5DBEBD]" />
          </div>
        )}
      </main>
    </div>
  );
}