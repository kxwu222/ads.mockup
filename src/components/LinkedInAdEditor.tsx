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
    // Ensure array has enough elements
    while (newImages.length <= index) {
      newImages.push('');
    }
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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              onChange={(e) => {
                const newCarouselType = e.target.value as 'single' | 'carousel';
                handleChange('carouselType', newCarouselType);
                // Initialize carousel images if switching to carousel
                if (newCarouselType === 'carousel' && (!ad.carouselImages || ad.carouselImages.length < 2)) {
                  handleChange('carouselImages', ['', '']);
                }
              }}
              className="mr-2"
            />
            <span className="text-sm">Carousel</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Headline
        </label>
        <input
          type="text"
          value={ad.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          maxLength={isCarousel ? 45 : 70}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter your headline"
        />
        <div className="text-xs text-gray-500 mt-1">
          {ad.headline.length}/{isCarousel ? 45 : 70} characters
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={ad.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          maxLength={isCarousel ? 255 : 150}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter your ad description"
        />
        <div className="text-xs text-gray-500 mt-1">
          {ad.description.length}/{isCarousel ? 255 : 150} characters
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          value={ad.businessName}
          onChange={(e) => handleChange('businessName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter username"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

      {/* Single Image/Video Upload */}
      {!isCarousel && (
        <div>
          <ImageUploader
            label="Asset"
            value={ad.image}
            onChange={(image) => handleChange('image', image)}
            aspectRatio={placement}
            allowVideo={true}
            autoDetect={true}
          />
        </div>
      )}

      {/* Carousel Images Section */}
      {isCarousel && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Carousel Images
            </label>
            <button
              type="button"
              onClick={addCarouselImage}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add more
            </button>
          </div>
          <div className="bg-blue-50 p-3 rounded-md mb-3">
            <div className="text-xs text-gray-600">File Type: jpg or png up to 10MB</div>
            <div className="text-xs text-gray-600 mt-1">Number of carousel cards: 2-10</div>
          </div>
          <div className="space-y-3">
            {/* First two images in two-column layout */}
            <div className="flex gap-3">
              {(ad.carouselImages || ['', '']).slice(0, 2).map((image, index) => (
                <div key={index} className="flex justify-center">
                  <ImageUploader
                    label={`Image ${index + 1}`}
                    value={image || ''}
                    onChange={(newImage) => handleCarouselImageChange(index, newImage)}
                    aspectRatio="1:1"
                    allowVideo={false}
                    autoDetect={false}
                  />
                </div>
              ))}
            </div>
            
            {/* Additional images in two-column rows */}
            {(() => {
              const additionalImages = (ad.carouselImages || []).slice(2);
              const rows = [];
              
              for (let i = 0; i < additionalImages.length; i += 2) {
                const image1 = additionalImages[i];
                const image2 = additionalImages[i + 1];
                const imageNumber1 = i + 3;
                const imageNumber2 = i + 4;
                
                rows.push(
                  <div key={i + 2} className="flex gap-3">
                    <div className="flex-1 relative">
                      <ImageUploader
                        label={`Image ${imageNumber1}`}
                        value={image1 || ''}
                        onChange={(newImage) => handleCarouselImageChange(i + 2, newImage)}
                        aspectRatio="1:1"
                        allowVideo={false}
                        autoDetect={false}
                      />
                    </div>
                    <div className="flex-1 relative">
                      {image2 !== undefined ? (
                        <ImageUploader
                          label={`Image ${imageNumber2}`}
                          value={image2 || ''}
                          onChange={(newImage) => handleCarouselImageChange(i + 3, newImage)}
                          aspectRatio="1:1"
                          allowVideo={false}
                          autoDetect={false}
                        />
                      ) : (
                        <div className="flex-1">
                          {/* Empty space for next image */}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              
              return rows;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}; 