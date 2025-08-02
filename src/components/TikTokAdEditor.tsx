import React from 'react';
import { TikTokAd } from '../types/ads';
import { ImageUploader } from './ImageUploader';

interface TikTokAdEditorProps {
  ad: TikTokAd;
  onChange: (ad: TikTokAd) => void;
  placement: string;
  onPlacementChange: (placement: string) => void;
}

export const TikTokAdEditor: React.FC<TikTokAdEditorProps> = ({
  ad,
  onChange,
  placement,
  onPlacementChange,
}) => {
  const handleChange = (field: keyof TikTokAd, value: string | number) => {
    onChange({ ...ad, [field]: value });
  };
 
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          value={ad.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caption
        </label>
        <textarea
          value={ad.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          maxLength={100}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your caption"
        />
        <div className="text-xs text-gray-500 mt-1">
          {ad.description.length}/100 characters
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Call to Action
        </label>
        <input
          type="text"
          value={ad.callToAction || ''}
          onChange={(e) => handleChange('callToAction', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Learn More"
        />
      </div>

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
          label="Video (9:16 vertical only)"
          value={ad.video}
          onChange={(video) => handleChange('video', video)}
          aspectRatio="9:16"
          allowVideo={true}
        />
      </div>

      <div className="text-xs text-gray-400 mt-2">
        Video Duration: Recommend 9-15s
      </div>
    </div>
  );
}; 