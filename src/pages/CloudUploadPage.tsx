import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloudUploadState from "../components/CloudUploadState";
import Toast from "../components/Toast";

const CloudUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string>("video-project.mp4");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  useEffect(() => {
    // Get file info from sessionStorage
    const savedFileName = sessionStorage.getItem("currentFileName");
    const savedBlobUrl = sessionStorage.getItem("currentBlobUrl");

    if (savedFileName) setFileName(savedFileName);
    if (savedBlobUrl) setBlobUrl(savedBlobUrl);

    // If no file info, redirect back to upload
    if (!savedFileName || !savedBlobUrl) {
      navigate("/");
    }
  }, [navigate]);

  const handleUploadComplete = (backendVideoUrl: string) => {
    // Store the blob URL in localStorage (for demo, since we don't have real backend)
    // In production, use the backendVideoUrl from the server
    if (blobUrl) {
      localStorage.setItem("videoUrl", blobUrl);
    }

    // Create processing job
    const newJobId = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem("jobId", newJobId);

    // Clear session storage
    sessionStorage.removeItem("currentFileName");
    sessionStorage.removeItem("currentBlobUrl");

    // Navigate to processing page
    navigate("/processing");
  };

  const handleUploadFail = () => {
    // Clean up
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }
    sessionStorage.removeItem("currentFileName");
    sessionStorage.removeItem("currentBlobUrl");

    // Show error and navigate back
    setToast({ visible: true, message: "Video Upload Failed. Try again" });
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (!blobUrl) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      {toast.visible && (
        <Toast
          message={toast.message}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}
      <div className="h-full w-full flex items-center justify-center">
        <CloudUploadState
          fileName={fileName}
          onUploadComplete={handleUploadComplete}
          onUploadFail={handleUploadFail}
        />
      </div>
    </>
  );
};

export default CloudUploadPage;
