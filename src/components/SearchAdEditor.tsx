import React from 'react';
import { Plus, X } from 'lucide-react';
import { SearchAd } from '../types/ads';
import { ImageUploader } from './ImageUploader';

interface SearchAdEditorProps {
  ad: SearchAd;
  onChange: (ad: SearchAd) => void;
  placement: 'with-image' | 'no-image';
  onPlacementChange: (placement: 'with-image' | 'no-image') => void;
}

export const SearchAdEditor: React.FC<SearchAdEditorProps> = ({ ad, onChange, placement, onPlacementChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Placement
        </label>
        <select
          value={placement}
          onChange={e => onPlacementChange(e.target.value as 'with-image' | 'no-image')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="with-image">With image</option>
          <option value="no-image">No image</option>
        </select>
      </div>
      {placement === 'with-image' && (
        <div>
          <ImageUploader
            label="Ad Image"
            value={ad.image || ''}
            onChange={img => onChange({ ...ad, image: img })}
            aspectRatio="16/9"
            allowVideo={false}
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Headline
        </label>
        <input
          type="text"
          value={ad.headline || ''}
          onChange={e => onChange({ ...ad, headline: e.target.value })}
          placeholder="Headline"
          maxLength={30}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-500">{(ad.headline || '').length}/30</span>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={ad.description || ''}
          onChange={e => onChange({ ...ad, description: e.target.value })}
          placeholder="Description"
          maxLength={90}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-500">{(ad.description || '').length}/90</span>
      </div>
      {/* Sitelinks editing UI */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sitelinks</label>
        {(ad.sitelinks && ad.sitelinks.length > 0 ? ad.sitelinks : [
          { text: 'Discover Sheffield' },
          { text: 'Get 1:1 advice' },
          { text: 'Attend an event' },
        ]).map((link, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="Sitelink text"
              value={ad.sitelinks && ad.sitelinks[idx] ? ad.sitelinks[idx].text : link.text}
              onChange={e => {
                const newLinks = ad.sitelinks && ad.sitelinks.length > 0 ? [...ad.sitelinks] : [
                  { text: 'Discover Sheffield' },
                  { text: 'Get 1:1 advice' },
                  { text: 'Attend an event' },
                ];
                newLinks[idx].text = e.target.value;
                onChange({ ...ad, sitelinks: newLinks });
              }}
            />
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => {
                const newLinks = (ad.sitelinks && ad.sitelinks.length > 0 ? [...ad.sitelinks] : [
                  { text: 'Discover Sheffield' },
                  { text: 'Get 1:1 advice' },
                  { text: 'Attend an event' },
                ]).filter((_, i) => i !== idx);
                onChange({ ...ad, sitelinks: newLinks });
              }}
              aria-label="Remove sitelink"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 mt-1"
          onClick={() => {
            const newLinks = ad.sitelinks && ad.sitelinks.length > 0 ? [...ad.sitelinks] : [
              { text: 'Discover Sheffield' },
              { text: 'Get 1:1 advice' },
              { text: 'Attend an event' },
            ];
            newLinks.push({ text: '' });
            onChange({ ...ad, sitelinks: newLinks });
          }}
        >
          + Add sitelink
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Final URL
          </label>
          <input
            type="url"
            value={ad.finalUrl}
            onChange={e => onChange({ ...ad, finalUrl: e.target.value })}
            placeholder="https://www.example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};