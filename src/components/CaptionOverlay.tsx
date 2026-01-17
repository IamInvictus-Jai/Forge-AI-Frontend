import React, { useMemo } from "react";
import { VideoConfig } from "../data/mockConfig";
import CaptionRenderer from "./CaptionRenderer";

interface CaptionOverlayProps {
  config: VideoConfig;
  currentTime: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  config,
  currentTime,
  containerRef,
}) => {
  // Find active caption based on current time
  const activeCaption = useMemo(() => {
    return config.tracks.text.captions.find(
      (caption) => currentTime >= caption.start && currentTime <= caption.end,
    );
  }, [config.tracks.text.captions, currentTime]);

  // Get highlights for active caption
  const activeHighlights = useMemo(() => {
    if (!activeCaption) return [];
    return config.tracks.text.highlights.filter(
      (h) => h.captionId === activeCaption.id,
    );
  }, [activeCaption, config.tracks.text.highlights]);

  if (!activeCaption) return null;

  return (
    <CaptionRenderer
      caption={activeCaption}
      highlights={activeHighlights}
      config={config}
      currentTime={currentTime}
      containerRef={containerRef}
    />
  );
};

export default CaptionOverlay;
