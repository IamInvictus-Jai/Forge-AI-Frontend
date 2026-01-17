import React from "react";
import CloudUploadState from "../components/CloudUploadState";

interface CloudUploadPageProps {
  fileName: string;
  onUploadComplete: (videoUrl: string) => void;
  onUploadFail: () => void;
}

const CloudUploadPage: React.FC<CloudUploadPageProps> = ({
  fileName,
  onUploadComplete,
  onUploadFail,
}) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <CloudUploadState
        fileName={fileName}
        onUploadComplete={onUploadComplete}
        onUploadFail={onUploadFail}
      />
    </div>
  );
};

export default CloudUploadPage;
