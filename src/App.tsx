import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { AdTypeSelector } from './components/AdTypeSelector';
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


function App() {
  const [activeAdType, setActiveAdType] = useState<AdType>('facebook');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('mobile');
  const [activePreview, setActivePreview] = useState('feed');
  const previewRef = useRef<HTMLDivElement>(null);
  const instagramPreviewRef = useRef<InstagramAdPreviewRef>(null);

  const [facebookAd, setFacebookAd] = useState<FacebookAd>({
    headline: '',
    description: '',
    image: '',
    businessName: 'The University of Sheffield',
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
    businessName: 'The University of Sheffield',
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
    businessName: 'The University of Sheffield',
    finalUrl: '',
    callToAction: '',
    videoLength: 15,
  });

  const [tiktokAdPlacement, setTiktokAdPlacement] = useState('feed');

  const [linkedinAd, setLinkedinAd] = useState<LinkedInAd>({
    headline: '',
    description: '',
    image: '',
    businessName: 'The University of Sheffield',
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

  // Load state from URL hash on mount
  // Load state from URL hash on mount




  const [tempExportImage, setTempExportImage] = useState<string | null>(null);

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

  const handleVideoExport = async () => {
    if (previewRef.current === null) {
      return;
    }

    const previewElement = previewRef.current;
    const videoElement = previewElement.querySelector('video') as HTMLVideoElement;

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

      // Get video dimensions
      const width = videoElement.videoWidth || 1080;
      const height = videoElement.videoHeight || 1920;

      if (width === 0 || height === 0) {
        throw new Error('Video dimensions are invalid.');
      }

      // 1. Capture the UI Overlay (everything except the video)
      // We use html-to-image to snapshot the preview container, but filter out the video element
      // and force a transparent background so we can layer it on top of the video canvas.
      console.log('Capturing UI overlay...');
      const overlayDataUrl = await htmlToImage.toPng(previewElement, {
        quality: 1.0,
        pixelRatio: 2,
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
        }
      });

      const overlayImage = new Image();
      await new Promise((resolve, reject) => {
        overlayImage.onload = resolve;
        overlayImage.onerror = reject;
        overlayImage.src = overlayDataUrl;
      });
      console.log('UI overlay captured.');

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

      mediaRecorder.onstop = () => {
        console.log('Recording stopped, creating blob...');
        const blob = new Blob(chunks, { type: mimeType });
        console.log('Blob created:', blob.size, 'bytes');

        if (blob.size === 0) {
          setExportStatus('error');
          setExportError('Recorded video is empty.');
          return;
        }

        setExportStatus('processing');
        setExportProgress(100);

        const extension = mimeType.includes('webm') ? 'webm' : 'mp4';
        const timestamp = new Date().getTime();
        const filename = `${activeAdType} -ad - preview - ${timestamp}.${extension} `;

        try {
          // Always use manual download method
          const url = URL.createObjectURL(blob);
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
          console.error('Error downloading file:', error);
          setExportStatus('error');
          setExportError('Failed to trigger download.');
        }
      };

      // Store original loop state and disable it for recording
      const originalLoop = videoElement.loop;
      videoElement.loop = false;

      // Reset and play video from start
      videoElement.currentTime = 0;
      videoElement.muted = true; // Mute to allow autoplay

      // Handle play promise
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        await playPromise.catch((error) => {
          console.error('Play failed:', error);
          throw new Error('Failed to play video for recording');
        });
      }

      // Start recording
      mediaRecorder.start();

      // Draw video frames to canvas
      let frameCount = 0;
      const totalDuration = videoElement.duration || 15; // Estimate duration
      const estimatedTotalFrames = totalDuration * 30;

      const drawFrame = () => {
        frameCount++;

        // Update progress
        if (frameCount % 10 === 0) {
          const progress = Math.min(99, (frameCount / estimatedTotalFrames) * 100);
          setExportProgress(progress);
        }

        // Stop conditions
        if (videoElement.paused || videoElement.ended || frameCount > 3600) { // 2 min safety limit
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
          return;
        }

        // 1. Draw Video (Background)
        ctx.drawImage(videoElement, 0, 0, width, height);

        // 2. Draw Overlay (Foreground)
        // We draw the static overlay image on top of the video frame
        ctx.drawImage(overlayImage, 0, 0, width, height);

        requestAnimationFrame(drawFrame);
      };

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

      saveAs(dataUrl, `${activeAdType} -ad - preview.${format} `);
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

    switch (activeAdType) {
      case 'facebook':
        return <FacebookAdPreview ad={facebookAd} mode={previewMode} placement={facebookAdPlacement} {...exportProps} />;
      case 'instagram':
        return <InstagramAdPreview ref={instagramPreviewRef} ad={instagramAd} mode={previewMode} placement={instagramAdPlacement} {...exportProps} />;
      case 'tiktok':
        return <TikTokAdPreview ad={tiktokAd} mode={previewMode} placement={tiktokAdPlacement} {...exportProps} />;
      case 'linkedin':
        return <LinkedInAdPreview ad={linkedinAd} mode={previewMode} placement={linkedinAdPlacement} {...exportProps} />;
      default:
        return null;
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 animate-gradient-xy">
      <Header activeType={activeAdType} onTypeChange={handleAdTypeChange} onExport={handleExport} hasVideo={hasVideo()} />

      <ExportProgressModal
        isOpen={isExporting}
        progress={exportProgress}
        status={exportStatus}
        error={exportError}
        onClose={() => setIsExporting(false)}
      />

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdTypeSelector activeType={activeAdType} onTypeChange={handleAdTypeChange} />

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
            <div className="bg-gray-100 rounded-lg p-6 h-[850px]">
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
