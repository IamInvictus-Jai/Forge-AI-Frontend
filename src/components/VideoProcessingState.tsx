import React, { useEffect, useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Workflow,
} from "lucide-react";

interface VideoProcessingStateProps {
  jobId: string;
  onJobComplete: () => void;
  onJobFail: () => void;
}

const VideoProcessingState: React.FC<VideoProcessingStateProps> = ({
  jobId,
  onJobComplete,
  onJobFail,
}) => {
  const [statusText, setStatusText] = useState("Initializing AI processor...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate Backend Polling logic
    // In a real app, this would be a setInterval calling fetch(`/api/jobs/${jobId}`)

    let intervalId: ReturnType<typeof setInterval>;
    let currentProgress = 0;

    const pollBackend = () => {
      // Simulation: We increment progress to fake "pending" state
      currentProgress += Math.random() * 5;

      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);

      // 1. Simulate Status Updates based on progress
      if (currentProgress < 30) {
        setStatusText("Video is processing...");
      } else if (currentProgress < 60) {
        setStatusText("AI is planning the edits...");
      } else if (currentProgress < 90) {
        setStatusText("Preparing your editor...");
      }

      // 2. Simulate Terminal States (Ready vs Failed)
      // For testing: If jobId contains 'fail', we trigger failure around 80%
      if (jobId.includes("fail") && currentProgress > 80) {
        clearInterval(intervalId);
        onJobFail();
        return;
      }

      // 3. Success Condition
      if (currentProgress >= 100) {
        clearInterval(intervalId);
        setStatusText("Editor Ready");
        setTimeout(() => {
          onJobComplete();
        }, 500);
      }
    };

    intervalId = setInterval(pollBackend, 200); // Fast polling for demo

    return () => clearInterval(intervalId);
  }, [jobId, onJobComplete, onJobFail]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Central Visual */}
      <div className="relative mb-12">
        {/* Abstract Tech Visual */}
        <div className="absolute inset-0 bg-orange-500/5 blur-3xl rounded-full animate-pulse" />

        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Rotating outer ring */}
          <div className="absolute inset-0 border-2 border-dashed border-neutral-700 rounded-full animate-[spin_10s_linear_infinite]" />

          {/* Inner pulsating circle */}
          <div className="absolute inset-4 border border-orange-500/30 rounded-full animate-pulse" />

          {/* Icon */}
          <div className="relative z-10 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-2xl">
            <BrainCircuit className="w-12 h-12 text-orange-500 animate-pulse" />
          </div>

          {/* Orbiting particle */}
          <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
            <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] absolute -top-1.5 left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl md:text-3xl font-bebas tracking-wide text-white animate-fade-in">
          {statusText}
        </h2>

        <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
          <Workflow className="w-3 h-3" />
          <span>Job ID: {jobId}</span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-64 mx-auto bg-neutral-800 rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-orange-500 shadow-[0_0_15px_rgba(255,85,0,0.6)] transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoProcessingState;
