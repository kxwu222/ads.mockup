import React from 'react';
import { DisplayAd } from '../types/ads';
import { ImageUploader } from './ImageUploader';

interface DisplayAdEditorProps {
  ad: DisplayAd;
  onChange: (ad: DisplayAd) => void;
  mode: 'desktop' | 'mobile';
  placement: string;
  onPlacementChange: (placement: string) => void;
}

export const DisplayAdEditor: React.FC<DisplayAdEditorProps> = ({
  ad,
  onChange,
  mode,
  placement,
  onPlacementChange,
}) => {
  const placementOptions = mode === 'desktop'
    ? [
        { value: 'banner', label: 'Banner' },
        { value: 'sidebar', label: 'Sidebar content card' },
      ]
    : [
        { value: 'banner', label: 'Banner' },
        { value: 'native', label: 'Native content card' },
        { value: 'interstitial', label: 'Interstitial card' },
      ];

  const ctaOptions = [
    { value: 'button-purple',   label: 'Purple circle (arrow)' },
    { value: 'button-black',    label: 'Black circle (arrow)' },
    { value: 'open',            label: 'Open (text + arrow)' },
    { value: 'learn-more',      label: 'Learn more (text + arrow)' },
    { value: 'learn-more-box',  label: 'Learn more (outlined box)' },
  ];

  const supportsCTA = placement !== 'interstitial';

  return (
    <div className="space-y-6">
      {/* Placement Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Placement
        </label>
        <select
          value={placement}
          onChange={e => onPlacementChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {placementOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Headline
        </label>
        <input
          type="text"
          value={ad.headline}
          onChange={(e) => onChange({ ...ad, headline: e.target.value })}
          placeholder="Your compelling headline"
          maxLength={30}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">{ad.headline.length}/30 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={ad.description}
          onChange={(e) => onChange({ ...ad, description: e.target.value })}
          placeholder="Describe your product or service"
          maxLength={90}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">{ad.description.length}/90 characters</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ImageUploader
          label="Main Image"
          value={ad.image}
          onChange={(value) => onChange({ ...ad, image: value })}
          aspectRatio="16:9"
          allowVideo={true}
        />
        {/* Logo Upload */}
        {placement !== 'banner' && (
          <ImageUploader
            label="Logo (Optional)"
            value={ad.logo}
            onChange={(value) => onChange({ ...ad, logo: value })}
            aspectRatio="1:1"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* University Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            University Name (Optional)
          </label>
          <input
            type="text"
            maxLength={27}
            value={ad.businessName || ''}
            onChange={(e) => onChange({ ...ad, businessName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter university name"
          />
          <div className="text-xs text-gray-500 mt-1">
            {(ad.businessName || '').length}/27 characters
          </div>
        </div>
        {supportsCTA && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button style
            </label>
            <select
              value={ad.ctaType || 'button-purple'}
              onChange={e => onChange({ ...ad, ctaType: placement === 'interstitial' ? 'learn-more-box' : e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(placement === 'interstitial'
                ? ctaOptions.filter(o => o.value === 'learn-more-box')
                : ctaOptions
              ).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Final URL
        </label>
        <input
          type="url"
          value={ad.finalUrl}
          onChange={(e) => onChange({ ...ad, finalUrl: e.target.value })}
          placeholder="https://www.example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
