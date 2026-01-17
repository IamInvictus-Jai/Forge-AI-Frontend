import React, { useEffect, useState } from "react";
import { Cloud, CheckCircle2, Server, ShieldCheck, Zap, X } from "lucide-react";
import Button from "./Button";

interface CloudUploadStateProps {
  fileName: string;
  onUploadComplete: () => void;
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
      text: "Establishing secure connection...",
      icon: <ShieldCheck className="w-5 h-5 text-orange-500" />,
    },
    {
      text: "Compressing video assets...",
      icon: <Zap className="w-5 h-5 text-orange-400" />,
    },
    {
      text: "Uploading to cloud storage...",
      icon: <Cloud className="w-5 h-5 text-orange-300" />,
    },
    {
      text: "Verifying integrity...",
      icon: <Server className="w-5 h-5 text-orange-200" />,
    },
    {
      text: "Ready for editing",
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
          setTimeout(onUploadComplete, 800); // Small delay after 100% before switching
          return 100;
        }

        // Variable speed to make it feel "real"
        const increment = Math.random() * 3 + 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onUploadComplete, onUploadFail, fileName]);

  // Update stage text based on progress
  useEffect(() => {
    if (progress < 15) setStage(0);
    else if (progress < 40) setStage(1);
    else if (progress < 80) setStage(2);
    else if (progress < 95) setStage(3);
    else setStage(4);
  }, [progress]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Central Visual */}
      <div className="relative mb-12">
        {/* Pulsing Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-orange-500/20 rounded-full animate-[spin_4s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-orange-500/40 rounded-full border-t-transparent animate-[spin_2s_linear_infinite_reverse]" />

        {/* Center Percentage */}
        <div className="relative w-32 h-32 flex items-center justify-center bg-neutral-900 rounded-full border border-neutral-800 shadow-[0_0_50px_rgba(255,85,0,0.15)] z-10">
          <span className="font-bebas text-5xl text-white tracking-wider">
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
