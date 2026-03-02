import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MapPin, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function Trips() {
  const [user, setUser] = React.useState(null);
  const [newTripName, setNewTripName] = useState("");
  const [creating, setCreating] = useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const me = await base44.auth.me();
      const all = await base44.entities.Trip.list("-created_date");
      // Show trips where user is owner or collaborator
      return all.filter(
        (t) =>
          t.owner_email === me.email ||
          (t.collaborator_emails || []).includes(me.email)
      );
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (name) => {
      const me = await base44.auth.me();
      return base44.entities.Trip.create({ name, owner_email: me.email, collaborator_emails: [] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      setNewTripName("");
      setCreating(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Trip.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTripName.trim()) return;
    createMutation.mutate(newTripName.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5DBEBD]/5 via-white to-[#4FA9D8]/5">
      <header className="border-b-2 border-[#5DBEBD] bg-white flex items-center justify-center py-4">
        <span className="text-xl font-bold tracking-widest text-[#5DBEBD] uppercase">Trip Planner</span>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-800">My Trips</h2>
          <button
            onClick={() => setCreating(!creating)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5DBEBD] text-white text-sm font-medium hover:bg-[#4FA9D8] transition-colors"
          >
            <Plus className="w-4 h-4" /> New Trip
          </button>
        </div>

        {creating && (
          <form onSubmit={handleCreate} className="mb-5 flex gap-2">
            <input
              autoFocus
              type="text"
              value={newTripName}
              onChange={(e) => setNewTripName(e.target.value)}
              placeholder="e.g. Paris 2025"
              className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#5DBEBD]"
            />
            <button
              type="submit"
              disabled={!newTripName.trim() || createMutation.isPending}
              className="px-4 py-2.5 rounded-xl bg-[#5DBEBD] text-white text-sm font-medium hover:bg-[#4FA9D8] disabled:opacity-60 transition-colors"
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </button>
          </form>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-stone-100 animate-pulse" />)}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <MapPin className="w-10 h-10 mx-auto mb-3 text-stone-200" />
            <p className="font-medium">No trips yet</p>
            <p className="text-sm mt-1">Create your first trip to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex items-center">
                <Link
                  to={createPageUrl(`TripPlanner?tripId=${trip.id}`)}
                  className="flex-1 flex items-center gap-3 p-4"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#5DBEBD] to-[#4FA9D8] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">{trip.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {trip.owner_email === user?.email ? "Owner" : "Collaborator"}
                      {trip.collaborator_emails?.length > 0 && ` · ${trip.collaborator_emails.length} collaborator${trip.collaborator_emails.length > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300 ml-auto" />
                </Link>
                {trip.owner_email === user?.email && (
                  <button
                    onClick={() => deleteMutation.mutate(trip.id)}
                    className="p-4 text-stone-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}