
import React from 'react';
import { Page } from '../types'; 
import { Branding } from '../constants'; 

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="page-container py-12 text-center">
      <img 
        src={Branding.brand.logo.title} 
        alt={`${Branding.brand.longName} Logo`}
        className="mx-auto mb-8 h-20 sm:h-24 md:h-28" // Logo itself is an image
      />
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-secondary dark:text-primary">
        Welcome to the Future of Marketing
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
        Leverage the power of AI with <span className="font-semibold text-secondary dark:text-primary">{Branding.brand.shortName}</span> to optimize your campaigns, maximize ROI, and achieve unparalleled marketing success.
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 italic">
        "{Branding.brand.slogan}"
      </p>
      
      <button
        onClick={() => onNavigate(Page.CAMPAIGN_OPTIMIZER)}
        className={`px-8 py-3 text-lg font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${Branding.brand.colors.secondary}]`}
        style={{ 
          backgroundColor: Branding.brand.colors.primary, 
          color: Branding.brand.colors.secondary,
          borderColor: Branding.brand.colors.secondary, // Might not be visible depending on button style
          // ringColor: Branding.brand.colors.secondary, // Focus ring - removed
        }}
      >
        Optimize Your Campaigns Now
      </button>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-3 text-secondary dark:text-primary">Real-Time Analysis</h3>
          <p className="text-gray-600 dark:text-gray-300">Monitor KPIs across all major platforms, track audience behavior, and gain instant insights into your campaign performance.</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-3 text-secondary dark:text-primary">AI-Powered Targeting</h3>
          <p className="text-gray-600 dark:text-gray-300">Utilize dynamic segmentation, lookalike audiences, and predictive analytics to reach your ideal customers effectively.</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-3 text-secondary dark:text-primary">Actionable Recommendations</h3>
          <p className="text-gray-600 dark:text-gray-300">Receive prioritized, data-driven suggestions to enhance your strategies, from bidding to messaging.</p>
        </div>
      </div>
    </div>
  );
};
