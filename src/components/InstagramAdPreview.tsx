import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { InstagramAd } from '../types/ads';
import { PreviewMode } from '../types/ads';
import { HeartIcon, MessageCircleIcon, SendIcon, MoreHorizontalIcon, BookmarkIcon, ChevronRightIcon, XIcon, ChevronUpIcon, Volume2, VolumeX, Home, Search, PlusSquare, Film, User, LinkIcon } from 'lucide-react';


interface InstagramAdPreviewProps {
  ad: InstagramAd;
  mode: PreviewMode;
  placement: '1:1' | '4:5' | '9:16' | '9:16-reel';
  staticImage?: string;
}

export interface InstagramAdPreviewRef {
  playAnimation: () => Promise<void>;
  setStage: (stage: number) => void;
}

export const InstagramAdPreview = forwardRef<InstagramAdPreviewRef, InstagramAdPreviewProps>((
  {
    ad,
    mode,
    placement,
    staticImage,
  }, ref) => {
  // Debug: Log when ad.image changes
  useEffect(() => {
    console.log('InstagramAdPreview: Received ad.image:', ad.image ? `Length: ${ad.image.length}, startsWith data:video: ${ad.image.startsWith('data:video')}` : 'empty');
  }, [ad.image]);
  // Adjust container width based on aspect ratio
  // Determine container width based on placement
  const getContainerWidth = () => {
    switch (placement) {
      case '1:1':
        return 'w-80'; // Square
      case '4:5':
        return 'w-80'; // Slightly taller
      case '9:16':
      case '9:16-reel':
      default:
        return 'w-80'; // Tall phone format
    }
  };

  const containerClass = getContainerWidth();
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctaColor, setCtaColor] = useState('#ffffff'); // Start with White
  const [ctaTextColor, setCtaTextColor] = useState('#000000'); // Start with Black
  // Default to final stage for preview: 2 (Card) if enabled, else 1 (Wide Button)
  const [stage, setStage] = useState(ad.showCard ? 2 : 1);

  // Expose playAnimation method via ref
  useImperativeHandle(ref, () => ({
    playAnimation: async () => {
      // Animate through stages: 0 -> 1 -> 2
      setStage(0);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Hold stage 0 for 1.5s
      setStage(1);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Hold stage 1 for 1.5s
      if (ad.showCard) {
        setStage(2);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Hold stage 2 for 2s
      }
    },
    setStage: (stage: number) => {
      setStage(stage);
    },
  }));

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

  // Shared logic to process colors from canvas context
  const processCanvasColors = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
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
      setCtaColor('#0095f6');
      setCtaTextColor('#ffffff');
      return;
    }

    // Extract RGB values from dominant color
    const rgbMatch = dominantColor.match(/\d+/g);
    if (!rgbMatch) {
      setCtaColor('#0095f6');
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

    // Set text color based on background luminance
    // User requested text to ALWAYS be white for the final state
    const textColor = '#ffffff';

    const finalColor = `rgb(${r},${g},${b})`;
    setCtaColor(finalColor);
    setCtaTextColor(textColor);
  };

  // Function to analyze video colors and select CTA color
  const analyzeVideoColors = () => {
    if (!videoRef.current || !canvasRef.current || !ad.image || !ad.image.startsWith('data:video')) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to a small size for performance
    canvas.width = 100;
    canvas.height = 100;

    // Draw video frame to canvas
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      processCanvasColors(ctx, canvas.width, canvas.height);
    } catch (e) {
      return; // Handle cross-origin issues or empty frames
    }
  };

  // Function to analyze image colors
  const analyzeImageColors = () => {
    if (!canvasRef.current || !ad.image || ad.image.startsWith('data:video')) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = ad.image;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 100;
      canvas.height = 100;

      try {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Add a small delay to allow the "White/Black" initial state to be visible
        // creating the requested transition effect
        setTimeout(() => {
          processCanvasColors(ctx, canvas.width, canvas.height);
          // Animation logic removed for static preview preference
          // But we ensure stage is correct after color analysis just in case
          setStage(ad.showCard ? 2 : 1);
        }, 500);
      } catch (e) {
        console.error("Error analyzing image colors:", e);
      }
    };
  };

  // Reset stage when ad changes
  useEffect(() => {
    // Immediate update for preview editing
    setStage(ad.showCard ? 2 : 1);
  }, [ad.showCard, ad.headline]);

  // Analyze colors when media loads
  useEffect(() => {
    if (!ad.image) return;

    if (ad.image.startsWith('data:video')) {
      // Video analysis
      if (videoRef.current) {
        const video = videoRef.current;
        const handleLoadedData = () => {
          analyzeVideoColors();
          setTimeout(analyzeVideoColors, 500);
        };
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('seeked', analyzeVideoColors);
        return () => {
          video.removeEventListener('loadeddata', handleLoadedData);
          video.removeEventListener('seeked', analyzeVideoColors);
        };
      }
    } else {
      // Image analysis
      analyzeImageColors();
    }
  }, [ad.image, placement]);


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

  // Render different layout for 9:16 aspect ratio (Stories)
  if (placement === '9:16') {
    return (
      <div
        className={`${containerClass} mx-auto bg-black text-white overflow-hidden relative font-sans shadow-2xl border border-gray-200`}
        style={{
          aspectRatio: '1179 / 2556',
        }}
      >
        {/* Hidden canvas for color analysis */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Video/Image Content Area - Full Screen */}
        <div className="absolute inset-0 bg-gray-900">
          {/* Export key-color background layer - behind media for video transparency (only show when there's media) */}
          {(staticImage || ad.image) && (
            <div
              className="absolute inset-0 z-0"
              style={{ backgroundColor: 'rgb(1, 2, 3)' }}
            />
          )}
          {staticImage ? (
            <img
              src={staticImage}
              alt="Ad Export"
              className="w-full h-full object-cover"
            />
          ) : ad.image ? (
              ad.image.startsWith('data:video') ? (
                <video
                  ref={videoRef}
                  src={ad.image}
                  className="w-full h-full object-cover relative z-10"
                  style={{ backgroundColor: 'rgb(1, 2, 3)', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                  muted={isMuted}
                  loop
                  playsInline
                  autoPlay
                />
            ) : (
              <img
                src={ad.image}
                alt="Ad"
                className="w-full h-full object-cover relative z-10"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center relative z-10">
              <div className="text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <div className="text-sm font-medium text-gray-600">Ad image/video</div>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar - OVERLAY on video (top) */}
        <div className="absolute top-0 left-0 w-full z-30">
          <div className="w-full flex items-center px-4 py-3">
            <div className="text-xs font-semibold drop-shadow-md">23:59</div>
          </div>
        </div>

        {/* Progress bar and Header - OVERLAY on video */}
        <div className="absolute top-0 left-0 w-full z-20 px-1 pt-10">
          <div className="w-full h-0.5 bg-gray-800/50">
            <div
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="w-full px-3 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full mr-2 flex items-center justify-center border border-white/20">
                <div className="w-8 h-8 rounded-full flex-shrink-0" />
              </div>
              <div>
                <p className="text-sm font-semibold drop-shadow-md">{ad.businessName || 'username'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="touch-manipulation">
                <MoreHorizontalIcon className="w-6 h-6 drop-shadow-md" />
              </button>
              <button className="touch-manipulation">
                <XIcon className="w-6 h-6 drop-shadow-md" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA and Followed by - OVERLAY on video (bottom of video area) */}
        <div className="absolute bottom-0 left-0 w-full z-20 pb-16">
          {/* Swipe up indicator */}
          {/* <div className="w-full flex justify-center pb-2">
            <button className="touch-manipulation">
              <ChevronUpIcon className="w-6 h-6 drop-shadow-md" />
            </button>
          </div> */}

          {/* CTA Button */}
          <div className="w-full px-4 flex items-center justify-center mb-8">
            <button className="bg-white text-gray-800 flex items-center space-x-1 gap-2 font-medium py-2 px-3 rounded-[16px] text-lg touch-manipulation shadow-lg">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              {ad.callToAction || 'Learn more'}
            </button>
          </div>

          {/* Followed by text */}
          <div className="w-full px-4 text-left mb-3">
            <p className="text-white text-xs drop-shadow-md">
              Followed by XYZ and 155K others
            </p>
          </div>
        </div>

        {/* Sponsored bar - OVERLAY on video (bottom) */}
        <div className="absolute bottom-0 left-0 w-full z-30 bg-black/90 py-4">
          <div className="w-full px-4 flex items-center justify-between py-2">
            <div className="flex items-center">
              <span className="text-white text-xs font-medium">Sponsored</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="touch-manipulation">
                <HeartIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </button>
              <button className="touch-manipulation">
                <SendIcon className="w-6 h-6 text-white transform rotate-45" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Mute/Unmute button - overlays on video */}
        {ad.image && ad.image.startsWith('data:video') && (
          <button
            onClick={toggleMute}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white z-20 opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        )}
      </div>
    );
  }

  // Instagram Reel layout for 9:16-reel
  if (placement === '9:16-reel') {
    return (
      <div
        className={`${containerClass} mx-auto bg-black text-white overflow-hidden relative font-sans shadow-2xl border border-gray-200`}
        data-export-hide-bg="true"
        style={{
          aspectRatio: '1179 / 2556',
        }}
      >
        {/* Status Bar (4.19%) */}
        <div
          className="absolute top-0 left-0 w-full flex items-center px-4 z-20"
          style={{ height: '4.19%', backgroundColor: '#000' }}
        >
          <div className="text-xs font-semibold">23:59</div>
        </div>

        {/* Hidden canvas for color analysis */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Placement Area - Media area positioned to end right above "Sponsored" text */}
        {/* Sponsored tag is at bottom: 12.5% with height: 1.8%, so its top edge is at 85.7% from top */}
        {/* Media area starts at 4.19%, so height should be 85.7% - 4.19% = 81.51% */}
        <div
          className="absolute left-0 w-full overflow-hidden bg-gray-900 relative"
          data-export-hide-bg="true"
          style={{
            top: '4.19%',
            height: '81.51%',
          }}
        >
          {staticImage ? (
            <img
              src={staticImage}
              alt="Ad Export"
              className="w-full h-full object-contain bg-black"
            />
          ) : ad.image ? (
            ad.image.startsWith('data:video') ? (
              <video
                ref={videoRef}
                src={ad.image}
                className="w-full h-full object-contain relative z-10"
                style={{ objectFit: 'contain' }}
                crossOrigin="anonymous"
                muted={isMuted}
                loop
                playsInline
                autoPlay
              />
              ) : (
                <img
                  src={ad.image}
                  alt="Ad"
                  className="w-full h-full object-contain bg-black relative z-10"
                />
              )
          ) : (
            <div className="w-full h-full flex items-center justify-center relative z-10">
              <div className="text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <div className="text-sm font-medium text-gray-400">
                  {ad.mediaType === 'video' ? 'Ad video' : 'Ad image'}
                </div>
              </div>
            </div>
          )}

          {/* Top Overlay Gradient inside placement area */}
          <div 
            className="absolute top-0 left-0 w-full h-24 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent)'
            }}
          ></div>
        </div>

        {/* CTA Button (Bottom ~32%, Height 3.72%) - Top of Stack, Aligned with Comment Icon */}
        {/* CTA Card / Button Transition */}
        <div
          className="absolute z-30 flex flex-col transition-all duration-500 ease-in-out"
          style={{
            bottom: stage === 2 ? '25%' : '28%',
            left: '4%',
            width: stage === 0 ? '35%' : '78%', // Stage 0: Narrow, Stage 1/2: Wide
            maxWidth: stage === 0 ? '35%' : '78%',
          }}
        >
          {/* Card Header (Hidden initially) */}
          <div
            className={`bg-[#262626] opacity-80 rounded-t-xl overflow-hidden transition-all duration-500 ease-in-out flex items-center ${stage === 2 && ad.headline ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}`}
          >
            <div className="py-5 px-3 flex items-center w-full">
              {/* Thumbnail Placeholder */}
              <div className="w-9 h-9 rounded-md bg-gray-600 flex-shrink-0 ml-1 mr-2.5 overflow-hidden relative">
                {ad.image ? (
                  ad.image.startsWith('data:video') ? (
                    <video
                      src={ad.image}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={ad.image}
                      className="w-full h-full object-cover relative z-10"
                      alt="Thumbnail"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-600 text-white font-bold text-xs">
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="mt-1 text-white text-[11px] font-normal text-wrap">
                  {ad.headline || 'Add card text here'}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            className={`w-full h-9 flex items-center justify-between px-4 transition-all duration-500 ease-in-out ${stage === 2 && ad.headline ? 'rounded-b-xl rounded-t-none' : 'rounded-lg'}`}
            style={{
              backgroundColor: stage === 0 ? 'rgba(255,255,255,0.15)' : ctaColor,
              color: stage === 0 ? '#ffffff' : ctaTextColor,
            }}
          >
            <span className="text-xs font-semibold whitespace-nowrap">{ad.callToAction || 'Learn more'}</span>
            <ChevronRightIcon size={18} style={{ color: stage === 0 ? '#ffffff' : ctaTextColor }} />
          </button>
        </div>

        {/* Avatar Block (Bottom ~17%, Height 13.72%) - Middle of Stack */}
        <div
          className="absolute z-30 flex items-center p-2"
          style={{
            bottom: stage === 2 ? '13%' : '16%',
            left: stage === 0 ? '1%' : '4%', // Stage 0: Left aligned with narrow button, Stage 1/2: Left aligned with wide button
            width: stage === 0 ? '73%' : '78%', // Match CTA button width
            height: '13.72%',
          }}
        >
          <div className="flex flex-col justify-center w-full h-full">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-white rounded-full mr-1 overflow-hidden border border-white/20">
                <div className="w-8 h-8 object-cover flex-shrink-0" />
              </div>
              <span className="font-semibold text-xs text-white shadow-black drop-shadow-md">
                {ad.businessName || 'username'}
              </span>
            </div>
            <div className="text-xs text-white opacity-95 drop-shadow-md leading-tight">
              {(ad.description || 'Add card text here').length > 40
                ? (ad.description || 'Add card text here').substring(0, 40) + '...'
                : (ad.description || 'Add card text here')}
            </div>
          </div>
        </div>

        {/* Sponsored Tag (Bottom ~14%, Height 1.8%) - Bottom of Stack, Below Media Edge */}
        <div
          className="absolute z-30 flex items-center text-white text-[10px] font-medium opacity-90 drop-shadow-md"
          style={{
            bottom: '12.5%',
            left: '4%',
            width: '15.78%',
            height: '1.8%',
          }}
        >
          Sponsored
        </div>

        {/* Icons Column (Right 0, Bottom 5.67%) */}
        <div
          className="absolute z-30 flex flex-col items-center justify-end pb-4 gap-3.5"
          style={{
            right: '2%',
            bottom: '9%',
            width: '12.13%',
            height: '22%',
          }}
        >
          <div className="flex flex-col items-center">
            <HeartIcon size={24} className="text-white drop-shadow-md" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center">
            <MessageCircleIcon size={24} className="text-white drop-shadow-md" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center mr-1">
            <SendIcon size={24} className="text-white drop-shadow-md transform rotate-12" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center mr-1">
            <MoreHorizontalIcon size={24} className="text-white drop-shadow-md" strokeWidth={1.5} />
          </div>
        </div>

        {/* Comment Bar (Bottom 0, Height 5.67%) */}
        <div
          className="absolute bottom-0 left-0 w-full bg-black z-30 flex items-center px-4 border-t border-white/10"
          style={{
            height: '5.67%',
          }}
        >
          <div className="w-full h-[70%] rounded-full flex items-center px-3 text-gray-400 text-xs">
            Add comment...
          </div>
        </div>

      </div>
    );
  }

  // Regular Instagram post layout for 1:1 and 4:5
  return (
    <div
      className={`${containerClass} mx-auto bg-white text-black overflow-hidden flex flex-col relative font-sans border border-gray-200 shadow-2xl`}
      style={{
        aspectRatio: '1179 / 2556',
      }}
    >
      {/* Hidden canvas for color analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Status Bar (4.19%) */}
      <div
        className="w-full flex items-center px-6 z-20 flex-shrink-0"
        style={{ height: '4.19%' }}
      >
        <div className="text-sm font-semibold">23:59</div>
        <div className="flex-1"></div>
        <div className="flex space-x-2">
          {/* Battery/Wifi icons mock */}
          <div className="w-4 h-4 bg-black rounded-sm opacity-20"></div>
          <div className="w-4 h-4 bg-black rounded-sm opacity-20"></div>
        </div>
      </div>

      {/* App Header */}
      <div className="w-full h-12 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
        <div className="font-bold text-xl tracking-tight">Instagram</div>
        <div className="flex items-center space-x-4">
          <HeartIcon className="w-6 h-6 text-black" strokeWidth={1.5} />
          <MessageCircleIcon className="w-6 h-6 text-black" strokeWidth={1.5} />
        </div>
      </div>

      {/* Feed Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white flex flex-col">

        {/* The Ad Post */}
        <div className="w-full pb-4">
          {/* Header */}
          <div className="flex items-center p-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <div className="w-8 h-8 rounded-full flex-shrink-0" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-none">{ad.businessName || 'username'}</p>
              <p className="text-xs text-gray-500 mt-0.5">Sponsored</p>
            </div>
            <button>
              <MoreHorizontalIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Image Content */}
          <div
            className="w-full bg-[#E5E7EB] flex flex-col items-center justify-center text-gray-500 overflow-hidden relative"
            style={{
              aspectRatio: placement === '4:5' ? '4/5' : '1/1',
            }}
          >
            {/* Export key-color background layer - behind media for video transparency (only show when there's media) */}
            {(staticImage || ad.image) && (
              <div
                className="absolute inset-0 z-0"
                style={{ backgroundColor: 'rgb(1, 2, 3)' }}
              />
            )}
            {staticImage ? (
              <img
                src={staticImage}
                alt="Ad Export"
                className="w-full h-full object-cover"
              />
            ) : ad.image ? (
              ad.image.startsWith('data:video') ? (
                <video
                  ref={videoRef}
                  src={ad.image}
                  className="w-full h-full object-cover relative z-10"
                  style={{ backgroundColor: 'rgb(1, 2, 3)', objectFit: 'cover' }}
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
                  className="w-full h-full object-cover relative z-10"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <div className="text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <div className="text-sm font-medium text-gray-600">Ad image/video</div>
                </div>
              </div>
            )}
          </div>

          {/* Learn More Button Bar - Reverted to below image */}
          <div className="w-full border-gray-100">
            <a
              href="#"
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium hover:opacity-90 transition-colors duration-1000 ease-in-out"
              style={{ backgroundColor: ctaColor, color: ctaTextColor }}
            >
              <span>{ad.callToAction || 'Learn more'}</span>
              <ChevronRightIcon className="w-4 h-4 transition-colors duration-1000" style={{ color: ctaTextColor }} />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex items-center space-x-4">
              <button>
                <HeartIcon className="w-6 h-6 text-black" strokeWidth={1.5} />
              </button>
              <button>
                <MessageCircleIcon className="w-6 h-6 text-black" strokeWidth={1.5} />
              </button>
              <button>
                <SendIcon className="w-6 h-6 text-black" strokeWidth={1.5} />
              </button>
            </div>
            <button>
              <BookmarkIcon className="w-6 h-6 text-black" strokeWidth={1.5} />
            </button>
          </div>

          {/* Likes and Caption */}
          <div className="px-3">
            <p className="font-semibold text-sm mb-1">1,234 likes</p>
            <p className="text-sm">
              <span className="font-semibold mr-2">{ad.businessName || 'username'}</span>
              {ad.description || 'Your Instagram ad description goes here.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="w-full h-12 border-t border-gray-200 flex items-center justify-around bg-white flex-shrink-0 pb-2">
        <Home className="w-6 h-6 text-black" strokeWidth={1.5} />
        <Search className="w-6 h-6 text-gray-500" strokeWidth={1.5} />
        <PlusSquare className="w-6 h-6 text-gray-500" strokeWidth={1.5} />
        <Film className="w-6 h-6 text-gray-500" strokeWidth={1.5} />
        <div className="w-7 h-7 rounded-full overflow-hidden">
          <User className="w-full h-full p-1 text-gray-500" />
        </div>
      </div>

      {/* Home Indicator
      <div className="w-full h-6 flex justify-center items-center bg-white flex-shrink-0">
        <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
      </div> */}
    </div>
  );
});