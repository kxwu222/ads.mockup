import React from 'react';
import { FacebookAd } from '../types/ads';
import { PreviewMode } from '../types/ads';


interface FacebookAdPreviewProps {
  ad: FacebookAd;
  mode: PreviewMode;
  placement: '4:5' | '1.91:1' | '1:1';
  staticImage?: string;
}

export const FacebookAdPreview: React.FC<FacebookAdPreviewProps> = ({
  ad,
  mode,
  placement,
  staticImage,
}) => {
  // Adjust container width based on aspect ratio
  const getContainerWidth = () => {
    if (mode === 'mobile') {
      return 'w-80'; // Fixed 320px width for all ratios on mobile
    } else {
      // Desktop - adjust based on aspect ratio
      if (placement === '4:5') {
        return 'max-w-sm';
      } else if (placement === '1:1') {
        return 'max-w-md';
      } else {
        // 1.91:1 ratio - wider container
        return 'max-w-lg';
      }
    }
  };

  return (
    <div
      className={`${getContainerWidth()} mx-auto bg-white text-black overflow-hidden flex flex-col relative font-sans border border-gray-200 shadow-2xl`}
      style={{
        aspectRatio: '1179 / 2556',
      }}
    >
      {/* Status Bar (4.19%) */}
      <div
        className="w-full flex items-center px-6 z-20 flex-shrink-0"
        style={{ height: '4.19%' }}
      >
        <div className="text-sm font-semibold">23:59</div>
        <div className="flex-1"></div>
        <div className="flex space-x-2">
          {/* Battery/Wifi icons mock */}
          <div className="w-4 h-4 bg-black rounded-sm opacity-20"></div>
          <div className="w-4 h-4 bg-black rounded-sm opacity-20"></div>
        </div>
      </div>

      {/* Facebook App Header */}
      <div className="w-full h-10 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="font-bold text-xl text-[#1877F2] tracking-tight">facebook</div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </div>
        </div>
      </div>

      {/* Feed Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F0F2F5] flex flex-col">
        {/* The Ad Post */}
        <div className="bg-white mb-2">
          {/* Facebook Header */}
          <div className="flex items-center p-3">
            <img src={'/icon128.png'} alt="Logo" className="w-10 h-10 rounded-full bg-[#440099] border border-gray-100 flex-shrink-0" />
            <div className="ml-2 flex-1">
              <div className="text-sm font-bold text-gray-900 leading-tight">{ad.businessName || 'username'}</div>
              <div className="text-xs text-gray-500 flex items-center mt-0.5">
                <span>Sponsored</span>
                <span className="mx-1">·</span>
                <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" /></svg>
              </div>
            </div>
            <button className="text-gray-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
            </button>
          </div>

          {/* Ad Description - Above Image */}
          <div className="px-3 pb-2">
            <p className="text-sm text-gray-900">{ad.description || 'Your Facebook ad description goes here.'}</p>
          </div>

          {/* Ad Image/Video */}
          <div
            className="relative overflow-hidden bg-gray-100"
            style={{
              aspectRatio: placement === '4:5' ? '4/5' : placement === '1:1' ? '1/1' : '1.91/1',
            }}
          >
            {/* Export key-color background layer - behind media for video transparency */}
            <div
              className="absolute inset-0 z-0"
              style={{ backgroundColor: 'rgb(1, 2, 3)' }}
            />
            {staticImage ? (
              <img
                src={staticImage}
                alt="Ad Export"
                className="w-full h-full object-cover"
              />
            ) : ad.image ? (
              ad.image.startsWith('data:video') ? (
                <video
                  src={ad.image}
                  className="w-full h-full object-cover relative z-10"
                  style={{ backgroundColor: 'rgb(1, 2, 3)', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <img
                  src={ad.image}
                  alt="Ad"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-sm font-medium">Ad image/video</div>
                  <div className="text-xs text-gray-400">
                    Use a {placement === '4:5' ? '4:5' : placement === '1:1' ? '1:1' : '1.91:1'} ratio
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ad Text Content */}
          <div className="bg-gray-100 px-3 py-2">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-2">
                <div className="text-xs text-gray-500 mb-0.5">{(ad.finalUrl || 'www.example.com').replace(/^https?:\/\//, '').split('/')[0].toUpperCase()}</div>
                <div className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{ad.headline || ad.callToAction || 'Headline'}</div>
              </div>
              <button className="bg-[#E4E6EB] text-black px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap">
                {ad.callToAction || 'Learn More'}
              </button>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="px-3 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-200">
            <div className="flex items-center space-x-1">
              <div className="flex -space-x-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-white z-10">
                  <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                </div>
              </div>
              <span>1.3k</span>
            </div>
            <div className="flex space-x-3">
              <span>240 comments</span>
              <span>26 shares</span>
            </div>
          </div>

          {/* Facebook Footer Actions */}
          <div className="flex items-center justify-between px-2 py-1">
            <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
              <span className="text-sm font-medium">Like</span>
            </button>
            <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <span className="text-sm font-medium">Comment</span>
            </button>
            <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 