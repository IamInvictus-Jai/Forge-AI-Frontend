import React, { useState, useEffect } from "react";
import { Sparkles, Scissors, Film, CheckCircle2, Zap } from "lucide-react";
import UploadZone from "../components/UploadZone";
import VideoPreview from "../components/VideoPreview";
import Button from "../components/Button";
import { UI_COPY, THEME_CLASSES } from "../constants";

// Types
type AppStatus = "idle" | "uploading" | "processing" | "ready" | "error";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>("idle");

  // Handle file selection
  const handleFileSelect = (selectedFile: File) => {
    setStatus("uploading");

    // Simulate upload delay for UX
    setTimeout(() => {
      setStatus("processing");

      // Simulate processing delay
      setTimeout(() => {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        setFile(selectedFile);
        setStatus("ready");
      }, 800);
    }, 1200);
  };

  // Reset state
  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setStatus("idle");
  };

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-brand-black flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* --- Cinematic Background --- */}
      {/* Top right orange glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[80vh] h-[80vh] bg-orange-600/25 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      {/* Bottom left subtle glow */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vh] h-[60vh] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay" />
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* --- Branding / Header --- */}
      <nav className="absolute top-0 left-0 w-full p-6 md:p-8 z-50 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto group cursor-default">
          {/* Logo Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,85,0,0.4)] group-hover:shadow-[0_0_30px_rgba(255,85,0,0.6)] transition-shadow duration-500">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-2xl md:text-3xl text-white tracking-wider leading-none mt-1">
              FORGE <span className="text-orange-500">AI</span>
            </span>
          </div>
        </div>
      </nav>

      {/* --- Main Content Container --- */}
      <main className="flex-1 w-full relative z-10 overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className="min-h-full w-full flex flex-col items-center justify-center py-20 md:py-24">
          <div className="w-full max-w-4xl px-6 flex flex-col items-center">
            {/* Header Text */}
            <div className="text-center mb-10 md:mb-12 space-y-6 flex-shrink-0 max-w-3xl">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2 animate-slide-up backdrop-blur-md"
                style={{ animationDelay: "0.1s" }}
              >
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span className="text-[10px] md:text-xs font-semibold tracking-wider text-neutral-300 uppercase font-display">
                  Premium Video Editor
                </span>
              </div>

              {/* Headline */}
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-bebas tracking-wide text-white leading-[0.9] animate-slide-up drop-shadow-2xl uppercase"
                style={{ animationDelay: "0.2s" }}
              >
                Edit videos Intelligently, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-orange-200">
                  right in your browser
                </span>
              </h1>

              {/* Subheadline */}
              <p
                className="text-sm md:text-lg font-exo font-semibold text-neutral-400 max-w-xl mx-auto animate-slide-up leading-relaxed"
                style={{ animationDelay: "0.3s" }}
              >
                {UI_COPY.landing.subtitle}
              </p>
            </div>

            {/* Dynamic Card Area */}
            <div
              className={`w-full max-w-2xl ${THEME_CLASSES.cardBg} rounded-2xl md:rounded-3xl p-1.5 shadow-2xl shadow-black/80 transition-all duration-500 animate-slide-up flex-shrink-0`}
              style={{ animationDelay: "0.4s" }}
            >
              {status === "ready" && file && previewUrl ? (
                // --- Preview State ---
                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                  <VideoPreview videoUrl={previewUrl} fileName={file.name} />

                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
                    <div className="flex flex-col gap-1 text-center md:text-left">
                      <div className="flex items-center gap-2 justify-center md:justify-start text-neutral-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-display">
                          Import Successful
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 hidden md:block">
                        {UI_COPY.preview.utilityText}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <Button
                        variant="ghost"
                        onClick={handleReset}
                        className="flex-1 md:flex-none text-xs md:text-sm"
                      >
                        Change Video
                      </Button>
                      <Button
                        variant="primary"
                        icon={<Scissors className="w-4 h-4" />}
                        className="w-full md:w-auto flex-1 md:flex-none"
                      >
                        {UI_COPY.preview.buttonContinue}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // --- Upload State ---
                <div className="p-1 bg-neutral-900/40 rounded-xl md:rounded-2xl">
                  <UploadZone onFileSelect={handleFileSelect} status={status} />
                </div>
              )}
            </div>

            {/* Footer */}
            <footer
              className="mt-10 md:mt-16 text-center animate-fade-in flex-shrink-0"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-neutral-600 font-medium mb-3">
                <span className="flex items-center gap-1.5 hover:text-neutral-400 transition-colors cursor-default">
                  <Film size={12} /> MP4
                </span>
                <span className="w-0.5 h-0.5 rounded-full bg-neutral-800"></span>
                <span className="hover:text-neutral-400 transition-colors cursor-default">
                  MOV
                </span>
                <span className="w-0.5 h-0.5 rounded-full bg-neutral-800"></span>
                <span className="hover:text-neutral-400 transition-colors cursor-default">
                  WebM
                </span>
                <span className="w-0.5 h-0.5 rounded-full bg-neutral-800 hidden md:block"></span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] tracking-wide text-neutral-500">
                  4K READY
                </span>
              </div>
              <p className="text-[10px] text-neutral-700 uppercase tracking-[0.2em] font-medium">
                {UI_COPY.landing.footer}
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
