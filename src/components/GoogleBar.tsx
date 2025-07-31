import React from 'react';
import { MdMenu, MdSearch } from 'react-icons/md';

export const GoogleBar: React.FC<{ isDesktop?: boolean; showMenu?: boolean; isDiscover?: boolean }> = ({ isDesktop, showMenu = true, isDiscover = false }) => (
  <div className={`w-full flex flex-col items-center bg-white pt-4 ${isDesktop ? 'pb-6' : 'pb-4'}`}>
    <div className="flex items-center justify-center w-full max-w-[650px] px-4 mb-2 relative" style={isDiscover ? { marginTop: '1rem', marginBottom: '1rem' } : {}}>
      {showMenu && <MdMenu className="text-gray-500 w-7 h-7 absolute left-4" />}
      <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_56x20dp.png" alt="Google" className="h-10 mx-auto" />
      {!isDiscover && <div className="w-7 h-7 rounded-full bg-gray-200 absolute right-4" />}
    </div>
    <div className="flex items-center w-full max-w-[650px] px-4" style={isDiscover ? { borderBottom: '1px solid #e5e7eb' } : {}}>
      <div className="flex items-center bg-gray-100 rounded-full w-full px-4 py-2">
        <MdSearch className="text-gray-500 mr-2" />
        <input
          className="bg-transparent outline-none flex-1 text-base"
          placeholder="Search"
          disabled
        />
      </div>
    </div>
  </div>
); 