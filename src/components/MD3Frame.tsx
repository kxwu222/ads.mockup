import React from 'react';
import { PreviewMode } from '../types/ads';

interface MD3FrameProps {
  mode: PreviewMode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const MD3Frame: React.FC<MD3FrameProps> = ({ mode, children }) => {
  const isDesktop = mode === 'desktop';

  if (isDesktop) {
    return (
      <div className="bg-white shadow-xl border border-gray-200 overflow-hidden w-full h-full" style={{ borderRadius: 16 }}>
        {/* Browser chrome */}
        <div className="flex items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
          <div className="flex space-x-1 mr-4">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 border border-gray-300 shadow-sm">
            website.com
          </div>
          <div className="ml-4 w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>
        {/* Content area (scrollable) */}
        <div className="w-full h-full bg-white overflow-y-auto">{children}</div>
      </div>
    );
  }

  // Mobile frame (no address bar)
  return (
    <div className="flex justify-center w-full">
      <div className="bg-white shadow-xl border border-gray-200 overflow-hidden w-full max-w-[320px] h-[640px]" style={{ borderRadius: 24 }}>
        {/* Content area only, no address bar (scrollable) */}
        <div className="w-full h-full bg-white overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}; 