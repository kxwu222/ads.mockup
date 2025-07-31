import React from 'react';

interface YouTubeFrameProps {
  /** Desktop sizes taken from real YT viewport (16 × 9 video + side rail) */
  style?: React.CSSProperties;
  children: React.ReactNode;
  /** Whether this is a mobile preview */
  isMobile?: boolean;
}

export const YouTubeFrame: React.FC<YouTubeFrameProps> = ({ style, children, isMobile }) => {
  return (
    <div
      className="relative bg-[#F9F9F9] rounded-xl shadow overflow-hidden"
      style={{ width: 960, height: 540, ...style }}
    >
      {/* ─── Top navigation bar ───────────────────── */}
      {isMobile ? (
        <div className="flex flex-col bg-white border-b">
          {/* Top row: Logo + icons */}
          <div className="flex items-center justify-between h-12 px-4">
            <div className="flex items-center space-x-3">
              <img 
                src="data:image/png;base64,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"
                alt="YouTube"
                className="h-4 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gray-200 rounded-full" />         {/* cast */}
              <div className="w-6 h-6 bg-gray-200 rounded-full" />         {/* notifications */}
              <div className="w-6 h-6 bg-gray-200 rounded-full" />         {/* search */}
              <div className="w-7 h-7 bg-gray-300 rounded-full" />         {/* profile */}
            </div>
          </div>
          {/* Bottom row: Navigation tabs */}
          <div className="flex items-center px-4 h-12 space-x-6 overflow-x-auto">
            <div className="flex-shrink-0 text-sm font-medium text-black border-b-2 border-black pb-3">All</div>
            <div className="flex-shrink-0 text-sm text-gray-600">Live</div>
            <div className="flex-shrink-0 text-sm text-gray-600">Gaming</div>
            <div className="flex-shrink-0 text-sm text-gray-600">Music</div>
            <div className="flex-shrink-0 text-sm text-gray-600">Mixes</div>
            <div className="flex-shrink-0 text-sm text-gray-600">News</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center h-12 px-4 bg-white border-b">
          {/* hamburger + logo */}
          <div className="flex items-center space-x-3 text-gray-700 text-sm">
            <div className="w-4 h-4 bg-gray-300 rounded-sm" />          {/* hamburger */}
            <div className="flex items-center">
              <img 
                src="data:image/png;base64,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"
                alt="YouTube"
                className="h-5 w-auto"
              />
            </div>
          </div>

          {/* fake search bar */}
          <div className="flex-1 mx-8 max-w-[500px]">
            <div className="h-8 bg-gray-100 border rounded-full flex items-center px-4">
              <div className="flex-1 h-4 bg-gray-200 rounded" />
              <div className="w-6 h-4 bg-gray-300 rounded ml-2" />       {/* search icon */}
            </div>
          </div>

          {/* profile / bell icons */}
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gray-200 rounded-full" />         {/* create */}
            <div className="w-6 h-6 bg-gray-200 rounded-full" />         {/* notifications */}
            <div className="w-8 h-8 bg-gray-300 rounded-full" />         {/* profile */}
          </div>
        </div>
      )}

      {/* parent sends the "page body" (feed, suggested, search etc.) */}
      <div className="absolute inset-0 top-12 overflow-x-auto overflow-y-hidden">{children}</div>
    </div>
  );
}; 