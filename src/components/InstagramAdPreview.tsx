import React, { useState, useRef, useEffect } from 'react';
import { InstagramAd } from '../types/ads';
import { PreviewMode } from '../types/ads';
import { HeartIcon, MessageCircleIcon, SendIcon, MoreHorizontalIcon, BookmarkIcon, ChevronRightIcon, XIcon, ChevronUpIcon, Volume2, VolumeX } from 'lucide-react';
import icon128 from '../../icon128.png';

interface InstagramAdPreviewProps {
  ad: InstagramAd;
  mode: PreviewMode;
  placement: '1:1' | '4:5' | '9:16';
}

export const InstagramAdPreview: React.FC<InstagramAdPreviewProps> = ({
  ad,
  mode,
  placement,
}) => {
  // Adjust container width based on aspect ratio
  const getContainerWidth = () => {
    if (mode === 'mobile') {
      return 'w-[280px]'; // Fixed 280px width for all ratios on mobile
    } else {
      // Desktop - adjust based on aspect ratio
      if (placement === '4:5') {
        return 'max-w-sm';
      } else {
        return 'max-w-md';
      }
    }
  };

  const containerClass = getContainerWidth();
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Update progress bar based on video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ad.image?.startsWith('data:video')) return;

    let animationFrameId: number;

    const updateProgress = () => {
      if (video.duration && video.duration > 0) {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
      }
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    const handleTimeUpdate = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', updateProgress);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', updateProgress);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [ad.image]);

  // Render different layout for 9:16 aspect ratio
  if (placement === '9:16') {
    return (
      <div className={`${containerClass} mx-auto bg-black text-white overflow-hidden flex flex-col relative`} style={{ aspectRatio: '9/16' }}>
        {/* Background video/image */}
        {ad.image && (
          <div className="absolute inset-0">
            {ad.image.startsWith('data:video') ? (
              <video
                ref={videoRef}
                src={ad.image}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
                playsInline
                autoPlay
              />
            ) : (
              <img
                src={ad.image}
                alt="Ad"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* Mute/Unmute button - center of screen */}
        {ad.image && ad.image.startsWith('data:video') && (
          <button
            onClick={toggleMute}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white z-20 opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        )}

        {/* 9:16 Header with progress bar */}
        <div className="w-full flex flex-col relative z-10">
          <div className="w-full h-1 bg-gray-700">
            <div 
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="w-full px-3 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-[#440099] rounded-full mr-2 flex items-center justify-center">
                <img src={icon128} alt="Logo" className="w-6 h-6 rounded-full" />
              </div>
              <div>
                <p className="text-xs font-semibold">{ad.businessName || 'The University of Sheffield'}</p>
                <p className="text-xs text-gray-300">Sponsored</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="touch-manipulation">
                <MoreHorizontalIcon className="w-3 h-3" />
              </button>
              <button className="touch-manipulation">
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 9:16 Main content - placeholder only when no content */}
        {!ad.image && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <div className="text-xs font-medium">Ad video</div>
          </div>
        )}

        {/* 9:16 Footer with actions - fixed at bottom */}
        <div className="w-full pb-4 flex flex-col items-center relative z-10 mt-auto">
          <button className="mb-2 touch-manipulation">
            <ChevronUpIcon className="w-4 h-4" />
          </button>
          <div className="w-full px-4 flex items-center justify-between">
            <div className="flex-1"></div>
            <button className="bg-white text-black font-medium py-2 px-6 rounded-full text-sm touch-manipulation">
              {ad.callToAction || 'Learn More'}
            </button>
            <div className="flex-1 flex justify-end">
              <button className="p-1 touch-manipulation">
                <SendIcon className="w-4 h-4 transform rotate-45" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular Instagram post layout for 1:1 and 4:5
  return (
    <div className={`${containerClass} mx-auto bg-white border border-gray-200 rounded-sm`}>
      {/* Header */}
      <div className="flex items-center p-2">
        <div className="w-6 h-6 rounded-full bg-[#440099] flex items-center justify-center">
          <img src={icon128} alt="Logo" className="w-6 h-6 rounded-full" />
        </div>
        <div className="ml-2">
          <p className="text-xs font-semibold">{ad.businessName || 'The University of Sheffield'}</p>
          <p className="text-xs text-gray-500">Sponsored</p>
        </div>
        <button className="ml-auto">
          <MoreHorizontalIcon className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Image Content */}
      <div 
        className="w-full bg-gray-200 flex flex-col items-center justify-center text-gray-500"
        style={{ 
          aspectRatio: placement === '4:5' ? '4/5' : '1/1',
          maxWidth: mode === 'mobile' ? '280px' : 'auto'
        }}
      >
        {ad.image ? (
          ad.image.startsWith('data:video') ? (
            <video
              src={ad.image}
              className="w-full h-full object-cover"
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
          <div className="flex flex-col items-center justify-center">
            <svg className="w-8 h-8 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-xs font-medium">Ad image</div>
            <div className="text-xs text-gray-400">
              Use a {placement === '4:5' ? '4:5' : placement === '1:1' ? '1:1' : '9:16'} ratio
            </div>
          </div>
        )}
      </div>

      {/* Learn More Button */}
      <div className="border-t border-gray-200 p-2">
        <a href="#" className="flex items-center justify-between text-xs font-semibold">
          {ad.callToAction || 'Learn More'}
          <ChevronRightIcon className="w-4 h-4" />
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center p-2 pt-0">
        <button className="mr-3">
          <HeartIcon className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
        </button>
        <button className="mr-3">
          <MessageCircleIcon className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
        </button>
        <button>
          <SendIcon className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
        </button>
        <button className="ml-auto">
          <BookmarkIcon className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
        </button>
      </div>

      {/* Likes and Caption */}
      <div className="px-2 pb-2">
        <p className="font-semibold text-xs">15 Likes</p>
        <p className="text-xs mt-1">
          <span className="font-semibold">{ad.businessName || 'The University of Sheffield'}</span> {ad.description || 'Your Instagram ad description goes here.'}
        </p>
      </div>
    </div>
  );
}; 