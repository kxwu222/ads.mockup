import React, { useState } from 'react';
import { LinkedInAd } from '../types/ads';
import { PreviewMode } from '../types/ads';
import { MoreHorizontalIcon, MessageCircleIcon, SendIcon, ChevronLeftIcon, ChevronRightIcon, Home, Users, PlusSquare, Bell, Briefcase, Search, MessageSquare } from 'lucide-react';


interface LinkedInAdPreviewProps {
  ad: LinkedInAd;
  mode: PreviewMode;
  placement: '1:1' | '4:5' | '2:3' | '1:1.91';
  staticImage?: string;
}

// LinkedIn Like Icon SVG Component
const LinkedInLikeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" stroke="#0077B5" />
  </svg>
);

const LinkedInImageCarousel = ({ images, ad }: { images: string[]; ad: LinkedInAd }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToSlide(newIndex);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToSlide(newIndex);
    }
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
    scrollToSlide(slideIndex);
  };

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const slideWidth = 280 + 10; // 280px width + 10px gap
      const scrollPosition = index * slideWidth;

      // Use scrollTo with immediate behavior
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'auto' // Use 'auto' for immediate scroll
      });
    }
  };

  // Touch handlers for swipe (works on mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      goToNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      goToPrevious();
    }
  };

  // Update current index based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const slideWidth = 280 + 10; // 320px width + 10px gap
        const newIndex = Math.round(scrollLeft / slideWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
          setCurrentIndex(newIndex);
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [currentIndex, images.length]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
    >
      {/* Slide Container */}
      <div
        ref={scrollContainerRef}
        className="h-full w-full flex overflow-x-scroll overflow-y-hidden gap-2.5 scrollbar-hide relative"
        style={{
          scrollbarWidth: 'none',
          width: '320px' // Constrain width to create overflow
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 h-full w-full border border-gray-200 overflow-hidden relative"
            style={{
              width: '280px',
              height: '350px',
              marginLeft: index === 0 ? '0' : '0'
            }}
          >
            {/* Image Section - 1:1 aspect ratio */}
            <div className="w-full aspect-square flex items-center justify-center relative bg-[#E5E7EB]">
              {image ? (
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <div className="text-sm font-medium text-gray-600">Ad image</div>
                  <div className="text-xs text-gray-500">
                    Use a 1:1 ratio
                  </div>
                </div>
              )}
            </div>

            {/* CTA Section for each card - adaptive width */}
            <div className="flex items-center justify-between p-3 border-t border-gray-100 bg-blue-50 min-h-[70px]">
              <div className="text-sm font-medium flex-1 mr-3">{ad.headline || 'Your headline'}</div>
              <button
                className={`border border-blue-500 text-blue-500 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap flex-shrink-0 ${ad.finalUrl ? 'hover:border-black cursor-pointer' : 'cursor-default'
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (ad.finalUrl && ad.finalUrl.trim() !== '') {
                    window.open(ad.finalUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                style={{
                  pointerEvents: ad.finalUrl ? 'auto' : 'none',
                  opacity: ad.finalUrl ? 1 : 0.6,
                  cursor: ad.finalUrl ? 'pointer' : 'default',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                {ad.callToAction || 'Apply'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="bg-white bg-opacity-70 rounded-full p-1.5 text-gray-800 hover:bg-opacity-90 transition-all shadow-sm"
          >
            <ChevronLeftIcon size={18} />
          </button>
        )}
        {currentIndex < images.length - 1 && (
          <button
            onClick={goToNext}
            className="bg-white bg-opacity-70 rounded-full p-1.5 text-gray-800 hover:bg-opacity-90 transition-all shadow-sm ml-auto"
          >
            <ChevronRightIcon size={18} />
          </button>
        )}
      </div>

      {/* Indicator dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentIndex ? 'bg-white w-3' : 'bg-white bg-opacity-50'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const LinkedInAdPreview: React.FC<LinkedInAdPreviewProps> = ({
  ad,
  mode,
  placement,
  staticImage,
}) => {
  const containerClass = mode === 'mobile' ? 'w-80' : 'max-w-md';

  // For carousel, show the first image with a "more images" indicator
  const showCarouselPreview = ad.carouselType === 'carousel' && ad.carouselImages && ad.carouselImages.length > 0;
  const carouselImages = ad.carouselImages || [];

  return (
    <div
      className={`${containerClass} mx-auto bg-[#F3F2EF] text-black overflow-hidden flex flex-col relative font-sans border border-gray-200 shadow-2xl`}
      style={{
        aspectRatio: '1179 / 2556',
      }}
    >
      {/* Status Bar (4.19%) */}
      <div
        className="w-full flex items-center px-6 z-20 flex-shrink-0 bg-white"
        style={{ height: '4.19%' }}
      >
        <div className="text-sm font-semibold">23:59</div>
        <div className="flex-1"></div>
        {/* <div className="flex space-x-2"> */}
        {/* Battery/Wifi icons mock */}
        {/* <div className="w-4 h-4 bg-black rounded-sm opacity-20"></div>
          <div className="w-4 h-4 bg-black rounded-sm opacity-20"></div>
        </div> */}
      </div>

      {/* LinkedIn App Header */}
      <div className="w-full h-10 flex items-center justify-between px-4 bg-white flex-shrink-0">
        <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200">
          {/* <img src={icon128} alt="Profile" className="w-full h-full object-cover" /> */}
          <div className="w-full h-full bg-gray-200 object-cover" />
        </div>
        <div className="flex-1 mx-4 relative">
          <div className="bg-[#EEF3F8] h-6 rounded-md flex items-center px-3">
            <Search className="w-3 h-3 text-gray-500 mr-2" />
            <span className="text-xs text-gray-500">Search</span>
          </div>
        </div>
        <div className="relative">
          <MessageSquare className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col" style={{ minHeight: 0 }}>

        {/* Ad Card */}
        <div className="bg-white mb-2 mt-2 shadow-sm">
          {/* Post header */}
          <div className="flex items-center p-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white border border-gray-100">
              <img src={'/icon128.png'} alt="Logo" className="w-10 h-10 object-cover flex-shrink-0" />
            </div>
            <div className="ml-3">
              <div className="font-semibold text-sm text-gray-900">{ad.businessName || 'Username'}</div>
              <div className="text-xs text-gray-500">Promoted</div>
            </div>
            <div className="ml-auto">
              <button className="text-gray-500">
                <MoreHorizontalIcon size={20} />
              </button>
            </div>
          </div>

          {/* Post caption */}
          <div className="px-3 pb-2">
            <p className="text-sm text-gray-900">{ad.description || 'Your LinkedIn ad description goes here.'}</p>
          </div>

          {/* Image/Video content */}
          {showCarouselPreview ? (
            <div className="w-full relative overflow-hidden" style={{ height: '350px' }}>
              {/* Main carousel display */}
              <LinkedInImageCarousel images={carouselImages} ad={ad} />
            </div>
          ) : (
            <div
              className="w-full bg-[#E5E7EB] flex flex-col items-center justify-center relative overflow-hidden"
              style={{
                aspectRatio: ad.mediaType === 'video' ? '9/16' : (placement === '4:5' ? '4/5' : placement === '1:1' ? '1/1' : '1.91/1')
              }}
            >
              {/* Export key-color background layer - behind media for video transparency */}
              <div
                className="absolute inset-0 z-0"
                style={{ backgroundColor: 'rgb(1, 2, 3)' }}
              />
              {staticImage ? (
                <img
                  src={staticImage}
                  alt="Ad Export"
                  className="w-full h-full object-cover"
                />
              ) : ad.image ? (
                ad.image.startsWith('data:video') || ad.mediaType === 'video' ? (
                  <video
                    src={ad.image}
                    className="w-full h-full object-contain relative z-10"
                    style={{ backgroundColor: 'rgb(1, 2, 3)', objectFit: 'contain' }}
                    crossOrigin="anonymous"
                    muted
                    loop
                    playsInline
                    controls
                  />
                ) : (
                  <img
                    src={ad.image}
                    alt="Ad"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <div className="text-sm font-medium text-gray-600">
                    {ad.mediaType === 'video' ? 'Ad video' : 'Ad image'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {ad.mediaType === 'video' ? 'Use a 9:16 ratio' : `Use a ${placement} ratio`}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CTA Banner for Single Image/Video */}
          {!showCarouselPreview && (
            <div className="flex items-center justify-between p-3 border-t border-gray-100 bg-[#F3F6F8]">
              <div className="text-sm font-semibold text-gray-900 flex-1 mr-3">{ad.headline || 'Your headline'}</div>
              <button
                className={`border border-gray-600 text-gray-600 rounded-full px-4 py-1 text-sm font-semibold whitespace-nowrap flex-shrink-0 hover:border-black hover:bg-gray-100 transition-colors ${ad.finalUrl ? 'cursor-pointer' : 'cursor-default'
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (ad.finalUrl && ad.finalUrl.trim() !== '') {
                    window.open(ad.finalUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                style={{
                  pointerEvents: ad.finalUrl ? 'auto' : 'none',
                  opacity: ad.finalUrl ? 1 : 0.6,
                }}
              >
                {ad.callToAction || 'Apply'}
              </button>
            </div>
          )}

          {/* Engagement stats */}
          <div className="px-3 py-2 border-t border-gray-100 flex items-center text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-1 text-xs">
                <LinkedInLikeIcon />
              </div>
              <span className="ml-1 hover:text-blue-600 hover:underline cursor-pointer">15</span>
            </div>
            <div className="ml-auto hover:text-blue-600 hover:underline cursor-pointer">1 comment • 1 share</div>
          </div>

          {/* Action buttons */}
          <div className="flex border-t border-gray-100 px-1 py-1">
            <button className="flex-1 py-2 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: 'scaleX(-1)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
              </svg>
              <span className="text-[10px] font-semibold">Like</span>
            </button>
            <button className="flex-1 py-2 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <MessageCircleIcon className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-semibold">Comment</span>
            </button>
            <button className="flex-1 py-2 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
              <span className="text-[10px] font-semibold">Share</span>
            </button>
            <button className="flex-1 py-2 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <SendIcon className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-semibold">Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* LinkedIn Bottom Navigation */}
      <div className="w-full h-12 bg-white border-t border-gray-200 flex items-center justify-around flex-shrink-0 pb-1">
        <div className="flex flex-col items-center justify-center w-16">
          <Home className="w-5 h-5 text-gray-900" />
          <span className="text-[9px] text-gray-900 mt-0.5">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center w-16">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-[9px] text-gray-500 mt-0.5">My Network</span>
        </div>
        <div className="flex flex-col items-center justify-center w-16">
          <PlusSquare className="w-5 h-5 text-gray-500" />
          <span className="text-[9px] text-gray-500 mt-0.5">Post</span>
        </div>
        <div className="flex flex-col items-center justify-center w-16">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="text-[9px] text-gray-500 mt-0.5">Notifications</span>
        </div>
        <div className="flex flex-col items-center justify-center w-16">
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span className="text-[9px] text-gray-500 mt-0.5">Jobs</span>
        </div>
      </div>
    </div>
  );
};