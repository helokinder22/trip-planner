import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import CategoryIcon from "@/components/trip/CategoryIcon";

const CARD_COLORS = [
  { bg: "bg-gradient-to-br from-amber-100 to-orange-200", accent: "border-l-amber-500" },
  { bg: "bg-gradient-to-br from-sky-100 to-blue-200", accent: "border-l-sky-500" },
  { bg: "bg-gradient-to-br from-emerald-100 to-green-200", accent: "border-l-emerald-500" },
  { bg: "bg-gradient-to-br from-violet-100 to-purple-200", accent: "border-l-violet-500" },
  { bg: "bg-gradient-to-br from-rose-100 to-pink-200", accent: "border-l-rose-500" },
  { bg: "bg-gradient-to-br from-teal-100 to-cyan-200", accent: "border-l-teal-500" },
];

export default function SharedTrip() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const { data: shares = [], isLoading: sharesLoading } = useQuery({
    queryKey: ["tripShare", token],
    queryFn: () => base44.entities.TripShare.filter({ share_token: token }),
    enabled: !!token,
  });

  const ownerEmail = shares[0]?.owner_email;

  const { data: locations = [], isLoading: locsLoading } = useQuery({
    queryKey: ["sharedLocations", ownerEmail],
    queryFn: () => base44.entities.TripLocation.filter({ created_by: ownerEmail }, "order"),
    enabled: !!ownerEmail,
  });

  if (!token) {
    return <div className="flex items-center justify-center min-h-screen text-stone-400">Invalid link.</div>;
  }

  if (sharesLoading || locsLoading) {
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

  if (!shares.length) {
    return <div className="flex items-center justify-center min-h-screen text-stone-400">Trip not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5DBEBD]/5 via-white to-[#4FA9D8]/5">
      <header className="border-b-2 border-[#5DBEBD] bg-white flex items-center justify-center py-4">
        <span className="text-xl font-bold tracking-widest text-[#5DBEBD] uppercase">Trip Planner</span>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6 space-y-4">
        <p className="text-sm text-stone-400 text-center mb-4">Shared trip · {locations.length} stops</p>

        {locations.map((loc, idx) => {
          const colorScheme = CARD_COLORS[idx % CARD_COLORS.length];
          return (
            <div
              key={loc.id}
              className={`${colorScheme.bg} rounded-2xl border border-white/80 shadow-sm overflow-hidden border-l-4 ${colorScheme.accent} ${loc.visited ? "opacity-60" : ""}`}
            >
              <div className="p-5 flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <span className="text-[11px] font-bold text-stone-300">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="h-6 w-px bg-stone-200" />
                </div>
                <CategoryIcon category={loc.category} size="sm" />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-lg leading-tight truncate ${loc.visited ? "line-through text-stone-400" : "text-stone-800"}`}>
                    {loc.name}
                  </h3>
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