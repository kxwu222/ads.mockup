import React, { useState } from 'react';
import { GmailAd, PreviewMode } from '../types/ads';
import { MD3Frame } from './MD3Frame';
import { GoogleBar } from './GoogleBar';
import { MdStarBorder, MdOpenInNew, MdDeleteOutline, MdMoreVert, MdArrowBack } from 'react-icons/md';

// --- Gmail Desktop Frame Components ---
const GmailSidebar: React.FC = () => (
  <div className="w-14 bg-gray-100 flex flex-col items-center py-4">
    <button className="p-2 mb-6">
      <svg width={24} height={24} className="text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  </div>
);

const TabNavigation: React.FC = () => (
  <div className="flex border-b border-gray-200">
    <div className="flex items-center px-4 py-3">
      <svg width={18} height={18} className="text-gray-600 mr-2" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" /></svg>
      <span className="text-gray-800">Primary</span>
    </div>
    <div className="flex items-center px-4 py-3 border-b-2 border-blue-500">
      <svg width={18} height={18} className="text-blue-500 mr-2" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M7 9h10M7 13h6" stroke="currentColor" strokeWidth="2" /></svg>
      <span className="text-blue-500">Promotions</span>
    </div>
  </div>
);

const EmailItem: React.FC<{ ad?: GmailAd; isAd?: boolean; onClick?: () => void }> = ({ ad, isAd, onClick }) => {
  const hasCTA = isAd && ad && ad.callToAction && ad.finalUrl;
  return (
    <div className={`flex items-center px-4 py-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${isAd ? 'bg-blue-50' : ''}`} onClick={onClick}>
      <input type="checkbox" className="mr-2" />
      <MdStarBorder size={18} className="text-gray-400 mr-2" />
      <div className="ml-2 flex-1">
        <div className="flex items-center">
          <span className="text-xs font-medium text-gray-800 mr-2">{ad ? ad.businessName : 'University of Sheffield'}</span>
          {isAd && <span className="text-gray-500 text-xs">Sponsored</span>}
          <span className="mx-1 text-gray-500">•</span>
          {/* Subject line as before */}
          <span className="text-xs font-medium text-gray-800">{ad ? ad.subject : 'Study in the UK'}</span>
          <span className="mx-1 text-gray-500">•</span>
          <span className="text-xs text-gray-600 flex-1 truncate">{ad ? ad.description : 'Join our community of over 28,000 students from 150+ countries. Apply now for fall 2025.'}</span>
          {/* CTA button for desktop closed view, only if ad.callToAction and ad.finalUrl exist */}
          {hasCTA && (
            <a
              href={ad.finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 text-blue-600 bg-white border border-gray-300 rounded-full font-medium text-xs px-2 py-1 whitespace-nowrap flex items-center hover:bg-blue-50 transition"
              style={{ fontWeight: 500, lineHeight: 'normal', borderRadius: '100px' }}
              onClick={e => e.stopPropagation()} // Prevents triggering onAdClick
            >
              {ad.callToAction}
            </a>
          )}
        </div>
      </div>
      {/* Three icon layout for desktop closed with CTA */}
      {hasCTA ? (
        <div className="flex items-center ml-4 gap-2">
          {/* delete icon */}
          <button className="p-1 hover:bg-#6B7280 rounded-full" tabIndex={-1} aria-label="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#6B7280" />
            </svg>
          </button>
          {/* three dot menu */}
          <MdMoreVert size={18} className="text-gray-400" />
        </div>
      ) : (
        <div className="flex items-center ml-4">
          <MdMoreVert size={18} className="text-gray-400" />
        </div>
      )}
    </div>
  );
};

// --- Open Ad Toolbar for Desktop ---
const OpenAdToolbar: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="flex items-center justify-between px-6 w-full">
    <div className="flex items-center space-x-4">
      <button className="text-gray-700 hover:bg-gray-100 rounded-full p-2">
        {/* Left arrow */}
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button className="text-gray-700 hover:bg-gray-100 rounded-full p-2">
        {/* Provided bin icon SVG, 24px */}
        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      </button>
      <button className="text-gray-700 hover:bg-gray-100 rounded-full p-2">
        {/* Star icon */}
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 17.75l-6.16 3.24 1.18-6.88L2 9.76l6.92-1.01L12 2.5l3.08 6.25L22 9.76l-5.02 4.35 1.18 6.88z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
      </button>
{/*       <span className="text-gray-700 text-xs font-medium ml-2">Save to inbox</span> */}
    </div>
    <div />
  </div>
);

// --- Open Ad Content for Desktop ---
const OpenAdContent: React.FC<{ ad: GmailAd }> = ({ ad }) => (
  <div className="relative bg-white rounded-lg border border-gray-100 px-0 py-0 flex flex-col w-full" style={{ boxShadow: 'none' }}>
    {/* First row: logo+name (left), three-dot menu (right) */}
    <div className="flex items-center justify-between px-6 pt-8 pb-4 w-full">
      <div className="flex items-center space-x-4">
        {ad.logo ? (
          <img src={ad.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
            {ad.businessName.charAt(0)}
          </div>
        )}
        {/* Subject line as a clickable link */}
        <a
          href={ad.finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-sm text-gray-900 whitespace-nowrap hover:underline focus:underline"
          style={{ textDecoration: 'none' }}
        >
          {ad.subject}
        </a>
      </div>
      <button className="text-gray-500 hover:text-gray-700">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>
      </button>
    </div>
    {/* Second row: image (left, 40%), description+CTA (right, 60%) */}
    <div className="flex w-full pl-24 pr-24 pt-4 pb-10">
      <div className="flex-shrink-0 w-2/5 flex items-center justify-center">
        {ad.image ? (
          <div className="w-full aspect-[16/9] bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            <img src={ad.image} alt="Ad visual" className="w-full h-full object-cover" style={{ aspectRatio: '16/9' }} />
          </div>
        ) : (
          <div className="w-full aspect-[16/9] bg-gray-200 rounded-md" />
        )}
      </div>
      <div className="flex-1 flex-start flex-col justify-center pl-4 items-end">
        <p className="text-sm text-gray-700 font-medium mb-6" style={{ wordBreak: 'break-word' }}>{ad.description}</p>
        {ad.callToAction && (
          <a
            href={ad.finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit inline-flex items-center pl-2 pr-1 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 transition"
          >
            {ad.callToAction}
          </a>
        )}
      </div>
    </div>
  </div>
);

const GmailDesktopFrame: React.FC<{ ad: GmailAd; isOpen: boolean; onAdClick: () => void; onClose: () => void }> = ({ ad, isOpen, onAdClick, onClose }) => (
  <div className="rounded-lg overflow-x-auto shadow-xl border border-gray-200 bg-white w-full h-full">
    <div className="flex h-[600px]">
      <GmailSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center p-2 border-b border-gray-200">
          <div className="flex items-center ml-2">
            <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" alt="Gmail" className="h-8" />
            <div className="ml-6" />
          </div>
          <div className="mx-4 flex-1">
            <div className="bg-blue-50 rounded-full px-4 py-2 flex items-center">
              <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span className="text-xs text-gray-500">Search in mail</span>
              <div className="ml-auto"><svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></div>
            </div>
          </div>
        </div>
        {/* Toolbar and ad content for open view */}
        {isOpen ? (
          <>
            <OpenAdToolbar onBack={onClose} />
            <OpenAdContent ad={ad} />
          </>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center p-2 border-b border-gray-200">
              <input type="checkbox" className="mr-4" />
              <div className="text-gray-600 mr-4" />
              <MdMoreVert size={20} className="text-gray-600" />
            </div>
            {/* Tabs */}
            <TabNavigation />
            {/* Email list */}
            <div className="flex-1 overflow-auto bg-white">
              <EmailItem ad={ad} isAd onClick={onAdClick} />
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);

interface GmailAdPreviewProps {
  ad: GmailAd;
  mode: PreviewMode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// --- Material 3 Type 2 Toggle Button ---
const ToggleButton: React.FC<{ isOpen: boolean; onChange: (open: boolean) => void }> = ({ isOpen, onChange }) => (
  <div className="inline-flex rounded-lg shadow-sm overflow-hidden border border-gray-200 bg-white">
    <button
      className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-150 ${!isOpen ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
      aria-pressed={!isOpen}
      onClick={() => onChange(false)}
      type="button"
      style={{ minWidth: 80 }}
    >
      Closed
    </button>
    <button
      className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-150 ${isOpen ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
      aria-pressed={isOpen}
      onClick={() => onChange(true)}
      type="button"
      style={{ minWidth: 80 }}
    >
      Open
    </button>
  </div>
);

const ClosedAdLine: React.FC<{ ad: GmailAd }> = ({ ad }) => {
  // Use closedContentType for mobile closed preview
  const closedContentType = ad.closedContentType || 'subject-cta';
  // For image card, require image
  const hasImage = !!ad.image;

  if (closedContentType === 'subject-image-card') {
    // If no image, show fallback to subject-description style
    if (!hasImage) {
      return (
        <div className="p-4 border-b border-gray-200">
          <div className="flex">
            {ad.logo ? (
              <img src={ad.logo} alt="Logo" className="h-12 w-12 rounded-full object-cover mr-3 flex-shrink-0" />
            ) : (
              <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-medium mr-3 flex-shrink-0">
                {ad.businessName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">
                    <span className="text-xs">Sponsored</span> ·{' '}
                    <span className="font-medium text-gray-800 text-sm">
                      {ad.businessName}
                    </span>
                  </p>
                  <p className="text-gray-800 text-xs truncate">{ad.subject}</p>
                </div>
                <MdMoreVert className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-gray-800 text-xs truncate">{ad.description}</span>
                <MdStarBorder className="text-gray-400 ml-2" size={18} />
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Subject line + Image card (16:9) + Description, no CTA, no star
    // Subject line + Image card (16:9) + Description, no CTA, no star
    return (
      <div className="p-4 border-b border-gray-200">
        <div className="flex">
          {ad.logo ? (
            <img src={ad.logo} alt="Logo" className="h-12 w-12 rounded-full object-cover mr-3 flex-shrink-0" />
          ) : (
            <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-medium mr-3 flex-shrink-0">
              {ad.businessName.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">
                  <span className="text-xs">Sponsored</span> ·{' '}
                  <span className="font-medium text-gray-800 text-sm">
                    {ad.businessName}
                  </span>
                </p>
                <p className="text-gray-800 text-xs truncate">{ad.subject}</p>
              </div>
              <MdMoreVert className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
            </div>
            <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
              <img src={ad.image} alt="Ad visual" className="w-full" style={{ aspectRatio: '16/9' }} />
              <div className="p-1">
                <p className="text-gray-800 text-xs overflow-hidden text-ellipsis"
                   style={{ minHeight: '2.5em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ad.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (closedContentType === 'subject-description') {
    // Subject line + Description + star (no CTA)
    return (
      <div className="p-4 border-b border-gray-200">
        <div className="flex">
          {ad.logo ? (
            <img src={ad.logo} alt="Logo" className="h-12 w-12 rounded-full object-cover mr-3 flex-shrink-0" />
          ) : (
            <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-medium mr-3 flex-shrink-0">
              {ad.businessName.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">
                  <span className="text-xs">Sponsored</span> ·{' '}
                  <span className="font-medium text-gray-800 text-sm">
                    {ad.businessName}
                  </span>
                </p>
                <p className="text-gray-800 text-xs truncate">{ad.subject}</p>
              </div>
              <MdMoreVert className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-gray-800 text-xs truncate">{ad.description}</span>
              <MdStarBorder className="text-gray-400 ml-2" size={18} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (closedContentType === 'subject-cta') {
    // Default: subject-cta (subject + CTA + star)
    // Remove border if no CTA
    const hasCTA = !!ad.callToAction;
    return (
      <div className={`p-4 ${hasCTA ? 'border-b border-gray-200' : ''}`}>
        <div className="flex">
          {ad.logo ? (
            <img src={ad.logo} alt="Logo" className="h-12 w-12 rounded-full object-cover mr-3 flex-shrink-0" />
          ) : (
            <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-medium mr-3 flex-shrink-0">
              {ad.businessName.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">
                  <span className="text-xs">Sponsored</span> ·{' '}
                  <span className="font-medium text-gray-800 text-sm">
                    {ad.businessName}
                  </span>
                </p>
                <p className="text-gray-800 text-xs truncate">{ad.subject}</p>
              </div>
              <MdMoreVert className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              {hasCTA ? (
                <a
                  href={ad.finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 bg-white border border-gray-300 rounded-full font-medium text-xs px-2 py-1 overflow-hidden whitespace-nowrap text-ellipsis flex items-center"
                  style={{
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: 'normal',
                    padding: '3px 8px',
                    maxWidth: '90%',
                    alignItems: 'center',
                    display: 'flex',
                    border: '1px solid #dadce0',
                    borderRadius: '100px'
                  }}
                >
                  {ad.callToAction}
                </a>
              ) : null}
              <MdStarBorder className="text-gray-400 ml-2" size={18} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: subject-cta (subject + CTA + star)
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex">
        {ad.logo ? (
          <img src={ad.logo} alt="Logo" className="h-12 w-12 rounded-full object-cover mr-3 flex-shrink-0" />
        ) : (
          <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-medium mr-3 flex-shrink-0">
            {ad.businessName.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600">
                <span className="text-xs">Sponsored</span> ·{' '}
                <span className="font-medium text-gray-800 text-sm">
                  {ad.businessName}
                </span>
              </p>
              <p className="text-gray-800 text-xs truncate">{ad.subject}</p>
            </div>
            <MdMoreVert className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <a
              href={ad.finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 bg-white border border-gray-300 rounded-full font-medium text-xs px-2 py-1 overflow-hidden whitespace-nowrap text-ellipsis flex items-center"
              style={{
                fontStyle: 'normal',
                fontWeight: '500',
                lineHeight: 'normal',
                padding: '3px 8px',
                maxWidth: '90%',
                alignItems: 'center',
                display: 'flex',
                border: '1px solid #dadce0',
                borderRadius: '100px'
              }}
            >
              {ad.callToAction}
            </a>
            <MdStarBorder className="text-gray-400 ml-2" size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

const OpenAdView: React.FC<{ ad: GmailAd; onClose?: () => void; isDesktop?: boolean }> = ({ ad, onClose, isDesktop }) => {
  // Only apply these changes for mobile (isDesktop === false)
  if (!isDesktop) {
    return (
      <div className="bg-white w-full border border-gray-100">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 17.75l-6.16 3.24 1.18-6.88L2 9.76l6.92-1.01L12 2.5l3.08 6.25L22 9.76l-5.02 4.35 1.18 6.88z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="5" r="1" fill="currentColor"/>
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
              <circle cx="12" cy="19" r="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
        {/* Logo and Sender Info - two columns, vertically centered */}
        <div className="flex items-center p-4 border-b border-gray-200">
          {ad.logo ? (
            <img src={ad.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover mr-3" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mr-3">
              {ad.businessName.charAt(0)}
            </div>
          )}
          <div className="flex flex-col justify-center">
            <div className="font-bold text-xs text-left">{ad.businessName}</div>
            <div className="text-xs text-gray-500 text-left">to me</div>
          </div>
        </div>
        {/* Ad Card Preview: image, subject, description, CTA */}
        <div className="p-0 flex flex-col items-center">
          {/* Image always 16:9 */}
          {ad.image && (
            <img src={ad.image} alt="Ad visual" className="w-full rounded-none object-cover" style={{ aspectRatio: '16/9' }} />
          )}
          {/* Headline */}
          <h3 className="font-semibold text-lg text-gray-900 mb-2 text-left w-full px-4 pt-4">{ad.subject}</h3>
          {/* Description */}
          <p className="text-base text-gray-700 mb-4 text-left w-full px-4">{ad.description}</p>
          {/* CTA Button */}
          {ad.callToAction && (
            <div className="w-full flex justify-center pb-6">
              <a
                href={ad.finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-blue-600 rounded-full font-medium text-base px-8 py-3 hover:bg-blue-700 transition"
                style={{
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: 'normal',
                  display: 'inline-block',
                }}
              >
                {ad.callToAction}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
  // ...existing desktop OpenAdView code...
};

export const GmailAdPreview: React.FC<GmailAdPreviewProps> = ({ ad, mode, isOpen: controlledIsOpen, onOpenChange }) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isDesktop = mode === 'desktop';
  // Use controlled or uncontrolled state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;
  const setIsOpen = onOpenChange || setUncontrolledIsOpen;

  // Mobile Gmail mockup with updated design
  const MobileContent = () => (
    <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      {!isOpen ? (
        <>
          {/* Search bar - only for closed view */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center bg-gray-100 rounded-full p-2">
              <svg className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <div className="flex-1">
                <p className="text-gray-700 text-sm">Search in mail</p>
              </div>
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          {/* Promotions label - only for closed view */}
          <div className="px-4 py-2 font-medium text-gray-700 text-sm">PROMOTIONS</div>
          {/* Ad content */}
          <ClosedAdLine ad={ad} />
          {/* Placeholder emails */}
          {[1, 2, 3].map(item => (
            <div key={item} className="p-4 border-b border-gray-200">
              <div className="flex">
                <div className="h-12 w-12 bg-gray-300 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <OpenAdView ad={ad} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-stretch w-full">
      <div className="mb-4 flex items-center space-x-4">
        <ToggleButton isOpen={isOpen} onChange={setIsOpen} />
        {/* Removed 'Open view' text for mobile */}
      </div>
      <MD3Frame mode={mode}>
        {isDesktop ? (
          <GmailDesktopFrame ad={ad} isOpen={isOpen} onAdClick={() => setIsOpen(true)} onClose={() => setIsOpen(false)} />
        ) : (
          <MobileContent />
        )}
      </MD3Frame>
    </div>
  );
};
