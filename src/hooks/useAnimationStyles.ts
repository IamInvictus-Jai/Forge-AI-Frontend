import { useEffect } from "react";
import { generateHighlightKeyframes } from "../utils/animationGenerator";

/**
 * Hook to inject animation keyframes into the document
 */
export const useAnimationStyles = () => {
  useEffect(() => {
    // Check if styles are already injected
    const existingStyle = document.getElementById("video-editor-animations");
    if (existingStyle) return;

    // Create style element
    const styleElement = document.createElement("style");
    styleElement.id = "video-editor-animations";
    styleElement.textContent = generateHighlightKeyframes();

    // Inject into document
    document.head.appendChild(styleElement);

    // Cleanup on unmount
    return () => {
      const style = document.getElementById("video-editor-animations");
      if (style) {
        style.remove();
      }
    };
  }, []);
};
