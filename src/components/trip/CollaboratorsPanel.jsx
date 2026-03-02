import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, X, Loader2 } from "lucide-react";

export default function CollaboratorsPanel({ trip }) {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (newEmail) => {
      const current = trip.collaborator_emails || [];
      if (current.includes(newEmail)) return;
      await base44.entities.Trip.update(trip.id, {
        collaborator_emails: [...current, newEmail],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", trip.id] });
      setEmail("");
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (emailToRemove) => {
      const updated = (trip.collaborator_emails || []).filter((e) => e !== emailToRemove);
      await base44.entities.Trip.update(trip.id, { collaborator_emails: updated });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", trip.id] });
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    addMutation.mutate(email.trim().toLowerCase());
  };

  const collaborators = trip.collaborator_emails || [];

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-stone-800">Collaborators</span>
          {collaborators.length > 0 && (
            <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">
              {collaborators.length}
            </span>
          )}
        </div>
        <span className="text-xs text-stone-400">{open ? "Hide" : "Manage"}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-stone-100 pt-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter collaborator's email"
              className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
            />
            <button
              type="submit"
              disabled={!email.trim() || addMutation.isPending}
              className="px-3 py-2 rounded-xl bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-60 transition-colors"
            >
              {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </button>
          </form>

          {collaborators.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-2">No collaborators yet</p>
          ) : (
            <div className="space-y-2">
              {collaborators.map((collab) => (
                <div key={collab} className="flex items-center justify-between bg-stone-50 rounded-xl px-3 py-2">
                  <span className="text-sm text-stone-700 truncate">{collab}</span>
                  <button
                    onClick={() => removeMutation.mutate(collab)}
                    className="text-stone-300 hover:text-red-400 transition-colors ml-2 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}