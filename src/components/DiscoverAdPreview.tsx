import React from 'react';
import { DiscoverAd, PreviewMode } from '../types/ads';
import { MD3Frame } from './MD3Frame';
import { GoogleBar } from './GoogleBar';

interface DiscoverAdPreviewProps {
  ad: DiscoverAd;
  mode: PreviewMode;
}

const renderFABButton = (type: string) => {
    // This should be extracted to a shared utility
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

export const DiscoverAdPreview: React.FC<DiscoverAdPreviewProps> = ({ ad, mode }) => {
  const isDesktop = mode === 'desktop';

  if (isDesktop) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex items-center bg-blue-50 rounded-lg px-6 py-4 mx-auto">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-blue-500 mr-2">
            <circle cx="12" cy="12" r="12" fill="#E3EDFC" />
            <path d="M12 8v4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="#2563EB" />
          </svg>
          <span className="text-gray-700 text-base font-medium">Discover ads are not available on desktop devices</span>
        </div>
      </div>
    );
  }

  const DiscoverCard = () => {
    const aspectRatio = ad.imageAspectRatio || '16/9';
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-[340px] border border-gray-100">
        {ad.image && (
          <img src={ad.image} alt="Discover ad" className="w-full object-cover" style={{ aspectRatio }} />
        )}
        <div className="p-4">
          <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-2">{ad.headline}</h3>
          {/* Sponsored row */}
          <div className="font-bold text-xs text-gray-900 mb-1">Sponsored</div>
          {/* Logo + Business Name + Icons row */}
          <div className="flex items-center justify-between mb-1 gap-2">
            <div className="flex items-center gap-1">
              {ad.logo && (
                <img src={ad.logo} alt="Logo" className="w-5 h-5 object-cover rounded-full" />
              )}
              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">{ad.businessName}</span>
            </div>
            <div className="flex items-center gap-3 ml-2">
              {/* Heart */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.293l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.035l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
              {/* Share (PNG) */}
              <img src="https://tpc.googlesyndication.com/pagead/gadgets/discover_ads/share_icon.png" alt="Share" className="h-4 w-4" />
              {/* Menu (Material Symbols Outlined: more_vert) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobilePreview = () => (
    <div className="w-full h-full bg-white flex flex-col relative">
      <div className="w-7 h-7 rounded-full bg-gray-200 absolute right-4 top-4 z-10" />
      <div className="flex flex-col items-center pt-7 pb-2 bg-white" style={{ marginTop: '60px' }}>
        <GoogleBar showMenu={false} isDiscover={true} />
      </div>
      <div className="flex-1 flex items-start justify-center p-2 pt-2">
        <DiscoverCard />
      </div>
    </div>
  );

  return (
    <MD3Frame mode={mode} style={isDesktop ? { width: 650, height: 418 } : { width: 340, height: 700 }}>
      {isDesktop ? null : renderMobilePreview()}
    </MD3Frame>
  );
};