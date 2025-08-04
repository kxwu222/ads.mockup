import React from 'react';
import { FacebookAd } from '../types/ads';
import { ImageUploader } from './ImageUploader';

interface FacebookAdEditorProps {
  ad: FacebookAd;
  onChange: (ad: FacebookAd) => void;
  placement: '4:5' | '1.91:1' | '1:1';
  onPlacementChange: (placement: '4:5' | '1.91:1' | '1:1') => void;
}

export const FacebookAdEditor: React.FC<FacebookAdEditorProps> = ({
  ad,
  onChange,
  placement,
  onPlacementChange,
}) => {
  const handleChange = (field: keyof FacebookAd, value: string | number) => {
    onChange({ ...ad, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Aspect Ratio
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="aspectRatio"
              value="4:5"
              checked={placement === '4:5'}
              onChange={(e) => onPlacementChange(e.target.value as '4:5' | '1.91:1' | '1:1')}
              className="mr-2"
            />
            <span className="text-sm">4:5 (Preferred)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="aspectRatio"
              value="1:1"
              checked={placement === '1:1'}
              onChange={(e) => onPlacementChange(e.target.value as '4:5' | '1.91:1' | '1:1')}
              className="mr-2"
            />
            <span className="text-sm">1:1 (Square)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="aspectRatio"
              value="1.91:1"
              checked={placement === '1.91:1'}
              onChange={(e) => onPlacementChange(e.target.value as '4:5' | '1.91:1' | '1:1')}
              className="mr-2"
            />
            <span className="text-sm">1.91:1</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Text
        </label>
        <textarea
          value={ad.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          maxLength={125}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter your ad description"
        />
        <div className="text-xs text-gray-500 mt-1">
          {ad.description.length}/125 characters
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Headline
        </label>
        <input
          type="text"
          value={ad.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          maxLength={40}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter your headline"
        />
        <div className="text-xs text-gray-500 mt-1">
          {ad.headline.length}/40 characters
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          value={ad.businessName}
          onChange={(e) => handleChange('businessName', e.target.value)}
          maxLength={125}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter username"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Call to Action
        </label>
        <input
          type="text"
          value={ad.callToAction || ''}
          onChange={(e) => handleChange('callToAction', e.target.value)}
          maxLength={40}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Learn More"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Website text
        </label>
        <input
          type="url"
          value={ad.finalUrl}
          onChange={(e) => handleChange('finalUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="www.example.com"
        />
      </div>

      <div>
        <ImageUploader
          label="Asset"
          value={ad.image}
          onChange={(image) => handleChange('image', image)}
          aspectRatio={placement}
          allowVideo={true}
          autoDetect={true}
        />
      </div>
    </div>
  );
}; 