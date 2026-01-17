// Animation presets for captions and video effects
// These presets are always available in the frontend

export interface AnimationProperty {
  from?: number | string;
  to?: number | string;
  keyframes?: number[];
  mode?: "oscillate" | "once";
}

export interface AnimationPreset {
  id: string;
  type: "entry" | "exit" | "highlight" | "video";
  properties: {
    opacity?: AnimationProperty;
    scale?: AnimationProperty;
    translateX?: AnimationProperty;
    translateY?: AnimationProperty;
    colorBlend?: AnimationProperty;
    fadeIn?: {
      opacity?: AnimationProperty;
    };
    fadeOut?: {
      opacity?: AnimationProperty;
    };
  };
  duration?: number;
  easing?: string;
}

export interface AnimationPresetCollection {
  version: string;
  defaults: {
    duration: number;
    easing?: string;
  };
  presets: AnimationPreset[];
}

// Entry Animations
export const entryAnimations: AnimationPresetCollection = {
  version: "1.0",
  defaults: {
    duration: 0.4,
    easing: "easeOut",
  },
  presets: [
    {
      id: "fade_in",
      type: "entry",
      properties: {
        opacity: {
          from: 0,
          to: 1,
        },
      },
    },
    {
      id: "pop_in",
      type: "entry",
      properties: {
        scale: {
          from: 0.85,
          to: 1,
        },
        opacity: {
          from: 0,
          to: 1,
        },
      },
    },
    {
      id: "slide_up",
      type: "entry",
      properties: {
        translateY: {
          from: "relative(0.6 * textHeight)",
          to: 0,
        },
      },
    },
    {
      id: "slide_down",
      type: "entry",
      properties: {
        translateY: {
          from: "relative(-0.6 * textHeight)",
          to: 0,
        },
      },
    },
    {
      id: "slide_left",
      type: "entry",
      properties: {
        translateX: {
          from: "relative(0.6 * textWidth)",
          to: 0,
        },
      },
    },
    {
      id: "slide_right",
      type: "entry",
      properties: {
        translateX: {
          from: "relative(-0.6 * textWidth)",
          to: 0,
        },
      },
    },
    {
      id: "slide_up_fade",
      type: "entry",
      properties: {
        translateY: {
          from: "relative(0.6 * textHeight)",
          to: 0,
        },
        opacity: {
          from: 0,
          to: 1,
        },
      },
    },
    {
      id: "slide_down_fade",
      type: "entry",
      properties: {
        translateY: {
          from: "relative(-0.6 * textHeight)",
          to: 0,
        },
        opacity: {
          from: 0,
          to: 1,
        },
      },
    },
    {
      id: "slide_left_fade",
      type: "entry",
      properties: {
        translateX: {
          from: "relative(0.6 * textWidth)",
          to: 0,
        },
        opacity: {
          from: 0,
          to: 1,
        },
      },
    },
    {
      id: "slide_right_fade",
      type: "entry",
      properties: {
        translateX: {
          from: "relative(-0.6 * textWidth)",
          to: 0,
        },
        opacity: {
          from: 0,
          to: 1,
        },
      },
    },
    {
      id: "scale_up",
      type: "entry",
      properties: {
        scale: {
          from: 0.9,
          to: 1,
        },
      },
    },
    {
      id: "scale_down",
      type: "entry",
      properties: {
        scale: {
          from: 1.1,
          to: 1,
        },
      },
    },
    {
      id: "scale_up_fade",
      type: "entry",
      properties: {
        scale: {
          from: 0.9,
          to: 1,
        },
        opacity: {
          from: 0,
          to: 1,
        },
      },
    },
    {
      id: "bounce_in",
      type: "entry",
      properties: {
        scale: {
          keyframes: [0.9, 1.08, 1.0],
        },
        opacity: {
          from: 0,
          to: 1,
        },
      },
      duration: 0.45,
      easing: "easeOut",
    },
  ],
};

// Exit Animations
export const exitAnimations: AnimationPresetCollection = {
  version: "1.0",
  defaults: {
    duration: 0.25,
    easing: "easeIn",
  },
  presets: [
    {
      id: "fade_out",
      type: "exit",
      properties: {
        opacity: {
          from: 1,
          to: 0,
        },
      },
    },
    {
      id: "pop_out",
      type: "exit",
      properties: {
        scale: {
          from: 1,
          to: 0.85,
        },
        opacity: {
          from: 1,
          to: 0,
        },
      },
    },
    {
      id: "slide_up_out",
      type: "exit",
      properties: {
        translateY: {
          from: 0,
          to: "relative(-0.6 * textHeight)",
        },
      },
    },
    {
      id: "slide_down_out",
      type: "exit",
      properties: {
        translateY: {
          from: 0,
          to: "relative(0.6 * textHeight)",
        },
      },
    },
    {
      id: "slide_left_out",
      type: "exit",
      properties: {
        translateX: {
          from: 0,
          to: "relative(-0.6 * textWidth)",
        },
      },
    },
    {
      id: "slide_right_out",
      type: "exit",
      properties: {
        translateX: {
          from: 0,
          to: "relative(0.6 * textWidth)",
        },
      },
    },
    {
      id: "slide_up_fade_out",
      type: "exit",
      properties: {
        translateY: {
          from: 0,
          to: "relative(-0.6 * textHeight)",
        },
        opacity: {
          from: 1,
          to: 0,
        },
      },
    },
    {
      id: "slide_down_fade_out",
      type: "exit",
      properties: {
        translateY: {
          from: 0,
          to: "relative(0.6 * textHeight)",
        },
        opacity: {
          from: 1,
          to: 0,
        },
      },
    },
    {
      id: "slide_left_fade_out",
      type: "exit",
      properties: {
        translateX: {
          from: 0,
          to: "relative(-0.6 * textWidth)",
        },
        opacity: {
          from: 1,
          to: 0,
        },
      },
    },
    {
      id: "slide_right_fade_out",
      type: "exit",
      properties: {
        translateX: {
          from: 0,
          to: "relative(0.6 * textWidth)",
        },
        opacity: {
          from: 1,
          to: 0,
        },
      },
    },
    {
      id: "scale_down_out",
      type: "exit",
      properties: {
        scale: {
          from: 1,
          to: 0.9,
        },
      },
    },
    {
      id: "scale_down_fade_out",
      type: "exit",
      properties: {
        scale: {
          from: 1,
          to: 0.9,
        },
        opacity: {
          from: 1,
          to: 0,
        },
      },
    },
  ],
};

// Highlight Animations
export const highlightAnimations: AnimationPresetCollection = {
  version: "1.0",
  defaults: {
    duration: 0.25,
    easing: "easeInOut",
  },
  presets: [
    {
      id: "none",
      type: "highlight",
      properties: {},
    },
    {
      id: "pulse",
      type: "highlight",
      properties: {
        scale: {
          from: 1,
          to: 1.12,
          mode: "oscillate",
        },
      },
    },
    {
      id: "pulse_fade",
      type: "highlight",
      properties: {
        scale: {
          from: 1,
          to: 1.12,
          mode: "oscillate",
        },
        opacity: {
          from: 0.9,
          to: 1,
        },
      },
    },
    {
      id: "scale_up",
      type: "highlight",
      properties: {
        scale: {
          from: 1,
          to: 1.15,
        },
      },
    },
    {
      id: "bounce_soft",
      type: "highlight",
      properties: {
        scale: {
          keyframes: [1.0, 1.18, 1.0],
        },
      },
      duration: 0.3,
      easing: "easeOut",
    },
    {
      id: "fade_emphasis",
      type: "highlight",
      properties: {
        opacity: {
          from: 0.85,
          to: 1,
        },
      },
    },
    {
      id: "color_emphasis",
      type: "highlight",
      properties: {
        colorBlend: {
          from: "base",
          to: "highlight",
        },
      },
    },
    {
      id: "scale_color_pulse",
      type: "highlight",
      properties: {
        scale: {
          from: 1,
          to: 1.12,
          mode: "oscillate",
        },
        colorBlend: {
          from: "base",
          to: "highlight",
        },
      },
    },
  ],
};

// Video Animations
export const videoAnimations: AnimationPresetCollection = {
  version: "1.0",
  defaults: {
    duration: 0.8,
  },
  presets: [
    {
      id: "none",
      type: "video",
      properties: {},
    },
    {
      id: "fade_in",
      type: "video",
      properties: {
        opacity: {
          from: 0,
          to: 1,
        },
      },
    },
    {
      id: "fade_out",
      type: "video",
      properties: {
        opacity: {
          from: 1,
          to: 0,
        },
      },
    },
    {
      id: "fade_in_out",
      type: "video",
      properties: {
        fadeIn: {
          opacity: {
            from: 0,
            to: 1,
          },
        },
        fadeOut: {
          opacity: {
            from: 1,
            to: 0,
          },
        },
      },
    },
  ],
};

// Helper function to get preset by ID
export const getAnimationPreset = (
  type: "entry" | "exit" | "highlight" | "video",
  presetId: string,
): AnimationPreset | undefined => {
  const collection =
    type === "entry"
      ? entryAnimations
      : type === "exit"
        ? exitAnimations
        : type === "highlight"
          ? highlightAnimations
          : videoAnimations;

  return collection.presets.find((preset) => preset.id === presetId);
};
