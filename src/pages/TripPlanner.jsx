import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { MapPin, Plane, Map, Sparkles } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import AddLocationForm from "@/components/trip/AddLocationForm";
import LocationCard from "@/components/trip/LocationCard";
import MapModal from "@/components/trip/MapModal";
import FullMapView from "@/components/trip/FullMapView";
import EmptyState from "@/components/trip/EmptyState";
import Translator from "@/components/trip/Translator";
import ShareButton from "@/components/trip/ShareButton";

export default function TripPlanner() {
  const [formOpen, setFormOpen] = useState(false);
  const [bannerExpanded, setBannerExpanded] = useState(true);
  const [mapLocation, setMapLocation] = useState(null);
  const [mapPreviousLocation, setMapPreviousLocation] = useState(null);
  const [fullMapOpen, setFullMapOpen] = useState(false);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

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

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;

    const reordered = Array.from(locations);
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    // Update order for each affected item
    reordered.forEach((loc, idx) => {
      if (loc.order !== idx + 1) {
        updateMutation.mutate({ id: loc.id, data: { order: idx + 1 } });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5DBEBD]/5 via-white to-[#4FA9D8]/5">
      {/* Header */}
      <header className="border-b-2 border-[#5DBEBD] w-full relative">
        {bannerExpanded ? (
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699e2cb20cbe0d4ef8ad57e7/3c7d2afae_banner223.png"
            alt="Trip Planner"
            className="w-full object-cover block"
          />
        ) : (
          <div className="flex items-center justify-center py-3 bg-white">
            <span className="text-xl font-bold tracking-widest text-[#5DBEBD] uppercase">Trip Planner</span>
          </div>
        )}
        <button
          onPointerUp={() => setBannerExpanded(!bannerExpanded)}
          className="absolute top-2 right-2 bg-white/80 text-stone-500 rounded-full shadow transition-all"
          style={{ padding: '10px', touchAction: 'manipulation' }}
        >
          {bannerExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          )}
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-xl mx-auto px-5 py-6">
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <Translator inline />
          </div>
          <button
            onPointerUp={() => setFullMapOpen(true)}
            style={{ touchAction: "manipulation" }}
            className="flex flex-col items-center justify-center gap-1 px-4 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow text-stone-600"
          >
            <Map className="w-5 h-5 text-[#5DBEBD]" />
            <span className="text-xs font-medium">Map</span>
          </button>
        </div>
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
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="locations">
              {(provided) => (
                <div className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                  {locations.map((loc, idx) => (
                    <Draggable key={loc.id} draggableId={loc.id} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.85 : 1,
                          }}
                        >
                          <LocationCard
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
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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