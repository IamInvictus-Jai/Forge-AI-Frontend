import { getAnimationPreset } from "../data/animationPresets";

/**
 * Easing functions
 */
const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

/**
 * Apply easing to progress value
 */
const applyEasing = (progress: number, easing?: string): number => {
  const easingFn =
    easingFunctions[easing as keyof typeof easingFunctions] ||
    easingFunctions.linear;
  return easingFn(progress);
};

/**
 * Interpolate between two values
 */
const interpolate = (from: number, to: number, progress: number): number => {
  return from + (to - from) * progress;
};

/**
 * Parse relative values like "relative(0.6 * textHeight)"
 */
const parseRelativeValue = (value: string | number): number => {
  if (typeof value === "number") return value;

  // For now, return a reasonable default for relative values
  // In a real implementation, you'd calculate based on actual element dimensions
  if (value.includes("textHeight")) {
    return 50; // Approximate text height
  }
  if (value.includes("textWidth")) {
    return 200; // Approximate text width
  }

  return 0;
};

/**
 * Generate entry animation styles
 */
export const generateEntryAnimation = (
  presetId: string,
  progress: number,
): React.CSSProperties => {
  const preset = getAnimationPreset("entry", presetId);
  if (!preset) return {};

  const easedProgress = applyEasing(progress, preset.easing);
  const style: React.CSSProperties = {};

  const { properties } = preset;

  // Opacity
  if (properties.opacity) {
    const from =
      typeof properties.opacity.from === "number" ? properties.opacity.from : 0;
    const to =
      typeof properties.opacity.to === "number" ? properties.opacity.to : 1;
    style.opacity = interpolate(from, to, easedProgress);
  }

  // Scale
  if (properties.scale) {
    const from =
      typeof properties.scale.from === "number" ? properties.scale.from : 1;
    const to =
      typeof properties.scale.to === "number" ? properties.scale.to : 1;
    const scale = interpolate(from, to, easedProgress);
    style.transform = `scale(${scale})`;
  }

  // TranslateY
  if (properties.translateY) {
    const from = parseRelativeValue(properties.translateY.from || 0);
    const to = parseRelativeValue(properties.translateY.to || 0);
    const translateY = interpolate(from, to, easedProgress);
    const existingTransform = style.transform || "";
    style.transform = `${existingTransform} translateY(${translateY}px)`.trim();
  }

  // TranslateX
  if (properties.translateX) {
    const from = parseRelativeValue(properties.translateX.from || 0);
    const to = parseRelativeValue(properties.translateX.to || 0);
    const translateX = interpolate(from, to, easedProgress);
    const existingTransform = style.transform || "";
    style.transform = `${existingTransform} translateX(${translateX}px)`.trim();
  }

  // Handle keyframes (for bounce, etc.)
  if (properties.scale?.keyframes) {
    const keyframes = properties.scale.keyframes;
    const segmentCount = keyframes.length - 1;
    const segmentIndex = Math.min(
      Math.floor(easedProgress * segmentCount),
      segmentCount - 1,
    );
    const segmentProgress = easedProgress * segmentCount - segmentIndex;

    const from = keyframes[segmentIndex];
    const to = keyframes[segmentIndex + 1];
    const scale = interpolate(from, to, segmentProgress);
    style.transform = `scale(${scale})`;
  }

  return style;
};

/**
 * Generate exit animation styles
 */
export const generateExitAnimation = (
  presetId: string,
  progress: number,
): React.CSSProperties => {
  const preset = getAnimationPreset("exit", presetId);
  if (!preset) return {};

  const easedProgress = applyEasing(progress, preset.easing);
  const style: React.CSSProperties = {};

  const { properties } = preset;

  // Opacity
  if (properties.opacity) {
    const from =
      typeof properties.opacity.from === "number" ? properties.opacity.from : 1;
    const to =
      typeof properties.opacity.to === "number" ? properties.opacity.to : 0;
    style.opacity = interpolate(from, to, easedProgress);
  }

  // Scale
  if (properties.scale) {
    const from =
      typeof properties.scale.from === "number" ? properties.scale.from : 1;
    const to =
      typeof properties.scale.to === "number" ? properties.scale.to : 1;
    const scale = interpolate(from, to, easedProgress);
    style.transform = `scale(${scale})`;
  }

  // TranslateY
  if (properties.translateY) {
    const from = parseRelativeValue(properties.translateY.from || 0);
    const to = parseRelativeValue(properties.translateY.to || 0);
    const translateY = interpolate(from, to, easedProgress);
    const existingTransform = style.transform || "";
    style.transform = `${existingTransform} translateY(${translateY}px)`.trim();
  }

  // TranslateX
  if (properties.translateX) {
    const from = parseRelativeValue(properties.translateX.from || 0);
    const to = parseRelativeValue(properties.translateX.to || 0);
    const translateX = interpolate(from, to, easedProgress);
    const existingTransform = style.transform || "";
    style.transform = `${existingTransform} translateX(${translateX}px)`.trim();
  }

  return style;
};

/**
 * Generate highlight animation styles (oscillating/pulsing)
 */
export const generateHighlightAnimation = (
  presetId: string,
  duration?: number,
): React.CSSProperties => {
  const preset = getAnimationPreset("highlight", presetId);
  if (!preset || presetId === "none") return {};

  const style: React.CSSProperties = {};
  const { properties } = preset;

  // Use provided duration or fall back to preset duration
  const animDuration = duration ?? preset.duration ?? 0.25;

  // For oscillating animations, use CSS animations
  if (properties.scale?.mode === "oscillate") {
    const animationName = `highlight-${presetId}`;
    style.animation = `${animationName} ${animDuration}s ease-in-out infinite alternate`;
  }

  return style;
};

/**
 * Generate CSS keyframes for highlight animations
 * This should be injected into the document once
 */
export const generateHighlightKeyframes = (): string => {
  const keyframes: string[] = [];

  // Pulse animation
  keyframes.push(`
    @keyframes highlight-pulse {
      from { transform: scale(1); }
      to { transform: scale(1.12); }
    }
  `);

  // Pulse fade animation
  keyframes.push(`
    @keyframes highlight-pulse_fade {
      from { transform: scale(1); opacity: 0.9; }
      to { transform: scale(1.12); opacity: 1; }
    }
  `);

  // Scale color pulse
  keyframes.push(`
    @keyframes highlight-scale_color_pulse {
      from { transform: scale(1); }
      to { transform: scale(1.12); }
    }
  `);

  return keyframes.join("\n");
};
