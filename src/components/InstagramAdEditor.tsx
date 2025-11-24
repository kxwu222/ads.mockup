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
  const handleChange = (field: keyof InstagramAd, value: string | number | boolean) => {
    onChange({ ...ad, [field]: value });
  };

  const handlePlacementChange = (newPlacement: '1:1' | '4:5' | '9:16' | '9:16-reel') => {
    onPlacementChange(newPlacement);
    // Automatically set media type to video for reels only (stories accept both)
    if (newPlacement === '9:16-reel') {
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
          className="w-11/12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter your caption here"
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
          onChange={(e) => handleChange('businessName', e.target.value)}
          className="w-11/12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter your username"
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
          className="w-11/12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Learn More"
        />
      </div>

      {placement === '9:16-reel' && (
        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="showCard"
              checked={ad.showCard || false}
              onChange={(e) => {
                // If checking, ensure we have a default value if empty? No, let user type.
                handleChange('showCard', e.target.checked);
              }}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showCard" className="text-sm font-semibold text-gray-700 select-none">
              Show CTA Card
            </label>
          </div>

          <div className={`transition-opacity duration-200 ${ad.showCard ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card text
            </label>
            <input
              type="text"
              value={ad.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              disabled={!ad.showCard}
              className="w-11/12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
              placeholder="Enter your card text"
            // maxLength={45}
            />
            <div className="text-xs text-gray-500 mt-1">
              Recommended max 45 characters
            </div>
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
          onChange={(image) => {
            // Update both image and mediaType in a single state update
            const isVideo = image.startsWith('data:video');
            const newAd = { ...ad, image, mediaType: (isVideo ? 'video' : 'image') as 'image' | 'video' };
            console.log('InstagramAdEditor: Updating ad state with image, hasImage:', !!newAd.image, 'isVideo:', isVideo);
            onChange(newAd);
          }}
          aspectRatio={placement}
          allowVideo={true}
          autoDetect={true}
          customPlaceholder={
            placement === '9:16' ? "Upload image or video" :
              placement === '9:16-reel' ? "Video in 9:16, 4:5, 1:1" :
                undefined
          }
        />
        {(placement === '9:16' || placement === '9:16-reel')}
      </div>
    </div>
  );
}; 