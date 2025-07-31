import React from 'react';
import { SearchAd, PreviewMode } from '../types/ads';
import { MD3Frame } from './MD3Frame';
import { GoogleBar } from './GoogleBar';

interface SearchAdPreviewProps {
  ad: SearchAd;
  mode: PreviewMode;
  placement: string;
}

// Mock advertiser info and sitelinks for preview
const advertiser = {
  name: 'University of Sheffield',
  url: 'www.sheffield.ac.uk/',
};
// Remove the local sitelinks array

export const SearchAdPreview: React.FC<SearchAdPreviewProps> = ({ ad, mode, placement }) => {
  const isDesktop = mode === 'desktop';
  // Use ad.sitelinks or fallback
  const sitelinks = ad.sitelinks && ad.sitelinks.length > 0
    ? ad.sitelinks
    : [
        { text: 'Discover Sheffield' },
        { text: 'Get 1:1 advice' },
        { text: 'Attend an event' },
      ];

  // --- Ad Card Layout (updated) ---
  const adCard = (
    <div
      className={`bg-white border border-gray-100 w-full ${isDesktop ? 'max-w-[650px]' : 'max-w-[340px]'} flex flex-col items-start p-4`}
      style={{ borderRadius: 12 }}
    >
      <div className="text-xs font-bold text-gray-700 mb-1">Sponsored</div>
      <div className="flex items-center mb-2">
        <div className="w-6 h-6 rounded-full bg-gray-300 mr-2" />
        <div>
          <div className="font-semibold text-sm text-gray-900 leading-tight">{advertiser.name}</div>
          <div className="text-xs text-gray-500">{ad.displayUrl || advertiser.url}</div>
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="flex-1 pr-2">
          <div className="text-blue-800 text-base md:text-lg font-medium leading-tight mb-1 cursor-pointer hover:underline">
            {ad.headline || 'Ad headline goes here'}
          </div>
          <div className={`text-sm text-gray-800 mb-2 ${isDesktop ? 'flex flex-wrap line-clamp-2' : 'block whitespace-normal line-clamp-3'}`}
            style={{ display: '-webkit-box', WebkitLineClamp: isDesktop ? 2 : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {ad.description || 'Ad description goes here.'}
          </div>
        </div>
        {placement === 'with-image' && ad.image && (
          <img src={ad.image} alt="Ad" className="w-16 h-16 object-cover rounded ml-2" />
        )}
      </div>
      {/* Sitelinks at the bottom as fake buttons */}
      <div className={`flex ${isDesktop ? 'flex-wrap gap-2' : 'flex-nowrap overflow-x-auto gap-2 scrollbar-hide'} mt-2 w-full`}>
        {sitelinks.map((link, i) => (
          isDesktop ? (
            <span
              key={i}
              className="text-[#1A73E8] text-xs font-medium cursor-pointer hover:underline whitespace-nowrap px-1"
              style={{ minWidth: 120, textAlign: 'center', border: 'none', background: 'none' }}
            >
              {link.text}
            </span>
          ) : (
            <span
              key={i}
              className="border border-[#1A73E8] bg-white text-[#1A73E8] py-1 rounded-full text-xs font-medium hover:bg-blue-50 transition whitespace-nowrap cursor-pointer select-none"
              style={{ minWidth: 120, textAlign: 'center' }}
            >
              {link.text}
            </span>
          )
        ))}
      </div>
    </div>
  );

  return (
    <MD3Frame mode={mode} style={isDesktop ? { width: 650, height: 418 } : { width: 340, height: 700 }}>
      <div className="w-full h-full flex flex-col items-center">
        <GoogleBar isDesktop={isDesktop} />
        <div className="flex-1 flex items-start justify-center w-full">
          {adCard}
        </div>
      </div>
    </MD3Frame>
  );
};

// Add font-google to your Tailwind config for the Google logo if not present.
