import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: string;
  isLogo?: boolean;
  allowVideo?: boolean;
  autoDetect?: boolean; // New prop for auto-detection
  customPlaceholder?: string; // New prop for custom placeholder text
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  label, 
  value, 
  onChange, 
  aspectRatio,
  isLogo = false,
  allowVideo = false,
  autoDetect = false, // Default to false for backward compatibility
  customPlaceholder // Add customPlaceholder to props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Auto-detection logic
      if (autoDetect) {
        const isVideo = file.type.startsWith('video/') || 
                       file.name.match(/\.(mp4|mov|avi|webm|mkv)$/i);
        const isImage = file.type.startsWith('image/') || 
                       file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        
        if (!isVideo && !isImage) {
          alert('Please upload a valid image or video file.');
          return;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert aspect ratio format from "16/9" to "16:9" for display
  const displayRatio = aspectRatio?.replace('/', ':');

  const containerStyle = {
    width: '200px',
    height: '200px',
    minWidth: '200px',
    minHeight: '200px',
    maxWidth: '250px',
    maxHeight: '250px'
  };

  const renderPlaceholder = () => {
    let placeholderText = "Upload image";
    
    if (customPlaceholder) {
      placeholderText = customPlaceholder;
    } else if (autoDetect) {
      placeholderText = "Upload image or video";
    } else if (allowVideo) {
      placeholderText = "Upload video";
    } else if (isLogo) {
      placeholderText = "Upload image";
    }

    return (
      <div className="flex flex-col items-center justify-center text-gray-500 py-4 px-2">
        <svg 
          className="w-8 h-8 mb-2 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75v-2.25m-3-7.5L12 3m0 0L6 9m6-6v12" 
          />
        </svg>
        <span className="text-sm font-medium text-gray-600 mb-1">
          {placeholderText}
        </span>
        {/* Remove suggested ratio for all except logo */}
        {isLogo && (
          <span className="text-xs text-gray-500">
            Suggested ratio {displayRatio}
          </span>
        )}
      </div>
    );
  };

  // Determine accept attribute based on props
  const getAcceptAttribute = () => {
    if (autoDetect) {
      return 'image/*,video/*';
    } else if (allowVideo) {
      return 'image/*,video/*';
    } else if (isLogo) {
      return 'image/*';
    } else {
      return 'image/*';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        onClick={handleClick}
        className={`
          relative 
          border-[3px] border-dashed 
          ${value ? 'border-gray-200' : 'border-gray-300'} 
          rounded-lg cursor-pointer 
          hover:border-gray-400 
          transition-all duration-200
          bg-gray-50 hover:bg-gray-100/50
          flex-shrink-0
        `}
        style={containerStyle}
      >
        {value ? (
          <>
            {value.startsWith('data:video') ? (
              <video
                src={value}
                className="absolute inset-0 w-full h-full object-cover rounded-md"
                muted
                loop
                playsInline
                controls
                style={{ background: '#000' }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={value}
                alt="Uploaded"
                className="absolute inset-0 w-full h-full object-cover rounded-md"
              />
            )}
            <button
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1.5 shadow-sm hover:shadow transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {renderPlaceholder()}
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptAttribute()}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
