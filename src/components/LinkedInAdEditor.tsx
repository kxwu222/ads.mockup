import React from 'react';
import { LinkedInAd } from '../types/ads';
import { ImageUploader } from './ImageUploader';

interface LinkedInAdEditorProps {
  ad: LinkedInAd;
  onChange: (ad: LinkedInAd) => void;
  placement: '1:1' | '4:5' | '2:3' | '1:1.91';
  onPlacementChange: (placement: '1:1' | '4:5' | '2:3' | '1:1.91') => void;
}

export const LinkedInAdEditor: React.FC<LinkedInAdEditorProps> = ({
  ad,
  onChange,
  placement,
  onPlacementChange,
}) => {
  const handleChange = (field: keyof LinkedInAd, value: string | number | string[]) => {
    onChange({ ...ad, [field]: value });
  };

  const handleCarouselImageChange = (index: number, image: string) => {
    const currentImages = ad.carouselImages || [];
    const newImages = [...currentImages];
    newImages[index] = image;
    handleChange('carouselImages', newImages);
  };

  const addCarouselImage = () => {
    const currentImages = ad.carouselImages || [];
    handleChange('carouselImages', [...currentImages, '']);
  };

  const removeCarouselImage = (index: number) => {
    const currentImages = ad.carouselImages || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    handleChange('carouselImages', newImages);
  };

  const isSingleImage = ad.carouselType === 'single' || !ad.carouselType;
  const isVideo = ad.mediaType === 'video';
  const isCarousel = ad.carouselType === 'carousel';

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="carouselType"
              value="single"
              checked={isSingleImage}
              onChange={(e) => handleChange('carouselType', e.target.value as 'single' | 'carousel')}
              className="mr-2"
            />
            <span className="text-sm">Single Image/Video</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="carouselType"
              value="carousel"
              checked={isCarousel}
              onChange={(e) => handleChange('carouselType', e.target.value as 'single' | 'carousel')}
              className="mr-2"
            />
            <span className="text-sm">Carousel</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Media Type
        </label>
        <div className="flex space-x-4">
          {!isCarousel && (
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
              value={isCarousel ? 'image' : ad.mediaType}
              checked={isCarousel ? true : ad.mediaType === 'video'}
              onChange={(e) => handleChange('mediaType', isCarousel ? 'image' : e.target.value as 'image' | 'video')}
              className="mr-2"
            />
            <span className="text-sm">{isCarousel ? 'Image' : 'Video'}</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Headline
        </label>
        <input
          type="text"
          value={ad.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          maxLength={isCarousel ? 45 : isVideo ? 200 : 70}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your headline"
        />
        <div className="text-xs text-gray-500 mt-1">
          {ad.headline.length}/{isCarousel ? 45 : isVideo ? 200 : 70} characters
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
          maxLength={isCarousel ? 255 : isVideo ? 600 : 150}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your ad description"
        />
        <div className="text-xs text-gray-500 mt-1">
          {ad.description.length}/{isCarousel ? 255 : isVideo ? 600 : 150} characters
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
          placeholder="Enter username"
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
          placeholder="Apply"
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
          label={isCarousel ? 'Carousel Images' : ad.mediaType === 'video' ? 'Video' : 'Image'}
          value={isCarousel ? ad.carouselImages?.[0] || '' : ad.image}
          onChange={(image) => {
            if (isCarousel) {
              const newCarouselImages = [...(ad.carouselImages || []), image];
              handleChange('carouselImages', newCarouselImages);
            } else {
              handleChange('image', image);
            }
          }}
          aspectRatio={placement}
          allowVideo={!isCarousel && ad.mediaType === 'video'}
        />
      </div>
    </div>
  );
}; 