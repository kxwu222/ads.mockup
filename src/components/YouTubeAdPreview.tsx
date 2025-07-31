import React from 'react';
import { YouTubeAd, PreviewMode } from '../types/ads';
import { YouTubeFrame } from './YouTubeFrame';
import { FeedCard } from './youtube/FeedCard';
import { SearchCard } from './youtube/SearchCard';
import { SuggestedCard } from './youtube/SuggestedCard';

interface YouTubeAdPreviewProps {
  ad: YouTubeAd;
  mode: PreviewMode;
  placement: string;
}

const renderFABButton = (type: string | null | undefined) => {
  if (!type) return null;

  switch (type) {
    case 'button-purple':
      return (
        <button className="flex items-center justify-center w-8 h-8 bg-[#6C2EB9] rounded-full">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M8 5L15 12L8 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      );
    default:
      return (
        <button className="flex items-center space-x-1 border border-black rounded px-3 py-1 text-black font-medium text-base bg-white">
          <span>{type}</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M8 5L15 12L8 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      );
  }
};

export const YouTubeAdPreview: React.FC<YouTubeAdPreviewProps> = ({ ad, mode, placement }) => {
  const isDesktop = mode === 'desktop';

  const desktopFeedPreview = () => (
    <div className="relative w-full h-full bg-[#F9F9F9] overflow-hidden">
      <div className="p-6 overflow-x-auto">
        <div className="grid grid-cols-3 gap-6 min-w-max pr-6">
          <div className="col-span-1">
            <FeedCard ad={ad} />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="col-span-1">
              <div className="bg-gray-200 rounded-lg aspect-video w-full mb-2"></div>
              <div className="flex gap-3 mt-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="bg-gray-200 h-3 w-full mb-1 rounded"></div>
                  <div className="bg-gray-200 h-3 w-3/4 mb-2 rounded"></div>
                  <div className="bg-gray-200 h-2 w-1/2 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const desktopSuggestedPreview = () => (
    <div className="relative w-full h-full bg-[#F9F9F9] overflow-y-hidden">
      <div className="min-w-full h-full flex pt-6">
        {/* Main content */}
        <div className="w-[75%] px-6">
          {/* Video Player */}
          <div className="bg-gray-200 rounded-lg aspect-video w-full mb-3"></div>
          
          {/* Video Title */}
          <div className="mb-3">
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>

          {/* Channel Info Bar */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="h-9 w-24 bg-gray-200 rounded"></div>
          </div>

          {/* Comments Section */}
          <div className="mt-4">
            <div className="h-5 w-28 bg-gray-200 rounded mb-4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-3.5 w-28 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar with ad and suggestions */}
        <div className="w-[25%] pl-2 pr-4">
          {/* Ad Card First */}
          <div className="mb-3">
            <SuggestedCard ad={ad} />
          </div>

          {/* Suggested Videos */}
          <div className="space-y-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-2 group cursor-pointer hover:bg-gray-100 rounded p-1">
                <div className="w-[168px] h-[94px] bg-gray-200 rounded flex-shrink-0"></div>
                <div className="flex-1 min-w-0 py-1">
                  <div className="h-3.5 w-full bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded mb-2"></div>
                  {/* Channel info */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="h-2.5 w-24 bg-gray-200 rounded flex-none"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const desktopSearchPreview = () => (
    <div className="relative w-full h-full bg-[#F9F9F9] overflow-hidden p-6">
      <div className="space-y-0">
        <SearchCard ad={ad} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4 py-3 border-b border-gray-100">
            <div className="bg-gray-200 rounded w-[200px] h-[112px] flex-shrink-0"></div>
            <div className="flex-1">
              <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
              <div className="bg-gray-200 h-3 w-3/4 mb-1 rounded"></div>
              <div className="bg-gray-200 h-3 w-1/2 mb-2 rounded"></div>
              <div className="bg-gray-200 h-2 w-1/4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const mobileFeedPreview = () => (
    <div className="w-full h-full bg-[#F9F9F9] overflow-y-auto space-y-4">
      <FeedCard ad={ad} isMobile />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-40"></div>
      ))}
    </div>
  );

  const mobileInStreamPreview = () => (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Video player */}
      <div className="relative flex-1 bg-black">
        {ad.videoThumbnail ? (
          <img src={ad.videoThumbnail} alt="Video thumbnail" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}

        {/* Top-left overlay: title & channel */}
        <div className="absolute top-0 left-0 p-3 text-white w-4/5">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">{ad.headline}</h3>
          {ad.businessName && (
            <p className="text-xs text-gray-300 mt-0.5">{ad.businessName}</p>
          )}
        </div>

        {/* Top-right share icon placeholder */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-gray-600/70 rounded-full" />

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
          <div className="h-full w-1/4 bg-[#ff0000]" />
        </div>
        {/* Timestamp */}
        <span className="absolute bottom-2 right-2 text-white text-xs">0:00</span>
      </div>

      {/* Ad details card */}
      <div className="bg-white px-4 py-3 space-y-3">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
            {ad.logo ? (
              <img 
                src={ad.logo} 
                alt="" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-snug line-clamp-2">{ad.headline}</h4>
            <p className="text-xs text-gray-600 line-clamp-2">{ad.description}</p>
            <p className="text-[11px] text-gray-500 mt-1">
              <span className="font-medium">Sponsored</span>
              {ad.businessName && <> · {ad.businessName}</>}
            </p>
          </div>
          {/* 3-dot menu */}
          <div className="w-5 h-5 bg-gray-300 rounded-full ml-2" />
        </div>

        {/* CTA buttons */}
        <div className="flex space-x-3 pt-1">
          <button className="flex-1 text-blue-600 border border-blue-600 rounded-full py-1 text-sm font-medium">
            Watch
          </button>
          <button className="flex-1 text-white bg-blue-600 rounded-full py-1 text-sm font-medium">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );

  const mobileShortsPreview = () => (
    <div className="w-full h-full bg-black relative flex items-center justify-center">
      {ad.videoThumbnail ? (
        <img src={ad.videoThumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-800"></div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="flex gap-3 mb-2">
          {/* Logo */}
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
              <div className="w-10 h-10 bg-gray-600/50 rounded-full" />
            )}
          </div>
          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{ad.headline}</h3>
            <p className="text-xs text-gray-200 line-clamp-2">{ad.description}</p>
          </div>
        </div>
        {renderFABButton(ad.callToAction)}
      </div>
    </div>
  );

  const renderDesktopPreview = () => {
    switch (placement) {
      case 'feed':
      default:
        return desktopFeedPreview();
      case 'suggested':
        return desktopSuggestedPreview();
      case 'search':
        return desktopSearchPreview();
    }
  };

  const renderMobilePreview = () => {
    switch (placement) {
      case 'feed':
      default:
        return mobileFeedPreview();
      case 'in-feed':
        return mobileInStreamPreview();
      case 'shorts':
        return mobileShortsPreview();
    }
  };

  return isDesktop ? (
    <YouTubeFrame>{renderDesktopPreview()}</YouTubeFrame>
  ) : (
    <YouTubeFrame style={{ width: 340, height: 700 }} isMobile>
      {renderMobilePreview()}
    </YouTubeFrame>
  );
};
