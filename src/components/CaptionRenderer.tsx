import React, { useMemo, useEffect, useState } from "react";
import { VideoConfig } from "../data/mockConfig";
import { getAnimationPreset } from "../data/animationPresets";
import {
  generateEntryAnimation,
  generateExitAnimation,
  generateHighlightAnimation,
} from "../utils/animationGenerator";

interface Caption {
  id: string;
  text: string;
  start: number;
  end: number;
  word_count: number;
  duration_ms: number;
}

interface Highlight {
  captionId: string;
  wordStartIndex: number;
  wordEndIndex: number;
}

interface CaptionRendererProps {
  caption: Caption;
  highlights: Highlight[];
  config: VideoConfig;
  currentTime: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const CaptionRenderer: React.FC<CaptionRendererProps> = ({
  caption,
  highlights,
  config,
  currentTime,
  containerRef,
}) => {
  const { globalStyle, highlightStyle, animation } = config.tracks.text;
  const { dynamicAnimations, highlightKeywords } = config.settings;

  // Split text into words
  const words = useMemo(() => caption.text.split(" "), [caption.text]);

  // Group words into segments (highlighted groups and non-highlighted words)
  const wordSegments = useMemo(() => {
    if (!highlightKeywords || highlights.length === 0) {
      // No highlights, return all words as individual segments
      return words.map((word, index) => ({
        text: word,
        isHighlighted: false,
        startIndex: index,
        endIndex: index,
      }));
    }

    const segments: Array<{
      text: string;
      isHighlighted: boolean;
      startIndex: number;
      endIndex: number;
    }> = [];

    let currentIndex = 0;

    while (currentIndex < words.length) {
      // Check if current word is part of a highlight
      const highlight = highlights.find(
        (h) =>
          currentIndex >= h.wordStartIndex && currentIndex <= h.wordEndIndex,
      );

      if (highlight) {
        // Create a highlighted segment for the entire range
        const highlightedWords = words.slice(
          highlight.wordStartIndex,
          highlight.wordEndIndex + 1,
        );
        segments.push({
          text: highlightedWords.join(" "),
          isHighlighted: true,
          startIndex: highlight.wordStartIndex,
          endIndex: highlight.wordEndIndex,
        });
        currentIndex = highlight.wordEndIndex + 1;
      } else {
        // Create a non-highlighted segment for single word
        segments.push({
          text: words[currentIndex],
          isHighlighted: false,
          startIndex: currentIndex,
          endIndex: currentIndex,
        });
        currentIndex++;
      }
    }

    return segments;
  }, [words, highlights, highlightKeywords]);

  // Calculate animation phase
  const animationPhase = useMemo(() => {
    const captionDuration = caption.end - caption.start;
    const elapsed = currentTime - caption.start;
    const progress = elapsed / captionDuration;

    // Get animation durations from presets
    const entryPreset = getAnimationPreset("entry", animation.entry.presetId);
    const exitPreset = getAnimationPreset("exit", animation.exit.presetId);

    // Use config duration if provided, otherwise fall back to preset duration
    const entryDuration =
      animation.entry.duration ?? entryPreset?.duration ?? 0.4;
    const exitDuration =
      animation.exit.duration ?? exitPreset?.duration ?? 0.25;

    const entryPhaseEnd = entryDuration / captionDuration;
    const exitPhaseStart = 1 - exitDuration / captionDuration;

    if (progress <= entryPhaseEnd) {
      return { phase: "entry", progress: progress / entryPhaseEnd };
    } else if (progress >= exitPhaseStart) {
      return {
        phase: "exit",
        progress: (progress - exitPhaseStart) / (1 - exitPhaseStart),
      };
    } else {
      return { phase: "visible", progress: 1 };
    }
  }, [currentTime, caption, animation]);

  // Generate animation styles
  const captionAnimationStyle = useMemo(() => {
    if (!dynamicAnimations) return {};

    if (animationPhase.phase === "entry") {
      return generateEntryAnimation(
        animation.entry.presetId,
        animationPhase.progress,
      );
    } else if (animationPhase.phase === "exit") {
      return generateExitAnimation(
        animation.exit.presetId,
        animationPhase.progress,
      );
    }

    return {};
  }, [dynamicAnimations, animationPhase, animation]);

  // Position calculation
  const positionStyle = useMemo(() => {
    const { position } = globalStyle;
    const styles: React.CSSProperties = {
      position: "absolute",
      zIndex: 10,
    };

    // Handle anchor positioning
    if (position.anchor === "bottom_center") {
      styles.bottom = `${Math.abs(position.offsetY)}px`;
      styles.left = "50%";
      styles.transform = "translateX(-50%)";
    } else if (position.anchor === "top_center") {
      styles.top = `${Math.abs(position.offsetY)}px`;
      styles.left = "50%";
      styles.transform = "translateX(-50%)";
    } else if (position.anchor === "center") {
      styles.top = "50%";
      styles.left = "50%";
      styles.transform = "translate(-50%, -50%)";
    }

    return styles;
  }, [globalStyle]);

  // Merge animation transform with position transform
  const mergedStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      fontFamily: globalStyle.fontFamily,
      fontSize: `${globalStyle.fontSize}px`,
      fontWeight: globalStyle.fontWeight,
      color: globalStyle.color,
      background: globalStyle.background,
      padding: `${globalStyle.padding[0]}px ${globalStyle.padding[1]}px`,
      borderRadius: `${globalStyle.borderRadius}px`,
      display: "inline-block",
      textAlign: "center",
      lineHeight: 1.2,
      maxWidth: "90%",
      wordWrap: "break-word",
      ...positionStyle,
      ...captionAnimationStyle,
    };

    // Merge transforms if both exist
    if (positionStyle.transform && captionAnimationStyle.transform) {
      baseStyle.transform = `${positionStyle.transform} ${captionAnimationStyle.transform}`;
    }

    return baseStyle;
  }, [globalStyle, positionStyle, captionAnimationStyle]);

  return (
    <div className="pointer-events-none" style={mergedStyle}>
      {wordSegments.map((segment, index) => {
        // Get highlight duration from config or preset
        const highlightPreset = getAnimationPreset(
          "highlight",
          animation.highlight.presetId,
        );
        const highlightDuration =
          animation.highlight.duration ?? highlightPreset?.duration ?? 0.25;

        const highlightAnimStyle =
          segment.isHighlighted && dynamicAnimations
            ? generateHighlightAnimation(
                animation.highlight.presetId,
                highlightDuration,
              )
            : {};

        const segmentStyle: React.CSSProperties = {
          display: "inline-block",
          marginRight: index < wordSegments.length - 1 ? "0.3em" : "0",
          ...(segment.isHighlighted && {
            color: highlightStyle.color,
            fontWeight: highlightStyle.fontWeight,
            transform: `scale(${highlightStyle.scale})`,
            transformOrigin: "center",
          }),
          ...highlightAnimStyle,
        };

        return (
          <span
            key={`${caption.id}-segment-${segment.startIndex}-${segment.endIndex}`}
            style={segmentStyle}
          >
            {segment.text}
          </span>
        );
      })}
    </div>
  );
};

export default CaptionRenderer;
