import React, { useRef, useEffect, useState } from "react";
import { VideoConfig } from "../data/mockConfig";
import CaptionOverlay from "./CaptionOverlay";
import VideoEffects from "./VideoEffects";

interface VideoRendererProps {
  config: VideoConfig;
  videoUrl: string;
  currentTime: number;
  isPlaying: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  onLoadedMetadata: () => void;
  onEnded: () => void;
  onTogglePlay: () => void;
  isFullscreen?: boolean;
}

const VideoRenderer: React.FC<VideoRendererProps> = ({
  config,
  videoUrl,
  currentTime,
  isPlaying,
  videoRef,
  onLoadedMetadata,
  onEnded,
  onTogglePlay,
  isFullscreen = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* Base Video with Effects */}
      <VideoEffects
        config={config}
        currentTime={currentTime}
        videoRef={videoRef}
        videoUrl={videoUrl}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onTogglePlay={onTogglePlay}
        isFullscreen={isFullscreen}
      />

      {/* Caption Overlay */}
      {config.settings.autoCaptions && (
        <CaptionOverlay
          config={config}
          currentTime={currentTime}
          containerRef={containerRef}
        />
      )}
    </div>
  );
};

export default VideoRenderer;
