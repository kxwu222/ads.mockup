export interface FacebookAd {
  headline: string;
  description: string;
  image: string;
  businessName: string;
  finalUrl: string;
  callToAction?: string;
  aspectRatio: '4:5' | '1.91:1' | '1:1';
  mediaType: 'image' | 'video';
}

export interface InstagramAd {
  headline: string;
  description: string;
  image: string;
  businessName: string;
  finalUrl: string;
  callToAction?: string;
  aspectRatio: '1:1' | '4:5' | '9:16' | '9:16-reel';
  mediaType: 'image' | 'video';
}

export interface TikTokAd {
  headline: string;
  description: string;
  video: string;
  businessName: string;
  finalUrl: string;
  callToAction?: string;
  videoLength: number; // in seconds
}

export interface LinkedInAd {
  headline: string;
  description: string;
  image: string;
  businessName: string;
  finalUrl: string;
  callToAction?: string;
  aspectRatio: '1:1' | '4:5' | '2:3' | '1:1.91';
  mediaType: 'image' | 'video';
  carouselType?: 'single' | 'carousel';
  carouselImages?: string[];
}

export type AdType = 'facebook' | 'instagram' | 'tiktok' | 'linkedin';
export type PreviewMode = 'desktop' | 'mobile';