import React, { useState } from 'react';
import icon128 from '../../icon128.png';
import { AdType } from '../types/ads';
import { Download, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeType: AdType;
  onTypeChange: (type: AdType) => void;
  onExport: (format: 'png' | 'jpeg' | 'mp4') => void;
  hasVideo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeType, onTypeChange, onExport, hasVideo = false }) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const handleExportClick = (format: 'png' | 'jpeg' | 'mp4') => {
    onExport(format);
    setIsExportMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-br from-orange-50 via-white to-red-50 animate-gradient-xy shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img src={icon128} alt="Logo icon" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-[#440099] hidden sm:block">
              Social Media Ads Preview
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="flex items-center space-x-2 bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={() => handleExportClick('png')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Download as PNG
                  </button>
                  <button
                    onClick={() => handleExportClick('jpeg')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Download as JPEG
                  </button>
                  {hasVideo && (
                    <button
                      onClick={() => handleExportClick('mp4')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Download as MP4
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
