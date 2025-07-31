import React from 'react';
import { PreviewMode } from '../types/ads';

interface DeviceFrameProps {
  mode: PreviewMode;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ mode, children }) => {
  if (mode === 'desktop') {
    return (
      <div className="bg-gray-800 rounded-lg p-4 shadow-2xl">
        <div className="bg-gray-700 rounded-t-lg p-2 flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 bg-gray-600 rounded px-3 py-1 text-xs text-gray-300">
            google.com/search
          </div>
        </div>
        <div className="bg-white rounded-b-lg min-h-96 overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl max-w-sm mx-auto">
      <div className="bg-black rounded-2xl p-1">
        <div className="bg-gray-800 rounded-xl p-2">
          <div className="w-16 h-1 bg-gray-600 rounded-full mx-auto mb-2"></div>
          <div className="bg-white rounded-lg min-h-96 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};