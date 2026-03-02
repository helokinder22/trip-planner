import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Download, Copy, Check, Loader2, X } from "lucide-react";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryIcon from "./CategoryIcon";

export default function ExportButton({ locations }) {
  const [step, setStep] = useState("idle"); // idle | select | link
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportUrl, setExportUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleOpen = () => {
    setSelected(locations.map((l) => l.id));
    setStep("select");
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const chosen = locations.filter((l) => selected.includes(l.id));
      const locData = chosen.map(({ name, address, latitude, longitude, order, transportation, notes, color, category }) => ({
        name, address, latitude, longitude, order, transportation, notes, color, category
      }));
      const token = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
      await base44.entities.TripExport.create({
        export_token: token,
        locations_data: JSON.stringify(locData),
      });
      const url = `${window.location.origin}${createPageUrl("ImportTrip")}?token=${token}`;
      setExportUrl(url);
      setStep("link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep("idle");
    setSelected([]);
    setExportUrl(null);
    setCopied(false);
  };

  return (
    <>
      <button
        onPointerUp={handleOpen}
        style={{ touchAction: "manipulation" }}
        className="flex flex-col items-center justify-center gap-1 px-4 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow text-stone-600"
      >
        <Download className="w-5 h-5 text-[#5DBEBD]" />
        <span className="text-xs font-medium">Export</span>
      </button>

      <Dialog open={step !== "idle"} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {step === "select" ? "Select destinations to export" : "Export link ready"}
            </DialogTitle>
          </DialogHeader>

          {step === "select" && (
            <>
              <p className="text-sm text-stone-500 mb-3">Choose which stops to include in the export link.</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => toggleSelect(loc.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors text-left ${
                      selected.includes(loc.id)
                        ? "border-[#5DBEBD] bg-[#5DBEBD]/10"
                        : "border-stone-200 bg-stone-50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                      selected.includes(loc.id) ? "border-[#5DBEBD] bg-[#5DBEBD]" : "border-stone-300"
                    }`}>
                      {selected.includes(loc.id) && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <CategoryIcon category={loc.category} size="sm" />
                    <span className="text-sm font-medium text-stone-700 truncate">{loc.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleGenerate}
                disabled={selected.length === 0 || loading}
                className="mt-3 w-full py-2.5 rounded-xl bg-[#5DBEBD] text-white font-medium text-sm hover:bg-[#4FA9D8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Generate link ({selected.length} stop{selected.length !== 1 ? "s" : ""})
              </button>
            </>
          )}

          {step === "link" && (
            <>
              <p className="text-sm text-stone-500 mb-3">Share this link — anyone can import these destinations into their own trip.</p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={exportUrl || ""}
                  className="flex-1 text-xs border border-stone-200 rounded-xl px-3 py-2 bg-stone-50 text-stone-700 outline-none truncate"
                />
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-[#5DBEBD] text-white hover:bg-[#4FA9D8] transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}