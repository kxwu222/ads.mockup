import React, { useRef } from 'react';
import { Info } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: string;
  isLogo?: boolean;
  allowVideo?: boolean;
  autoDetect?: boolean;
  customPlaceholder?: string;
  labelClassName?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  aspectRatio,
  isLogo = false,
  allowVideo = false,
  autoDetect = false,
  customPlaceholder,
  labelClassName
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (autoDetect) {
        const isVideo = file.type.startsWith('video/') ||
          file.name.match(/\.(mp4|mov|avi|webm|mkv)$/i);
        const isImage = file.type.startsWith('image/') ||
          file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);

        if (!isVideo && !isImage) {
          alert('Please upload a valid image or video file.');
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (!result) {
          console.error('Failed to read file');
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }

        // If it's an image, resize it
        if (file.type.startsWith('image/')) {
          const img = new Image();
          img.onerror = () => {
            console.error('Failed to load image');
            // Reset file input
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          };
          img.src = result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDim = 600; // Changed from 800 to 600

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              // Compress to JPEG 0.7
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // Changed from 0.8 to 0.7
              console.log('ImageUploader: Calling onChange with image data URL, length:', compressedDataUrl.length);
              onChange(compressedDataUrl);
            } else {
              console.log('ImageUploader: Canvas context not available, using original result');
              onChange(result);
            }
            // Reset file input after successful upload
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          };
        } else {
          // For videos or other types, use as is (can't easily resize video in browser)
          console.log('ImageUploader: Calling onChange with video data URL, length:', result.length);
          onChange(result);
          // Reset file input after successful upload
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      reader.onerror = () => {
        console.error('Failed to read file');
        alert('Failed to read file. Please try again.');
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
        {isLogo && (
          <span className="text-xs text-gray-500">
            Suggested ratio {displayRatio}
          </span>
        )}
      </div>
    );
  };

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
      <div className="flex items-center mb-2">
        <label className={`block text-sm font-medium text-gray-700 ${labelClassName || ''}`}>
          {label}
        </label>
        {(allowVideo || autoDetect) && (
          <div className="group relative ml-2">
            <Info className="w-4 h-4 text-gray-400" />
            <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-max max-w-xs pointer-events-none z-10 shadow-lg">
              If using video, recommended duration is 9-15s
              <div className="absolute top-full left-1.5 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
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
        role="button"
        tabIndex={0}
        aria-label={customPlaceholder ? customPlaceholder : (autoDetect ? 'Upload image or video' : (allowVideo ? 'Upload video' : 'Upload image'))}
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
