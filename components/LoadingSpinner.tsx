
import React from 'react';
import { Branding } from '../constants';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center my-10 p-5">
      <div 
        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin"
        style={{ borderColor: Branding.brand.colors.primary, borderTopColor: 'transparent' }} // Primary color is spinner track
      ></div>
      <p className="mt-4 text-lg font-semibold text-secondary dark:text-primary">
        {message || `${Branding.brand.shortName} is thinking...`}
      </p>
      <img 
        src={Branding.brand.chatbot.avatar} 
        alt="Chatbot Avatar" 
        className="mt-3 w-20 h-20 rounded-full shadow-lg border-2"
        style={{ borderColor: Branding.brand.colors.primary }} // Primary color for border
      />
    </div>
  );
};