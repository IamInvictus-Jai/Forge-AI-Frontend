// UI Copy Configuration
export const UI_COPY = {
  landing: {
    title: "Edit videos intelligently, right in your browser",
    subtitle: "No installs. Upload once, let AI handle captions, animations, framing, and effects — instantly.",
    footer: "Powered for speed • Built for simplicity"
  },
  upload: {
    buttonPrimary: "Upload Video",
    supportingText: "MP4, MOV, or WebM • Up to 4K",
    privacyText: "Your file stays private.",
    dragHint: "or drag and drop your video here",
  },
  preview: {
    label: "Video Preview",
    statusReady: "Ready to edit",
    buttonContinue: "Continue to Editor",
    utilityText: "You can trim, cut, add text, and export in minutes.",
  },
  states: {
    uploading: "Uploading video…",
    processing: "Preparing your video…",
    error: "Something went wrong. Try another file.",
  }
};

// Configurable Theme Classes
export const THEME_CLASSES = {
  // Primary Color: Orange
  primaryButton: "bg-brand-orange hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(255,85,0,0.3)] hover:shadow-[0_0_30px_rgba(255,85,0,0.5)] transition-all duration-300",
  // Secondary Color: Dark Grays
  secondaryButton: "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700",
  // Accent Color: White (Used for text emphasis and borders)
  accentBorder: "border-white/10 hover:border-white/20",
  accentText: "text-white",
  // Backgrounds
  cardBg: "bg-black/40 backdrop-blur-xl border border-white/10",
  inputBg: "bg-neutral-900/50",
};