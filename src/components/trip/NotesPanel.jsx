import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotesPanel({ notes, onSave, isOpen }) {
  const [text, setText] = useState(notes || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setText(notes || "");
  }, [notes]);

  const handleSave = () => {
    onSave(text);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="pt-4 pb-1">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Notes</p>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add notes about this place — tips, reservations, things to see..."
              className="rounded-xl border-stone-200 focus:border-[#E8725A] focus:ring-[#E8725A]/20 min-h-[100px] text-sm resize-none"
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleSave}
                size="sm"
                className={`rounded-lg font-medium text-xs transition-all duration-300 ${
                  saved
                    ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                    : "bg-stone-800 hover:bg-stone-900 text-white"
                }`}
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" /> Saved
                  </>
                ) : (
                  "Save notes"
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}