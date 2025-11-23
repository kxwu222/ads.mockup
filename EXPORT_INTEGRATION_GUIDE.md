# Export Functionality Integration Guide

This guide explains how to integrate the export functionality (PNG/JPEG/MP4) into your existing repository.

## Files to Copy

### Core Files

1. **`src/utils/exportUtils.ts`** - Main export utility functions
2. **`src/components/ExportProgressModal.tsx`** - Progress modal UI component
3. **`src/components/Header.tsx`** - Export button/dropdown (or integrate into your existing header)

### Preview Component Updates

Update your preview components to support export:

- **`src/components/InstagramAdPreview.tsx`** - Add `setStage` method, `data-export-hide-bg` attributes
- **`src/components/FacebookAdPreview.tsx`** - Add key-color background (`rgb(1, 2, 3)`)
- **`src/components/LinkedInAdPreview.tsx`** - Add key-color background
- **`src/components/TikTokAdPreview.tsx`** - Add key-color background

## Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "@ffmpeg/ffmpeg": "^0.12.10",
    "@ffmpeg/util": "^0.12.2",
    "file-saver": "^2.0.5",
    "html-to-image": "^1.11.13"
  }
}
```

Then run:
```bash
npm install
```

## Vite Configuration

Update your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
```

## Integration Steps

### 1. Add Export State to Your Component

```typescript
import { useState } from 'react';
import { ExportProgressModal } from './components/ExportProgressModal';
import { handleExport, ExportStatus } from './utils/exportUtils';

function YourComponent() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [exportError, setExportError] = useState<string | undefined>(undefined);

  // ... rest of your component
}
```

### 2. Create Export Handler

```typescript
const handleExportClick = async (format: 'png' | 'jpeg' | 'mp4') => {
  if (!previewRef.current) {
    return;
  }

  setIsExporting(true);
  setExportProgress(0);
  setExportStatus('idle');
  setExportError(undefined);

  try {
    await handleExport(
      previewRef.current,
      format,
      activeAdType, // Your ad type
      {
        placement: currentPlacement, // e.g., '9:16', '4:5', etc.
        instagramShowCard: instagramAd.showCard, // For Instagram Stories
        setStage: instagramPreviewRef.current?.setStage, // For Instagram Stories CTA animation
      },
      {
        onProgress: setExportProgress,
        onStatusChange: setExportStatus,
        onError: setExportError,
      }
    );
  } catch (error) {
    console.error('Export failed:', error);
    setExportStatus('error');
    setExportError(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    // Don't set isExporting to false here - let the modal handle it
    // The modal will close when status is 'completed' or 'error'
  }
};
```

### 3. Add Export Button/UI

```typescript
import { Header } from './components/Header';

// In your render:
<Header 
  activeType={activeAdType}
  onTypeChange={handleAdTypeChange}
  onExport={handleExportClick}
  hasVideo={hasVideo()} // Your function to detect if video is present
/>
```

### 4. Add Progress Modal

```typescript
<ExportProgressModal
  isOpen={isExporting}
  progress={exportProgress}
  status={exportStatus}
  error={exportError}
  onClose={() => setIsExporting(false)}
/>
```

### 5. Update Preview Components

#### For Instagram Stories CTA Animation

Add a `setStage` method to your `InstagramAdPreview` ref:

```typescript
// In InstagramAdPreview.tsx
export interface InstagramAdPreviewRef {
  setStage: (stage: number) => void;
}

export const InstagramAdPreview = React.forwardRef<InstagramAdPreviewRef, Props>((props, ref) => {
  const [stage, setStage] = useState(0);

  useImperativeHandle(ref, () => ({
    setStage: (newStage: number) => {
      setStage(newStage);
    },
  }));

  // ... rest of component
});
```

#### For Key-Color Transparency

Add a background div with `rgb(1, 2, 3)` behind video content in each preview component:

```typescript
// Example for TikTokAdPreview.tsx
<div style={{ backgroundColor: 'rgb(1, 2, 3)' }}>
  <video src={ad.video} ... />
</div>
```

#### For Instagram Reels Layout

Add `data-export-hide-bg="true"` to containers that should be transparent during export:

```typescript
// In InstagramAdPreview.tsx for Reels
<div data-export-hide-bg="true" className="...">
  {/* Video content */}
</div>
```

## Usage Example

```typescript
import { handleExport } from './utils/exportUtils';

// Export PNG
await handleExport(
  previewRef.current,
  'png',
  'instagram',
  undefined,
  {
    onProgress: (progress) => console.log(progress),
    onStatusChange: (status) => console.log(status),
  }
);

// Export MP4 with Instagram Stories CTA animation
await handleExport(
  previewRef.current,
  'mp4',
  'instagram',
  {
    placement: '9:16',
    instagramShowCard: true,
    setStage: (stage) => instagramPreviewRef.current?.setStage(stage),
  },
  {
    onProgress: setExportProgress,
    onStatusChange: setExportStatus,
    onError: setExportError,
  }
);
```

## Key Features

- **PNG/JPEG Export**: High-quality image export with 2x pixel ratio
- **MP4 Export**: Video export with overlay elements (CTA buttons, text, mobile frames)
- **Platform-Specific Behavior**: 
  - Instagram Stories: CTA button animation (3 stages)
  - Instagram Reels: Proper video positioning (4.19% from top)
  - All platforms: Correct `object-fit` behavior (contain/cover)
- **Progress Tracking**: Real-time progress updates during export
- **Error Handling**: Comprehensive error messages and fallbacks

## Troubleshooting

### FFmpeg Not Loading
- Ensure `vite.config.ts` has the correct headers
- Check browser console for CORS errors
- Verify `@ffmpeg/ffmpeg` and `@ffmpeg/util` are installed

### Video Not Exporting
- Ensure video element is loaded (`readyState >= 2`)
- Check that video is playing before export starts
- Verify `previewRef` points to the correct element

### Overlay Not Showing
- Ensure preview components have key-color backgrounds (`rgb(1, 2, 3)`)
- Check that `data-export-hide-bg="true"` is set on transparent containers
- Verify overlay capture dimensions match canvas dimensions

### Layout Mismatches
- Ensure `aspect-ratio` CSS is used instead of fixed heights
- Check that borders/padding are removed during capture
- Verify percentage-based positioning uses correct container dimensions

## API Reference

### `handleExport`

Main export function that routes to image or video export.

**Parameters:**
- `previewElement: HTMLElement` - The preview container element
- `format: 'png' | 'jpeg' | 'mp4'` - Export format
- `activeAdType: AdType` - Current ad platform type
- `options?: { placement?, instagramShowCard?, setStage? }` - Platform-specific options
- `callbacks?: { onProgress?, onStatusChange?, onError? }` - Progress callbacks

**Returns:** `Promise<void>`

### `exportImage`

Exports preview as PNG or JPEG.

**Parameters:**
- `previewElement: HTMLElement`
- `format: 'png' | 'jpeg'`
- `filename: string`

**Returns:** `Promise<void>`

### `exportVideo`

Exports preview as MP4 with overlay elements.

**Parameters:**
- `previewElement: HTMLElement`
- `filename: string`
- `options: VideoExportOptions`
- `callbacks?: ExportProgressCallbacks`

**Returns:** `Promise<void>`

### `transcodeToMp4`

Transcodes WebM blob to MP4 using FFmpeg.wasm.

**Parameters:**
- `sourceBlob: Blob`
- `callbacks?: ExportProgressCallbacks`

**Returns:** `Promise<Blob>`

