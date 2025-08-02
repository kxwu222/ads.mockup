import React from 'react';
import icon128 from '../../icon128.png';
import { Smartphone } from 'lucide-react';
import { PreviewMode } from '../types/ads';

interface HeaderProps {
  previewMode?: PreviewMode;
  onPreviewModeChange?: (mode: PreviewMode) => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img src={icon128} alt="Logo icon" className="h-8 w-8" />
            <span className="text-sm font-normal" style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.875rem' }}>
              By Digital UX team
            </span>
            <h1 className="text-2xl mb-1 pl-2 font-bold text-[#440099]">
              Social Media Ads Preview
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
