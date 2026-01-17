import React, { useEffect, useState, useRef } from "react";
import {
  Cloud,
  CheckCircle2,
  Server,
  ShieldCheck,
  Zap,
  X,
  Upload,
  AlertCircle,
} from "lucide-react";
import Button from "./Button";
import { createProject, VideoMetadata, APIError } from "../api/client";

interface CloudUploadStateProps {
  file: File;
  onUploadComplete: () => void;
  onUploadFail: () => void;
  onBackToUpload: () => void;
}

type UploadStage =
  | "uploading"
  | "upload-complete"
  | "creating-project"
  | "project-created"
  | "upload-failed"
  | "project-failed";

const CloudUploadState: React.FC<CloudUploadStateProps> = ({
  file,
  onUploadComplete,
  onUploadFail,
  onBackToUpload,
}) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<UploadStage>("uploading");
  const [stageText, setStageText] = useState("Handshaking with server...");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  // Calculate aspect ratio as string (e.g., "16:9")
  const calculateAspectRatio = (width: number, height: number): string => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  // Upload to Cloudinary
  const uploadToCloudinary = () => {
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("resource_type", "video");

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setProgress(percentComplete);

        // Update stage text based on progress
        if (percentComplete < 15) {
          setStageText("Handshaking with server...");
        } else if (percentComplete < 40) {
          setStageText("Optimizing upload stream...");
        } else if (percentComplete < 80) {
          setStageText("Transferring video data...");
        } else if (percentComplete < 100) {
          setStageText("Finalizing storage...");
        }
      }
    };

    // Handle successful upload
    xhr.onload = async () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);

          // Extract metadata from Cloudinary response
          const videoMetadata: VideoMetadata = {
            video_url: response.secure_url,
            width: response.width,
            height: response.height,
            duration: response.duration,
            aspectRatio: calculateAspectRatio(response.width, response.height),
          };

          // Save to localStorage
          localStorage.setItem("videoMetadata", JSON.stringify(videoMetadata));

          setStage("upload-complete");
          setStageText("Upload Complete");
          setProgress(100);

          // Now create project in backend
          await createProjectInBackend(videoMetadata);
        } catch (error) {
          console.error("Error parsing Cloudinary response:", error);
          setStage("upload-failed");
          setErrorMessage("Failed to process upload response");
          setTimeout(() => onUploadFail(), 2000);
        }
      } else {
        setStage("upload-failed");
        setErrorMessage("Upload failed. Please try again.");
        setTimeout(() => onUploadFail(), 2000);
      }
    };

    // Handle upload error
    xhr.onerror = () => {
      setStage("upload-failed");
      setErrorMessage("Network error. Please check your connection.");
      setTimeout(() => onUploadFail(), 2000);
    };

    // Send request
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    );
    xhr.send(formData);
  };

  // Create project in backend
  const createProjectInBackend = async (videoMetadata: VideoMetadata) => {
    setStage("creating-project");
    setStageText("Creating project...");

    try {
      const response = await createProject(videoMetadata);

      // Save jobId to localStorage
      localStorage.setItem("jobId", response.jobId);

      setStage("project-created");
      setStageText("Project created successfully");

      // Navigate to processing page
      setTimeout(() => onUploadComplete(), 500);
    } catch (error) {
      setStage("project-failed");
      if (error instanceof APIError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to create project. Please try again.");
      }
    }
  };

  // Retry project creation (video already uploaded)
  const handleRetryProject = async () => {
    setIsRetrying(true);
    const savedMetadata = localStorage.getItem("videoMetadata");

    if (savedMetadata) {
      try {
        const videoMetadata: VideoMetadata = JSON.parse(savedMetadata);
        await createProjectInBackend(videoMetadata);
      } catch (error) {
        console.error("Retry failed:", error);
      }
    }

    setIsRetrying(false);
  };

  // Cancel upload
  const handleCancelUpload = () => {
    if (xhrRef.current && stage === "uploading") {
      xhrRef.current.abort();
      onBackToUpload();
    }
  };

  // Start upload on mount
  useEffect(() => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setStage("upload-failed");
      setErrorMessage("Cloudinary configuration missing");
      return;
    }

    uploadToCloudinary();

    // Cleanup on unmount
    return () => {
      if (xhrRef.current) {
        xhrRef.current.abort();
      }
    };
  }, []);

  // Get icon based on stage
  const getStageIcon = () => {
    if (stage === "upload-failed" || stage === "project-failed") {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }

    if (progress < 15) {
      return <ShieldCheck className="w-5 h-5 text-orange-500" />;
    } else if (progress < 40) {
      return <Zap className="w-5 h-5 text-orange-400" />;
    } else if (progress < 80) {
      return <Upload className="w-5 h-5 text-orange-300" />;
    } else if (progress < 100) {
      return <Server className="w-5 h-5 text-orange-200" />;
    } else if (stage === "creating-project") {
      return <Server className="w-5 h-5 text-orange-400 animate-pulse" />;
    } else {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Central Visual */}
      <div className="relative mb-12">
        {/* Pulsing Rings */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse ${
            stage === "upload-failed" || stage === "project-failed"
              ? "bg-red-500/10"
              : "bg-orange-500/10"
          }`}
        />

        {/* Center Percentage */}
        <div className="relative w-32 h-32 flex items-center justify-center bg-neutral-900 rounded-full border border-neutral-800 shadow-[0_0_50px_rgba(255,85,0,0.15)] z-10 group">
          <Cloud className="absolute w-12 h-12 text-neutral-800 group-hover:text-neutral-700 transition-colors" />
          <span className="relative font-bebas text-5xl text-white tracking-wider z-10">
            {stage === "creating-project" || stage === "project-created"
              ? "✓"
              : stage === "upload-failed" || stage === "project-failed"
                ? "✗"
                : `${Math.floor(progress)}%`}
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2 text-neutral-300 font-medium">
            <div
              className={
                stage === "creating-project" ? "animate-bounce" : undefined
              }
            >
              {getStageIcon()}
            </div>
            <span className="text-sm font-mono tracking-tight transition-all duration-300">
              {stageText}
            </span>
          </div>
        </div>

        {/* Bar - Only show during upload */}
        {stage === "uploading" && (
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_20px_rgba(255,85,0,0.5)] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Info */}
        {stage === "uploading" && (
          <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase tracking-widest font-semibold pt-2">
            <span className="truncate max-w-[200px]">{file.name}</span>
            <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
          </div>
        )}

        {/* Error Message */}
        {(stage === "upload-failed" || stage === "project-failed") && (
          <div className="pt-2 text-center">
            <p className="text-sm text-red-400 mb-4">{errorMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 flex justify-center gap-3">
          {stage === "uploading" && (
            <Button
              variant="ghost"
              onClick={handleCancelUpload}
              className="text-xs text-neutral-500 hover:text-red-400 hover:bg-red-500/5 px-4 py-2 h-auto rounded-full border border-neutral-800 hover:border-red-500/20"
            >
              <X className="w-3 h-3 mr-2" />
              Cancel Upload
            </Button>
          )}

          {stage === "project-failed" && (
            <>
              <Button
                variant="ghost"
                onClick={onBackToUpload}
                className="text-xs px-4 py-2 h-auto rounded-full"
              >
                Back to Upload
              </Button>
              <Button
                variant="primary"
                onClick={handleRetryProject}
                isLoading={isRetrying}
                loadingText="Retrying..."
                className="text-xs px-4 py-2 h-auto rounded-full"
              >
                Retry Processing
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudUploadState;
