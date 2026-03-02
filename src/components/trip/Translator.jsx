import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Languages, ArrowRight, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Japanese", "Chinese", "Korean", "Arabic", "Russian", "Hindi",
  "Dutch", "Turkish", "Polish", "Swedish", "Thai", "Vietnamese"
];

export default function Translator() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [result, setResult] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setResult("");
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Translate the following text to ${targetLang}. Return only the translated text, nothing else.\n\n"${inputText}"`,
      });
      setResult(response);
    } catch (error) {
      setResult("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="mb-6 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <button
        onPointerUp={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ touchAction: "manipulation" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#5DBEBD] to-[#4FA9D8] flex items-center justify-center">
            <Languages className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-stone-800">Translator</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-3 border-t border-stone-100 pt-4">
          <Textarea
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="rounded-xl border-stone-200 focus:border-[#5DBEBD] focus:ring-[#5DBEBD]/20 resize-none h-24 text-base"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500 whitespace-nowrap">Translate to:</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 bg-white focus:outline-none focus:border-[#5DBEBD]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            className="w-full bg-gradient-to-r from-[#5DBEBD] to-[#4FA9D8] hover:from-[#4FA9D8] hover:to-[#3D8BB8] text-white rounded-xl h-11 font-medium"
          >
            {isTranslating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Translating...</>
            ) : (
              <><ArrowRight className="w-4 h-4 mr-2" /> Translate</>
            )}
          </Button>

          {result && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-stone-700 text-sm whitespace-pre-wrap">
              {result}
            </div>
          )}
        </div>
      )}
    </div>
  );
}