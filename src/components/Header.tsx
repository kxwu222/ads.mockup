import React from 'react';
import icon128 from '../../icon128.png';
import { Monitor, Smartphone } from 'lucide-react';

interface HeaderProps {
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
}

export const Header: React.FC<HeaderProps> = ({ previewMode, onPreviewModeChange }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img src={icon128} alt="Logo icon" className="h-8 w-8" />
            <span className="text-sm font-normal" style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.875rem' }}>
              By Digital UX team
            </span>
            <h1 className="text-2xl mb-1 pl-2 font-bold text-gray-900">
              Google Ads Preview
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 pr-6">
            <span className="text-sm font-medium text-gray-700">Preview Mode:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onPreviewModeChange('desktop')}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  previewMode === 'desktop'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Monitor className="h-4 w-4" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => onPreviewModeChange('mobile')}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  previewMode === 'mobile'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span>Mobile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
