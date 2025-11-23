/**
 * Export Utility Functions
 * 
 * Standalone utility for exporting ad previews as PNG, JPEG, or MP4.
 * This file can be easily integrated into other repositories.
 * 
 * Dependencies:
 * - html-to-image: ^1.11.13
 * - file-saver: ^2.0.5
 * - @ffmpeg/ffmpeg: ^0.12.10
 * - @ffmpeg/util: ^0.12.2
 */

import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';

// Export types
export type AdType = 'facebook' | 'instagram' | 'tiktok' | 'linkedin';
export type ExportFormat = 'png' | 'jpeg' | 'mp4';
export type ExportStatus = 'idle' | 'recording' | 'processing' | 'completed' | 'error';

export interface ExportProgressCallbacks {
  onProgress?: (progress: number) => void;
  onStatusChange?: (status: ExportStatus) => void;
  onError?: (error: string) => void;
}

export interface VideoExportOptions {
  activeAdType: AdType;
  placement?: string;
  instagramShowCard?: boolean;
  setStage?: (stage: number) => void; // For Instagram Stories CTA animation
}

/**
 * Transcodes a WebM blob to MP4 using FFmpeg.wasm
 */
export async function transcodeToMp4(
  sourceBlob: Blob,
  callbacks?: ExportProgressCallbacks
): Promise<Blob> {
  callbacks?.onStatusChange?.('processing');
  callbacks?.onProgress?.(90);

  try {
    // Dynamically import ffmpeg to avoid build-time issues
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

        callbacks?.onProgress?.(100);
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

        callbacks?.onProgress?.(100);
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
    callbacks?.onStatusChange?.('error');
    callbacks?.onError?.('Failed to transcode video to MP4.');
    throw error;
  }
}

/**
 * Determines the object-fit behavior for video based on platform and placement
 */
function getVideoObjectFit(
  activeAdType: AdType,
  placement?: string
): 'contain' | 'cover' {
  switch (activeAdType) {
    case 'tiktok':
      // TikTok feed: video should sit inside the phone frame with padding when 1:1
      return 'contain';
    case 'instagram':
      // Instagram Stories: full-screen video (cover)
      if (placement === '9:16') return 'cover';
      // Reels: video letterboxed within placement (contain)
      if (placement === '9:16-reel') return 'contain';
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
}

/**
 * Determines the specific area on the canvas where the video should be drawn
 */
function getVideoDrawArea(
  width: number,
  height: number,
  activeAdType: AdType,
  placement?: string
) {
  if (activeAdType === 'instagram' && placement === '9:16-reel') {
    // For Instagram Reels, video is placed between status bar and bottom UI
    // Top: 4.19%, Height: 81.51% (matching Preview component)
    return {
      x: 0,
      y: height * 0.0419,
      w: width,
      h: height * 0.8151
    };
  }
  return { x: 0, y: 0, w: width, h: height };
}

/**
 * Exports the preview as PNG or JPEG
 */
export async function exportImage(
  previewElement: HTMLElement,
  format: 'png' | 'jpeg',
  filename: string
): Promise<void> {
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
        // Wait for re-render if needed
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

    saveAs(dataUrl, filename);
  } catch (error) {
    console.error('Error exporting image:', error);
    throw new Error('Failed to export image.');
  }
}

/**
 * Exports the preview as MP4 with overlay elements
 */
export async function exportVideo(
  previewElement: HTMLElement,
  filename: string,
  options: VideoExportOptions,
  callbacks?: ExportProgressCallbacks
): Promise<void> {
  // Find the actual preview component element (the mobile frame container)
  const actualPreviewElement = previewElement.querySelector('[style*="aspectRatio"]') as HTMLElement 
    || previewElement.firstElementChild as HTMLElement 
    || previewElement;
  const videoElement = actualPreviewElement.querySelector('video') as HTMLVideoElement;

  if (!videoElement) {
    throw new Error('No video found in preview.');
  }

  try {
    callbacks?.onStatusChange?.('recording');
    callbacks?.onProgress?.(0);

    // Ensure video is loaded
    if (videoElement.readyState < 2) {
      await new Promise((resolve, reject) => {
        videoElement.onloadedmetadata = resolve;
        videoElement.onerror = reject;
        setTimeout(() => reject(new Error('Video loading timeout')), 5000);
      });
    }

    // Get preview container dimensions (mobile frame) instead of video native dimensions
    const containerRect = actualPreviewElement.getBoundingClientRect();
    const baseWidth = Math.round(containerRect.width);
    const baseHeight = Math.round(containerRect.height);
    const width = baseWidth * 2; // 2x for high DPI
    const height = baseHeight * 2; // 2x for high DPI

    if (width === 0 || height === 0) {
      throw new Error('Container dimensions are invalid.');
    }

    // Get video native dimensions for scaling
    const videoWidth = videoElement.videoWidth || 1080;
    const videoHeight = videoElement.videoHeight || 1920;
    
    if (videoWidth === 0 || videoHeight === 0) {
      throw new Error('Video dimensions are invalid.');
    }

    // 1. Capture the UI Overlay (everything except the video)
    console.log('Capturing UI overlay...');
    
    // Ensure any scrollable containers are scrolled to top before capture
    const scrollableElements = previewElement.querySelectorAll('[class*="overflow"]');
    scrollableElements.forEach((el) => {
      if (el instanceof HTMLElement && (el.scrollTop > 0 || el.scrollLeft > 0)) {
        el.scrollTop = 0;
        el.scrollLeft = 0;
      }
    });
    
    // Force the actual preview container to maintain exact dimensions during capture
    const originalStyle = actualPreviewElement.style.cssText;
    const originalMargin = actualPreviewElement.style.margin;
    const originalPadding = actualPreviewElement.style.padding;
    const originalBoxSizing = actualPreviewElement.style.boxSizing;
    
    // Ensure box-sizing is content-box so width matches exactly
    actualPreviewElement.style.boxSizing = 'content-box';
    actualPreviewElement.style.width = `${baseWidth}px`;
    actualPreviewElement.style.flexShrink = '0';
    actualPreviewElement.style.flexGrow = '0';
    
    // Remove border, margin, and padding during capture
    actualPreviewElement.style.borderWidth = '0';
    actualPreviewElement.style.borderStyle = 'none';
    actualPreviewElement.style.margin = '0';
    actualPreviewElement.style.padding = '0';

    // Identify elements that need to be transparent during export
    const transparentElements = actualPreviewElement.querySelectorAll('[data-export-hide-bg="true"]');
    const originalBackgrounds: { element: HTMLElement, bg: string }[] = [];
    
    transparentElements.forEach(el => {
      if (el instanceof HTMLElement) {
        originalBackgrounds.push({ element: el, bg: el.style.backgroundColor });
        el.style.backgroundColor = 'transparent';
        el.style.background = 'transparent';
      }
    });
    
    // Longer delay to ensure styles are applied
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Suppress console errors for CSS security issues
    const originalConsoleError = console.error;
    const cssErrors: any[] = [];
    console.error = (...args: any[]) => {
      if (args[0]?.includes?.('cssRules') || args[0]?.includes?.('CSSStyleSheet')) {
        cssErrors.push(args);
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
    let overlayDataUrl: string;
    try {
      overlayDataUrl = await htmlToImage.toPng(actualPreviewElement, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: 'transparent',
        filter: (node) => {
          return node.tagName !== 'VIDEO';
        },
        style: {
          background: 'transparent',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          border: 'none',
          width: `${baseWidth}px`,
          boxSizing: 'content-box',
          margin: '0',
          padding: '0',
        },
        cacheBust: true,
      });
    } catch (error) {
      console.error('Failed to capture overlay:', error);
      // Create a blank overlay as fallback
      const blankCanvas = document.createElement('canvas');
      blankCanvas.width = width;
      blankCanvas.height = height;
      overlayDataUrl = blankCanvas.toDataURL('image/png');
    } finally {
      // Restore original background colors
      originalBackgrounds.forEach(({ element, bg }) => {
        element.style.backgroundColor = bg;
        element.style.background = '';
      });

      // Restore original container styles
      actualPreviewElement.style.cssText = originalStyle;
      if (originalMargin) actualPreviewElement.style.margin = originalMargin;
      if (originalPadding) actualPreviewElement.style.padding = originalPadding;
      if (originalBoxSizing) actualPreviewElement.style.boxSizing = originalBoxSizing;
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

    // Post-process overlay to punch out key-color areas (rgb(1, 2, 3)) so video shows through
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = width;
    overlayCanvas.height = height;
    const overlayCtx = overlayCanvas.getContext('2d');
    if (!overlayCtx) {
      throw new Error('Failed to create overlay canvas context.');
    }

    overlayCtx.drawImage(overlayImage, 0, 0, width, height);
    const overlayImageData = overlayCtx.getImageData(0, 0, width, height);
    const data = overlayImageData.data;

    // Make only our special key-color (rgb(1, 2, 3)) fully transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

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
    let stageOverlays: HTMLImageElement[] = [processedOverlay];
    const isInstagramStories = options.activeAdType === 'instagram' && options.placement === '9:16';
    
    if (isInstagramStories && options.setStage) {
      console.log('Capturing Instagram Stories CTA animation stages...');
      const stages = [0, 1, 2];
      const stageImages: HTMLImageElement[] = [];
      
      for (const stage of stages) {
        options.setStage(stage);
        await new Promise(resolve => setTimeout(resolve, 100));
        
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
          
          // Process this stage overlay
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
          stageImages.push(processedOverlay);
        }
      }
      
      stageOverlays = stageImages;
      console.log(`Captured ${stageOverlays.length} stage overlays for Instagram Stories animation`);
      
      // Reset to initial stage
      options.setStage(options.instagramShowCard ? 2 : 1);
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
        callbacks?.onStatusChange?.('error');
        callbacks?.onError?.('Recorded video is empty.');
        return;
      }

      try {
        const mp4Blob = await transcodeToMp4(blob, callbacks);

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

        callbacks?.onStatusChange?.('completed');
      } catch (error) {
        console.error('Error downloading MP4 file:', error);
        if (!callbacks?.onError) {
          callbacks?.onError?.('Failed to export MP4 video.');
        }
        callbacks?.onStatusChange?.('error');
      }
    };

    // Store original loop state and disable it for recording
    const originalLoop = videoElement.loop;
    const originalMuted = videoElement.muted;
    videoElement.loop = false;
    videoElement.muted = true;

    // Reset and ensure video is ready
    videoElement.currentTime = 0;
    
    if (videoElement.readyState < 2) {
      await new Promise((resolve, reject) => {
        videoElement.oncanplay = resolve;
        videoElement.onerror = reject;
        setTimeout(() => reject(new Error('Video loading timeout')), 10000);
      });
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      await videoElement.play();
    } catch (error) {
      console.error('Play failed:', error);
      throw new Error('Failed to play video for recording');
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    if (videoElement.paused) {
      console.warn('Video is paused, attempting to play again...');
      await videoElement.play();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const videoObjectFit = getVideoObjectFit(options.activeAdType, options.placement);
    const targetArea = getVideoDrawArea(width, height, options.activeAdType, options.placement);

    // Calculate video drawing dimensions
    const targetAspect = targetArea.w / targetArea.h;
    const videoAspect = videoWidth / videoHeight;
    
    let drawWidth = targetArea.w;
    let drawHeight = targetArea.h;
    let drawX = targetArea.x;
    let drawY = targetArea.y;

    if (videoObjectFit === 'contain') {
      if (videoAspect > targetAspect) {
        drawWidth = targetArea.w;
        drawHeight = targetArea.w / videoAspect;
        drawX = targetArea.x;
        drawY = targetArea.y + (targetArea.h - drawHeight) / 2;
      } else {
        drawHeight = targetArea.h;
        drawWidth = targetArea.h * videoAspect;
        drawY = targetArea.y;
        drawX = targetArea.x + (targetArea.w - drawWidth) / 2;
      }
    } else {
      if (videoAspect > targetAspect) {
        drawHeight = targetArea.h;
        drawWidth = targetArea.h * videoAspect;
        drawX = targetArea.x + (targetArea.w - drawWidth) / 2;
        drawY = targetArea.y;
      } else {
        drawWidth = targetArea.w;
        drawHeight = targetArea.w / videoAspect;
        drawY = targetArea.y + (targetArea.h - drawHeight) / 2;
        drawX = targetArea.x;
      }
    }

    // Start recording
    mediaRecorder.start();

    // Use fixed interval for consistent 30fps frame capture
    const frameInterval = 1000 / 30; // ~33.33ms per frame
    let frameCount = 0;
    const totalDuration = videoElement.duration || 15;
    const estimatedTotalFrames = Math.ceil(totalDuration * 30);

    const drawFrame = () => {
      if (videoElement.readyState < 2) {
        setTimeout(drawFrame, frameInterval);
        return;
      }

      frameCount++;

      // Update progress
      if (frameCount % 10 === 0) {
        const progress = Math.min(99, (frameCount / estimatedTotalFrames) * 100);
        callbacks?.onProgress?.(progress);
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

      // 1. Draw Video (Background)
      try {
        if (videoElement.readyState >= 2) {
          ctx.drawImage(videoElement, drawX, drawY, drawWidth, drawHeight);
        }
      } catch (drawError) {
        console.error(`Error drawing video frame ${frameCount}:`, drawError);
      }

      // 2. Draw Overlay (Foreground)
      try {
        let overlayToDraw = processedOverlay;
        if (isInstagramStories && stageOverlays.length >= 3) {
          const currentTime = videoElement.currentTime;
          if (currentTime < 1.5) {
            overlayToDraw = stageOverlays[0];
          } else if (currentTime < 3.0) {
            overlayToDraw = stageOverlays[1];
          } else {
            overlayToDraw = options.instagramShowCard ? stageOverlays[2] : stageOverlays[1];
          }
        }
        ctx.drawImage(overlayToDraw, 0, 0, width, height);
      } catch (overlayError) {
        if (frameCount === 1) {
          console.warn('Error drawing overlay:', overlayError);
        }
      }

      // Schedule next frame
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
    callbacks?.onStatusChange?.('error');
    callbacks?.onError?.(error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Main export handler - routes to image or video export
 */
export async function handleExport(
  previewElement: HTMLElement,
  format: ExportFormat,
  activeAdType: AdType,
  options?: {
    placement?: string;
    instagramShowCard?: boolean;
    setStage?: (stage: number) => void;
  },
  callbacks?: ExportProgressCallbacks
): Promise<void> {
  const timestamp = new Date().getTime();
  const filename = format === 'mp4'
    ? `${activeAdType}-ad-preview-${timestamp}.mp4`
    : `${activeAdType}-ad-preview.${format}`;

  if (format === 'mp4') {
    await exportVideo(previewElement, filename, {
      activeAdType,
      placement: options?.placement,
      instagramShowCard: options?.instagramShowCard,
      setStage: options?.setStage,
    }, callbacks);
  } else {
    await exportImage(previewElement, format, filename);
  }
}

