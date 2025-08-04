import React from 'react';
import { InstagramAd } from '../types/ads';
import { ImageUploader } from './ImageUploader';

interface InstagramAdEditorProps {
  ad: InstagramAd;
  onChange: (ad: InstagramAd) => void;
  placement: '1:1' | '4:5' | '9:16' | '9:16-reel';
  onPlacementChange: (placement: '1:1' | '4:5' | '9:16' | '9:16-reel') => void;
}

export const InstagramAdEditor: React.FC<InstagramAdEditorProps> = ({
  ad,
  onChange,
  placement,
  onPlacementChange,
}) => {
  const handleChange = (field: keyof InstagramAd, value: string | number) => {
    onChange({ ...ad, [field]: value });
  };

  const handlePlacementChange = (newPlacement: '1:1' | '4:5' | '9:16' | '9:16-reel') => {
    onPlacementChange(newPlacement);
    // Automatically set media type to video for stories and reels
    if (newPlacement === '9:16' || newPlacement === '9:16-reel') {
      handleChange('mediaType', 'video');
    }
  };

  return (
    <div className="space-y-6">
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
              onChange={(e) => handlePlacementChange(e.target.value as '1:1' | '4:5' | '9:16' | '9:16-reel')}
              className="mr-2"
            />
            <span className="text-sm">4:5</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="aspectRatio"
              value="1:1"
              checked={placement === '1:1'}
              onChange={(e) => handlePlacementChange(e.target.value as '1:1' | '4:5' | '9:16' | '9:16-reel')}
              className="mr-2"
            />
            <span className="text-sm">1:1</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="aspectRatio"
              value="9:16"
              checked={placement === '9:16'}
              onChange={(e) => handlePlacementChange(e.target.value as '1:1' | '4:5' | '9:16' | '9:16-reel')}
              className="mr-2"
            />
            <span className="text-sm">Stories</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="aspectRatio"
              value="9:16-reel"
              checked={placement === '9:16-reel'}
              onChange={(e) => handlePlacementChange(e.target.value as '1:1' | '4:5' | '9:16' | '9:16-reel')}
              className="mr-2"
            />
            <span className="text-sm">Reel</span>
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
          placeholder="Enter your CTA card text"
        />
        <div className="text-xs text-gray-500 mt-1">
          {ad.description.length}/125 characters
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter your username"
        />
      </div>

      {placement === '9:16-reel' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Caption
          </label>
          <input
            type="text"
            value={ad.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Enter your caption"
            // maxLength={45}
          />
          <div className="text-xs text-gray-500 mt-1">
            Recommended max 45 characters
          </div>
        </div>
      )}

      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL
        </label>
        <input
          type="url"
          value={ad.finalUrl}
          onChange={(e) => handleChange('finalUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://www.example.com"
        />
      </div> */}

      <div>
        <ImageUploader
          label="Asset"
          value={ad.image}
          onChange={(image) => handleChange('image', image)}
          aspectRatio={placement}
          allowVideo={true}
          autoDetect={true}
          customPlaceholder={placement === '9:16' || placement === '9:16-reel' ? "Upload video (9:16)" : undefined}
        />
        {(placement === '9:16' || placement === '9:16-reel') && (
          <div className="text-xs text-gray-400 mt-2">
            If using video, recommended duration is 9-15s
          </div>
        )}
      </div>
    </div>
  );
}; 