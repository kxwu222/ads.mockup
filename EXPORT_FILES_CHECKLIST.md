# Export Functionality - Files Checklist

Use this checklist when copying export functionality to another repository.

## ✅ Core Export Files

- [ ] `src/utils/exportUtils.ts` - **REQUIRED** - Main export utility functions
- [ ] `src/components/ExportProgressModal.tsx` - **REQUIRED** - Progress modal UI
- [ ] `src/components/Header.tsx` - **OPTIONAL** - Export button/dropdown (or integrate into your existing header)

## ✅ Configuration Files

- [ ] `package.json` - Add dependencies:
  - `@ffmpeg/ffmpeg: ^0.12.10`
  - `@ffmpeg/util: ^0.12.2`
  - `file-saver: ^2.0.5`
  - `html-to-image: ^1.11.13`
- [ ] `vite.config.ts` - Add FFmpeg WASM configuration (see integration guide)

## ✅ Preview Component Updates

Update these files to support video export with overlays:

### InstagramAdPreview.tsx
- [ ] Add `setStage` method to `InstagramAdPreviewRef` interface
- [ ] Implement `setStage` in `useImperativeHandle`
- [ ] Add `data-export-hide-bg="true"` to Reels video container
- [ ] Use inline CSS gradient instead of Tailwind for Reels top overlay
- [ ] Set Status Bar background to solid black (`#000`) for Reels

### FacebookAdPreview.tsx
- [ ] Add key-color background div (`backgroundColor: 'rgb(1, 2, 3)'`) behind video content

### LinkedInAdPreview.tsx
- [ ] Add key-color background div (`backgroundColor: 'rgb(1, 2, 3)'`) behind video content
- [ ] Remove `mt-2` from Ad Card
- [ ] Add `minHeight: 0` to Content Area

### TikTokAdPreview.tsx
- [ ] Add key-color background div (`backgroundColor: 'rgb(1, 2, 3)'`) behind video content

## ✅ Type Definitions

- [ ] `src/types/ads.ts` - Ensure these types exist:
  - `AdType` - `'facebook' | 'instagram' | 'tiktok' | 'linkedin'`
  - `FacebookAd`, `InstagramAd`, `TikTokAd`, `LinkedInAd` interfaces

## ✅ Integration in Your App

- [ ] Import `handleExport` from `src/utils/exportUtils`
- [ ] Import `ExportProgressModal` component
- [ ] Add export state management:
  - `isExporting: boolean`
  - `exportProgress: number`
  - `exportStatus: ExportStatus`
  - `exportError: string | undefined`
- [ ] Create `previewRef` using `useRef<HTMLDivElement>(null)`
- [ ] Create `instagramPreviewRef` using `useRef<InstagramAdPreviewRef>(null)` (if using Instagram)
- [ ] Implement `handleExportClick` function
- [ ] Add export button/UI (use Header component or create your own)
- [ ] Add `ExportProgressModal` to your render
- [ ] Wire up export button to `handleExportClick`

## ✅ Testing Checklist

After integration, test:

- [ ] PNG export works for all platforms
- [ ] JPEG export works for all platforms
- [ ] MP4 export works for all platforms
- [ ] Video export includes overlay elements (CTA buttons, text, mobile frames)
- [ ] Instagram Stories MP4 shows CTA animation (3 stages)
- [ ] Instagram Reels MP4 has correct video positioning
- [ ] All platforms maintain correct aspect ratios in exported video
- [ ] Progress modal shows correct status messages
- [ ] Error handling works (test with invalid video, etc.)

## 📝 Notes

- The key-color `rgb(1, 2, 3)` is used to identify areas that should be transparent during export
- `data-export-hide-bg="true"` attribute makes containers transparent during overlay capture
- Instagram Stories CTA animation requires `setStage` method in `InstagramAdPreviewRef`
- All preview components should use `aspect-ratio` CSS instead of fixed heights for proper export

