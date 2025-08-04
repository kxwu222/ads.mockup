import React, { useState, useRef, useEffect } from 'react';
import { TikTokAd } from '../types/ads';
import { PreviewMode } from '../types/ads';
import { Heart, MessageCircle, Home, Search, Plus, MessageSquare, User, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import icon128 from '../../icon128.png';

interface TikTokAdPreviewProps {
  ad: TikTokAd;
  mode: PreviewMode;
  placement: string;
}

const TopNavigation = () => {
  return (
    <div className="flex justify-center pt-4 pb-2 text-lg font-medium">
      <div className="flex space-x-16">
        <button className="text-gray-400">Following</button>
        <button className="text-white relative">
          For You
          <div className="absolute bottom-[-4px] left-1/2 w-10 h-[3px] bg-white transform -translate-x-1/2"></div>
        </button>
      </div>
    </div>
  );
};

const InteractionButtons = () => {
  return (
    <div className="absolute right-3 bottom-20 flex flex-col items-center space-y-4">
      <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
        <img src={icon128} alt="Profile" className="w-6 h-6 rounded-full" />
      </div>
      <div className="flex flex-col items-center">
        <Heart className="w-6 h-6 fill-white stroke-white" />
        <span className="text-xs mt-1">15</span>
      </div>
      <div className="flex flex-col items-center">
        <MessageCircle className="w-6 h-6" />
      </div>
      <div className="flex flex-col items-center">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </div>
      <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-white"></div>
    </div>
  );
};

const SponsoredContent = ({ ad, ctaColor }: { ad: TikTokAd; ctaColor: string }) => {
  const [showFullText, setShowFullText] = useState(false);
  
  // Calculate if text should be truncated (over 100 characters)
  const shouldTruncate = (text: string) => {
    return text.length > 100;
  };

  const displayText = ad.description || 'Your TikTok ad description goes here.';
  const needsTruncation = shouldTruncate(displayText);
  const truncatedText = displayText.substring(0, 100);

  return (
    <div className="absolute bottom-16 left-3" style={{ maxWidth: 'calc(100% - 120px)' }}>
      <div className="bg-opacity-80">
        <div className="flex bg-transparent">
          <div className="flex-1">
            <h3 className="font-semibold mb-1 text-white" style={{ fontSize: '14px' }}>
              {ad.headline || '@username'}
            </h3>
            <div className="text-white" style={{ fontSize: '12px', lineHeight: '1.4' }}>
              {showFullText ? (
                <p>{displayText}</p>
              ) : needsTruncation ? (
                <p>
                  {truncatedText}
                  <span 
                    className="font-bold cursor-pointer ml-1"
                    onClick={() => setShowFullText(true)}
                  >
                    ...See more
                  </span>
                </p>
              ) : (
                <p>{displayText}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mb-2">
          <span className="inline-block py-0.5 text-[10px] text-white border-gray-300 rounded-sm">
            Sponsored
          </span>
        </div>
        <button 
          className="w-full text-white py-2 mt-2 font-medium text-xs cursor-pointer"
          style={{ backgroundColor: ctaColor }}
          onClick={() => {
            if (ad.finalUrl) {
              window.open(ad.finalUrl, '_blank');
            }
          }}
        >
          {ad.callToAction || 'Learn More'} &gt;
        </button>
      </div>
    </div>
  );
};

const BottomNavigation = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-black py-2">
      <div className="flex justify-around items-center">
        <div className="flex flex-col items-center">
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center">
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-1">Discover</span>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] rounded-md"></div>
            <div className="absolute inset-[2px] bg-white flex items-center justify-center rounded-md">
              <Plus className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-1">Inbox</span>
        </div>
        <div className="flex flex-col items-center">
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1">Me</span>
        </div>
      </div>
    </div>
  );
};

export const TikTokAdPreview: React.FC<TikTokAdPreviewProps> = ({
  ad,
  mode,
  placement,
}) => {
  const containerClass = mode === 'mobile' ? 'w-80' : 'max-w-sm';
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [ctaColor, setCtaColor] = useState('#440099'); // Default color
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Function to analyze video colors and select CTA color
  const analyzeVideoColors = () => {
    if (!videoRef.current || !canvasRef.current || !ad.video) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Sample colors from the video
    const colors: number[][] = [];
    const sampleSize = 1000; // Sample 1000 pixels

    for (let i = 0; i < sampleSize; i++) {
      const index = Math.floor(Math.random() * data.length / 4) * 4;
      colors.push([data[index], data[index + 1], data[index + 2]]);
    }

    // Calculate average color
    const avgColor = colors.reduce(
      (acc, color) => [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]],
      [0, 0, 0]
    ).map(val => Math.round(val / colors.length));

    // Generate complementary or contrasting color for CTA
    const [r, g, b] = avgColor;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // If video is dark, use bright color; if bright, use dark color
    let newCtaColor;
    if (brightness < 128) {
      // Dark video - use bright color
      newCtaColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    } else {
      // Bright video - use dark color
      newCtaColor = `hsl(${Math.random() * 360}, 70%, 40%)`;
    }

    setCtaColor(newCtaColor);
  };

  // Analyze colors when video loads
  useEffect(() => {
    if (ad.video && videoRef.current) {
      const video = videoRef.current;
      const handleLoadedData = () => {
        setTimeout(analyzeVideoColors, 100); // Small delay to ensure video is ready
      };
      
      video.addEventListener('loadeddata', handleLoadedData);
      return () => video.removeEventListener('loadeddata', handleLoadedData);
    }
  }, [ad.video]);

  return (
    <div className={`${containerClass} relative bg-gradient-to-b from-black to-gray-800 text-white overflow-hidden`} style={{ aspectRatio: '9/16', maxHeight: '600px' }}>
      {/* Hidden canvas for color analysis */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Video Content */}
      <div className="relative w-full h-full">
        {ad.video ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={ad.video}
              className="w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
            </div>

            {/* Sound Control */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="text-sm font-medium">TikTok Video</div>
              <div className="text-xs text-gray-500">Use a 9:16 ratio</div>
            </div>
          </div>
        )}

        {/* TikTok Interface Components */}
        <TopNavigation />
        <InteractionButtons />
        <SponsoredContent ad={ad} ctaColor={ctaColor} />
        <BottomNavigation />
      </div>
    </div>
  );
}; 