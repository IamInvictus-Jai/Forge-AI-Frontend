// Centralized API client for backend communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined in environment variables");
}

export interface VideoMetadata {
  video_url: string;
  width: number;
  height: number;
  duration: number;
  aspectRatio: string;
}

export interface CreateProjectResponse {
  jobId: string;
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export const createProject = async (
  videoMetadata: VideoMetadata,
): Promise<CreateProjectResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingest/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_url: videoMetadata.video_url,
        metadata: {
          width: videoMetadata.width,
          height: videoMetadata.height,
          duration: videoMetadata.duration,
          aspectRatio: videoMetadata.aspectRatio,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `Server error: ${response.status}`,
        response.status,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    // Network or other errors
    throw new APIError(
      "Failed to connect to server. Please check your connection.",
    );
  }
};
