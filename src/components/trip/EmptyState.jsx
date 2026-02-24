import React from "react";
import { Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#E8725A]/10 to-amber-100/50 flex items-center justify-center">
          <Compass className="w-9 h-9 text-[#E8725A]/70" strokeWidth={1.5} />
        </div>
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-200/60 animate-pulse" />
        <div className="absolute -bottom-2 -left-2 h-3 w-3 rounded-full bg-[#E8725A]/20 animate-pulse delay-500" />
      </div>
      <h3 className="text-xl font-semibold text-stone-700 mb-2">Start planning your trip</h3>
      <p className="text-stone-400 text-sm max-w-xs leading-relaxed">
        Add your first destination above to begin mapping out your journey.
      </p>
    </motion.div>
  );
}