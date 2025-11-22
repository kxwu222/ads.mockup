import React, { useState, useRef, useEffect } from 'react';
import { TikTokAd } from '../types/ads';
import { PreviewMode } from '../types/ads';
import { Heart, MessageCircle, Home, Search, Plus, MessageSquare, User, Play, Pause, Volume2, VolumeX } from 'lucide-react';


interface TikTokAdPreviewProps {
  ad: TikTokAd;
  mode: PreviewMode;
  placement: string;
  staticImage?: string;
}

const TopNavigation = () => {
  return (
    <div className="flex justify-center pt-4 pb-2 text-md font-medium">
      <div className="flex space-x-16">
        <button className="text-white drop-shadow-md">Following</button>
        <button className="text-white relative drop-shadow-md">
          For You
          <div className="absolute bottom-[-4px] left-1/2 w-10 h-[3px] bg-white transform -translate-x-1/2 drop-shadow-md"></div>
        </button>
      </div>
    </div>
  );
};

const InteractionButtons = () => {
  return (
    <div className="absolute right-3 bottom-20 flex flex-col items-center space-y-4">
      <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
        {/* <img src={icon128} alt="Profile" className="w-6 h-6 rounded-full" /> */}
        <div className="w-6 h-6 rounded-full bg-gray-600" />
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

const SponsoredContent = ({ ad, ctaColor, ctaTextColor }: { ad: TikTokAd; ctaColor: string; ctaTextColor: string }) => {
  const [showFullText, setShowFullText] = useState(false);

  // Calculate if text should be truncated (over 100 characters)
  const shouldTruncate = (text: string) => {
    return text.length > 100;
  };

  const displayText = ad.description || 'Your TikTok ad description goes here.';
  const needsTruncation = shouldTruncate(displayText);
  const truncatedText = displayText.substring(0, 100);

  return (
    <div className="absolute bottom-16 left-3 mb-2" style={{ maxWidth: 'calc(100% - 120px)' }}>
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
          className="w-full py-2 mb-1 font-medium text-xs cursor-pointer"
          style={{ backgroundColor: ctaColor, color: ctaTextColor }}
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
  staticImage,
}) => {
  // Normalize placement to valid aspect ratio
  const normalizedPlacement: '9:16' | '4:5' | '1:1' =
    placement === '1:1' ? '1:1' :
      placement === '4:5' ? '4:5' :
        '9:16'; // Default to 9:16 for 'feed' or any other value

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [ctaColor, setCtaColor] = useState('#440099'); // Default color
  const [ctaTextColor, setCtaTextColor] = useState('#ffffff'); // Default text color
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

  // Helper function to convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [h * 360, s * 100, l * 100];
  };

  // Helper function to convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // Function to analyze video colors and select CTA color
  const analyzeVideoColors = () => {
    if (!videoRef.current || !canvasRef.current || !ad.video) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to a small size for performance
    canvas.width = 100;
    canvas.height = 100;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple color quantization
    const colorCounts: { [key: string]: number } = {};
    let maxCount = 0;
    let dominantColor = 'rgb(0,0,0)';

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Skip transparent or very dark/white pixels
      if (a < 128 || (r < 20 && g < 20 && b < 20) || (r > 240 && g > 240 && b > 240)) continue;

      // Quantize colors (round to nearest 32) to group similar shades
      const qr = Math.round(r / 32) * 32;
      const qg = Math.round(g / 32) * 32;
      const qb = Math.round(b / 32) * 32;

      const key = `${qr},${qg},${qb}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;

      if (colorCounts[key] > maxCount) {
        maxCount = colorCounts[key];
        dominantColor = `rgb(${qr},${qg},${qb})`;
      }
    }

    // If no dominant color found (e.g., all black video), fallback to default
    if (maxCount === 0) {
      setCtaColor('#FE2C55'); // TikTok default red
      setCtaTextColor('#ffffff');
      return;
    }

    // Extract RGB values from dominant color
    const rgbMatch = dominantColor.match(/\d+/g);
    if (!rgbMatch) {
      setCtaColor('#FE2C55');
      setCtaTextColor('#ffffff');
      return;
    }

    let [r, g, b] = rgbMatch.map(Number);

    // Convert to HSL for better color manipulation
    let [h, s, l] = rgbToHsl(r, g, b);

    // Boost saturation to at least 50% for vibrant colors
    if (s < 50) {
      s = Math.min(70, s + 30);
    }

    // Enforce strict luminance bounds for accessibility
    // Target range: 25% to 65% luminance
    if (l > 65) {
      l = 45; // Darken significantly
    } else if (l < 25) {
      l = 35; // Lighten a bit
    }

    // Convert back to RGB
    [r, g, b] = hslToRgb(h, s, l);

    // Calculate final luminance
    const finalLuminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    // Set text color based on background luminance for accessibility
    // Use white text for darker backgrounds, black text for lighter backgrounds
    const textColor = finalLuminance > 0.5 ? '#000000' : '#ffffff';

    const finalColor = `rgb(${r},${g},${b})`;
    setCtaColor(finalColor);
    setCtaTextColor(textColor);
  };

  // Analyze colors when video loads and plays
  useEffect(() => {
    if (ad.video && videoRef.current) {
      const video = videoRef.current;

      const handleLoadedData = () => {
        // Analyze immediately and then again after a short delay to ensure frame render
        analyzeVideoColors();
        setTimeout(analyzeVideoColors, 500);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('seeked', analyzeVideoColors); // Re-analyze if user scrubs

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('seeked', analyzeVideoColors);
      };
    }
  }, [ad.video]);

  // Determine aspect ratio based on placement
  const getAspectRatio = () => {
    switch (normalizedPlacement) {
      case '1:1':
        return '1 / 1';
      case '4:5':
        return '4 / 5';
      case '9:16':
      default:
        return '9 / 16';
    }
  };

  // Determine container width based on placement
  const getContainerWidth = () => {
    switch (normalizedPlacement) {
      case '1:1':
        return 'w-80'; // Square
      case '4:5':
        return 'w-80'; // Slightly taller
      case '9:16':
      default:
        return 'w-80'; // Tall phone format
    }
  };

  return (
    <div
      className={`${getContainerWidth()} mx-auto bg-black text-white overflow-hidden relative font-sans shadow-2xl border border-gray-200`}
      style={{
        aspectRatio: '1179 / 2556',
      }}
    >
      {/* Status Bar (4.19%) - Overlay */}
      <div
        className="absolute top-0 left-0 w-full flex items-center px-6 z-50"
        style={{ height: '4.19%', backgroundColor: 'transparent' }}
      >
        <div className="text-sm font-semibold">23:59</div>
        <div className="flex-1"></div>
      </div>

      {/* Content Container - Full Height */}
      <div className="relative w-full h-full">
        {/* Hidden canvas for color analysis */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Video Content */}
        <div className="relative w-full h-full">
          {staticImage ? (
            <img
              src={staticImage}
              alt="Ad Export"
              className="w-full h-full object-contain"
              style={{ backgroundColor: '#000' }}
            />
          ) : ad.video ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={ad.video}
                className="w-full h-full object-contain"
                style={{ backgroundColor: '#000', objectFit: 'contain' }}
                muted={isMuted}
                loop
                playsInline
                crossOrigin="anonymous"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 z-40">
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
                className="absolute top-12 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white z-30"
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
              </div>
            </div>
          )}

          {/* TikTok Interface Components */}
          <div className="absolute top-0 left-0 w-full pt-[4.19%] z-20">
            <TopNavigation />
          </div>
          <InteractionButtons />
          <SponsoredContent ad={ad} ctaColor={ctaColor} ctaTextColor={ctaTextColor} />
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
}; 