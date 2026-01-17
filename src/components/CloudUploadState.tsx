import React, { useEffect, useState } from "react";
import {
  Cloud,
  CheckCircle2,
  Server,
  ShieldCheck,
  Zap,
  X,
  Upload,
} from "lucide-react";
import Button from "./Button";

interface CloudUploadStateProps {
  fileName: string;
  onUploadComplete: (videoUrl: string) => void;
  onUploadFail: () => void;
}

const CloudUploadState: React.FC<CloudUploadStateProps> = ({
  fileName,
  onUploadComplete,
  onUploadFail,
}) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    {
      text: "Handshaking with server...",
      icon: <ShieldCheck className="w-5 h-5 text-orange-500" />,
    },
    {
      text: "Optimizing upload stream...",
      icon: <Zap className="w-5 h-5 text-orange-400" />,
    },
    {
      text: "Transferring video data...",
      icon: <Upload className="w-5 h-5 text-orange-300" />,
    },
    {
      text: "Finalizing storage...",
      icon: <Server className="w-5 h-5 text-orange-200" />,
    },
    {
      text: "Upload Complete",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    },
  ];

  useEffect(() => {
    // Hidden feature: Simulate error if filename contains 'fail'
    const shouldSimulateError = fileName.toLowerCase().includes("fail");

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Mock error condition
        if (shouldSimulateError && prev > 60 && prev < 65) {
          clearInterval(interval);
          setTimeout(() => onUploadFail(), 500);
          return prev;
        }

        if (prev >= 100) {
          clearInterval(interval);
          // MOCK BACKEND RESPONSE: Return a dummy URL
          // TODO: In production, replace this with actual backend cloud storage URL
          // For now, this mock URL will be replaced with blob URL in App.tsx
          const mockBackendUrl = `https://mock-storage.forge-ai.com/uploads/${Date.now()}_${fileName}`;
          setTimeout(() => onUploadComplete(mockBackendUrl), 800);
          return 100;
        }

        const increment = Math.random() * 4 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onUploadComplete, onUploadFail, fileName]);

  // Update stage text based on progress
  useEffect(() => {
    if (progress < 15) setStage(0);
    else if (progress < 40) setStage(1);
    else if (progress < 80) setStage(2);
    else if (progress < 99) setStage(3);
    else setStage(4);
  }, [progress]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Central Visual */}
      <div className="relative mb-12">
        {/* Pulsing Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />

        {/* Center Percentage */}
        <div className="relative w-32 h-32 flex items-center justify-center bg-neutral-900 rounded-full border border-neutral-800 shadow-[0_0_50px_rgba(255,85,0,0.15)] z-10 group">
          <Cloud className="absolute w-12 h-12 text-neutral-800 group-hover:text-neutral-700 transition-colors" />
          <span className="relative font-bebas text-5xl text-white tracking-wider z-10">
            {Math.floor(progress)}%
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2 text-neutral-300 font-medium">
            <div className="animate-bounce">{stages[stage].icon}</div>
            <span className="text-sm font-mono tracking-tight transition-all duration-300">
              {stages[stage].text}
            </span>
          </div>
        </div>

        {/* Bar */}
        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_20px_rgba(255,85,0,0.5)] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Info & Actions */}
        <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase tracking-widest font-semibold pt-2">
          <span className="truncate max-w-[150px]">{fileName}</span>
          <span>{(Math.random() * 5 + 15).toFixed(1)} MB/s</span>
        </div>

        <div className="pt-4 flex justify-center">
          <Button
            variant="ghost"
            onClick={onUploadFail}
            className="text-xs text-neutral-500 hover:text-red-400 hover:bg-red-500/5 px-4 py-2 h-auto rounded-full border border-neutral-800 hover:border-red-500/20"
          >
            <X className="w-3 h-3 mr-2" />
            Cancel Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CloudUploadState;
