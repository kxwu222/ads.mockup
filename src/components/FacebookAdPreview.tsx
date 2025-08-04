import React from 'react';
import { FacebookAd } from '../types/ads';
import { PreviewMode } from '../types/ads';
import icon128 from '../../icon128.png';

interface FacebookAdPreviewProps {
  ad: FacebookAd;
  mode: PreviewMode;
  placement: '4:5' | '1.91:1' | '1:1';
}

export const FacebookAdPreview: React.FC<FacebookAdPreviewProps> = ({
  ad,
  mode,
  placement,
}) => {
  // Adjust container width based on aspect ratio
  const getContainerWidth = () => {
    if (mode === 'mobile') {
      return 'w-[280px]'; // Fixed 280px width for all ratios on mobile
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
    <div className={`${getContainerWidth()} bg-white rounded-lg shadow-lg overflow-hidden`}>
      {/* Facebook Header */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <img src={icon128} alt="Logo" className="w-8 h-8 rounded-full bg-[#440099]" />
        <div className="ml-3">
          <div className="text-sm font-semibold text-gray-900">{ad.businessName || 'The University of Sheffield'}</div>
          <div className="text-xs text-gray-500 flex items-center">
            <span>Sponsored</span>
          </div>
        </div>
      </div>

      {/* Ad Content */}
      <div className="relative">
        {/* Ad Description - Above Image */}
        <div className="p-4 pb-2">
          <p className="text-sm text-gray-900">{ad.description || 'Your Facebook ad description goes here.'}</p>
        </div>

        {/* Ad Image/Video */}
        <div 
          className="relative overflow-hidden"
          style={{ 
            aspectRatio: placement === '4:5' ? '4/5' : placement === '1:1' ? '1/1' : '1.91/1',
            maxHeight: mode === 'mobile' ? '400px' : '500px',
            maxWidth: placement === '4:5' ? '280px' : 'auto'
          }}
        >
          {ad.image ? (
            ad.image.startsWith('data:video') ? (
              <video
                src={ad.image}
                className="w-full h-full object-cover"
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
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
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
        <div className="px-4 pb-4">
          
          <div className="bg-gray-50 -mx-4">
            <div className="text-xs text-gray-500 mb-1 px-4 pt-3">{(ad.finalUrl || 'www.example.com').replace(/^https?:\/\//, '').toUpperCase()}</div>
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="font-semibold text-gray-900 text-sm">{ad.headline || ad.callToAction || 'Headline'}</div>
              <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Engagement Metrics */}
          <div className="flex items-center justify-between text-xs text-gray-500 border-gray-200 pt-3">
            <div className="flex items-center space-x-1">
              <img 
                src="data:image/svg+xml,%3Csvg%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Cpath%20d='M16.0001%207.9996c0%204.418-3.5815%207.9996-7.9995%207.9996S.001%2012.4176.001%207.9996%203.5825%200%208.0006%200C12.4186%200%2016%203.5815%2016%207.9996Z'%20fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath%20d='M16.0001%207.9996c0%204.418-3.5815%207.9996-7.9995%207.9996S.001%2012.4176.001%207.9996%203.5825%200%208.0006%200C12.4186%200%2016%203.5815%2016%207.9996Z'%20fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath%20d='M16.0001%207.9996c0%204.418-3.5815%207.9996-7.9995%207.9996S.001%2012.4176.001%207.9996%203.5825%200%208.0006%200C12.4186%200%2016%203.5815%2016%207.9996Z'%20fill='url(%23paint2_radial_15251_63610)'%20fill-opacity='.5'/%3E%3Cpath%20d='M7.3014%203.8662a.6974.6974%200%200%201%20.6974-.6977c.6742%200%201.2207.5465%201.2207%201.2206v1.7464a.101.101%200%200%200%20.101.101h1.7953c.992%200%201.7232.9273%201.4917%201.892l-.4572%201.9047a2.301%202.301%200%200%201-2.2374%201.764H6.9185a.5752.5752%200%200%201-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878%203.6878%200%200%200%20.3893-1.6509l-.0002-.4496ZM4.367%207a.767.767%200%200%200-.7669.767v3.2598a.767.767%200%200%200%20.767.767h.767a.3835.3835%200%200%200%20.3835-.3835V7.3835A.3835.3835%200%200%200%205.134%207h-.767Z'%20fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient%20id='paint1_radial_15251_63610'%20cx='0'%20cy='0'%20r='1'%20gradientUnits='userSpaceOnUse'%20gradientTransform='rotate(90%20.0005%208)%20scale(7.99958)'%3E%3Cstop%20offset='.5618'%20stop-color='%230866FF'%20stop-opacity='0'/%3E%3Cstop%20offset='1'%20stop-color='%230866FF'%20stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient%20id='paint2_radial_15251_63610'%20cx='0'%20cy='0'%20r='1'%20gradientUnits='userSpaceOnUse'%20gradientTransform='rotate(45%20-4.5257%2010.9237)%20scale(10.1818)'%3E%3Cstop%20offset='.3143'%20stop-color='%2302ADFC'/%3E%3Cstop%20offset='1'%20stop-color='%2302ADFC'%20stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient%20id='paint0_linear_15251_63610'%20x1='2.3989'%20y1='2.3999'%20x2='13.5983'%20y2='13.5993'%20gradientUnits='userSpaceOnUse'%3E%3Cstop%20stop-color='%2302ADFC'/%3E%3Cstop%20offset='.5'%20stop-color='%230866FF'/%3E%3Cstop%20offset='1'%20stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"
                alt="Like"
                className="w-5 h-5"
              />
              <span>1.3k</span>
            </div>
            <div className="text-right">
              <span>240 comments 26 shares</span>
            </div>
          </div>
        </div>
      </div>

      {/* Facebook Footer */}
      <div className="flex items-center justify-between p-3 border-t border-gray-200">
        <div className="flex w-full">
          <button className="flex flex-col items-center justify-center flex-1 text-sm text-gray-500">
            <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span className="text-xs">Like</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-sm text-gray-500">
            <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs">Comment</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-sm text-gray-500">
            <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-xs">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 