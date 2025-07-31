import React from 'react';
import { DiscoverAd } from '../types/ads';
import { ImageUploader } from './ImageUploader';

interface DiscoverAdEditorProps {
  ad: DiscoverAd;
  onChange: (ad: DiscoverAd) => void;
}

export const DiscoverAdEditor: React.FC<DiscoverAdEditorProps> = ({ ad, onChange }) => {
  // Aspect ratio options
  const aspectRatioOptions = [
    { value: '16/9', label: 'Landscape (16:9)' },
    { value: '1/1', label: 'Square (1:1)' },
  ];
  const selectedAspectRatio = ad.imageAspectRatio || '16/9';

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Headline
        </label>
        <input
          type="text"
          value={ad.headline}
          onChange={(e) => onChange({ ...ad, headline: e.target.value })}
          placeholder="Your discover ad headline"
          maxLength={105}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">{ad.headline.length}/105 characters</p>
      </div>

      {/* Description section - moved below Headline */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={ad.description}
          onChange={e => onChange({ ...ad, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ImageUploader
          label="Main Image"
          value={ad.image}
          onChange={(value) => onChange({ ...ad, image: value })}
          allowVideo={false}
        />
        <ImageUploader
          label="Logo"
          value={ad.logo}
          onChange={(value) => onChange({ ...ad, logo: value })}
          aspectRatio="1:1"
          isLogo={true}
          allowVideo={false}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Aspect Ratio
        </label>
        <select
          value={selectedAspectRatio}
          onChange={e => onChange({ ...ad, imageAspectRatio: e.target.value as '16/9' | '1/1' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          {aspectRatioOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={ad.businessName}
            onChange={(e) => onChange({ ...ad, businessName: e.target.value })}
            placeholder="Your Business Name"
            maxLength={25}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {/* Final URL section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Final URL</label>
        <input
          type="url"
          value={ad.finalUrl}
          onChange={e => onChange({ ...ad, finalUrl: e.target.value })}
          placeholder="https://www.example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};