import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoProcessingState from "../components/VideoProcessingState";
import Toast from "../components/Toast";

const VideoProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobId, setJobId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  useEffect(() => {
    // Get job ID from localStorage
    const savedJobId = localStorage.getItem("jobId");

    if (savedJobId) {
      setJobId(savedJobId);
    } else {
      // No job ID, redirect to upload
      navigate("/");
    }
  }, [navigate]);

  const handleJobComplete = () => {
    // Clear job ID from localStorage
    localStorage.removeItem("jobId");

    // Navigate to editor
    navigate("/editor");
  };

  const handleJobFail = () => {
    // Clear job ID
    localStorage.removeItem("jobId");

    // Show error and navigate back
    setToast({
      visible: true,
      message: "Processing Failed. Please upload again.",
    });
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (!jobId) {
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
        <VideoProcessingState
          jobId={jobId}
          onJobComplete={handleJobComplete}
          onJobFail={handleJobFail}
        />
      </div>
    </>
  );
};

export default VideoProcessingPage;
