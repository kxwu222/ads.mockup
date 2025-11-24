import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { FacebookAdEditor } from './components/FacebookAdEditor';
import { FacebookAdPreview } from './components/FacebookAdPreview';
import { InstagramAdEditor } from './components/InstagramAdEditor';
import { InstagramAdPreview, InstagramAdPreviewRef } from './components/InstagramAdPreview';
import { TikTokAdEditor } from './components/TikTokAdEditor';
import { TikTokAdPreview } from './components/TikTokAdPreview';
import { LinkedInAdEditor } from './components/LinkedInAdEditor';
import { LinkedInAdPreview } from './components/LinkedInAdPreview';
import { AdType, FacebookAd, InstagramAd, TikTokAd, LinkedInAd, PreviewMode } from './types/ads';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { ExportProgressModal } from './components/ExportProgressModal';
import { ToastContainer } from './components/Toast';
import { useToast } from './contexts/ToastContext';


function App() {
  const { toasts, removeToast } = useToast();
  const [activeAdType, setActiveAdType] = useState<AdType>('facebook');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('mobile');
  const [activePreview, setActivePreview] = useState('feed');
  const previewRef = useRef<HTMLDivElement>(null);
  const instagramPreviewRef = useRef<InstagramAdPreviewRef>(null);

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
    businessName: 'username',
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
    businessName: 'username',
    finalUrl: '',
    callToAction: '',
    videoLength: 15,
  });

  const [tiktokAdPlacement, setTiktokAdPlacement] = useState('feed');

  const [linkedinAd, setLinkedinAd] = useState<LinkedInAd>({
    headline: '',
    description: '',
    image: '',
    businessName: 'username',
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

  // Debug: Log state changes to verify updates
  useEffect(() => {
    console.log('App: facebookAd.image changed:', facebookAd.image ? `Length: ${facebookAd.image.length}` : 'empty');
  }, [facebookAd.image]);

  useEffect(() => {
    console.log('App: instagramAd.image changed:', instagramAd.image ? `Length: ${instagramAd.image.length}` : 'empty');
  }, [instagramAd.image]);

  useEffect(() => {
    console.log('App: linkedinAd.image changed:', linkedinAd.image ? `Length: ${linkedinAd.image.length}` : 'empty');
  }, [linkedinAd.image]);

  // Load state from URL hash on mount
  // Load state from URL hash on mount




  const [tempExportImage, setTempExportImage] = useState<string | null>(null);
  const [globalLogo, setGlobalLogo] = useState<string>('');

  // Detect if current ad contains video
  const hasVideo = () => {
    switch (activeAdType) {
      case 'facebook':
        return (facebookAd.mediaType === 'video' && facebookAd.image.startsWith('data:video')) || facebookAd.image.startsWith('data:video');
      case 'instagram':
        return (instagramAd.mediaType === 'video' && instagramAd.image.startsWith('data:video')) || instagramAd.image.startsWith('data:video');
      case 'tiktok':
        return tiktokAd.video.startsWith('data:video');
      case 'linkedin':
        return (linkedinAd.mediaType === 'video' && linkedinAd.image.startsWith('data:video')) || linkedinAd.image.startsWith('data:video');
      default:
        return false;
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'recording' | 'processing' | 'completed' | 'error'>('idle');
  const [exportError, setExportError] = useState<string | undefined>(undefined);

  const transcodeToMp4 = async (sourceBlob: Blob): Promise<Blob> => {
    setExportStatus('processing');
    // Nudge progress into the processing phase (recording phase generally covers 0–90%)
    setExportProgress((prev) => (prev < 90 ? 90 : prev));

    try {
      // Dynamically import ffmpeg to avoid build-time issues
      // Try the newer 0.12.x API first, fallback to older API if needed
      let ffmpeg: any;
      let fetchFile: any;

      try {
        const ffmpegModule = await import('@ffmpeg/ffmpeg');
        const utilModule = await import('@ffmpeg/util');

        // Check if it's the new API (FFmpeg class) or old API (createFFmpeg)
        if (ffmpegModule.FFmpeg) {
          // New API (0.12.x)
          const { FFmpeg } = ffmpegModule;
          fetchFile = utilModule.fetchFile;
          ffmpeg = new FFmpeg();

          ffmpeg.on('log', ({ message }: { message: string }) => {
            // Optional: log ffmpeg messages
          });

          if (!ffmpeg.loaded) {
            await ffmpeg.load();
          }

          const inputName = 'input.webm';
          const outputName = 'output.mp4';

          await ffmpeg.writeFile(inputName, await fetchFile(sourceBlob));

          // Try exec first, then spawn as fallback
          try {
            await ffmpeg.exec([
              '-i', inputName,
              '-c:v', 'libx264',
              '-preset', 'medium',
              '-crf', '23',
              '-c:a', 'aac',
              '-b:a', '128k',
              '-movflags', 'faststart',
              outputName
            ]);
          } catch (execError) {
            // If exec doesn't work, try spawn
            await ffmpeg.spawn([
              '-i', inputName,
              '-c:v', 'libx264',
              '-preset', 'medium',
              '-crf', '23',
              '-c:a', 'aac',
              '-b:a', '128k',
              '-movflags', 'faststart',
              outputName
            ]);
          }

          const data = await ffmpeg.readFile(outputName);
          await ffmpeg.deleteFile(inputName);
          await ffmpeg.deleteFile(outputName);

          setExportProgress(100);
          return new Blob([data], { type: 'video/mp4' });
        } else if ((ffmpegModule as any).createFFmpeg) {
          // Old API (0.11.x and earlier)
          const { createFFmpeg, fetchFile: oldFetchFile } = ffmpegModule as any;
          fetchFile = oldFetchFile;
          ffmpeg = createFFmpeg({ log: false });

          if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
          }

          const inputName = 'input.webm';
          const outputName = 'output.mp4';

          ffmpeg.FS('writeFile', inputName, await fetchFile(sourceBlob));

          await ffmpeg.run(
            '-i', inputName,
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '23',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', 'faststart',
            outputName
          );

          const data = ffmpeg.FS('readFile', outputName);
          ffmpeg.FS('unlink', inputName);
          ffmpeg.FS('unlink', outputName);

          setExportProgress(100);
          return new Blob([data.buffer], { type: 'video/mp4' });
        } else {
          throw new Error('Unknown ffmpeg API version');
        }
      } catch (importError) {
        console.error('Failed to import ffmpeg:', importError);
        throw new Error('FFmpeg library not available');
      }
    } catch (error) {
      console.error('ffmpeg transcoding error:', error);
      setExportStatus('error');
      setExportError('Failed to transcode video to MP4.');
      throw error;
    }
  };

  const handleVideoExport = async () => {
    if (previewRef.current === null) {
      return;
    }

    const previewElement = previewRef.current;
    // Find the actual preview component element (the mobile frame container)
    // The previewRef is on a wrapper with scale-95 transform, but we need the actual preview component
    // which has the mobile frame with aspectRatio and all the UI elements
    const actualPreviewElement = previewElement.querySelector('[style*="aspectRatio"]') as HTMLElement || previewElement.firstElementChild as HTMLElement || previewElement;
    const videoElement = actualPreviewElement.querySelector('video') as HTMLVideoElement;

    if (!videoElement) {
      alert('No video found in preview.');
      return;
    }

    try {
      setIsExporting(true);
      setExportStatus('recording');
      setExportProgress(0);
      setExportError(undefined);

      // Ensure video is loaded
      if (videoElement.readyState < 2) {
        await new Promise((resolve, reject) => {
          videoElement.onloadedmetadata = resolve;
          videoElement.onerror = reject;
          setTimeout(() => reject(new Error('Video loading timeout')), 5000);
        });
      }

      // Get preview container dimensions (mobile frame) instead of video native dimensions
      // Use the actual preview element, not the wrapper, to get correct dimensions
      const containerRect = actualPreviewElement.getBoundingClientRect();
      const baseWidth = Math.round(containerRect.width);
      const baseHeight = Math.round(containerRect.height);
      const width = baseWidth * 2; // 2x for high DPI
      const height = baseHeight * 2; // 2x for high DPI

      if (width === 0 || height === 0) {
        throw new Error('Container dimensions are invalid.');
      }

      console.log('Preview element dimensions:', {
        wrapper: { width: previewElement.getBoundingClientRect().width, height: previewElement.getBoundingClientRect().height },
        actual: { width: baseWidth, height: baseHeight },
        canvas: { width, height }
      });

      // Get video native dimensions for scaling
      const videoWidth = videoElement.videoWidth || 1080;
      const videoHeight = videoElement.videoHeight || 1920;

      if (videoWidth === 0 || videoHeight === 0) {
        throw new Error('Video dimensions are invalid.');
      }

      // 1. Capture the UI Overlay (everything except the video)
      // We use html-to-image to snapshot the preview container, but filter out the video element
      // and force a transparent background so we can layer it on top of the video canvas.
      console.log('Capturing UI overlay...');
      console.log('Container size:', { baseWidth, baseHeight, canvasWidth: width, canvasHeight: height });

      // Ensure any scrollable containers are scrolled to top before capture
      // This prevents extra spacing from scroll position affecting the layout
      const scrollableElements = previewElement.querySelectorAll('[class*="overflow"]');
      scrollableElements.forEach((el) => {
        if (el instanceof HTMLElement && (el.scrollTop > 0 || el.scrollLeft > 0)) {
          el.scrollTop = 0;
          el.scrollLeft = 0;
        }
      });

      // Force the actual preview container to maintain exact dimensions during capture
      // We avoid forcing height to let aspect-ratio handle it, preventing
      // potential conflicts that could push content down or off-screen
      const originalStyle = actualPreviewElement.style.cssText;
      const originalMargin = actualPreviewElement.style.margin;
      const originalPadding = actualPreviewElement.style.padding;
      const originalBoxSizing = actualPreviewElement.style.boxSizing;

      // Ensure box-sizing is content-box so width matches exactly
      // This ensures percentage calculations use the full width we set
      actualPreviewElement.style.boxSizing = 'content-box';
      actualPreviewElement.style.width = `${baseWidth}px`;
      // actualPreviewElement.style.height = `${baseHeight}px`; // Removing height force to fix "push down" issue
      actualPreviewElement.style.flexShrink = '0';
      actualPreviewElement.style.flexGrow = '0';

      // Remove border, margin, and padding during capture to ensure percentage-based positioning
      // (like right: 2% for engagement buttons) calculates correctly
      // These are just visual frames and don't need to be in the export
      actualPreviewElement.style.borderWidth = '0';
      actualPreviewElement.style.borderStyle = 'none';
      actualPreviewElement.style.margin = '0';
      actualPreviewElement.style.padding = '0';

      // Identify elements that need to be transparent during export (video backgrounds)
      // This allows us to capture semi-transparent overlays (gradients) correctly
      const transparentElements = actualPreviewElement.querySelectorAll('[data-export-hide-bg="true"]');
      const originalBackgrounds: { element: HTMLElement, bg: string }[] = [];

      transparentElements.forEach(el => {
        if (el instanceof HTMLElement) {
          originalBackgrounds.push({ element: el, bg: el.style.backgroundColor });
          // Force transparent background
          el.style.backgroundColor = 'transparent';
          el.style.background = 'transparent'; // Clear background image/gradient if any on container
        }
      });

      // Longer delay to ensure styles are applied and layout is fully recalculated
      // This is critical for percentage-based positioning to work correctly
      await new Promise(resolve => setTimeout(resolve, 200));

      // Suppress console errors for CSS security issues (they're warnings, not fatal)
      const originalConsoleError = console.error;
      const cssErrors: any[] = [];
      console.error = (...args: any[]) => {
        // Filter out CSS security errors - they're expected and non-fatal
        if (args[0]?.includes?.('cssRules') || args[0]?.includes?.('CSSStyleSheet')) {
          cssErrors.push(args);
          return; // Suppress these specific errors
        }
        originalConsoleError.apply(console, args);
      };

      let overlayDataUrl: string;
      try {
        // Use pixelRatio: 2 to match our 2x canvas scaling
        // This ensures percentage-based positioning in Reel layout scales correctly
        // html-to-image will capture at 2x the container's actual rendered size
        // Important: Ensure the container maintains its aspect ratio during capture
        // by using the exact dimensions from getBoundingClientRect
        overlayDataUrl = await htmlToImage.toPng(actualPreviewElement, {
          quality: 1.0,
          pixelRatio: 2, // This produces an image that's 2x the container size
          backgroundColor: 'transparent',
          filter: (node) => {
            // Exclude the video element itself from the snapshot
            return node.tagName !== 'VIDEO';
          },
          style: {
            // Force container background to be transparent so video shows through
            background: 'transparent',
            backgroundColor: 'transparent',
            boxShadow: 'none', // Remove shadow if it interferes
            border: 'none',    // Remove border if it interferes
            // Ensure width matches exactly for correct percentage calculations
            width: `${baseWidth}px`,
            boxSizing: 'content-box',
            margin: '0',
            padding: '0',
          },
          cacheBust: true,
        });
      } catch (error) {
        console.error('Failed to capture overlay:', error);
        // Create a blank overlay as fallback - video will still export
        const blankCanvas = document.createElement('canvas');
        blankCanvas.width = width;
        blankCanvas.height = height;
        overlayDataUrl = blankCanvas.toDataURL('image/png');
      } finally {
        // Restore original background colors for transparent elements
        originalBackgrounds.forEach(({ element, bg }) => {
          element.style.backgroundColor = bg;
          element.style.background = ''; // Clear manual override
        });

        // Restore original container styles
        actualPreviewElement.style.cssText = originalStyle;
        // Explicitly restore margin, padding, and box-sizing if they were set
        if (originalMargin) actualPreviewElement.style.margin = originalMargin;
        if (originalPadding) actualPreviewElement.style.padding = originalPadding;
        if (originalBoxSizing) actualPreviewElement.style.boxSizing = originalBoxSizing;
        // Restore original console.error
        console.error = originalConsoleError;
      }

      if (cssErrors.length > 0) {
        console.log(`Suppressed ${cssErrors.length} CSS security warnings (expected for external fonts)`);
      }

      const overlayImage = new Image();
      await new Promise((resolve, reject) => {
        overlayImage.onload = resolve;
        overlayImage.onerror = reject;
        overlayImage.src = overlayDataUrl;
      });

      // Verify overlay dimensions match expected canvas size
      // html-to-image with pixelRatio: 2 should produce 2x the container size
      const overlayNaturalWidth = overlayImage.naturalWidth;
      const overlayNaturalHeight = overlayImage.naturalHeight;
      // Allow small tolerance for rounding differences (within 2 pixels)
      const dimensionMatch = Math.abs(overlayNaturalWidth - width) <= 2 && Math.abs(overlayNaturalHeight - height) <= 2;
      console.log('UI overlay captured.', {
        overlaySize: `${overlayNaturalWidth}x${overlayNaturalHeight}`,
        expectedSize: `${width}x${height}`,
        containerSize: `${baseWidth}x${baseHeight}`,
        matches: dimensionMatch,
        actualScale: `${(overlayNaturalWidth / baseWidth).toFixed(2)}x`,
        expectedScale: '2x'
      });

      if (!dimensionMatch) {
        console.warn(`⚠️ Overlay dimensions (${overlayNaturalWidth}x${overlayNaturalHeight}) don't match canvas (${width}x${height}). This may cause element positioning issues in Reel layout.`);
        console.warn(`   Container: ${baseWidth}x${baseHeight}, Overlay scale: ${(overlayNaturalWidth / baseWidth).toFixed(2)}x, Expected: 2x`);
      }

      // Post-process overlay to punch out pure black areas so the video shows through.
      // Many previews use solid black as the media background, which would otherwise
      // completely cover the video when we draw the overlay on top.
      const overlayCanvas = document.createElement('canvas');
      overlayCanvas.width = width;
      overlayCanvas.height = height;
      const overlayCtx = overlayCanvas.getContext('2d');
      if (!overlayCtx) {
        throw new Error('Failed to create overlay canvas context.');
      }

      // Draw overlay at exact canvas size (width x height)
      // If overlay dimensions don't match, this will scale it, which may cause
      // percentage-based positioning in Reel layout to appear slightly off
      // This is necessary to maintain consistency with video drawing dimensions
      overlayCtx.drawImage(overlayImage, 0, 0, width, height);
      const overlayImageData = overlayCtx.getImageData(0, 0, width, height);
      const data = overlayImageData.data;

      // Make only our special near-black background color fully transparent so
      // underlying video is visible. This preserves true black UI elements
      // like icons and text outlines.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Our special background color is rgb(1, 2, 3)
        if (a > 0 && r === 1 && g === 2 && b === 3) {
          data[i + 3] = 0; // Set alpha to 0 (fully transparent)
        }
      }

      overlayCtx.putImageData(overlayImageData, 0, 0);

      const processedOverlayUrl = overlayCanvas.toDataURL('image/png');
      const processedOverlay = new Image();
      await new Promise((resolve, reject) => {
        processedOverlay.onload = resolve;
        processedOverlay.onerror = reject;
        processedOverlay.src = processedOverlayUrl;
      });

      // For Instagram Stories (9:16), capture overlays for each CTA animation stage
      let stageOverlays: HTMLImageElement[] = [processedOverlay]; // Default: single overlay
      const isInstagramStories = activeAdType === 'instagram' && instagramAdPlacement === '9:16';

      if (isInstagramStories && instagramPreviewRef.current) {
        console.log('Capturing Instagram Stories CTA animation stages...');
        const stages = [0, 1, 2];
        const stageImages: HTMLImageElement[] = [];

        for (const stage of stages) {
          // Set the stage
          instagramPreviewRef.current.setStage(stage);
          // Wait for React to render the new stage
          await new Promise(resolve => setTimeout(resolve, 100));

          // Capture overlay for this stage
          try {
            const stageOverlayDataUrl = await htmlToImage.toPng(previewElement, {
              quality: 1.0,
              pixelRatio: 2,
              backgroundColor: 'transparent',
              filter: (node) => node.tagName !== 'VIDEO',
              style: {
                background: 'transparent',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: 'none',
              },
              cacheBust: true,
            });

            // Process this stage overlay (punch out key-color)
            const stageCanvas = document.createElement('canvas');
            stageCanvas.width = width;
            stageCanvas.height = height;
            const stageCtx = stageCanvas.getContext('2d');
            if (stageCtx) {
              const stageImg = new Image();
              await new Promise((resolve, reject) => {
                stageImg.onload = resolve;
                stageImg.onerror = reject;
                stageImg.src = stageOverlayDataUrl;
              });

              stageCtx.drawImage(stageImg, 0, 0, width, height);
              const stageImageData = stageCtx.getImageData(0, 0, width, height);
              const stageData = stageImageData.data;

              for (let i = 0; i < stageData.length; i += 4) {
                const r = stageData[i];
                const g = stageData[i + 1];
                const b = stageData[i + 2];
                const a = stageData[i + 3];

                if (a > 0 && r === 1 && g === 2 && b === 3) {
                  stageData[i + 3] = 0;
                }
              }

              stageCtx.putImageData(stageImageData, 0, 0);
              const processedStageUrl = stageCanvas.toDataURL('image/png');
              const processedStageImg = new Image();
              await new Promise((resolve, reject) => {
                processedStageImg.onload = resolve;
                processedStageImg.onerror = reject;
                processedStageImg.src = processedStageUrl;
              });

              stageImages.push(processedStageImg);
            }
          } catch (error) {
            console.warn(`Failed to capture stage ${stage} overlay, using default:`, error);
            stageImages.push(processedOverlay); // Fallback to default
          }
        }

        stageOverlays = stageImages;
        console.log(`Captured ${stageOverlays.length} stage overlays for Instagram Stories animation`);

        // Reset to initial stage
        instagramPreviewRef.current.setStage(instagramAd.showCard ? 2 : 1);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create canvas for recording
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to create canvas context.');
      }

      // Create stream from canvas
      const stream = canvas.captureStream(30); // 30 fps

      // Add audio track if video has audio
      if ('captureStream' in videoElement && typeof (videoElement as any).captureStream === 'function') {
        try {
          const videoStream = (videoElement as any).captureStream();
          const audioTracks = videoStream.getAudioTracks();
          if (audioTracks.length > 0) {
            stream.addTrack(audioTracks[0]);
          }
        } catch (e) {
          console.warn('Failed to capture audio from video', e);
        }
      }

      // Setup MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 8000000, // 8 Mbps for high quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped, creating blob...');
        const blob = new Blob(chunks, { type: mimeType });
        console.log('Blob created:', blob.size, 'bytes');

        if (blob.size === 0) {
          setExportStatus('error');
          setExportError('Recorded video is empty.');
          return;
        }

        try {
          // Transcode whatever the recorder produced into a true MP4 file
          const mp4Blob = await transcodeToMp4(blob);

          const timestamp = new Date().getTime();
          const filename = `${activeAdType}-ad-preview-${timestamp}.mp4`;

          const url = URL.createObjectURL(mp4Blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);

          a.click();

          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 1000);

          setExportStatus('completed');
        } catch (error) {
          console.error('Error downloading MP4 file:', error);
          if (!exportError) {
            setExportError('Failed to export MP4 video.');
          }
          setExportStatus('error');
        }
      };

      // Store original loop state and disable it for recording
      const originalLoop = videoElement.loop;
      const originalMuted = videoElement.muted;
      videoElement.loop = false;
      videoElement.muted = true; // Mute to allow autoplay

      // Reset and ensure video is ready
      videoElement.currentTime = 0;

      // Wait for video to be ready to play
      if (videoElement.readyState < 2) {
        await new Promise((resolve, reject) => {
          videoElement.oncanplay = resolve;
          videoElement.onerror = reject;
          setTimeout(() => reject(new Error('Video loading timeout')), 10000);
        });
      }

      // Small delay to ensure video is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Handle play promise
      try {
        await videoElement.play();
      } catch (error) {
        console.error('Play failed:', error);
        throw new Error('Failed to play video for recording');
      }

      // Wait a bit more to ensure video is actually playing
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify video is actually playing
      if (videoElement.paused) {
        console.warn('Video is paused, attempting to play again...');
        await videoElement.play();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Log video state for debugging
      console.log('Video export state:', {
        readyState: videoElement.readyState,
        paused: videoElement.paused,
        currentTime: videoElement.currentTime,
        duration: videoElement.duration,
        videoWidth: videoElement.videoWidth,
        videoHeight: videoElement.videoHeight,
        visible: videoElement.offsetWidth > 0 && videoElement.offsetHeight > 0
      });

      // Determine desired object-fit behavior based on platform + placement
      const getVideoObjectFit = (): 'contain' | 'cover' => {
        switch (activeAdType) {
          case 'tiktok':
            // TikTok feed: video should sit inside the phone frame with padding when 1:1
            return 'contain';
          case 'instagram':
            // Instagram Stories: full-screen video (cover)
            if (instagramAdPlacement === '9:16') return 'cover';
            // Reels: video letterboxed within placement (contain)
            if (instagramAdPlacement === '9:16-reel') return 'contain';
            // Feed posts: image/video fills its media box (cover)
            return 'cover';
          case 'facebook':
            // Facebook feed media fills its box
            return 'cover';
          case 'linkedin':
            // LinkedIn uses object-contain for video (letterboxed/pillarboxed)
            return 'contain';
          default:
            return 'contain';
        }
      };

      // Determine the specific area on the canvas where the video should be drawn
      // Default is full canvas (0, 0, width, height)
      const getVideoDrawArea = () => {
        // Special handling for Instagram Reels (9:16-reel)
        if (activeAdType === 'instagram' && instagramAdPlacement === '9:16-reel') {
          // For Instagram Reels, video is placed between status bar and bottom UI
          // Top: 4.19%, Height: 81.51% (matching Preview component)
          return {
            x: 0,
            y: height * 0.0419,
            w: width,
            h: height * 0.8151
          };
        }

        // Special handling for LinkedIn single-asset:
        // we want the exported video to be restricted to the actual media
        // container, not the entire phone frame. So we compute the draw area
        // from the <video> element's position relative to the preview frame.
        if (activeAdType === 'linkedin') {
          const videoRect = videoElement.getBoundingClientRect();

          // If layout info is unavailable, fall back to full canvas.
          if (
            !videoRect.width ||
            !videoRect.height ||
            !containerRect.width ||
            !containerRect.height
          ) {
            return { x: 0, y: 0, w: width, h: height };
          }

          const relX = (videoRect.left - containerRect.left) / containerRect.width;
          const relY = (videoRect.top - containerRect.top) / containerRect.height;
          const relW = videoRect.width / containerRect.width;
          const relH = videoRect.height / containerRect.height;

          return {
            x: Math.max(0, width * relX),
            y: Math.max(0, height * relY),
            w: Math.max(1, width * relW),
            h: Math.max(1, height * relH),
          };
        }

        // Default: use the full canvas
        return { x: 0, y: 0, w: width, h: height };
      };

      const videoObjectFit = getVideoObjectFit();
      const targetArea = getVideoDrawArea();

      // Calculate video drawing dimensions once (outside the loop for performance)
      // We calculate relative to the target area, not the full canvas
      const targetAspect = targetArea.w / targetArea.h;
      const videoAspect = videoWidth / videoHeight;

      let drawWidth = targetArea.w;
      let drawHeight = targetArea.h;
      let drawX = targetArea.x;
      let drawY = targetArea.y;

      if (videoObjectFit === 'contain') {
        // Contain: entire video visible inside target area (letterbox / pillarbox)
        if (videoAspect > targetAspect) {
          // Video relatively wider → limit by width
          drawWidth = targetArea.w;
          drawHeight = targetArea.w / videoAspect;
          drawX = targetArea.x;
          drawY = targetArea.y + (targetArea.h - drawHeight) / 2;
        } else {
          // Video relatively taller → limit by height
          drawHeight = targetArea.h;
          drawWidth = targetArea.h * videoAspect;
          drawY = targetArea.y;
          drawX = targetArea.x + (targetArea.w - drawWidth) / 2;
        }
      } else {
        // Cover: fill target area, cropping as needed
        if (videoAspect > targetAspect) {
          // Video relatively wider → limit by height, crop left/right
          drawHeight = targetArea.h;
          drawWidth = targetArea.h * videoAspect;
          drawX = targetArea.x + (targetArea.w - drawWidth) / 2;
          drawY = targetArea.y;
        } else {
          // Video relatively taller → limit by width, crop top/bottom
          drawWidth = targetArea.w;
          drawHeight = targetArea.w / videoAspect;
          drawY = targetArea.y + (targetArea.h - drawHeight) / 2;
          drawX = targetArea.x;
        }
      }

      console.log('Video drawing config:', {
        videoSize: `${videoWidth}x${videoHeight}`,
        canvasSize: `${width}x${height}`,
        drawSize: `${drawWidth}x${drawHeight}`,
        drawPos: `${drawX},${drawY}`
      });

      // Start recording
      mediaRecorder.start();

      // Use fixed interval for consistent 30fps frame capture
      const frameInterval = 1000 / 30; // ~33.33ms per frame
      let frameCount = 0;
      const totalDuration = videoElement.duration || 15;
      const estimatedTotalFrames = Math.ceil(totalDuration * 30);

      const drawFrame = () => {
        // Check if video is ready to be drawn
        if (videoElement.readyState < 2) {
          setTimeout(drawFrame, frameInterval);
          return;
        }

        frameCount++;

        // Update progress
        if (frameCount % 10 === 0) {
          const progress = Math.min(99, (frameCount / estimatedTotalFrames) * 100);
          setExportProgress(progress);
        }

        // Stop conditions
        if (videoElement.paused || videoElement.ended || frameCount > estimatedTotalFrames + 30) {
          if (mediaRecorder.state === 'recording') {
            console.log(`Stopping recording: paused=${videoElement.paused}, ended=${videoElement.ended}, frames=${frameCount}`);
            mediaRecorder.stop();
          }
          return;
        }

        // Clear canvas with background color
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // 1. Draw Video (Background) - draw regardless of visibility checks
        // The video element's internal state is what matters, not DOM visibility
        try {
          if (videoElement.readyState >= 2) {
            // Always try to draw - don't check visibility, just draw it
            ctx.drawImage(videoElement, drawX, drawY, drawWidth, drawHeight);

            // Log first few frames for debugging
            if (frameCount <= 3) {
              console.log(`Frame ${frameCount} drawn: readyState=${videoElement.readyState}, currentTime=${videoElement.currentTime.toFixed(3)}`);
            }
          } else if (frameCount === 1) {
            console.warn(`Video not ready on first frame: readyState=${videoElement.readyState}`);
          }
        } catch (drawError) {
          console.error(`Error drawing video frame ${frameCount}:`, drawError);
        }

        // 2. Draw Overlay (Foreground) - this includes the mobile frame and all UI elements
        // We use the processed overlay where pure black areas have been made transparent so
        // the video content shows through.
        // For Instagram Stories, switch overlay based on current time to show CTA animation
        try {
          let overlayToDraw = processedOverlay;
          if (isInstagramStories && stageOverlays.length >= 3) {
            const currentTime = videoElement.currentTime;
            if (currentTime < 1.5) {
              // Stage 0: Small white button (0-1.5s)
              overlayToDraw = stageOverlays[0];
            } else if (currentTime < 3.0) {
              // Stage 1: Wide button (1.5-3s)
              overlayToDraw = stageOverlays[1];
            } else {
              // Stage 2: CTA card (3s+), only if showCard is enabled
              overlayToDraw = instagramAd.showCard ? stageOverlays[2] : stageOverlays[1];
            }
          }
          ctx.drawImage(overlayToDraw, 0, 0, width, height);
        } catch (overlayError) {
          if (frameCount === 1) {
            console.warn('Error drawing overlay:', overlayError);
          }
        }

        // Schedule next frame with fixed interval
        setTimeout(drawFrame, frameInterval);
      };

      // Start drawing frames immediately
      drawFrame();

      // Stop recording when video ends
      videoElement.onended = () => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      };

      // Restore loop state when recording stops
      mediaRecorder.addEventListener('stop', () => {
        videoElement.loop = originalLoop;
        videoElement.muted = originalMuted;
        if (originalLoop) {
          videoElement.play().catch(e => console.log('Resume play failed', e));
        }
      });

    } catch (error) {
      console.error('Error exporting video:', error);
      setExportStatus('error');
      setExportError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleExport = async (format: 'png' | 'jpeg' | 'mp4') => {
    // Handle MP4 export separately
    if (format === 'mp4') {
      await handleVideoExport();
      return;
    }

    if (previewRef.current === null) {
      return;
    }

    const previewElement = previewRef.current;

    // Check for video and capture frame
    const videoElement = previewElement.querySelector('video');
    if (videoElement && !videoElement.paused && !videoElement.ended) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL('image/png');
          setTempExportImage(frameData);
          // Wait for re-render
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (e) {
        console.error("Failed to capture video frame for export", e);
      }
    }

    try {
      // Small delay to ensure styles are applied if state changed
      if (videoElement) await new Promise(resolve => setTimeout(resolve, 200));

      const dataUrl = format === 'png'
        ? await htmlToImage.toPng(previewElement, { cacheBust: true, pixelRatio: 2 })
        : await htmlToImage.toJpeg(previewElement, { cacheBust: true, pixelRatio: 2, quality: 0.95 });

      saveAs(dataUrl, `${activeAdType}-ad-preview.${format}`);
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export image.');
    } finally {
      setTempExportImage(null);
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
    // Pass tempExportImage as a special prop to override video rendering during export
    const exportProps = tempExportImage ? { staticImage: tempExportImage } : {};

    // Create keys based on image presence and a hash to force re-render when image changes
    const getImageKey = (image: string) => image ? image.substring(0, 50) : 'empty';

    switch (activeAdType) {
      case 'facebook':
        return <FacebookAdPreview key={`facebook-${getImageKey(facebookAd.image)}`} ad={facebookAd} mode={previewMode} placement={facebookAdPlacement} logo={globalLogo} {...exportProps} />;
      case 'instagram':
        return <InstagramAdPreview key={`instagram-${getImageKey(instagramAd.image)}`} ref={instagramPreviewRef} ad={instagramAd} mode={previewMode} placement={instagramAdPlacement} logo={globalLogo} {...exportProps} />;
      case 'tiktok':
        return <TikTokAdPreview key={`tiktok-${getImageKey(tiktokAd.video)}`} ad={tiktokAd} mode={previewMode} placement={tiktokAdPlacement} logo={globalLogo} {...exportProps} />;
      case 'linkedin':
        return <LinkedInAdPreview key={`linkedin-${getImageKey(linkedinAd.image)}`} ad={linkedinAd} mode={previewMode} placement={linkedinAdPlacement} logo={globalLogo} {...exportProps} />;
      default:
        return null;
    }
  };



  return (
    <div className="min-h-screen bg-[#ffd7b5]/10 shadow-sm">
      <Header
        activeType={activeAdType}
        onTypeChange={handleAdTypeChange}
        onExport={handleExport}
        hasVideo={hasVideo()}
        globalLogo={globalLogo}
        onGlobalLogoChange={setGlobalLogo}
      />

      <ExportProgressModal
        isOpen={isExporting}
        progress={exportProgress}
        status={exportStatus}
        error={exportError}
        onClose={() => setIsExporting(false)}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <div className="flex-grow" style={{ flexBasis: '50%', maxWidth: '50%' }}>
            <div className="bg-white shadow-sm rounded-lg px-14 py-6 h-[850px] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {activeAdType.charAt(0).toUpperCase() + activeAdType.slice(1)} Ad Editor
              </h2>

              {renderEditor()}
            </div>
          </div>
          <div className="flex-shrink-0" style={{ flexBasis: '50%', maxWidth: '50%' }}>
            <div className="bg-gray-100 rounded-lg shadow-sm p-6 h-[850px]">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Preview
                </h2>
              </div>
              <div className="flex items-top justify-center h-[calc(850px-110px)]">
                <div className="transform scale-95 origin-center">
                  <div ref={previewRef} className="inline-block">
                    {renderPreview()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
