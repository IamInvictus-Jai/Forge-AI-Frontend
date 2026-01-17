import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileVideo, AlertCircle } from 'lucide-react';
import { UI_COPY, THEME_CLASSES } from '../constants';
import Button from './Button';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  status: 'idle' | 'uploading' | 'processing' | 'error' | 'ready';
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, status }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const validateAndUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska'];
    
    // Simple MIME type check (can be expanded)
    if (validTypes.some(type => file.type.includes(type) || file.type === '')) {
       onFileSelect(file);
    } else {
       alert("Please upload a valid video file (MP4, MOV, WebM).");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    validateAndUpload(e.dataTransfer.files);
  }, [onFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndUpload(e.target.files);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const isLoading = status === 'uploading' || status === 'processing';

  return (
    <div 
      className={`
        relative group w-full p-8 md:p-12 rounded-2xl border-2 border-dashed transition-all duration-300 ease-out
        flex flex-col items-center justify-center text-center
        ${isDragActive 
          ? 'border-orange-500 bg-orange-500/5 scale-[1.01]' 
          : 'border-neutral-700 bg-neutral-900/30 hover:border-neutral-600 hover:bg-neutral-900/50'
        }
        ${status === 'error' ? 'border-red-500/50 bg-red-500/5' : ''}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        ref={inputRef}
        type="file" 
        className="hidden" 
        accept="video/mp4,video/quicktime,video/webm"
        onChange={handleInputChange}
        disabled={isLoading}
      />

      {/* Icon */}
      <div className={`mb-6 p-4 rounded-full transition-transform duration-300 ${isDragActive ? 'scale-110' : 'scale-100'} ${status === 'error' ? 'bg-red-500/10' : 'bg-neutral-800'}`}>
        {status === 'error' ? (
          <AlertCircle className="w-8 h-8 text-red-500" />
        ) : (
          <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-orange-500' : 'text-neutral-400'}`} />
        )}
      </div>

      {/* Main Action */}
      <Button 
        onClick={handleButtonClick}
        isLoading={isLoading}
        loadingText={status === 'uploading' ? UI_COPY.states.uploading : UI_COPY.states.processing}
        variant="primary"
        className="mb-4 min-w-[200px]"
      >
        {status === 'error' ? 'Try Again' : UI_COPY.upload.buttonPrimary}
      </Button>

      {/* Supporting Text */}
      <div className="space-y-1">
        {status === 'error' ? (
           <p className="text-sm text-red-400 font-medium">{UI_COPY.states.error}</p>
        ) : (
          <>
            <p className="text-sm text-neutral-400 font-medium">{UI_COPY.upload.supportingText}</p>
            <p className="text-xs text-neutral-500">{UI_COPY.upload.privacyText}</p>
          </>
        )}
      </div>

      {/* Drag Hint */}
      {!isLoading && status !== 'error' && (
        <div className="mt-8 flex items-center gap-3 w-full max-w-xs opacity-60">
           <div className="h-px bg-neutral-700 flex-1"></div>
           <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">OR</span>
           <div className="h-px bg-neutral-700 flex-1"></div>
        </div>
      )}
      
      {!isLoading && status !== 'error' && (
         <p className="mt-3 text-sm text-neutral-500 group-hover:text-neutral-400 transition-colors">
            {UI_COPY.upload.dragHint}
         </p>
      )}
    </div>
  );
};

export default UploadZone;