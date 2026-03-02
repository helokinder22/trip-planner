import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Share2, Copy, Check, Loader2 } from "lucide-react";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ShareButton({ userEmail }) {
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      // Check if a share already exists for this user
      const existing = await base44.entities.TripShare.filter({ owner_email: userEmail });
      let token;
      if (existing.length > 0) {
        token = existing[0].share_token;
      } else {
        token = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
        await base44.entities.TripShare.create({ share_token: token, owner_email: userEmail });
      }
      const url = `${window.location.origin}${createPageUrl("SharedTrip")}?token=${token}`;
      setShareUrl(url);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onPointerUp={handleShare}
        style={{ touchAction: "manipulation" }}
        disabled={loading}
        className="flex flex-col items-center justify-center gap-1 px-4 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow text-stone-600"
      >
        {loading ? <Loader2 className="w-5 h-5 text-[#5DBEBD] animate-spin" /> : <Share2 className="w-5 h-5 text-[#5DBEBD]" />}
        <span className="text-xs font-medium">Share</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Share your trip</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-500 mb-3">Anyone with this link can view your destinations.</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl || ""}
              className="flex-1 text-xs border border-stone-200 rounded-xl px-3 py-2 bg-stone-50 text-stone-700 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-[#5DBEBD] text-white hover:bg-[#4FA9D8] transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}