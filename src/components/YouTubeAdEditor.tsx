import React from 'react';
import { YouTubeAd } from '../types/ads';
import { ImageUploader } from './ImageUploader';

interface YouTubeAdEditorProps {
  ad: YouTubeAd;
  onChange: (ad: YouTubeAd) => void;
  mode: 'desktop' | 'mobile';
  placement: string;
  onPlacementChange: (placement: string) => void;
}

export const YouTubeAdEditor: React.FC<YouTubeAdEditorProps> = ({ ad, onChange, mode, placement, onPlacementChange }) => {
  const placementOptions = mode === 'desktop'
    ? [
        { value: 'feed', label: 'Feed' },
        { value: 'suggested', label: 'Suggested videos' },
        { value: 'search', label: 'Search results' },
      ]
    : [
        { value: 'feed', label: 'Feed' },
        { value: 'shorts', label: 'Shorts' },
        { value: 'in-feed', label: 'In-stream' },
      ];

  const handleCallToActionChange = (value: string) => {
    onChange({
      ...ad,
      callToAction: value || null
    });
  };

  const aspectRatioOptions = [
    { value: '16/9', label: 'Landscape (16:9)' },
    { value: '1/1', label: 'Square (1:1)' },
    { value: '4/5', label: 'Portrait (4:5)' },
  ];

  const showAspectRatioSelector = mode === 'mobile' && placement === 'feed';
  const showBusinessLogo = (mode === 'mobile') || (mode === 'desktop' && placement === 'feed');
  const showCTA = mode === 'mobile' && (placement === 'shorts' || placement === 'feed');

  return (
    <div className="space-y-6">
      {/* Placement selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Placement
        </label>
        <select
          value={placement}
          onChange={e => onPlacementChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
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
          placeholder="Your video ad headline"
          maxLength={25}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">{ad.headline.length}/25 characters</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={ad.description}
          onChange={e => onChange({ ...ad, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {/* Thumbnail and logo section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="w-full">
          <ImageUploader
            label="Video Thumbnail"
            value={ad.videoThumbnail}
            onChange={(value) => onChange({ ...ad, videoThumbnail: value })}
            aspectRatio={ad.thumbnailAspectRatio || "16/9"}
            allowVideo={true}
          />
          {showAspectRatioSelector && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Aspect Ratio
              </label>
              <select
                value={ad.thumbnailAspectRatio || '16/9'}
                onChange={e => onChange({ ...ad, thumbnailAspectRatio: e.target.value as '16/9' | '1/1' | '4/5' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {aspectRatioOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        {showBusinessLogo && (
          <div className="w-full">
            <ImageUploader
              label="Business Logo (Optional)"
              value={ad.logo || ''}
              onChange={(value) => onChange({ ...ad, logo: value })}
              isLogo={true}
              aspectRatio="1:1"
            />
          </div>
        )}
      </div>

      {/* Two-column layout for business name and CTA */}
      <div className={showCTA ? 'grid grid-cols-2 gap-4' : ''}>
        <div className={showCTA ? '' : 'w-1/2'}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel Name (Optional)
          </label>
          <input
            type="text"
            value={ad.businessName || ''}
            onChange={e => onChange({ ...ad, businessName: e.target.value })}
            placeholder="The University of Sheffield"
            maxLength={27}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">{(ad.businessName || '').length}/27 characters</p>
        </div>
        {showCTA && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call to Action (Optional)
            </label>
            <select
              value={ad.callToAction || ''}
              onChange={(e) => handleCallToActionChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No call to action</option>
              <option value="Learn More">Learn More</option>
              <option value="Watch Now">Watch Now</option>
            </select>
          </div>
        )}
      </div>

      {/* Final URL section - moved below Channel Name */}
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