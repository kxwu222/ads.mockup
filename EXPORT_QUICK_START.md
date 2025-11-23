# Export Functionality - Quick Start

## Minimal Integration (5 minutes)

### 1. Copy Files

```bash
# Copy core files
cp src/utils/exportUtils.ts /path/to/your/repo/src/utils/
cp src/components/ExportProgressModal.tsx /path/to/your/repo/src/components/
```

### 2. Install Dependencies

```bash
npm install @ffmpeg/ffmpeg@^0.12.10 @ffmpeg/util@^0.12.2 file-saver@^2.0.5 html-to-image@^1.11.13
```

### 3. Update vite.config.ts

```typescript
export default defineConfig({
  // ... your existing config
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

### 4. Add to Your Component

```typescript
import { useState, useRef } from 'react';
import { handleExport, ExportStatus } from './utils/exportUtils';
import { ExportProgressModal } from './components/ExportProgressModal';

function YourComponent() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [exportError, setExportError] = useState<string | undefined>();

  const handleExportClick = async (format: 'png' | 'jpeg' | 'mp4') => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    setExportProgress(0);
    setExportStatus('idle');
    
    try {
      await handleExport(
        previewRef.current,
        format,
        'instagram', // Your ad type
        { placement: '9:16' }, // Optional
        {
          onProgress: setExportProgress,
          onStatusChange: setExportStatus,
          onError: setExportError,
        }
      );
    } catch (error) {
      setExportStatus('error');
      setExportError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <>
      <div ref={previewRef}>
        {/* Your preview content */}
      </div>
      
      <button onClick={() => handleExportClick('png')}>Export PNG</button>
      <button onClick={() => handleExportClick('mp4')}>Export MP4</button>
      
      <ExportProgressModal
        isOpen={isExporting}
        progress={exportProgress}
        status={exportStatus}
        error={exportError}
        onClose={() => setIsExporting(false)}
      />
    </>
  );
}
```

### 5. Update Preview Components (for video export)

Add key-color background behind video:

```typescript
// In your preview component
<div style={{ backgroundColor: 'rgb(1, 2, 3)' }}>
  <video src={videoSrc} />
</div>
```

## That's it! 🎉

Your export functionality is now integrated. See `EXPORT_INTEGRATION_GUIDE.md` for advanced features like Instagram Stories CTA animation.

