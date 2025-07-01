
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CampaignPage } from './pages/CampaignPage';
import { AboutPage } from './pages/AboutPage';
import { SettingsPage } from './pages/SettingsPage';
import { Page, Theme } from './types';
import { PageTitles } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('app-theme') as Theme | null;
    return storedTheme || Theme.LIGHT;
  });

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); 
  }, []);

  useEffect(() => {
    document.title = `HERE AND NOW AI - ${PageTitles[currentPage]}`;
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <HomePage onNavigate={handleNavigate} />;
      case Page.CAMPAIGN_OPTIMIZER:
        return <CampaignPage />;
      case Page.ABOUT:
        return <AboutPage />;
      case Page.SETTINGS:
        return <SettingsPage currentTheme={theme} toggleTheme={toggleTheme} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === Theme.LIGHT ? 'bg-gray-100 text-gray-900' : 'bg-slate-900 text-gray-100'}`}>
      <Header currentPage={currentPage} onNavigate={handleNavigate} currentTheme={theme} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer currentTheme={theme} />
    </div>
  );
};

export default App;