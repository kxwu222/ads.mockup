import React from 'react';
import { AdType } from '../types/ads';
import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

interface PreviewSelectorProps {
  adType: AdType;
  activePreview: string;
  onPreviewChange: (preview: string) => void;
  mode?: string; // 'desktop' or 'mobile'
}

// Add a type for preview options
interface PreviewOption {
  id: string;
  label: string;
  desktopOnly?: boolean;
}

const previewOptions: Record<string, PreviewOption[]> = {
  search: [
    { id: 'serp-top', label: 'Search Results (Top)' },
    { id: 'serp-bottom', label: 'Search Results (Bottom)' },
    { id: 'shopping', label: 'Shopping Results' }
  ],
  display: [
    { id: 'banner', label: 'Banner Ad' },
    { id: 'sidebar', label: 'Sidebar Ad', desktopOnly: true },
    { id: 'native', label: 'Native Content' },
    { id: 'interstitial', label: 'Interstitial' }
  ],
  youtube: [
    { id: 'skippable', label: 'Skippable In-Stream' },
    { id: 'non-skippable', label: 'Non-Skippable' },
    { id: 'discovery', label: 'Video Discovery' },
    { id: 'bumper', label: 'Bumper Ad' }
  ],
  discover: [
    { id: 'feed', label: 'Discover Feed' },
    { id: 'youtube-home', label: 'YouTube Home' },
    { id: 'gmail-promotions', label: 'Gmail Promotions' }
  ],
  gmail: [
    { id: 'collapsed', label: 'Collapsed View' },
    { id: 'expanded', label: 'Expanded View' },
    { id: 'promotions-tab', label: 'Promotions Tab' }
  ]
};

export const PreviewSelector: React.FC<PreviewSelectorProps> = ({ 
  adType, 
  activePreview, 
  onPreviewChange, 
  mode = 'desktop' 
}) => {
  let options = previewOptions[adType] || [];
  if (adType === 'display') {
    if (mode === 'mobile') {
      // Remove native, rename sidebar to Native Ad, rename interstitial to Interstitial Ad
      options = options
        .filter(opt => opt.id !== 'native')
        .map((opt, idx) => {
          if (opt.id === 'sidebar') return { ...opt, label: 'Native Ad' };
          if (opt.id === 'interstitial') return { ...opt, label: 'Interstitial Ad' };
          return opt;
        });
    } else {
      options = options.filter(opt => opt.id !== 'interstitial');
    }
  }

  const selected = options.find(opt => opt.id === activePreview) || options[0];

  return (
    <div className="mb-4">
      {/* Remove any JSX for the preview placement dropdown and its label. */}
    </div>
  );
};