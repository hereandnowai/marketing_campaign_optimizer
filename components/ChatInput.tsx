
import React from 'react';
import { Branding } from '../constants';

interface ChatInputProps {
  userInput: string;
  setUserInput: (input: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  selectedAnalysisTypeLabel: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ userInput, setUserInput, onSubmit, isLoading, selectedAnalysisTypeLabel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <label htmlFor="userInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Provide details for: <span className="font-semibold text-secondary dark:text-primary">{selectedAnalysisTypeLabel}</span>
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        e.g., Campaign objectives, target audience, current KPIs, specific questions, competitor names, ad copy examples, etc. The more context you provide, the better the AI analysis will be.
      </p>
      <textarea
        id="userInput"
        rows={8}
        className="shadow-sm focus:ring-secondary dark:focus:ring-primary focus:border-secondary dark:focus:border-primary mt-1 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-slate-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        placeholder={`Enter campaign data or your specific query here...`}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        disabled={isLoading}
        style={{ borderColor: Branding.brand.colors.secondary }} // This can be overridden by dark:border-primary if needed
      />
      <button
        type="submit"
        disabled={isLoading || !userInput.trim()}
        className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-900 disabled:opacity-50 transition-colors"
        style={{ 
          backgroundColor: isLoading ? Branding.brand.colors.secondary : Branding.brand.colors.primary, 
          color: isLoading ? Branding.brand.colors.primary : Branding.brand.colors.secondary,
        }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Get AI Analysis'
        )}
      </button>
    </form>
  );
};