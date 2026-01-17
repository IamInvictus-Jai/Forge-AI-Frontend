// Mock config data - simulates backend API response
// TODO: Replace with actual API call when backend is ready

export interface VideoConfig {
  id: string;
  meta: {
    schemaVersion: string;
    createdAt: string;
    duration: number;
    timeUnit: string;
  };
  source: {
    video: {
      id: string;
      url: string;
      width: number;
      height: number;
      aspectRatio: string;
      duration: number;
    };
  };
  timeline: {
    start: number;
    end: number;
  };
  tracks: {
    video: {
      animation: {
        presetId: string;
        fadeIn?: {
          start: number;
          duration: number;
        };
        fadeOut?: {
          start: number;
          duration: number;
        };
      };
    };
    text: {
      globalStyle: {
        fontFamily: string;
        fontSize: number;
        fontWeight: number;
        color: string;
        background: string;
        padding: number[];
        borderRadius: number;
        position: {
          anchor: string;
          offsetY: number;
        };
      };
      highlightStyle: {
        color: string;
        scale: number;
        fontWeight: number;
      };
      animation: {
        entry: {
          presetId: string;
          duration?: number;
        };
        exit: {
          presetId: string;
          duration?: number;
        };
        highlight: {
          presetId: string;
          duration?: number;
        };
      };
      captions: Array<{
        id: string;
        text: string;
        start: number;
        end: number;
        word_count: number;
        duration_ms: number;
      }>;
      highlights: Array<{
        captionId: string;
        wordStartIndex: number;
        wordEndIndex: number;
      }>;
    };
    audio: any[];
  };
  settings: {
    autoCaptions: boolean;
    dynamicAnimations: boolean;
    highlightKeywords: boolean;
    introFadeIn: boolean;
    outroFadeOut: boolean;
  };
  export: {
    resolution: {
      width: number;
      height: number;
    };
    format: string;
    burnCaptions: boolean;
  };
}

export const mockConfig: VideoConfig = {
  id: "test-project-id",
  meta: {
    schemaVersion: "1.1",
    createdAt: "2023-08-15T14:30:00Z",
    duration: 20.8,
    timeUnit: "seconds",
  },
  source: {
    video: {
      id: "video_001",
      url: "https://res.cloudinary.com/dcpcbpfgg/video/upload/v1768684294/pe1lguv498kngizeqtg3.mp4",
      width: 1920,
      height: 1080,
      aspectRatio: "16:9",
      duration: 20.08,
    },
  },
  timeline: {
    start: 0,
    end: 20.8,
  },
  tracks: {
    video: {
      animation: {
        presetId: "fade_in_out",
        fadeIn: {
          start: 0.0,
          duration: 0.8,
        },
        fadeOut: {
          start: 18.5,
          duration: 2,
        },
      },
    },
    text: {
      globalStyle: {
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: 700,
        color: "#ffffff",
        background: "rgba(0,0,0,0.45)",
        padding: [12, 16],
        borderRadius: 12,
        position: {
          anchor: "bottom_center",
          offsetY: -50,
        },
      },
      highlightStyle: {
        color: "#ffd166",
        scale: 1.03,
        fontWeight: 800,
      },
      animation: {
        entry: {
          presetId: "slide_up_fade",
          duration: 0.2, // Override default 0.4s
        },
        exit: {
          presetId: "fade_out",
          duration: 0.2, // Override default 0.25s
        },
        highlight: {
          presetId: "none",
          duration: 0.4, // Override default 0.25s
        },
      },
      captions: [
        {
          id: "cap_001",
          text: "The age between 16 to",
          start: 0.08,
          end: 1.28,
          word_count: 5,
          duration_ms: 1200,
        },
        {
          id: "cap_002",
          text: "22 is one of the",
          start: 1.28,
          end: 2.44,
          word_count: 5,
          duration_ms: 1160,
        },
        {
          id: "cap_003",
          text: "most confusing,",
          start: 2.44,
          end: 3.28,
          word_count: 2,
          duration_ms: 840,
        },
        {
          id: "cap_004",
          text: "yet deciding phases of our",
          start: 3.36,
          end: 4.76,
          word_count: 5,
          duration_ms: 1400,
        },
        {
          id: "cap_005",
          text: "life. It is a time",
          start: 4.76,
          end: 5.88,
          word_count: 5,
          duration_ms: 1120,
        },
        {
          id: "cap_006",
          text: "filled with doubt,",
          start: 5.88,
          end: 6.72,
          word_count: 3,
          duration_ms: 840,
        },
        {
          id: "cap_007",
          text: "fear, stress,",
          start: 6.8,
          end: 7.92,
          word_count: 2,
          duration_ms: 1120,
        },
        {
          id: "cap_008",
          text: "anxiety, and even moments of",
          start: 8.08,
          end: 9.88,
          word_count: 5,
          duration_ms: 1800,
        },
        {
          id: "cap_009",
          text: "depression. But it is also",
          start: 9.88,
          end: 11.68,
          word_count: 5,
          duration_ms: 1800,
        },
        {
          id: "cap_010",
          text: "the time.",
          start: 12.0,
          end: 12.56,
          word_count: 2,
          duration_ms: 560,
        },
        {
          id: "cap_011",
          text: "But it is also the",
          start: 13.36,
          end: 14.48,
          word_count: 5,
          duration_ms: 1120,
        },
        {
          id: "cap_012",
          text: "time",
          start: 14.48,
          end: 14.8,
          word_count: 1,
          duration_ms: 320,
        },
        {
          id: "cap_013",
          text: "when we dream big,",
          start: 15.12,
          end: 16.399,
          word_count: 4,
          duration_ms: 1279,
        },
        {
          id: "cap_014",
          text: "fail hard,",
          start: 16.4,
          end: 17.12,
          word_count: 2,
          duration_ms: 720,
        },
        {
          id: "cap_015",
          text: "learn fast,",
          start: 17.12,
          end: 17.84,
          word_count: 2,
          duration_ms: 720,
        },
        {
          id: "cap_016",
          text: "and grow more than",
          start: 17.84,
          end: 19.28,
          word_count: 4,
          duration_ms: 1440,
        },
        {
          id: "cap_017",
          text: "ever.",
          start: 19.68,
          end: 20.08,
          word_count: 1,
          duration_ms: 400,
        },
      ],
      highlights: [
        {
          captionId: "cap_001",
          wordStartIndex: 1,
          wordEndIndex: 2,
        },
        {
          captionId: "cap_003",
          wordStartIndex: 0,
          wordEndIndex: 0,
        },
        {
          captionId: "cap_004",
          wordStartIndex: 1,
          wordEndIndex: 1,
        },
        {
          captionId: "cap_006",
          wordStartIndex: 2,
          wordEndIndex: 2,
        },
        {
          captionId: "cap_007",
          wordStartIndex: 0,
          wordEndIndex: 1,
        },
        {
          captionId: "cap_008",
          wordStartIndex: 0,
          wordEndIndex: 0,
        },
        {
          captionId: "cap_013",
          wordStartIndex: 2,
          wordEndIndex: 3,
        },
        {
          captionId: "cap_014",
          wordStartIndex: 0,
          wordEndIndex: 1,
        },
        {
          captionId: "cap_015",
          wordStartIndex: 0,
          wordEndIndex: 1,
        },
        {
          captionId: "cap_016",
          wordStartIndex: 1,
          wordEndIndex: 1,
        },
      ],
    },
    audio: [],
  },
  settings: {
    autoCaptions: true,
    dynamicAnimations: true,
    highlightKeywords: true,
    introFadeIn: true,
    outroFadeOut: true,
  },
  export: {
    resolution: {
      width: 1920,
      height: 1080,
    },
    format: "mp4",
    burnCaptions: true,
  },
};
