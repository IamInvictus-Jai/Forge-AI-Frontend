import React, { useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { UI_COPY, THEME_CLASSES } from '../constants';

interface VideoPreviewProps {
  videoUrl: string;
  fileName: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl, fileName }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play muted on load to show it works, then pause
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setTimeout(() => {
          if (videoRef.current) videoRef.current.pause();
        }, 1500);
      }).catch(() => {
        // Autoplay prevented, standard behavior
      });
    }
  }, [videoUrl]);

  return (
    <div className={`w-full overflow-hidden rounded-xl ${THEME_CLASSES.cardBg} animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            {UI_COPY.preview.label}
          </span>
        </div>
        <span className="text-xs text-neutral-500 truncate max-w-[150px]">{fileName}</span>
      </div>

      {/* Video Area */}
      <div className="relative aspect-video bg-black group">
        <video 
          ref={videoRef}
          src={videoUrl} 
          className="w-full h-full object-contain"
          controls
          muted // Muted initially to allow autoplay preview
        />
        
        {/* Overlay Decoration (Optional, only visible when paused/hovered ideally, but kept simple for now) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
          {/* Controls are native, so we don't need a custom play button overlay blocking interaction */}
        </div>
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2 bg-neutral-900/50 flex items-center justify-center border-t border-white/5">
        <span className="text-xs text-green-400 flex items-center gap-1.5">
          <Play size={10} fill="currentColor" />
          {UI_COPY.preview.statusReady}
        </span>
      </div>
    </div>
  );
};

export default VideoPreview;