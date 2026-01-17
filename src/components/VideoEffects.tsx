import React, { useMemo } from "react";
import { VideoConfig } from "../data/mockConfig";

interface VideoEffectsProps {
  config: VideoConfig;
  currentTime: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string;
  onLoadedMetadata: () => void;
  onEnded: () => void;
  onTogglePlay: () => void;
  isFullscreen?: boolean;
}

const VideoEffects: React.FC<VideoEffectsProps> = ({
  config,
  currentTime,
  videoRef,
  videoUrl,
  onLoadedMetadata,
  onEnded,
  onTogglePlay,
  isFullscreen = false,
}) => {
  // Calculate video opacity based on fade effects
  const videoOpacity = useMemo(() => {
    const { video } = config.tracks;
    const { settings } = config;

    let opacity = 1;

    // Fade In Effect
    if (settings.introFadeIn && video.animation?.fadeIn) {
      const { start, duration } = video.animation.fadeIn;
      const fadeInEnd = start + duration;

      if (currentTime >= start && currentTime <= fadeInEnd) {
        const progress = (currentTime - start) / duration;
        opacity = Math.min(1, progress);
      } else if (currentTime < start) {
        opacity = 0;
      }
    }

    // Fade Out Effect
    if (settings.outroFadeOut && video.animation?.fadeOut) {
      const { start, duration } = video.animation.fadeOut;
      const fadeOutEnd = start + duration;

      if (currentTime >= start && currentTime <= fadeOutEnd) {
        const progress = (currentTime - start) / duration;
        opacity = Math.max(0, 1 - progress);
      } else if (currentTime > fadeOutEnd) {
        opacity = 0;
      }
    }

    return opacity;
  }, [config, currentTime]);

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className={`max-h-full max-w-full shadow-2xl rounded-sm transition-opacity duration-100 ${isFullscreen ? "h-full w-full object-contain" : ""}`}
      style={{
        opacity: videoOpacity,
      }}
      onLoadedMetadata={onLoadedMetadata}
      onEnded={onEnded}
      onClick={onTogglePlay}
    />
  );
};

export default VideoEffects;
