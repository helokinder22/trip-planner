import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, X, Sparkles, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

export default function AddLocationForm({ onAdd, isOpen, onToggle }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundLocation, setFoundLocation] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Find this location and return structured data: "${query}". Include the full name, complete address, latitude, and longitude.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            address: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
            category: { type: "string", enum: ["restaurant", "museum", "hotel", "landmark", "park", "shopping", "entertainment", "airport", "beach", "other"] }
          }
        }
      });
      
      setFoundLocation(result);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = () => {
    if (!foundLocation) return;
    onAdd(foundLocation);
    setQuery("");
    setFoundLocation(null);
    onToggle();
  };

  const handleReset = () => {
    setFoundLocation(null);
    setQuery("");
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
              className="w-full py-6 bg-gradient-to-r from-[#5DBEBD] to-[#4FA9D8] hover:from-[#4FA9D8] hover:to-[#3D8BB8] text-white rounded-2xl shadow-lg shadow-[#5DBEBD]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#5DBEBD]/30 text-base font-medium tracking-wide"
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
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#5DBEBD] to-[#4FA9D8] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-stone-800">AI Search Destination</h3>
              </div>
              <button type="button" onClick={onToggle} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!foundLocation ? (
              <>
                <div className="space-y-3">
                  <Input
                    placeholder="Search any place... (e.g. Eiffel Tower, Tokyo Tower)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="rounded-xl border-stone-200 focus:border-[#5DBEBD] focus:ring-[#5DBEBD]/20 h-12 text-base"
                    autoFocus
                    disabled={isSearching}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!query.trim() || isSearching}
                  className="mt-4 w-full bg-gradient-to-r from-[#5DBEBD] to-[#4FA9D8] hover:from-[#4FA9D8] hover:to-[#3D8BB8] text-white rounded-xl h-11 font-medium"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Search location
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 space-y-2">
                    <Input
                      value={foundLocation.name}
                      onChange={(e) => setFoundLocation({ ...foundLocation, name: e.target.value })}
                      className="font-semibold text-stone-800 rounded-lg border-stone-200 focus:border-[#5DBEBD] focus:ring-[#5DBEBD]/20 h-10"
                    />
                    <p className="text-sm text-stone-500">{foundLocation.address}</p>
                  </div>

                  {foundLocation.latitude && foundLocation.longitude && (
                    <div className="rounded-xl overflow-hidden border border-stone-100 shadow-inner">
                      <iframe
                        src={`https://www.google.com/maps?q=${foundLocation.latitude},${foundLocation.longitude}&output=embed`}
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map of ${foundLocation.name}`}
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1 rounded-xl h-11"
                    >
                      Search again
                    </Button>
                    <Button
                      type="button"
                      onClick={handleConfirm}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-medium"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirm & Add
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}