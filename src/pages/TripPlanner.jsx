import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { MapPin, Map, ArrowLeft } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import AddLocationForm from "@/components/trip/AddLocationForm";
import LocationCard from "@/components/trip/LocationCard";
import MapModal from "@/components/trip/MapModal";
import FullMapView from "@/components/trip/FullMapView";
import EmptyState from "@/components/trip/EmptyState";
import Translator from "@/components/trip/Translator";
import ShareButton from "@/components/trip/ShareButton";
import CollaboratorsPanel from "@/components/trip/CollaboratorsPanel";

export default function TripPlanner() {
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get("tripId");

  const [formOpen, setFormOpen] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const [mapPreviousLocation, setMapPreviousLocation] = useState(null);
  const [fullMapOpen, setFullMapOpen] = useState(false);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: trip } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => base44.entities.Trip.filter({ id: tripId }).then((r) => r[0]),
    enabled: !!tripId,
  });

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["tripLocations", tripId],
    queryFn: () =>
      tripId
        ? base44.entities.TripLocation.filter({ trip_id: tripId }, "order")
        : base44.entities.TripLocation.list("order"),
  });

  const createMutation = useMutation({
    mutationFn: (data) =>
      base44.entities.TripLocation.create({
        ...data,
        trip_id: tripId || null,
        order: locations.length + 1,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tripLocations", tripId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TripLocation.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tripLocations", tripId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TripLocation.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tripLocations", tripId] }),
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;

    const reordered = Array.from(locations);
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    reordered.forEach((loc, idx) => {
      if (loc.order !== idx + 1) {
        updateMutation.mutate({ id: loc.id, data: { order: idx + 1 } });
      }
    });
  };

  const isOwner = trip && user && trip.owner_email === user.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5DBEBD]/5 via-white to-[#4FA9D8]/5">
      {/* Header */}
      <header className="border-b-2 border-[#5DBEBD] bg-white flex items-center px-4 py-3 gap-3">
        <Link to={createPageUrl("Trips")} className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4 text-stone-600" />
        </Link>
        <div className="flex-1 min-w-0">
          <span className="text-lg font-bold text-[#5DBEBD] uppercase tracking-widest truncate block">
            {trip ? trip.name : "Trip Planner"}
          </span>
        </div>
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
          {user && <ShareButton userEmail={user.email} />}
        </div>

        {/* Collaborators panel — only trip owner can manage */}
        {trip && isOwner && (
          <div className="mb-6">
            <CollaboratorsPanel trip={trip} />
          </div>
        )}

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

        {locations.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 text-[#5DBEBD]">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#5DBEBD]" />
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-medium">{locations.length} stops</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#5DBEBD]" />
          </div>
        )}
      </main>

      <MapModal
        location={mapLocation}
        previousLocation={mapPreviousLocation}
        open={!!mapLocation}
        onClose={() => {
          setMapLocation(null);
          setMapPreviousLocation(null);
        }}
      />

      <FullMapView
        locations={locations}
        open={fullMapOpen}
        onClose={() => setFullMapOpen(false)}
      />
    </div>
  );
}