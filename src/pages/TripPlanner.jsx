import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { MapPin, Plane } from "lucide-react";

import AddLocationForm from "@/components/trip/AddLocationForm";
import LocationCard from "@/components/trip/LocationCard";
import MapModal from "@/components/trip/MapModal";
import EmptyState from "@/components/trip/EmptyState";

export default function TripPlanner() {
  const [formOpen, setFormOpen] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const queryClient = useQueryClient();

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["tripLocations"],
    queryFn: () => base44.entities.TripLocation.list("order"),
  });

  const createMutation = useMutation({
    mutationFn: (data) =>
      base44.entities.TripLocation.create({
        ...data,
        order: locations.length + 1,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tripLocations"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TripLocation.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tripLocations"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TripLocation.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tripLocations"] }),
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#FAF8F5]/80 backdrop-blur-xl border-b border-stone-100">
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E8725A] to-[#D4594A] flex items-center justify-center shadow-lg shadow-[#E8725A]/20">
              <Plane className="w-4.5 h-4.5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-800 tracking-tight">Trip Planner</h1>
              <p className="text-[11px] text-stone-400 font-medium -mt-0.5">
                {locations.length} {locations.length === 1 ? "destination" : "destinations"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {locations.length > 0 && (
              <div className="flex -space-x-1">
                {locations.slice(0, 4).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full border border-[#FAF8F5] ${
                      ["bg-amber-400", "bg-sky-400", "bg-emerald-400", "bg-violet-400"][i % 4]
                    }`}
                  />
                ))}
                {locations.length > 4 && (
                  <span className="text-[10px] text-stone-400 ml-2">+{locations.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-xl mx-auto px-5 py-6">
        <AddLocationForm
          onAdd={(data) => createMutation.mutate(data)}
          isOpen={formOpen}
          onToggle={() => setFormOpen(!formOpen)}
        />

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : locations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {locations.map((loc, idx) => (
                <LocationCard
                  key={loc.id}
                  location={loc}
                  index={idx}
                  onUpdate={(id, data) => updateMutation.mutate({ id, data })}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onShowMap={(loc) => setMapLocation(loc)}
                  previousLocation={idx > 0 ? locations[idx - 1] : null}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Route connector line */}
        {locations.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 text-stone-300">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">{locations.length} stops</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200" />
          </div>
        )}
      </main>

      {/* Map Modal */}
      <MapModal
        location={mapLocation}
        open={!!mapLocation}
        onClose={() => setMapLocation(null)}
      />
    </div>
  );
}