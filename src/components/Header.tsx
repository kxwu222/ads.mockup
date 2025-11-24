import React, { useState, useEffect, useRef } from 'react';
import icon128 from '/icon128.png';
import { AdType } from '../types/ads';
import { Download, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeType: AdType;
  onTypeChange: (type: AdType) => void;
  onExport: (format: 'png' | 'jpeg' | 'mp4') => void;
  hasVideo?: boolean;
}

type IconComponent = React.ComponentType<{ className?: string }> | (() => JSX.Element);

const adTypes: Array<{
  type: AdType;
  label: string;
  icon: IconComponent;
}> = [
    {
      type: 'facebook' as AdType,
      label: 'Facebook',
      icon: () => (
        <svg fill="currentColor" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <title>facebook</title>
          <path d="M30.996 16.091c-0.001-8.281-6.714-14.994-14.996-14.994s-14.996 6.714-14.996 14.996c0 7.455 5.44 13.639 12.566 14.8l0.086 0.012v-10.478h-3.808v-4.336h3.808v-3.302c-0.019-0.167-0.029-0.361-0.029-0.557 0-2.923 2.37-5.293 5.293-5.293 0.141 0 0.281 0.006 0.42 0.016l-0.018-0.001c1.199 0.017 2.359 0.123 3.491 0.312l-0.134-0.019v3.69h-1.892c-0.086-0.012-0.185-0.019-0.285-0.019-1.197 0-2.168 0.97-2.168 2.168 0 0.068 0.003 0.135 0.009 0.202l-0.001-0.009v2.812h4.159l-0.665 4.336h-3.494v10.478c7.213-1.174 12.653-7.359 12.654-14.814v-0z"></path>
        </svg>
      )
    },
    {
      type: 'instagram' as AdType,
      label: 'Instagram',
      icon: () => (
        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM12 15.88C9.86 15.88 8.12 14.14 8.12 12C8.12 9.86 9.86 8.12 12 8.12C14.14 8.12 15.88 9.86 15.88 12C15.88 14.14 14.14 15.88 12 15.88ZM17.92 6.88C17.87 7 17.8 7.11 17.71 7.21C17.61 7.3 17.5 7.37 17.38 7.42C17.26 7.47 17.13 7.5 17 7.5C16.73 7.5 16.48 7.4 16.29 7.21C16.2 7.11 16.13 7 16.08 6.88C16.03 6.76 16 6.63 16 6.5C16 6.37 16.03 6.24 16.08 6.12C16.13 5.99 16.2 5.89 16.29 5.79C16.52 5.56 16.87 5.45 17.19 5.52C17.26 5.53 17.32 5.55 17.38 5.58C17.44 5.6 17.5 5.63 17.56 5.67C17.61 5.7 17.66 5.75 17.71 5.79C17.8 5.89 17.87 5.99 17.92 6.12C17.97 6.24 18 6.37 18 6.5C18 6.63 17.97 6.76 17.92 6.88Z" />
        </svg>
      )
    },
    {
      type: 'tiktok' as AdType,
      label: 'TikTok',
      icon: () => (
        <svg fill="currentColor" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <title>tiktok</title>
          <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z"></path>
        </svg>
      )
    },
    {
      type: 'linkedin' as AdType,
      label: 'LinkedIn',
      icon: () => (
        <svg width="20px" height="20px" viewBox="0 0 24 24" role="img" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <title>LinkedIn icon</title>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
  ];

export const Header: React.FC<HeaderProps> = ({ activeType, onTypeChange, onExport, hasVideo = false }) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };

    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportMenuOpen]);

  const handleExportClick = (format: 'png' | 'jpeg' | 'mp4') => {
    onExport(format);
    setIsExportMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-br from-orange-50 via-white to-red-50 animate-gradient-xy shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ... (Logo and AdType selector remain same) */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img src={icon128} alt="Logo icon" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-[#B73F00] hidden sm:block">
                Social Media Ads Mockup Tool
              </h1>
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              {adTypes.map(({ type, label, icon: Icon }) => {
                const getActiveStyles = (t: AdType) => {
                  switch (t) {
                    case 'facebook':
                      return 'bg-white text-[#1877F2] shadow-sm ring-1 ring-black/5';
                    case 'instagram':
                      return 'bg-white text-[#E1306C] shadow-sm ring-1 ring-black/5';
                    case 'tiktok':
                      return 'bg-white text-[#000000] shadow-sm ring-1 ring-black/5';
                    case 'linkedin':
                      return 'bg-white text-[#0077B5] shadow-sm ring-1 ring-black/5';
                    default:
                      return 'bg-white text-gray-900 shadow-sm';
                  }
                };

                return (
                  <button
                    key={type}
                    onClick={() => onTypeChange(type)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeType === type
                      ? getActiveStyles(type)
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                      }`}
                  >
                    {typeof Icon === 'function' && Icon.prototype === undefined ? <Icon /> : <Icon className="h-5 w-5" />}
                    <span className="hidden md:inline">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative" ref={menuRef}>
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