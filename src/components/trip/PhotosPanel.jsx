import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { base44 } from "@/api/base44Client";
import { Camera, X, Loader2, ImagePlus, Download } from "lucide-react";

const downloadPhoto = async (url, idx) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = `photo-${idx + 1}.jpg`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export default function PhotosPanel({ photos = [], onSave, isOpen }) {
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    onSave([...photos, ...urls]);
    setUploading(false);
    e.target.value = "";
  };

  const removePhoto = (idx) => {
    const updated = photos.filter((_, i) => i !== idx);
    onSave(updated);
  };

  return (
    <div className="mt-3 pt-3 border-t border-white/50 space-y-3">
      {selectedPhoto && createPortal(
        <div
          className="fixed inset-0 bg-black flex items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={selectedPhoto}
            alt=""
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-stone-500">Photos</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-white/70 border border-white/80 text-stone-600 hover:bg-white hover:shadow-sm transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
          {uploading ? "Uploading..." : "Add photo"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {photos.length === 0 ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-white/60 bg-white/30 text-stone-400 hover:bg-white/50 transition-all"
        >
          <Camera className="w-6 h-6" />
          <span className="text-xs">Tap to add photos</span>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((url, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden">
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedPhoto(url)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
              <button
                onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={() => downloadPhoto(url, idx)}
                className="absolute bottom-1 right-1 bg-black/50 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}