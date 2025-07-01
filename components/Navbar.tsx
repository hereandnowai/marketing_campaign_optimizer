
import React from 'react';
import { Page, Theme } from '../types'; 
import { PageTitles, Branding } from '../constants'; 

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentTheme: Theme;
}

const navItems = [
  { page: Page.HOME, label: PageTitles[Page.HOME] },
  { page: Page.CAMPAIGN_OPTIMIZER, label: PageTitles[Page.CAMPAIGN_OPTIMIZER] },
  { page: Page.ABOUT, label: PageTitles[Page.ABOUT] },
  { page: Page.SETTINGS, label: PageTitles[Page.SETTINGS] },
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, currentTheme }) => {
  return (
    <nav className="flex space-x-2 md:space-x-4">
      {navItems.map(item => {
        const isActive = currentPage === item.page;
        return (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[${Branding.brand.colors.primary}]
              ${isActive 
                ? 'shadow-md' 
                : 'hover:bg-opacity-75' // General hover for non-active
              }`}
            style={{
              backgroundColor: isActive ? Branding.brand.colors.primary : 'transparent',
              color: isActive ? Branding.brand.colors.secondary : (currentTheme === Theme.DARK ? Branding.brand.colors.primary : '#e5e7eb'), // Text color for non-active links
              // ringColor: Branding.brand.colors.primary, // Focus ring color - removed
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};
