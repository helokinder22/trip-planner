import { Utensils, Landmark, Hotel, MapPin, Trees, ShoppingBag, Ticket, PlaneLanding, Waves, Star } from "lucide-react";

const CATEGORY_CONFIG = {
  restaurant: { icon: Utensils, label: "Restaurant", color: "text-orange-500 bg-orange-50" },
  museum: { icon: Landmark, label: "Museum", color: "text-purple-500 bg-purple-50" },
  hotel: { icon: Hotel, label: "Hotel", color: "text-blue-500 bg-blue-50" },
  landmark: { icon: MapPin, label: "Landmark", color: "text-red-500 bg-red-50" },
  park: { icon: Trees, label: "Park", color: "text-green-500 bg-green-50" },
  shopping: { icon: ShoppingBag, label: "Shopping", color: "text-pink-500 bg-pink-50" },
  entertainment: { icon: Ticket, label: "Entertainment", color: "text-yellow-500 bg-yellow-50" },
  airport: { icon: PlaneLanding, label: "Airport", color: "text-sky-500 bg-sky-50" },
  beach: { icon: Waves, label: "Beach", color: "text-cyan-500 bg-cyan-50" },
  other: { icon: Star, label: "Other", color: "text-stone-400 bg-stone-50" },
};

export function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
}

export default function CategoryIcon({ category, size = "md" }) {
  const config = getCategoryConfig(category);
  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "h-6 w-6 p-1" : "h-8 w-8 p-1.5";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className={`rounded-lg flex items-center justify-center flex-shrink-0 ${sizeClasses} ${config.color}`}>
      <Icon className={iconSize} />
    </div>
  );
}