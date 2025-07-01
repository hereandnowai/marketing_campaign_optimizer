
import React from 'react';
import { Page, Theme } from '../types';
import { Branding } from '../constants';
import { Navbar } from './Navbar'; 

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentTheme: Theme; // Added currentTheme
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, currentTheme }) => {
  return (
    <header 
      style={{ backgroundColor: Branding.brand.colors.secondary }} 
      className="text-white shadow-lg sticky top-0 z-50" // Base styling remains, dark mode variations handled by Tailwind if needed for text/icon colors inside if they weren't white
    >
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); onNavigate(Page.HOME);}} 
          className="flex items-center space-x-3 mb-2 sm:mb-0"
          aria-label="Go to Home page"
        >
          <img 
            src={Branding.brand.logo.title} 
            alt={`${Branding.brand.shortName} Logo`} 
            className="h-10 hidden md:block" // Logo is image, color defined by image
          />
          <span className="text-xl font-semibold md:hidden" style={{color: Branding.brand.colors.primary}}>{Branding.brand.shortName}</span>
        </a>
        <div className="flex items-center space-x-4">
          <Navbar currentPage={currentPage} onNavigate={onNavigate} currentTheme={currentTheme} />
           <img 
            src={Branding.brand.chatbot.face} 
            alt="Chatbot Face" 
            className="h-10 w-10 rounded-full border-2 hidden sm:block"
            style={{ borderColor: Branding.brand.colors.primary }} // Border color is primary, should be visible in both modes
          />
        </div>
      </div>
    </header>
  );
};