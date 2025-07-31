import React from 'react';
import { YouTubeAd } from '../../types/ads';

interface FeedCardProps {
  ad: YouTubeAd;
  isMobile?: boolean;
}

export const FeedCard: React.FC<FeedCardProps> = ({ ad, isMobile }) => {
  const cardClasses = isMobile 
    ? "bg-white w-full" 
    : "bg-white rounded shadow-sm w-full max-w-[340px]";

  const thumbnailStyle = isMobile 
    ? { aspectRatio: ad.thumbnailAspectRatio || '16/9' }
    : { aspectRatio: '16/9' }; // Always 16:9 for desktop

  return (
    <div className={cardClasses}>
      {/* Video thumbnail with overlay icon */}
      <div className="relative">
        {ad.videoThumbnail ? (
          ad.videoThumbnail.startsWith('data:video') ? (
            <video
              src={ad.videoThumbnail}
              className={`w-full object-cover ${!isMobile ? 'rounded-t' : ''}`}
              style={thumbnailStyle}
              controls
              muted
              loop
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img 
              src={ad.videoThumbnail} 
              alt="Video thumbnail" 
              className={`w-full object-cover ${!isMobile ? 'rounded-t' : ''}`}
              style={thumbnailStyle}
            />
          )
        ) : (
          <div 
            className={`w-full bg-gray-200 ${!isMobile ? 'rounded-t' : ''} flex items-center justify-center`}
            style={thumbnailStyle}
          >
            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
        {/* Info icon - top right */}
        <div className="absolute top-2 right-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 15 15" 
            className="w-4 h-4 text-white" 
            fill="currentColor"
          >
            <path d="M7.5 1.5a6 6 0 100 12 6 6 0 100-12m0 1a5 5 0 110 10 5 5 0 110-10zM6.625 11h1.75V6.5h-1.75zM7.5 3.75a1 1 0 100 2 1 1 0 100-2z"/>
          </svg>
        </div>

        {/* Desktop open-in-new icon only */}
        {!isMobile && (
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-black bg-opacity-70 rounded flex items-center justify-center">
            <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
              <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
          </div>
        )}

        {/* Mobile blue banner */}
        {isMobile && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#f2f8ff] px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-[#065fd4] font-medium">
              {ad.callToAction || 'Learn more'}
            </span>
            <svg width="12" height="12" fill="#065fd4" viewBox="0 0 24 24">
              <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex gap-3">
          {/* Left column - Logo */}
          <div className="flex-shrink-0">
            {ad.logo ? (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={ad.logo} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-full" />
            )}
          </div>

          {/* Right column - Content */}
          <div className="flex-1 min-w-0">
            {/* Headline and description */}
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
              {ad.headline}
            </h3>
            <p className="text-xs text-gray-700 line-clamp-2 mb-2">
              {ad.description}
            </p>

            {/* Sponsored and channel name */}
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium text-black">Sponsored</span>
              {ad.businessName && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">{ad.businessName}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 