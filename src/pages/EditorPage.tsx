import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Undo2,
  Download,
  Zap,
  MessageSquare,
  Send,
  Settings2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Sparkles,
  MonitorPlay,
  Minimize,
} from "lucide-react";
import Button from "../components/Button";
import ExportModal from "../components/ExportModal";

// --- Helper Components ---

const ToggleSwitch: React.FC<{
  label: string;
  isOn: boolean;
  onToggle: () => void;
}> = ({ label, isOn, onToggle }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
    <span className="text-sm text-neutral-300 font-medium">{label}</span>
    <button
      onClick={onToggle}
      className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none ${isOn ? "bg-brand-orange" : "bg-neutral-700"}`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isOn ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  </div>
);

const ChatMessage: React.FC<{ role: "ai" | "user"; text: string }> = ({
  role,
  text,
}) => (
  <div
    className={`flex w-full ${role === "user" ? "justify-end" : "justify-start"} mb-4`}
  >
    <div
      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
        role === "user"
          ? "bg-neutral-800 text-white rounded-tr-sm"
          : "bg-brand-orange/10 border border-brand-orange/20 text-orange-100 rounded-tl-sm"
      }`}
    >
      {text}
    </div>
  </div>
);

// --- Main Component ---

const EditorPage: React.FC = () => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [aiStatus, setAiStatus] = useState<string>(
    "AI is ready for instructions",
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFsHint, setShowFsHint] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Modal State
  const [showExportModal, setShowExportModal] = useState(false);

  // Toggles State
  const [toggles, setToggles] = useState({
    captions: true,
    animatedCaptions: false,
    emphasisWords: true,
    fadeIn: true,
    fadeOut: true,
  });

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "ai" | "user"; text: string }>
  >([
    {
      role: "ai",
      text: "I've analyzed your video. Scenes are detected. How should I edit the pacing?",
    },
  ]);

  // Load Video
  useEffect(() => {
    const url = localStorage.getItem("videoUrl");
    if (url) setVideoUrl(url);
  }, []);

  // --- Smooth Playback Logic (rAF) ---
  useEffect(() => {
    let animationFrameId: number;

    const updateLoop = () => {
      if (
        !isDragging &&
        videoRef.current &&
        !videoRef.current.paused &&
        !videoRef.current.ended
      ) {
        setCurrentTime(videoRef.current.currentTime);
      }
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    if (isPlaying) {
      updateLoop();
    }

    return () => cancelAnimationFrame(animationFrameId || 0);
  }, [isPlaying, isDragging]);

  // --- Fullscreen Listener ---
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = document.fullscreenElement !== null;
      setIsFullscreen(isFs);
      if (isFs) {
        setShowFsHint(true);
        setTimeout(() => setShowFsHint(false), 3000);
      }
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // --- Drag & Seek Logic ---

  const updateTimelineFromMouse = (clientX: number) => {
    if (timelineRef.current && videoRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const pos = (clientX - rect.left) / rect.width;
      const newTime = Math.max(0, Math.min(pos * duration, duration));

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTimelineMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateTimelineFromMouse(e.clientX);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        updateTimelineFromMouse(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, duration]);

  // --- Video Event Handlers ---

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const toggleFullScreen = async () => {
    if (!previewContainerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await previewContainerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      document.exitFullscreen();
    }
  };

  const handleFsSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(pos * duration, duration));
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "00:00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user" as const, text: chatInput },
    ]);
    setChatInput("");
    setAiStatus("AI is analyzing your request...");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai" as const,
          text: "Got it. I will apply those changes to the timeline.",
        },
      ]);
      setAiStatus("AI is updating the edit...");

      setTimeout(() => {
        setAiStatus("Changes applied.");
      }, 1500);
    }, 1000);
  };

  const handleUndo = () => {
    setAiStatus("Undoing last action...");
    setTimeout(() => setAiStatus("Undo complete"), 800);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* --- HEADER --- */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0a0a] z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bebas text-2xl tracking-wider text-white">
            FORGE <span className="text-orange-500">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleUndo}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </button>

          <Button
            variant="primary"
            className="px-5 py-2 h-9 text-xs uppercase tracking-wider"
            icon={<Download className="w-3 h-3" />}
            onClick={() => setShowExportModal(true)}
          >
            Export
          </Button>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: PREVIEW & TIMELINE */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative">
          {/* Top Bar: AI Status */}
          <div className="h-10 border-b border-white/5 bg-neutral-900/30 flex items-center px-6 shrink-0">
            <Sparkles className="w-3 h-3 text-brand-orange mr-2 animate-pulse" />
            <span className="text-xs font-mono text-brand-orange uppercase tracking-widest opacity-80">
              {aiStatus}
            </span>
          </div>

          {/* Video Canvas Area */}
          <div
            ref={previewContainerRef}
            className="flex-1 bg-black relative flex items-center justify-center p-0 md:p-8 overflow-hidden group"
          >
            {!isFullscreen && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-neutral-900/80 border border-white/10 rounded-full backdrop-blur-md z-10 pointer-events-none">
                <AlertTriangle className="w-3 h-3 text-yellow-500" />
                <span className="text-[10px] text-neutral-300 font-medium uppercase tracking-wide">
                  Preview Mode • Low Res
                </span>
              </div>
            )}

            {isFullscreen && showFsHint && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 z-50 animate-fade-in">
                <span className="text-sm font-medium text-white shadow-sm">
                  Press ESC to exit full screen
                </span>
              </div>
            )}

            {videoUrl && (
              <video
                ref={videoRef}
                src={videoUrl}
                className={`max-h-full max-w-full shadow-2xl rounded-sm ${isFullscreen ? "h-full w-full object-contain" : ""}`}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                onClick={togglePlay}
              />
            )}

            {isFullscreen && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40">
                <div
                  className="h-2 bg-white/20 rounded-full cursor-pointer mb-4 relative"
                  onClick={handleFsSeek}
                >
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-brand-orange rounded-full"
                    style={{
                      width: `${(currentTime / (duration || 1)) * 100}%`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                    style={{
                      left: `${(currentTime / (duration || 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-brand-orange transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current" />
                      )}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-neutral-300 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-6 h-6" />
                      ) : (
                        <Volume2 className="w-6 h-6" />
                      )}
                    </button>

                    <span className="text-sm font-mono text-neutral-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button
                    onClick={toggleFullScreen}
                    className="text-white hover:text-neutral-300 transition-colors"
                  >
                    <Minimize className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Timeline Panel */}
          <div className="h-48 bg-[#0f0f0f] border-t border-white/5 flex flex-col shrink-0">
            <div className="h-10 flex items-center justify-between px-4 border-b border-white/5">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                </button>
                <span className="text-xs font-mono text-neutral-400">
                  {formatTime(currentTime)}{" "}
                  <span className="text-neutral-600">/</span>{" "}
                  {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="text-neutral-500 hover:text-white transition-colors focus:outline-none"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={toggleFullScreen}
                  className="text-neutral-500 hover:text-white transition-colors focus:outline-none"
                  title="Full Screen Preview"
                >
                  <MonitorPlay className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden relative select-none">
              <div className="h-6 w-full border-b border-white/5 mb-2 flex items-end justify-between text-[10px] text-neutral-600 font-mono">
                <span>00:00</span>
                <span>{formatTime(duration * 0.25)}</span>
                <span>{formatTime(duration * 0.5)}</span>
                <span>{formatTime(duration * 0.75)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div
                ref={timelineRef}
                className={`relative h-24 w-full bg-neutral-900/50 rounded-lg border border-white/5 cursor-pointer group ${isDragging ? "cursor-grabbing" : "cursor-pointer"}`}
                onMouseDown={handleTimelineMouseDown}
              >
                <div className="absolute top-2 left-0 right-0 h-16 bg-neutral-800 rounded mx-2 overflow-hidden flex pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 border-r border-white/5 bg-white/5 opacity-20"
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                    <span className="text-xs font-bold tracking-widest text-neutral-500">
                      VIDEO TRACK (READ ONLY)
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-2 left-0 right-0 h-4 mx-2 opacity-30 pointer-events-none">
                  <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/c/c2/Breakers-sound-waveform.jpg')] bg-cover bg-center mix-blend-screen filter grayscale" />
                </div>

                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-brand-orange z-20 shadow-[0_0_10px_rgba(255,85,0,0.8)] pointer-events-none"
                  style={{
                    transform: `translateX(${(currentTime / (duration || 1)) * (timelineRef.current?.clientWidth || 0)}px)`,
                    willChange: "transform",
                  }}
                >
                  <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-brand-orange rotate-45 rounded-sm" />
                  <div className="absolute top-0 bottom-0 left-[0.5px] w-px bg-orange-300/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TOOLS & CHAT */}
        <div className="w-80 md:w-96 flex flex-col bg-[#0f0f0f] border-l border-white/5 shrink-0">
          <div className="flex border-b border-white/5">
            <button className="flex-1 py-3 text-sm font-medium text-white border-b-2 border-brand-orange bg-white/5">
              AI Tools
            </button>
            <button className="flex-1 py-3 text-sm font-medium text-neutral-500 hover:text-neutral-300">
              Assets
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="w-4 h-4 text-brand-orange" />
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Global Effects
                </h3>
              </div>

              <div className="space-y-2">
                <ToggleSwitch
                  label="Auto Captions"
                  isOn={toggles.captions}
                  onToggle={() =>
                    setToggles((p) => ({ ...p, captions: !p.captions }))
                  }
                />
                <ToggleSwitch
                  label="Dynamic Animations"
                  isOn={toggles.animatedCaptions}
                  onToggle={() =>
                    setToggles((p) => ({
                      ...p,
                      animatedCaptions: !p.animatedCaptions,
                    }))
                  }
                />
                <ToggleSwitch
                  label="Highlight Keywords"
                  isOn={toggles.emphasisWords}
                  onToggle={() =>
                    setToggles((p) => ({
                      ...p,
                      emphasisWords: !p.emphasisWords,
                    }))
                  }
                />
                <ToggleSwitch
                  label="Intro Fade In"
                  isOn={toggles.fadeIn}
                  onToggle={() =>
                    setToggles((p) => ({ ...p, fadeIn: !p.fadeIn }))
                  }
                />
                <ToggleSwitch
                  label="Outro Fade Out"
                  isOn={toggles.fadeOut}
                  onToggle={() =>
                    setToggles((p) => ({ ...p, fadeOut: !p.fadeOut }))
                  }
                />
              </div>
            </div>

            <div className="w-full h-px bg-white/5" />

            <div className="flex flex-col h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-brand-orange" />
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  AI Editor Assistant
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-2 custom-scrollbar">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} text={msg.text} />
                ))}
                <div className="h-2" />
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask AI to trim silence, add b-roll..."
                  className="w-full bg-neutral-900 border border-neutral-800 text-sm text-white p-3 pr-10 rounded-xl focus:outline-none focus:border-brand-orange/50 transition-colors placeholder:text-neutral-600"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 hover:text-brand-orange transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
