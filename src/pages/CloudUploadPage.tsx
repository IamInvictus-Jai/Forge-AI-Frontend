import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CloudUploadState from "../components/CloudUploadState";
import Toast from "../components/Toast";

const CloudUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  useEffect(() => {
    // Get file from navigation state
    const stateFile = location.state?.file;

    if (stateFile && stateFile instanceof File) {
      setFile(stateFile);
    } else {
      // No file provided, redirect back to upload
      navigate("/");
    }
  }, [navigate, location]);

  const handleUploadComplete = () => {
    // Navigate to processing page
    navigate("/processing");
  };

  const handleUploadFail = () => {
    // Show error and navigate back
    setToast({ visible: true, message: "Video Upload Failed. Try again" });
    setTimeout(() => {
      navigate("/");
    }, 5000);
  };

  const handleBackToUpload = () => {
    navigate("/");
  };

  if (!file) {
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
          file={file}
          onUploadComplete={handleUploadComplete}
          onUploadFail={handleUploadFail}
          onBackToUpload={handleBackToUpload}
        />
      </div>
    </>
  );
};

export default CloudUploadPage;
