import React, { useState, useEffect } from "react";
import { Sparkles, Scissors, Film, CheckCircle2 } from "lucide-react";
import UploadZone from "../components/UploadZone";
import VideoPreview from "../components/VideoPreview";
import Button from "../components/Button";
import { UI_COPY, THEME_CLASSES } from "../constants";

// Types
type AppStatus = "idle" | "uploading" | "processing" | "ready" | "error";

interface UploadPageProps {
  onContinueToEditor: (file: File) => void;
  onChangeVideo: () => void;
  initialStatus?: AppStatus;
  savedVideoUrl: string | null;
}

const UploadPage: React.FC<UploadPageProps> = ({
  onContinueToEditor,
  onChangeVideo,
  initialStatus = "idle",
  savedVideoUrl,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(initialStatus);

  // Use savedVideoUrl from localStorage if available
  const previewUrl = savedVideoUrl || localPreviewUrl;

  // Handle file selection
  const handleFileSelect = (selectedFile: File) => {
    setStatus("uploading");

    // Simulate upload delay for local preview
    setTimeout(() => {
      setStatus("processing");

      setTimeout(() => {
        const url = URL.createObjectURL(selectedFile);
        setLocalPreviewUrl(url);
        setFile(selectedFile);
        setStatus("ready");
      }, 800);
    }, 1200);
  };

  // Reset state when user clicks "Change Video"
  const handleReset = () => {
    if (localPreviewUrl && localPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setFile(null);
    setLocalPreviewUrl(null);
    onChangeVideo();
  };

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (localPreviewUrl && localPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center py-20 md:py-24 animate-fade-in">
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
          {status === "ready" && previewUrl ? (
            // --- Preview State (Uses localStorage URL or Local Blob) ---
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <VideoPreview
                videoUrl={previewUrl}
                fileName={file?.name || "Project Video"}
              />

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
                <div className="flex flex-col gap-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start text-neutral-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-display">
                      Ready for Upload
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
                    onClick={() => file && onContinueToEditor(file)}
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
  );
};

export default UploadPage;
