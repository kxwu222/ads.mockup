export interface AdAsset {
  id: string;
  type: 'image' | 'text' | 'headline' | 'description' | 'url';
  content: string;
  title?: string;
}

export interface SearchAd {
  headline: string;
  description: string;
  displayUrl: string;
  finalUrl: string;
  sitelinks?: { text: string }[];
  image?: string;
}

export interface DisplayAd {
  headline: string;
  description: string;
  image: string;
  logo: string;
  businessName: string;
  finalUrl: string;
  callToAction: string;
  ctaType?: string;
  showCTA?: boolean; // <-- Added for editor toggle
}

export interface YouTubeAd {
  videoThumbnail: string;
  headline: string;
  description: string;
  callToAction?: string | null;
  finalUrl: string;
  /** Optional business/brand name shown beneath headline */
  businessName?: string;
  /** Optional brand logo shown in ad details */
  logo?: string;
  /** Aspect ratio for video thumbnail */
  thumbnailAspectRatio?: '16/9' | '1/1' | '4/5';
}

export interface DiscoverAd {
  headline: string;
  description: string;
  image: string;
  logo: string;
  businessName: string;
  finalUrl: string;
  imageAspectRatio?: '16/9' | '1/1';
}

export interface GmailAd {
  subject: string;
  description: string;
  image: string;
  logo: string;
  businessName: string;
  finalUrl: string;
  callToAction?: string;
  contentType?: 'description-cta' | 'image-card';
  imageCardDescription?: string;
  closedContentType?: 'subject-cta' | 'subject-description' | 'subject-image-card';
}

export type AdType = 'search' | 'display' | 'youtube' | 'discover' | 'gmail';
export type PreviewMode = 'desktop' | 'mobile';