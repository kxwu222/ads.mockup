import React from 'react';
import { DisplayAd, PreviewMode } from '../types/ads';
import { MD3Frame } from './MD3Frame';
import { GoogleBar } from './GoogleBar';

interface DisplayAdPreviewProps {
  ad: DisplayAd;
  mode: PreviewMode;
  placement: string;
}

// Material Design 3 right arrow SVG
const MD3Arrow = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5L15 12L8 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Helper to render FAB/button variants with size options
function renderFABButton(type: string, size: 'normal' | 'small' = 'normal') {
  const circleSize = size === 'small' ? 'w-6 h-6' : 'w-8 h-8';
  const arrowSize = size === 'small' ? '12' : '16';
  const textSize = size === 'small' ? 'text-xs' : 'text-sm';
  const padding = size === 'small' ? 'px-2 py-0.5' : 'px-3 py-1';

  switch (type) {
    case 'button-purple':
      return (
        <button className={`flex items-center justify-center ${circleSize} bg-[#6C2EB9] rounded-full flex-shrink-0`}>
          <svg width={arrowSize} height={arrowSize} fill="none" viewBox="0 0 24 24">
            <path d="M8 5L15 12L8 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      );
    case 'button-black':
      return (
        <button className={`flex items-center justify-center ${circleSize} bg-black rounded-full flex-shrink-0`}>
          <svg width={arrowSize} height={arrowSize} fill="none" viewBox="0 0 24 24">
            <path d="M8 5L15 12L8 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      );
    case 'open':
      return (
        <button className={`flex items-center space-x-1 text-black font-medium ${textSize} flex-shrink-0`}>
          <span>Open</span>
          <svg width={arrowSize} height={arrowSize} fill="none" viewBox="0 0 24 24">
            <path d="M8 5L15 12L8 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      );
    case 'learn-more':
      return (
        <button className={`flex items-center space-x-1 text-black font-medium ${textSize} flex-shrink-0`}>
          <span>Learn more</span>
          <svg width={arrowSize} height={arrowSize} fill="none" viewBox="0 0 24 24">
            <path d="M8 5L15 12L8 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      );
    case 'learn-more-box':
      return (
        <button className={`flex items-center space-x-1 border border-black rounded ${padding} text-black font-medium ${textSize} bg-white flex-shrink-0`}>
          <span>Learn more</span>
          <svg width={arrowSize} height={arrowSize} fill="none" viewBox="0 0 24 24">
            <path d="M8 5L15 12L8 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      );
    default:
      return null;
  }
}

export const DisplayAdPreview: React.FC<DisplayAdPreviewProps> = ({ ad, mode, placement }) => {
  const isDesktop = mode === 'desktop';

  // Desktop Banner Ad – full frame width like mobile
  const desktopBannerAd = (
    <div className="bg-white shadow border border-gray-100 w-full flex items-start p-4" style={{ borderRadius: 8 }}>
      <div className="flex items-center space-x-4 w-full max-w-[800px] mx-auto">
        {ad.image && (
          ad.image.startsWith('data:video') ? (
            <video
              src={ad.image}
              className="w-20 h-20 object-cover rounded"
              controls
              muted
              loop
              playsInline
              style={{ background: '#000' }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={ad.image} alt="Ad" className="w-20 h-20 object-cover rounded" />
          )
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">{ad.headline}</div>
          <div className="text-sm text-gray-700 mb-2 line-clamp-2">{ad.description}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">Ad</span>
              {ad.businessName && (
                <span className="text-sm text-gray-500 font-medium">{ad.businessName}</span>
              )}
            </div>
            {renderFABButton(ad.ctaType || 'learn-more-box')}
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar Ad (web, new layout) - smaller fonts, min-height for proper spacing, small buttons
  const sidebarAd = (
    <div className="bg-white shadow-lg border border-gray-100 w-full flex flex-col" style={{ borderRadius: 8, minHeight: '280px' }}>
      {ad.image && (
        ad.image.startsWith('data:video') ? (
          <video
            src={ad.image}
            className="w-full h-32 object-cover rounded-t"
            controls
            muted
            loop
            playsInline
            style={{ background: '#000' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={ad.image} alt="Ad" className="w-full h-32 object-cover rounded-t" />
        )
      )}
      <div className="p-3 flex flex-col flex-1">
        <div className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{ad.headline}</div>
        <div className="text-xs text-gray-700 mb-3 line-clamp-3 flex-1">{ad.description}</div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-1">
            {ad.logo && <img src={ad.logo} alt="Logo" className="w-4 h-4 object-contain" />}
            {ad.businessName && (
              <span className="text-xs text-gray-500 font-medium">{ad.businessName}</span>
            )}
          </div>
          {renderFABButton('button-purple', 'small')}
        </div>
      </div>
    </div>
  );

  const nativeAd = (
    <div className="bg-white shadow-lg border border-gray-100 w-[300px] flex flex-col p-4" style={{ borderRadius: 8 }}>
      {ad.image && (
        ad.image.startsWith('data:video') ? (
          <video
            src={ad.image}
            className="w-full aspect-[16/9] object-cover rounded mb-3"
            controls
            muted
            loop
            playsInline
            style={{ background: '#000' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={ad.image} alt="Ad" className="w-full aspect-[16/9] object-cover rounded mb-3" />
        )
      )}
      <div className="font-semibold text-base text-gray-900 mb-1">{ad.headline}</div>
      <div className="text-sm text-gray-700 mb-2">{ad.description}</div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-1">
          {ad.logo && <img src={ad.logo} alt="Logo" className="w-4 h-4 object-contain" />}
          {ad.businessName && <span className="text-xs text-gray-500 font-medium">{ad.businessName}</span>}
        </div>
        {renderFABButton(ad.ctaType || 'learn-more-box')}
      </div>
    </div>
  );

  // Interstitial Ad (static, no overlay)
  const interstitialAd = (
    <div className="bg-white shadow-lg overflow-hidden border border-gray-100 w-full max-w-[340px] flex flex-col h-full mx-auto" style={{ borderRadius: 8 }}>
      {ad.image && (
        ad.image.startsWith('data:video') ? (
          <video
            src={ad.image}
            className="w-full h-[60px] object-cover"
            controls
            muted
            loop
            playsInline
            style={{ background: '#000', borderRadius: 0 }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={ad.image} alt="Ad" className="w-full h-[60px] object-cover" style={{ borderRadius: 0 }} />
        )
      )}
      <div className="p-3 flex-1 flex flex-col">
        <div className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 truncate">{ad.headline}</div>
        <div className="text-xs text-gray-600 mb-2 line-clamp-2 truncate">{ad.description}</div>
        <div className="flex items-center space-x-2 mt-auto">
          <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">Ad</span>
          <span className="text-[11px] text-gray-500">University name</span>
        </div>
      </div>
    </div>
  );

  // --- Desktop Layout ---
  const renderDesktopPreview = () => (
    <div className="relative w-full h-full bg-gray-50 overflow-hidden flex flex-row max-w-full" style={{ minHeight: 320 }}>
      {/* Banner spanning full frame width */}
      {placement === 'banner' && (
        <div className="absolute top-0 left-0 right-0 z-10 px-4 py-2">
          {desktopBannerAd}
        </div>
      )}
      
      {/* Fake content area */}
      <div className="flex-1 flex flex-col justify-start p-8 max-w-[calc(100%-240px)]" style={{ paddingTop: placement === 'banner' ? '100px' : '32px' }}>
        <div className="h-4 w-1/3 bg-gray-200 mb-6"></div>
        <div className="flex space-x-8 mb-6 overflow-x-auto">
          <div className="h-4 w-32 bg-gray-200 flex-shrink-0"></div>
          <div className="h-4 w-32 bg-gray-200 flex-shrink-0"></div>
          <div className="h-4 w-32 bg-gray-200 flex-shrink-0"></div>
          <div className="h-4 w-32 bg-gray-200 flex-shrink-0"></div>
        </div>
        <div className="h-3 w-5/6 bg-gray-200 mb-2"></div>
        <div className="h-3 w-5/6 bg-gray-200 mb-2"></div>
        <div className="h-3 w-5/6 bg-gray-200 mb-2"></div>
        <div className="h-3 w-2/3 bg-gray-200 mb-2"></div>
        <div className="flex-1 bg-gray-100"></div>
      </div>
      
      {/* Sidebar: tall / narrow down the side */}
      {placement === 'sidebar' && (
        <div className="flex flex-col items-end justify-start p-8 w-[240px] flex-shrink-0">
          {sidebarAd}
        </div>
      )}
    </div>
  );

  // --- Mobile Ad Placements ---
  // Mobile Banner Ad
  const mobileBannerAd = (
    <div className="bg-white shadow border border-gray-100 w-full max-w-[340px] flex flex-row items-start p-2" style={{ borderRadius: 8 }}>
      {ad.image && (
        ad.image.startsWith('data:video') ? (
          <video
            src={ad.image}
            className="w-14 h-14 object-cover rounded mr-2"
            controls
            muted
            loop
            playsInline
            style={{ background: '#000' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={ad.image} alt="Ad" className="w-14 h-14 object-cover rounded mr-2" />
        )
      )}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="font-semibold text-xs text-gray-900 leading-snug mb-1 line-clamp-2">{ad.headline}</div>
          <div className="text-xs text-gray-700 leading-snug mb-1 line-clamp-2">{ad.description}</div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-1">
            <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">Ad</span>
            {ad.businessName && (
              <span className="text-[11px] text-gray-500">{ad.businessName}</span>
            )}
          </div>
          {renderFABButton(ad.ctaType || 'button-purple')}
        </div>
      </div>
      {/* info icon & FAB container */}
      <div className="flex flex-col items-end justify-between h-full">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="text-gray-400 mt-1"><circle cx="12" cy="12" r="12" fill="#F3F4F6"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#888">i</text></svg>
      </div>
    </div>
  );

  // Mobile Native Ad: match screenshot layout
  const mobileNativeAd = (
    <div className="bg-white shadow border border-gray-100 w-full max-w-[340px] flex flex-col" style={{ borderRadius: 8 }}>
      {ad.image && (
        ad.image.startsWith('data:video') ? (
          <video
            src={ad.image}
            className="w-full aspect-[16/9] object-cover rounded-t"
            controls
            muted
            loop
            playsInline
            style={{ background: '#000' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={ad.image} className="w-full aspect-[16/9] object-cover rounded-t" />
        )
      )}
      <div className="p-3 flex flex-col flex-1">
        <div className="font-semibold text-xs text-gray-900 mb-1 line-clamp-2">{ad.headline}</div>
        <div className="text-xs text-gray-700 mb-2 line-clamp-2">{ad.description}</div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-1">
            {ad.logo && <img src={ad.logo} alt="Logo" className="w-4 h-4 object-contain" />}
            {ad.businessName && <span className="text-[11px] text-gray-500">{ad.businessName}</span>}
          </div>
          {renderFABButton(ad.ctaType || 'learn-more-box')}
        </div>
      </div>
    </div>
  );

  // Mobile Interstitial Ad: with university name and proper scrolling
  const mobileInterstitialAd = (
    <div className="bg-white shadow-lg border border-gray-100 w-full max-w-[340px] mx-auto flex flex-col" style={{ borderRadius: 16, minHeight: '500px' }}>
      <div className="relative">
        {ad.image && (
          ad.image.startsWith('data:video') ? (
            <video
              src={ad.image}
              className="w-full h-72 object-cover"
              controls
              muted
              loop
              playsInline
              style={{ background: '#000', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={ad.image} alt="Ad" className="w-full h-72 object-cover" style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
          )
        )}
        {/* Info icon in top-right */}
        <div className="absolute top-2 right-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-400"><circle cx="12" cy="12" r="12" fill="#F3F4F6"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#888">i</text></svg>
        </div>
      </div>
      <div className="flex flex-col items-center p-6 flex-1">
        {ad.logo && (
          <img src={ad.logo} alt="Logo" className="w-12 h-12 object-contain mb-4" />
        )}
        <div className="font-bold text-2xl text-gray-900 text-center mb-3 leading-tight">{ad.headline}</div>
        <div className="text-base text-gray-700 text-center mb-4 leading-snug">{ad.description}</div>
        {ad.businessName && (
          <div className="text-sm text-gray-500 mb-4">{ad.businessName}</div>
        )}
        <div className="flex w-full gap-3 mt-auto">
          <button className="flex-1 border border-gray-300 rounded-md py-3 font-medium text-gray-700 bg-white">Close</button>
          {renderFABButton('learn-more-box')}
        </div>
      </div>
    </div>
  );

  // --- Mobile Layout ---
  const renderMobilePreview = () => (
    <div className="w-full h-full bg-gray-50 flex flex-col" style={{ minHeight: 400 }}>
      <GoogleBar />
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col space-y-4">
          <div className="h-4 w-2/3 bg-gray-200 self-center mt-2"></div>
          <div className="h-4 w-5/6 bg-gray-200 self-center"></div>
          {(placement === 'banner' || !placement) && <div>{mobileBannerAd}</div>}
          {placement === 'native' && <div>{mobileNativeAd}</div>}
          {placement === 'interstitial' && <div>{mobileInterstitialAd}</div>}
          <div className="h-3 w-full bg-gray-200"></div>
          <div className="h-3 w-4/5 bg-gray-200"></div>
          <div className="h-3 w-3/4 bg-gray-200"></div>
          <div className="h-20 w-full bg-gray-100"></div>
        </div>
      </div>
    </div>
  );

  return (
    <MD3Frame mode={mode}>
      {isDesktop ? renderDesktopPreview() : renderMobilePreview()}
    </MD3Frame>
  );
};
