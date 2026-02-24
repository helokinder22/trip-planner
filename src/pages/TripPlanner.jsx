import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { MapPin, Plane, Map, Sparkles } from "lucide-react";

import AddLocationForm from "@/components/trip/AddLocationForm";
import LocationCard from "@/components/trip/LocationCard";
import MapModal from "@/components/trip/MapModal";
import FullMapView from "@/components/trip/FullMapView";
import EmptyState from "@/components/trip/EmptyState";

export default function TripPlanner() {
  const [formOpen, setFormOpen] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const [mapPreviousLocation, setMapPreviousLocation] = useState(null);
  const [fullMapOpen, setFullMapOpen] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-[#5DBEBD]/5 via-white to-[#4FA9D8]/5">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b-2 border-[#5DBEBD]">
        <div className="max-w-xl mx-auto px-5 py-6 flex items-center justify-center">
          <div className="relative">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699e2cb20cbe0d4ef8ad57e7/b82608c84_Firefly_GeminiFlash_removetheouterrectangle2558992.png" 
              alt="Trip Planner" 
              className="h-32 w-32 object-contain"
              style={{ transform: 'rotate(-5deg)' }}
            />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
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
                  onShowMap={(loc, prevLoc) => {
                    setMapLocation(loc);
                    setMapPreviousLocation(prevLoc);
                  }}
                  previousLocation={idx > 0 ? locations[idx - 1] : null}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Route connector line */}
        {locations.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 text-[#5DBEBD]">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#5DBEBD]" />
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">{locations.length} stops</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#5DBEBD]" />
          </div>
        )}
      </main>

      {/* Map Modal */}
      <MapModal
        location={mapLocation}
        previousLocation={mapPreviousLocation}
        open={!!mapLocation}
        onClose={() => {
          setMapLocation(null);
          setMapPreviousLocation(null);
        }}
      />

      {/* Full Route Map */}
      <FullMapView
        locations={locations}
        open={fullMapOpen}
        onClose={() => setFullMapOpen(false)}
      />
    </div>
  );
}