import React, { useState, useRef, useEffect } from 'react';
import { InstagramAd } from '../types/ads';
import { PreviewMode } from '../types/ads';
import { HeartIcon, MessageCircleIcon, SendIcon, MoreHorizontalIcon, BookmarkIcon, ChevronRightIcon, XIcon, ChevronUpIcon, Volume2, VolumeX, HomeIcon, SearchIcon, PlusIcon, Play, Pause } from 'lucide-react';
import icon128 from '../../icon128.png';

interface InstagramAdPreviewProps {
  ad: InstagramAd;
  mode: PreviewMode;
  placement: '1:1' | '4:5' | '9:16' | '9:16-reel';
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
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
      <div className={`${containerClass} mx-auto bg-gray-800 text-white overflow-hidden flex flex-col relative`} style={{ aspectRatio: '9/16' }}>
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
          <div className="w-full h-1 bg-gray-800">
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
            <div className="text-xs font-medium">Ad video (9:16)</div>
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

  // Instagram Reel layout for 9:16-reel
  if (placement === '9:16-reel') {
    return (
      <div className={`${containerClass} mx-auto bg-gray-800 text-white overflow-hidden relative`} style={{ aspectRatio: '9/16' }}>
        {/* Background video */}
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
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <div className="text-xs font-medium">Reel video</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Play/Pause button - center of screen */}
        {ad.image && ad.image.startsWith('data:video') && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white z-20 opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
        )}

        {/* Mute/Unmute button - top right */}
        {ad.image && ad.image.startsWith('data:video') && (
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white z-20"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        {/* Content area - mostly empty to show the background */}
        <div className="relative z-10 flex-1 h-[450px]"></div>

        {/* Branding overlay - positioned at bottom */}
        <div className="absolute bottom-[40px] left-0 right-0 z-20 px-2">
          <div className="flex items-center mb-1">
            <div className="w-6 h-6 bg-[#440099] rounded-full flex items-center justify-center mr-2">
              <img src={icon128} alt="Logo" className="w-6 h-6 rounded-full" />
            </div>
            <span className="text-white text-xs font-medium">{ad.businessName || 'The University of Sheffield'}</span>
          </div>
          
          {/* CTA card with integrated button */}
          <div className="bg-black/30 rounded-lg max-w-[80%]">
            <div className="flex items-center p-1 mb-1">
              <div className="w-8 h-8 bg-[#440099] rounded-md overflow-hidden mr-2 flex items-center justify-center">
                {ad.image && ad.image.startsWith('data:video') ? (
                  <video
                    src={ad.image}
                    className="w-8 h-8 rounded object-cover"
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-600"></div>
                )}
              </div>
              <div className="text-white text-xs">{ad.description || 'Text here'}</div>
            </div>
            
            {/* CTA Button - directly under CTA card content with no spacing */}
            <button className="w-full bg-[#440099] text-white py-2 px-4 rounded-lg font-semibold text-[10px] flex justify-between items-center">
              Learn More
              <span>›</span>
            </button>
          </div>
          
          <div className="text-white text-[10px] mt-2 mb-1 max-w-[90%]">
            {ad.headline && ad.headline.length > 45 ? (
              <span>{ad.headline.substring(0, 45)}...</span>
            ) : (
              ad.headline || 'Caption here'
            )}
          </div>
          <div className="text-white/80 text-[9px] mb-2">Sponsored</div>
        </div>

        {/* Right side engagement buttons - moved above bottom navigation */}
        <div className="absolute right-2 bottom-[40px] z-20 flex flex-col items-center gap-3">
          <div className="flex flex-col items-center">
            <HeartIcon size={20} className="text-white mb-1" />
            <span className="text-white text-[10px]">419</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircleIcon size={20} className="text-white mb-1" />
            <span className="text-white text-[10px]">108</span>
          </div>
          <SendIcon size={20} className="text-white" />
          <MoreHorizontalIcon size={20} className="text-white" />
          <div className="w-6 h-6 rounded-lg border-[#440099] flex items-center mb-2 justify-center bg-[#440099]/20">
            <img src={icon128} alt="Logo" className="w-6 h-6 rounded" />
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-black py-2 px-3 flex justify-between items-center">
          <HomeIcon size={20} className="text-white" />
          <SearchIcon size={20} className="text-white" />
          <div className="w-6 h-6 border-2 border-white flex items-center justify-center rounded">
            <PlusIcon size={14} className="text-white" />
          </div>
          <div className="relative">
            <div className="w-6 h-6 rounded">
              <svg viewBox="0 0 24 24" fill="none" className="text-white w-6 h-6">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-700 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gray-500"></div>
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
            <div className="text-xs font-medium">Ad image/video</div>
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