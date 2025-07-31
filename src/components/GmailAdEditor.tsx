import React from 'react';
import { GmailAd } from '../types/ads';
import { ImageUploader } from './ImageUploader';

interface GmailAdEditorProps {
  ad: GmailAd;
  onChange: (ad: GmailAd) => void;
}

interface GmailAdEditorMobileProps extends GmailAdEditorProps {
  activePreview?: string;
}

// --- Desktop Editor (default export) ---
const GmailAdEditor: React.FC<GmailAdEditorProps> = ({ ad, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject Line
        </label>
        <input
          type="text"
          value={ad.subject}
          onChange={(e) => onChange({ ...ad, subject: e.target.value })}
          placeholder="Your email subject line"
          maxLength={50}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">{ad.subject.length}/50 characters</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={ad.description}
          onChange={(e) => onChange({ ...ad, description: e.target.value })}
          placeholder="Your email preview text"
          maxLength={105}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">{ad.description.length}/105 characters</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload image <span className="text-gray-400">(16:9)</span>
          </label>
          <ImageUploader
            label=""
            value={ad.image}
            onChange={(value) => onChange({ ...ad, image: value })}
            aspectRatio="16:9"
            allowVideo={false}
          />
        </div>
        <ImageUploader
          label="Logo"
          value={ad.logo}
          onChange={(value) => onChange({ ...ad, logo: value })}
          aspectRatio="1:1"
          isLogo={true}
          allowVideo={false}
        />
      </div>
      
      {/* Name and Final URL in two-column layout */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
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
      
      {/* CTA section - moved after Final URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Call-to-action
        </label>
        <select
          value={ad.callToAction || ''}
          onChange={(e) => onChange({ ...ad, callToAction: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No call to action</option>
          <option value="Learn more">Learn more</option>
        </select>
      </div>
    </div>
  );
};

// --- Mobile Editor (for mobile-specific logic) ---
export const GmailAdEditorMobile: React.FC<GmailAdEditorMobileProps> = ({ ad, onChange, activePreview = 'collapsed' }) => {
  // Closed content type options for mobile
  const closedOptions = [
    { value: 'subject-cta', label: 'Subject line + CTA' },
    { value: 'subject-description', label: 'Subject line + Description' },
    { value: 'subject-image-card', label: 'Subject line + Image card' },
  ];
  const closedContentType = ad.closedContentType || 'subject-cta';
  
  // Check if this is for open view (expanded)
  const isOpenView = activePreview === 'expanded';

  return (
    <div className="space-y-6">
      {/* Content type selector - only for closed view */}
      {!isOpenView && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content type (closed view)
          </label>
          <select
            value={closedContentType}
            onChange={e => onChange({ ...ad, closedContentType: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {closedOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
      
      {/* Subject always shown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject Line
        </label>
        <input
          type="text"
          value={ad.subject}
          onChange={(e) => onChange({ ...ad, subject: e.target.value })}
          placeholder="Your email subject line"
          maxLength={50}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">{ad.subject.length}/50 characters</p>
      </div>
      
      {/* Description - always shown for open view, conditional for closed view */}
      {(isOpenView || closedContentType === 'subject-description' || closedContentType === 'subject-image-card') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={ad.description}
            onChange={(e) => onChange({ ...ad, description: e.target.value })}
            placeholder="Your email preview text"
            maxLength={105}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">{ad.description.length}/105 characters</p>
        </div>
      )}
      
      {/* Image and Logo - always shown for open view, conditional for closed view */}
      {(isOpenView || closedContentType === 'subject-image-card') && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload image <span className="text-gray-400">(16:9)</span>
            </label>
            <ImageUploader
              label=""
              value={ad.image}
              onChange={(value) => onChange({ ...ad, image: value })}
              aspectRatio="16:9"
              allowVideo={false}
            />
          </div>
          <ImageUploader
            label="Logo"
            value={ad.logo}
            onChange={(value) => onChange({ ...ad, logo: value })}
            aspectRatio="1:1"
            isLogo={true}
            allowVideo={false}
          />
        </div>
      )}
      
      {/* Logo for other closed view types */}
      {!isOpenView && closedContentType !== 'subject-image-card' && (
        <div className={closedContentType === 'subject-cta' || closedContentType === 'subject-description' ? 'w-1/2' : ''}>
          <ImageUploader
            label="Logo"
            value={ad.logo}
            onChange={(value) => onChange({ ...ad, logo: value })}
            aspectRatio="1:1"
            isLogo={true}
            allowVideo={false}
          />
        </div>
      )}
      
      {/* Name and Final URL - always shown in two-column layout */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={ad.businessName}
            onChange={(e) => onChange({ ...ad, businessName: e.target.value })}
            placeholder="Your Business Name"
            maxLength={25}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Final URL</label>
          <input
            type="url"
            value={ad.finalUrl}
            onChange={(e) => onChange({ ...ad, finalUrl: e.target.value })}
            placeholder="https://www.example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* CTA - always shown for open view, conditional for closed view - moved after Final URL */}
      {(isOpenView || closedContentType === 'subject-cta') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Call-to-action
          </label>
          <input
            type="text"
            value={ad.callToAction || ''}
            onChange={e => onChange({ ...ad, callToAction: e.target.value })}
            placeholder="e.g. Learn more"
            maxLength={20}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default GmailAdEditor;
