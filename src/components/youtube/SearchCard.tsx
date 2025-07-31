import React from 'react';
import { YouTubeAd } from '../../types/ads';

interface SearchCardProps {
  ad: YouTubeAd;
}

export const SearchCard: React.FC<SearchCardProps> = ({ ad }) => {
  return (
    <div className="flex items-start w-full py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Video thumbnail */}
      <div className="relative flex-shrink-0 mr-4">
        {ad.videoThumbnail ? (
          ad.videoThumbnail.startsWith('data:video') ? (
            <video
              src={ad.videoThumbnail}
              className="w-[200px] h-[112px] object-cover rounded"
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
              className="w-[200px] h-[112px] object-cover rounded" 
            />
          )
        ) : (
          <div className="w-[200px] h-[112px] bg-gray-200 rounded flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
        {/* Open in new icon */}
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-black bg-opacity-70 rounded flex items-center justify-center">
          <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
            <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative">
        {/* Info icon - top right */}
        <div className="absolute top-0 right-0">
          <button className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" className="w-4 h-4" fill="currentColor">
              <path d="M7.5 1.5a6 6 0 100 12 6 6 0 100-12m0 1a5 5 0 110 10 5 5 0 110-10zM6.625 11h1.75V6.5h-1.75zM7.5 3.75a1 1 0 100 2 1 1 0 100-2z"/>
            </svg>
          </button>
        </div>

        {/* Headline */}
        <h3 className="font-semibold text-base text-gray-900 line-clamp-1 mr-12 mb-1">
          {ad.headline}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-2 mb-2 mr-12">
          {ad.description}
        </p>
        
        {/* Sponsored info */}
        <div className="text-sm text-gray-500">
          <span className="font-medium">Sponsored</span>
          {ad.businessName && (
            <>
              <span className="mx-1">·</span>
              <span>{ad.businessName}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 