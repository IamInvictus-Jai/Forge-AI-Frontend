import React, { useState, useEffect, useRef } from "react";
import {
  X,
  CheckCircle2,
  Download,
  Film,
  Settings,
  Clock,
  Loader2,
} from "lucide-react";
import Button from "./Button";
import { UI_COPY } from "../constants";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFileName?: string;
}

type RenderStatus =
  | "idle"
  | "starting"
  | "rendering"
  | "exported"
  | "cancelling";

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  defaultFileName = "My_Project_Video",
}) => {
  // Config State
  const [fileName, setFileName] = useState(defaultFileName);
  const [resolution, setResolution] = useState("1080p");
  const [quality, setQuality] = useState("balanced");
  const [captionsBurned, setCaptionsBurned] = useState(true);

  // Process State
  const [status, setStatus] = useState<RenderStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // Seconds

  // Refs for simulation intervals
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen && status === "exported") {
      setStatus("idle");
      setProgress(0);
    }
  }, [isOpen, status]);

  const handleStartRender = () => {
    setStatus("starting");

    // Simulate Backend API Call
    setTimeout(() => {
      setStatus("rendering");
      startPolling();
    }, 1500);
  };

  const startPolling = () => {
    setProgress(0);
    setTimeLeft(30);

    // Simulate Polling Interval
    pollingRef.current = setInterval(() => {
      setProgress((prev) => {
        // If we are cancelling, stop progress
        if (status === "cancelling") return prev;

        const increment = Math.random() * 2 + 0.5; // Random increment
        const next = Math.min(prev + increment, 100);

        if (next >= 100) {
          clearInterval(pollingRef.current!);
          setStatus("exported");
          return 100;
        }
        return next;
      });

      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 200);
  };

  const handleCancel = () => {
    if (status !== "rendering" && status !== "starting") return;

    setStatus("cancelling");

    // Simulate API Cancel Request
    setTimeout(() => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      setStatus("idle"); // Reset to config
      setProgress(0);
    }, 1000);
  };

  const handleDownload = () => {
    // Fake download action
    const link = document.createElement("a");
    link.href = "#";
    link.download = `${fileName}.mp4`;
    document.body.appendChild(link);
    // link.click(); // Commented out to prevent actual navigation/error in demo
    document.body.removeChild(link);
    onClose();
  };

  if (!isOpen) return null;

  const isLocked =
    status === "rendering" || status === "starting" || status === "cancelling";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => !isLocked && onClose()}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#141414]">
          <h2 className="text-xl font-bebas tracking-wide text-white">
            {status === "exported"
              ? UI_COPY.export.successTitle
              : status === "rendering"
                ? UI_COPY.export.renderingTitle
                : UI_COPY.export.title}
          </h2>
          {!isLocked && (
            <button
              onClick={onClose}
              className="p-1 text-neutral-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto">
          {/* STATE: CONFIGURATION (Idle) */}
          {status === "idle" && (
            <div className="space-y-6">
              {/* Filename */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  File Name
                </label>
                <div className="relative">
                  <Film className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-brand-orange focus:outline-none transition-colors text-sm"
                    placeholder="Enter project name..."
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 text-xs">
                    .mp4
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Resolution */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Resolution
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-3 px-3 text-white focus:border-brand-orange focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
                  >
                    <option value="480p">480p (Mobile)</option>
                    <option value="720p">720p (HD)</option>
                    <option value="1080p">1080p (Full HD)</option>
                  </select>
                </div>

                {/* Quality */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Quality
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-3 px-3 text-white focus:border-brand-orange focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
                  >
                    <option value="high">High (Slow)</option>
                    <option value="balanced">Balanced</option>
                    <option value="small">Small Size (Fast)</option>
                  </select>
                </div>
              </div>

              {/* Captions Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    Burn Captions
                  </span>
                  <span className="text-xs text-neutral-500">
                    Embed subtitles directly into video
                  </span>
                </div>
                <button
                  onClick={() => setCaptionsBurned(!captionsBurned)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${captionsBurned ? "bg-brand-orange" : "bg-neutral-700"}`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${captionsBurned ? "translate-x-6" : "translate-x-0"}`}
                  />
                </button>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleStartRender}
                  icon={<Settings className="w-4 h-4" />}
                >
                  {UI_COPY.export.start}
                </Button>
              </div>
            </div>
          )}

          {/* STATE: RENDERING / CANCELLING / STARTING */}
          {(status === "rendering" ||
            status === "starting" ||
            status === "cancelling") && (
            <div className="py-8 flex flex-col items-center justify-center space-y-8">
              {/* Animation */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Spinner Ring */}
                <div
                  className={`absolute inset-0 border-4 border-neutral-800 border-t-brand-orange rounded-full ${status !== "cancelling" ? "animate-spin" : ""}`}
                />

                {/* Inner Percentage */}
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bebas text-white">
                    {status === "starting" ? "0" : Math.floor(progress)}%
                  </span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono uppercase tracking-widest">
                  <span>
                    {status === "starting"
                      ? "Initiating..."
                      : status === "cancelling"
                        ? "Cancelling..."
                        : "Rendering..."}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {status === "starting" ? "--" : `~${timeLeft}s left`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-brand-orange transition-all duration-300 ${status === "cancelling" ? "opacity-50 grayscale" : ""}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Cancel Button */}
              <div className="pt-2">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={status === "cancelling"}
                  className={`text-red-400 hover:text-red-300 hover:bg-red-500/10 ${status === "cancelling" ? "opacity-50" : ""}`}
                >
                  {status === "cancelling" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Cancelling...
                    </>
                  ) : (
                    UI_COPY.export.cancel
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STATE: EXPORT SUCCESS */}
          {status === "exported" && (
            <div className="py-6 flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-medium text-white">
                  Your video is ready!
                </h3>
                <p className="text-sm text-neutral-400 max-w-xs mx-auto">
                  {fileName}.mp4 ({resolution}, {quality}) has been successfully
                  rendered.
                </p>
              </div>

              <div className="grid w-full gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={handleDownload}
                  icon={<Download className="w-4 h-4" />}
                >
                  {UI_COPY.export.download}
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  {UI_COPY.export.close}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
