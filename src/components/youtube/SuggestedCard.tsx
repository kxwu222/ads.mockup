import React from "react";
import { YouTubeAd } from "../../types/ads";
import { ExternalLink } from "lucide-react";

interface SuggestedCardProps {
  ad: YouTubeAd;
  showDescription?: boolean;
}

export const SuggestedCard: React.FC<SuggestedCardProps> = ({ ad, showDescription = true }) => {
  console.log('SuggestedCard ad:', ad);
  return (
    <div className="w-[402px] h-[180px] flex flex-row font-roboto">
      {/* Video thumbnail */}
      <div className="relative w-[168px] h-[180px] flex-shrink-0 mr-3">
        {ad.videoThumbnail ? (
          ad.videoThumbnail.startsWith('data:video') ? (
            <video
              src={ad.videoThumbnail}
              className="w-full h-full absolute top-0 left-0 rounded-lg object-cover"
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
              className="w-full h-full absolute top-0 left-0 rounded-lg object-cover" 
            />
          )
        ) : (
          <div className="w-full h-full absolute top-0 left-0 rounded-lg overflow-clip bg-gray-100 flex items-center justify-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col py-1">
        {/* Headline */}
        <h3 className="font-medium text-[15px] text-gray-900 leading-5 mb-1">
          {ad.headline}
        </h3>
        
        {/* Description */}
        {showDescription && (
          <p className="text-[13px] text-gray-600 mb-2 line-clamp-2">
            {ad.description}
          </p>
        )}

        {/* Sponsor and Channel info */}
        <div className="flex justify-between items-center mb-2 text-[13px] text-gray-600 gap-2">
          <span>Sponsored</span>
          <span>{ad.businessName}</span>
        </div>

        {/* Learn more button */}
        <div className="flex">
          <button className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#4285f4] hover:bg-[#3367d6] text-white rounded-full text-sm font-medium">
            Learn more
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};
