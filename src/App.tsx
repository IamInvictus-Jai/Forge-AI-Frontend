import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import UploadPage from "./pages/UploadPage";
import CloudUploadPage from "./pages/CloudUploadPage";
import VideoProcessingPage from "./pages/VideoProcessingPage";
import EditorPage from "./pages/EditorPage";
import Toast from "./components/Toast";

// Types
type PageView = "upload" | "cloud-upload" | "processing" | "editor";
type UploadStatus = "idle" | "uploading" | "processing" | "ready" | "error";

const App = () => {
  // Application State
  const [view, setView] = useState<PageView>("upload");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  // -------------------------------------------------------------------------
  // 1. Initialization & Persistence
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Check localStorage on mount
    const savedVideoUrl = localStorage.getItem("videoUrl");
    const savedJobId = localStorage.getItem("jobId");

    if (savedVideoUrl) {
      setVideoUrl(savedVideoUrl);
      setUploadStatus("ready");
    }

    if (savedJobId) {
      setJobId(savedJobId);
    }
  }, []);

  // -------------------------------------------------------------------------
  // 2. Action Handlers
  // -------------------------------------------------------------------------

  // User clicked "Continue to Editor" from Upload Page -> Starts Cloud Upload
  const handleContinueToCloudUpload = (file: File) => {
    setCurrentFile(file);
    setView("cloud-upload");
  };

  // User clicked "Change Video" - Resets UI but maintains localStorage until new upload confirms
  const handleChangeVideo = () => {
    setCurrentFile(null);
    setUploadStatus("idle");
    // Note: We do NOT clear videoUrl from localStorage here
    // It persists until a new upload succeeds
  };

  // -------------------------------------------------------------------------
  // 3. Flow Logic
  // -------------------------------------------------------------------------

  // Step 1 Complete: Cloud Upload Success
  const handleCloudUploadComplete = (backendVideoUrl: string) => {
    // 1. Store video URL in localStorage
    localStorage.setItem("videoUrl", backendVideoUrl);
    setVideoUrl(backendVideoUrl);

    // 2. Mock Backend Request to Create Processing Job
    const newJobId = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 3. Store Job ID in localStorage
    localStorage.setItem("jobId", newJobId);
    setJobId(newJobId);

    // 4. Route to Processing
    setView("processing");
  };

  // Step 1 Failed: Cloud Upload Error
  const handleCloudUploadFail = () => {
    setCurrentFile(null);
    setUploadStatus("error");
    setView("upload");
    setToast({ visible: true, message: "Video Upload Failed. Try again" });
  };

  // Step 2 Complete: Job Processing Success (Backend says 'ready')
  const handleJobComplete = () => {
    // Clear job ID from localStorage (job is complete)
    localStorage.removeItem("jobId");
    setJobId(null);

    // Route to Editor
    setView("editor");
  };

  // Step 2 Failed: Job Processing Error (Backend says 'failed')
  const handleJobFail = () => {
    // Clear invalid job
    localStorage.removeItem("jobId");
    setJobId(null);

    // Route back to upload page
    setView("upload");
    setUploadStatus("error");
    setToast({
      visible: true,
      message: "Processing Failed. Please upload again.",
    });
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-brand-black flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* --- Toast Notification --- */}
      {toast.visible && (
        <Toast
          message={toast.message}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}

      {/* --- Cinematic Background (Persistent across all pages) --- */}
      <div className="absolute top-[-20%] right-[-10%] w-[80vh] h-[80vh] bg-orange-600/25 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vh] h-[60vh] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* --- Branding / Header (Persistent) --- */}
      <nav className="absolute top-0 left-0 w-full p-6 md:p-8 z-50 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto group cursor-default">
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
        {/* VIEW: UPLOAD PAGE */}
        {view === "upload" && (
          <UploadPage
            onContinueToEditor={handleContinueToCloudUpload}
            onChangeVideo={handleChangeVideo}
            initialStatus={uploadStatus}
            savedVideoUrl={videoUrl}
          />
        )}

        {/* VIEW: CLOUD UPLOAD PAGE */}
        {view === "cloud-upload" && currentFile && (
          <CloudUploadPage
            fileName={currentFile.name}
            onUploadComplete={handleCloudUploadComplete}
            onUploadFail={handleCloudUploadFail}
          />
        )}

        {/* VIEW: VIDEO PROCESSING PAGE */}
        {view === "processing" && jobId && (
          <VideoProcessingPage
            jobId={jobId}
            onJobComplete={handleJobComplete}
            onJobFail={handleJobFail}
          />
        )}

        {/* VIEW: EDITOR PAGE */}
        {view === "editor" && <EditorPage />}
      </main>
    </div>
  );
};

export default App;
