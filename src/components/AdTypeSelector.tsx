import React from 'react';
import { Search, Image, Play, Compass, Mail } from 'lucide-react';
import { AdType } from '../types/ads';

interface AdTypeSelectorProps {
  activeType: AdType;
  onTypeChange: (type: AdType) => void;
}

const adTypes = [
  { type: 'search' as AdType, label: 'Search', icon: Search },
  { type: 'display' as AdType, label: 'Display', icon: Image },
  { type: 'youtube' as AdType, label: 'YouTube', icon: Play },
  { type: 'discover' as AdType, label: 'Discover', icon: Compass },
  { type: 'gmail' as AdType, label: 'Gmail', icon: Mail },
];

export const AdTypeSelector: React.FC<AdTypeSelectorProps> = ({ activeType, onTypeChange }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Ad Type</h2>
      <div className="grid grid-cols-5 gap-4">
        {adTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all ${
              activeType === type
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-8 w-8" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};