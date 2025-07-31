import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: string;
  isLogo?: boolean;
  allowVideo?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  label, 
  value, 
  onChange, 
  aspectRatio,
  isLogo = false,
  allowVideo = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    minHeight: '200px',
    ...(aspectRatio ? { aspectRatio } : {})
  };

  const renderPlaceholder = () => {
    return (
      <div className="flex flex-col items-center justify-center text-gray-500 py-8 px-4">
        <svg 
          className="w-10 h-10 mb-3 text-gray-400" 
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
        <span className="text-base font-small text-gray-600 mb-1">
          {isLogo ? "Upload image" : allowVideo ? "Upload image or video" : "Upload image"}
        </span>
        {/* Remove suggested ratio for all except logo */}
        {isLogo && (
          <span className="text-sm text-gray-500">
            Suggested ratio {displayRatio}
          </span>
        )}
      </div>
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        onClick={handleClick}
        className={`
          relative w-full 
          border-[3px] border-dashed 
          ${value ? 'border-gray-200' : 'border-gray-300'} 
          rounded-lg cursor-pointer 
          hover:border-gray-400 
          transition-all duration-200
          bg-gray-50 hover:bg-gray-100/50
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
        accept={isLogo ? 'image/*' : allowVideo ? 'image/*,video/*' : 'image/*'}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
