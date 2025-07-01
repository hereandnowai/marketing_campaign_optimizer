
import React from 'react';
import { Branding } from '../constants';
import { SocialIcon } from './SocialIcon';
import { Theme } from '../types';

interface FooterProps {
  currentTheme: Theme;
}

export const Footer: React.FC<FooterProps> = ({ currentTheme }) => {
  const socialLinks = [
    { name: 'Blog', url: Branding.brand.socialMedia.blog, icon: SocialIcon.Blog },
    { name: 'LinkedIn', url: Branding.brand.socialMedia.linkedin, icon: SocialIcon.LinkedIn },
    { name: 'Instagram', url: Branding.brand.socialMedia.instagram, icon: SocialIcon.Instagram },
    { name: 'GitHub', url: Branding.brand.socialMedia.github, icon: SocialIcon.GitHub },
    { name: 'X', url: Branding.brand.socialMedia.x, icon: SocialIcon.X },
    { name: 'YouTube', url: Branding.brand.socialMedia.youtube, icon: SocialIcon.YouTube },
  ];

  return (
    <footer 
      style={{ backgroundColor: Branding.brand.colors.secondary }} 
      className="text-white py-8" // Base colors are fine for dark background
    >
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4 text-lg" style={{ color: Branding.brand.colors.primary }}>{Branding.brand.slogan}</p>
        <div className="flex justify-center space-x-6 mb-4">
          {socialLinks.map(link => (
            <a 
              key={link.name} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={link.name}
              className="hover:opacity-75 transition-opacity"
              style={{ color: Branding.brand.colors.primary }} // Primary color should stand out
            >
              <link.icon className="w-6 h-6" />
            </a>
          ))}
        </div>
        <p className={`text-sm ${currentTheme === Theme.DARK ? 'text-gray-400' : 'text-gray-300'}`}> {/* Adjusted for slightly better contrast in dark mode */}
          &copy; {new Date().getFullYear()} {Branding.brand.longName}. All rights reserved.
        </p>
        <p className={`text-sm ${currentTheme === Theme.DARK ? 'text-gray-400' : 'text-gray-300'}`}>
          Contact: <a href={`mailto:${Branding.brand.email}`} className="hover:underline" style={{ color: Branding.brand.colors.primary }}>{Branding.brand.email}</a> | Phone: {Branding.brand.mobile}
        </p>
        <p className={`text-xs mt-2 ${currentTheme === Theme.DARK ? 'text-gray-500' : 'text-gray-300'}`}>
          Developed by Adhithya J [ AI Products Engineering Team ]
        </p>
      </div>
    </footer>
  );
};
