import React, { useState } from 'react';
import { Header } from './components/Header';
import { AdTypeSelector } from './components/AdTypeSelector';
import { FacebookAdEditor } from './components/FacebookAdEditor';
import { FacebookAdPreview } from './components/FacebookAdPreview';
import { InstagramAdEditor } from './components/InstagramAdEditor';
import { InstagramAdPreview } from './components/InstagramAdPreview';
import { TikTokAdEditor } from './components/TikTokAdEditor';
import { TikTokAdPreview } from './components/TikTokAdPreview';
import { LinkedInAdEditor } from './components/LinkedInAdEditor';
import { LinkedInAdPreview } from './components/LinkedInAdPreview';
import { AdType, FacebookAd, InstagramAd, TikTokAd, LinkedInAd, PreviewMode } from './types/ads';

function App() {
  const [activeAdType, setActiveAdType] = useState<AdType>('facebook');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('mobile');
  const [activePreview, setActivePreview] = useState('feed');

  const [facebookAd, setFacebookAd] = useState<FacebookAd>({
    headline: '',
    description: '',
    image: '',
    businessName: '',
    finalUrl: '',
    callToAction: '',
    aspectRatio: '4:5',
    mediaType: 'image',
  });

  const [facebookAdPlacement, setFacebookAdPlacement] = useState<'4:5' | '1.91:1' | '1:1'>('4:5');

  const [instagramAd, setInstagramAd] = useState<InstagramAd>({
    headline: '',
    description: '',
    image: '',
    businessName: '',
    finalUrl: '',
    callToAction: '',
    aspectRatio: '4:5',
    mediaType: 'image',
  });

  const [instagramAdPlacement, setInstagramAdPlacement] = useState<'1:1' | '4:5' | '9:16' | '9:16-reel'>('4:5');

  const [tiktokAd, setTiktokAd] = useState<TikTokAd>({
    headline: '',
    description: '',
    video: '',
    businessName: '',
    finalUrl: '',
    callToAction: '',
    videoLength: 15,
  });

  const [tiktokAdPlacement, setTiktokAdPlacement] = useState('feed');

  const [linkedinAd, setLinkedinAd] = useState<LinkedInAd>({
    headline: '',
    description: '',
    image: '',
    businessName: '',
    finalUrl: '',
    callToAction: '',
    aspectRatio: '1:1',
    mediaType: 'image',
    carouselType: 'single',
    carouselImages: ['', ''], // Two default images
  });

  const [linkedinAdPlacement, setLinkedinAdPlacement] = useState<'1:1' | '4:5' | '2:3' | '1:1.91'>('1:1');

  // Reset preview when ad type changes
  const handleAdTypeChange = (type: AdType) => {
    setActiveAdType(type);
    const defaultPreviews = {
      facebook: 'feed',
      instagram: 'feed',
      tiktok: 'feed',
      linkedin: 'feed'
    };
    setActivePreview(defaultPreviews[type]);
    // Reset placements when changing ad types
    if (type === 'facebook') {
      setFacebookAdPlacement('4:5');
    }
    if (type === 'instagram') {
      setInstagramAdPlacement('4:5');
    }
    if (type === 'tiktok') {
      setTiktokAdPlacement('feed');
    }
    if (type === 'linkedin') {
      setLinkedinAdPlacement('1:1');
    }
  };

  // Handle preview mode changes
  const handlePreviewModeChange = (mode: PreviewMode) => {
    setPreviewMode(mode);
    // Set default placement for Facebook ads when switching to mobile
    if (activeAdType === 'facebook') {
      setFacebookAdPlacement('4:5');
    }
    if (activeAdType === 'instagram') {
      setInstagramAdPlacement('4:5');
    }
    if (activeAdType === 'tiktok') {
      setTiktokAdPlacement('feed');
    }
    if (activeAdType === 'linkedin') {
      setLinkedinAdPlacement('1:1');
    }
  };

  const renderEditor = () => {
    switch (activeAdType) {
      case 'facebook':
        return <FacebookAdEditor ad={facebookAd} onChange={setFacebookAd} placement={facebookAdPlacement} onPlacementChange={setFacebookAdPlacement} />;
      case 'instagram':
        return <InstagramAdEditor ad={instagramAd} onChange={setInstagramAd} placement={instagramAdPlacement} onPlacementChange={setInstagramAdPlacement} />;
      case 'tiktok':
        return <TikTokAdEditor ad={tiktokAd} onChange={setTiktokAd} placement={tiktokAdPlacement} onPlacementChange={setTiktokAdPlacement} />;
      case 'linkedin':
        return <LinkedInAdEditor ad={linkedinAd} onChange={setLinkedinAd} placement={linkedinAdPlacement} onPlacementChange={setLinkedinAdPlacement} />;
      default:
        return null;
    }
  };

  const renderPreview = () => {
    switch (activeAdType) {
      case 'facebook':
        return <FacebookAdPreview ad={facebookAd} mode={previewMode} placement={facebookAdPlacement} />;
      case 'instagram':
        return <InstagramAdPreview ad={instagramAd} mode={previewMode} placement={instagramAdPlacement} />;
      case 'tiktok':
        return <TikTokAdPreview ad={tiktokAd} mode={previewMode} placement={tiktokAdPlacement} />;
      case 'linkedin':
        return <LinkedInAdPreview ad={linkedinAd} mode={previewMode} placement={linkedinAdPlacement} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdTypeSelector activeType={activeAdType} onTypeChange={handleAdTypeChange} />
        <div className="flex gap-8">
          <div className="flex-shrink-0" style={{ flexBasis: '40%', maxWidth: '40%' }}>
            <div className="bg-white shadow-sm rounded-lg p-6 h-[730px] overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {activeAdType.charAt(0).toUpperCase() + activeAdType.slice(1)} Ad Editor
              </h2>
              {renderEditor()}
            </div>
          </div>
          <div className="flex-grow" style={{ flexBasis: '60%', maxWidth: '60%' }}>
            <div className="bg-gray-100 rounded-lg p-6 h-[730px]">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Preview ({previewMode === 'desktop' ? 'Desktop' : 'Mobile'})
                </h2>
              </div>
              <div className="flex items-center justify-center h-[calc(730px-120px)]">
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
