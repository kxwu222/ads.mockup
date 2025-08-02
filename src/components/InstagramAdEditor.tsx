import React from 'react';
import { InstagramAd } from '../types/ads';
import { ImageUploader } from './ImageUploader';

interface InstagramAdEditorProps {
  ad: InstagramAd;
  onChange: (ad: InstagramAd) => void;
  placement: '1:1' | '4:5' | '9:16';
  onPlacementChange: (placement: '1:1' | '4:5' | '9:16') => void;
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

  const handlePlacementChange = (newPlacement: '1:1' | '4:5' | '9:16') => {
    onPlacementChange(newPlacement);
    // Automatically set media type to video for stories
    if (newPlacement === '9:16') {
      handleChange('mediaType', 'video');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Aspect Ratio
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="aspectRatio"
              value="4:5"
              checked={placement === '4:5'}
              onChange={(e) => handlePlacementChange(e.target.value as '1:1' | '4:5' | '9:16')}
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
              onChange={(e) => handlePlacementChange(e.target.value as '1:1' | '4:5' | '9:16')}
              className="mr-2"
            />
            <span className="text-sm">1:1 (Square)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="aspectRatio"
              value="9:16"
              checked={placement === '9:16'}
              onChange={(e) => handlePlacementChange(e.target.value as '1:1' | '4:5' | '9:16')}
              className="mr-2"
            />
            <span className="text-sm">9:16 (Stories)</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Media Type
        </label>
        <div className="flex space-x-4">
          {placement !== '9:16' && (
            <label className="flex items-center">
              <input
                type="radio"
                name="mediaType"
                value="image"
                checked={ad.mediaType === 'image'}
                onChange={(e) => handleChange('mediaType', e.target.value as 'image' | 'video')}
                className="mr-2"
              />
              <span className="text-sm">Image</span>
            </label>
          )}
          <label className="flex items-center">
            <input
              type="radio"
              name="mediaType"
              value="video"
              checked={ad.mediaType === 'video'}
              onChange={(e) => handleChange('mediaType', e.target.value as 'image' | 'video')}
              className="mr-2"
            />
            <span className="text-sm">Video</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text
        </label>
        <textarea
          value={ad.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          maxLength={125}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your ad description"
        />
        <div className="text-xs text-gray-500 mt-1">
          {ad.description.length}/125 characters
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          value={ad.businessName}
          onChange={(e) => handleChange('businessName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your username"
        />
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
          label={placement === '9:16' ? 'Video (9:16 vertical only)' : 'Image'}
          value={ad.image}
          onChange={(image) => handleChange('image', image)}
          aspectRatio={placement === '9:16' ? '9:16' : placement}
          allowVideo={placement === '9:16'}
        />
      </div>

      <div className="text-xs text-gray-400 mt-2">
        Video Duration: Recommend 9-15s
      </div>
    </div>
  );
}; 