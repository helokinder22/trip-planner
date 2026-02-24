import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddLocationForm({ onAdd, isOpen, onToggle }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), address: address.trim() });
    setName("");
    setAddress("");
    onToggle();
  };

  return (
    <div className="mb-8">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button
              onClick={onToggle}
              className="w-full py-6 bg-gradient-to-r from-[#E8725A] to-[#D4594A] hover:from-[#D4594A] hover:to-[#C04A3C] text-white rounded-2xl shadow-lg shadow-[#E8725A]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#E8725A]/30 text-base font-medium tracking-wide"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add a destination
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#E8725A]/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#E8725A]" />
                </div>
                <h3 className="font-semibold text-stone-800">New Destination</h3>
              </div>
              <button type="button" onClick={onToggle} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="Location name (e.g. Eiffel Tower)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-stone-200 focus:border-[#E8725A] focus:ring-[#E8725A]/20 h-12 text-base"
                autoFocus
              />
              <Input
                placeholder="Address (optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl border-stone-200 focus:border-[#E8725A] focus:ring-[#E8725A]/20 h-12 text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="mt-4 w-full bg-[#E8725A] hover:bg-[#D4594A] text-white rounded-xl h-11 font-medium"
            >
              Add to trip
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}