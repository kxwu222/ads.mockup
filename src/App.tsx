import React, { useState } from 'react';
import { Header } from './components/Header';
import { AdTypeSelector } from './components/AdTypeSelector';
import { PreviewSelector } from './components/PreviewSelector';
import { SearchAdEditor } from './components/SearchAdEditor';
import { DisplayAdEditor } from './components/DisplayAdEditor';
import { YouTubeAdEditor } from './components/YouTubeAdEditor';
import { DiscoverAdEditor } from './components/DiscoverAdEditor';
import GmailAdEditor, { GmailAdEditorMobile } from './components/GmailAdEditor';
import { SearchAdPreview } from './components/SearchAdPreview';
import { DisplayAdPreview } from './components/DisplayAdPreview';
import { YouTubeAdPreview } from './components/YouTubeAdPreview';
import { DiscoverAdPreview } from './components/DiscoverAdPreview';
import { GmailAdPreview } from './components/GmailAdPreview';
import { AdType, PreviewMode, SearchAd, DisplayAd, YouTubeAd, DiscoverAd, GmailAd } from './types/ads';

function App() {
  const [activeAdType, setActiveAdType] = useState<AdType>('search');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [activePreview, setActivePreview] = useState<string>('collapsed');

  // Add placement state for Search ads
  const [searchAdPlacement, setSearchAdPlacement] = useState<'with-image' | 'no-image'>('no-image');
  
  // Add placement state for Display ads
  const [displayAdPlacement, setDisplayAdPlacement] = useState('banner');

  // Placement state for YouTube ads
  const [youtubeAdPlacement, setYoutubeAdPlacement] = useState('feed');

  const [searchAd, setSearchAd] = useState<SearchAd>({
    headline: 'Your First Headline',
    description: 'Your first description goes here.',
    displayUrl: 'www.example.com',
    finalUrl: 'https://www.example.com',
    sitelinks: [],
    image: '',
  });
  
  const [displayAd, setDisplayAd] = useState<DisplayAd>({
    headline: 'Your compelling headline',
    description: 'Describe your product or service in a compelling way.',
    image: '',
    logo: '',
    businessName: 'The University of Sheffield',
    finalUrl: 'https://www.example.com',
    callToAction: 'Learn more',
    ctaType: 'learn-more-box',
    showCTA: true,
  });
  
  const [youtubeAd, setYoutubeAd] = useState<YouTubeAd>({
    videoThumbnail: '',
    headline: 'Your video headline',
    description: 'Video description',
    callToAction: 'Watch Now',
    finalUrl: 'https://www.example.com',
    businessName: 'The University of Sheffield'
  });
  
  const [discoverAd, setDiscoverAd] = useState<DiscoverAd>({
    headline: 'Your discover headline',
    description: 'Describe your product or service.',
    image: '',
    logo: '',
    businessName: 'The University of Sheffield',
    finalUrl: 'https://www.example.com'
  });
  
  const [gmailAd, setGmailAd] = useState<GmailAd>({
    subject: 'Your email subject',
    description: 'Your email preview text.',
    image: '',
    logo: '',
    businessName: 'The University of Sheffield',
    finalUrl: 'https://www.example.com',
    callToAction: 'Learn more',
    contentType: 'description-cta',
    closedContentType: 'subject-cta'
  });

  const [gmailIsOpen, setGmailIsOpen] = useState(false); // NEW: controls Gmail mobile open/closed

  // Reset preview when ad type changes
  const handleAdTypeChange = (type: AdType) => {
    setActiveAdType(type);
    const defaultPreviews = {
      search: 'serp-top',
      display: 'banner',
      youtube: 'feed',
      discover: 'feed',
      gmail: 'collapsed'
    };
    setActivePreview(defaultPreviews[type]);
    // Reset placements when changing ad types
    if (type === 'display' && previewMode === 'mobile') {
      setDisplayAdPlacement('banner');
    }
    if (type === 'youtube') {
      setYoutubeAdPlacement('feed');
    }
  };

  // Handle preview mode changes
  const handlePreviewModeChange = (mode: PreviewMode) => {
    setPreviewMode(mode);
    // Set default placement for Display ads when switching to mobile
    if (activeAdType === 'display' && mode === 'mobile') {
      setDisplayAdPlacement('banner');
    }
    if (activeAdType === 'youtube') {
      setYoutubeAdPlacement('feed');
    }
  };
  const renderEditor = () => {
    switch (activeAdType) {
      case 'search':
        return <SearchAdEditor ad={searchAd} onChange={setSearchAd} placement={searchAdPlacement} onPlacementChange={setSearchAdPlacement} />;
      case 'display':
        return <DisplayAdEditor ad={displayAd} onChange={setDisplayAd} placement={displayAdPlacement} mode={previewMode} onPlacementChange={setDisplayAdPlacement} />;
      case 'youtube':
        return <YouTubeAdEditor ad={youtubeAd} onChange={setYoutubeAd} placement={youtubeAdPlacement} mode={previewMode} onPlacementChange={setYoutubeAdPlacement} />;
      case 'discover':
        return <DiscoverAdEditor ad={discoverAd} onChange={setDiscoverAd} />;
      case 'gmail':
        return previewMode === 'mobile'
          ? <GmailAdEditorMobile ad={gmailAd} onChange={setGmailAd} isOpen={gmailIsOpen} />
          : <GmailAdEditor ad={gmailAd} onChange={setGmailAd} />;
      default:
        return null;
    }
  };

  const renderPreview = () => {
    switch (activeAdType) {
      case 'search':
        return <SearchAdPreview ad={searchAd} mode={previewMode} placement={searchAdPlacement} />;
      case 'display':
        return <DisplayAdPreview ad={displayAd} mode={previewMode} placement={displayAdPlacement} />;
      case 'youtube':
        return <YouTubeAdPreview ad={youtubeAd} mode={previewMode} placement={youtubeAdPlacement} />;
      case 'discover':
        return <DiscoverAdPreview ad={discoverAd} mode={previewMode} />;
      case 'gmail':
        return <GmailAdPreview ad={gmailAd} mode={previewMode} isOpen={gmailIsOpen} onOpenChange={setGmailIsOpen} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header previewMode={previewMode} onPreviewModeChange={handlePreviewModeChange} />
      
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdTypeSelector activeType={activeAdType} onTypeChange={handleAdTypeChange} />
        <div className="flex gap-8">
          <div className="flex-shrink-0" style={{ flexBasis: '40%', maxWidth: '40%' }}>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {activeAdType.charAt(0).toUpperCase() + activeAdType.slice(1)} Ad Editor
              </h2>
              {renderEditor()}
            </div>
          </div>
          <div className="flex-grow" style={{ flexBasis: '60%', maxWidth: '60%' }}>
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Preview ({previewMode === 'desktop' ? 'Desktop' : 'Mobile'})
                </h2>
                <PreviewSelector 
                  adType={activeAdType}
                  activePreview={activePreview}
                  onPreviewChange={setActivePreview}
                  mode={previewMode}
                />
              </div>
              <div className="flex items-center justify-center min-h-96">
                {renderPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
