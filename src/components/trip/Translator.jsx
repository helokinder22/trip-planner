import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Languages, ArrowRight, Loader2, ChevronDown, ChevronUp, Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const LANGUAGES = [
  { label: "Spanish", code: "es-ES" },
  { label: "English", code: "en-US" },
  { label: "French", code: "fr-FR" },
  { label: "German", code: "de-DE" },
  { label: "Italian", code: "it-IT" },
  { label: "Portuguese", code: "pt-PT" },
  { label: "Japanese", code: "ja-JP" },
  { label: "Chinese", code: "zh-CN" },
  { label: "Korean", code: "ko-KR" },
  { label: "Arabic", code: "ar-SA" },
  { label: "Russian", code: "ru-RU" },
  { label: "Hindi", code: "hi-IN" },
  { label: "Dutch", code: "nl-NL" },
  { label: "Turkish", code: "tr-TR" },
  { label: "Polish", code: "pl-PL" },
  { label: "Swedish", code: "sv-SE" },
  { label: "Thai", code: "th-TH" },
  { label: "Vietnamese", code: "vi-VN" },
];

export default function Translator({ inline }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [targetLang, setTargetLang] = useState(LANGUAGES[0]);
  const [result, setResult] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  const handleTranslate = async (textToTranslate) => {
    const text = textToTranslate || inputText;
    if (!text.trim()) return;
    setIsTranslating(true);
    setResult("");
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Translate the following text to ${targetLang.label}. Return only the translated text, nothing else.\n\n"${text}"`,
      });
      setResult(response);
    } catch (error) {
      setResult("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      handleTranslate(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  const handleSpeak = () => {
    if (!result) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(result);
    utterance.lang = targetLang.code;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
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
          {/* Text input + mic button */}
          <div className="relative">
            <Textarea
              placeholder="Type or tap the mic to speak..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="rounded-xl border-stone-200 focus:border-[#5DBEBD] focus:ring-[#5DBEBD]/20 resize-none h-24 text-base pr-12"
            />
            <button
              onPointerUp={handleMic}
              style={{ touchAction: "manipulation" }}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500 whitespace-nowrap">Translate to:</span>
            <select
              value={targetLang.label}
              onChange={(e) => setTargetLang(LANGUAGES.find(l => l.label === e.target.value))}
              className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 bg-white focus:outline-none focus:border-[#5DBEBD]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.label} value={lang.label}>{lang.label}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => handleTranslate()}
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
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-stone-700 text-sm whitespace-pre-wrap relative">
              {result}
              <button
                onPointerUp={handleSpeak}
                style={{ touchAction: "manipulation" }}
                className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${
                  isSpeaking
                    ? "bg-[#5DBEBD] text-white animate-pulse"
                    : "bg-stone-200 text-stone-500 hover:bg-stone-300"
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}