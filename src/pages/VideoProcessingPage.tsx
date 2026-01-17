import React from "react";
import VideoProcessingState from "../components/VideoProcessingState";

interface VideoProcessingPageProps {
  jobId: string;
  onJobComplete: () => void;
  onJobFail: () => void;
}

const VideoProcessingPage: React.FC<VideoProcessingPageProps> = ({
  jobId,
  onJobComplete,
  onJobFail,
}) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <VideoProcessingState
        jobId={jobId}
        onJobComplete={onJobComplete}
        onJobFail={onJobFail}
      />
    </div>
  );
};

export default VideoProcessingPage;
