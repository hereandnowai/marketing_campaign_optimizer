
import React, { useState, useEffect } from 'react';
import { Branding } from '../constants';
import { Theme, NotificationPreferences } from '../types';

interface SettingsPageProps {
  currentTheme: Theme;
  toggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentTheme, toggleTheme }) => {
  const [notifications, setNotifications] = useState<NotificationPreferences>(() => {
    const storedPrefs = localStorage.getItem('notification-preferences');
    return storedPrefs ? JSON.parse(storedPrefs) : {
      criticalAlerts: true,
      weeklySummary: false,
      newFeatureUpdates: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('notification-preferences', JSON.stringify(notifications));
  }, [notifications]);

  const handleNotificationChange = (key: keyof NotificationPreferences) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SwitchToggle: React.FC<{ checked: boolean; onChange: () => void; label: string, id: string }> = ({ checked, onChange, label, id }) => (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer py-3 border-b border-gray-200 dark:border-gray-700">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <div className="relative">
        <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
      </div>
    </label>
  );


  return (
    <div className="page-container py-12">
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-8 md:p-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 text-center text-secondary dark:text-primary">
          Application Settings
        </h1>

        <div className="space-y-10">
          {/* Theme Preference */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-secondary dark:text-gray-200">Theme Preference</h2>
            <div className="p-5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  Current Theme: <strong className="capitalize">{currentTheme}</strong>
                </span>
                <button
                  onClick={toggleTheme}
                  className="px-6 py-2 rounded-md font-medium text-secondary dark:text-slate-900 bg-primary hover:opacity-90 transition-opacity"
                  style={{ color: Branding.brand.colors.secondary }}
                >
                  Switch to {currentTheme === Theme.LIGHT ? 'Dark' : 'Light'} Mode
                </button>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-secondary dark:text-gray-200">Notification Settings</h2>
            <div className="p-5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm">
              <SwitchToggle
                id="criticalAlerts"
                label="Critical Performance Alerts"
                checked={notifications.criticalAlerts}
                onChange={() => handleNotificationChange('criticalAlerts')}
              />
              <SwitchToggle
                id="weeklySummary"
                label="Weekly Campaign Summary Email"
                checked={notifications.weeklySummary}
                onChange={() => handleNotificationChange('weeklySummary')}
              />
              <SwitchToggle
                id="newFeatureUpdates"
                label="New Feature Updates"
                checked={notifications.newFeatureUpdates}
                onChange={() => handleNotificationChange('newFeatureUpdates')}
              />
            </div>
          </section>
          
          {/* API Key Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-secondary dark:text-gray-200">API Key Configuration</h2>
            <div className="p-5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                The Gemini API Key for this application is configured via an environment variable (<code>process.env.API_KEY</code>) on the server or build environment.
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                This key is not managed through the UI for security reasons. Please refer to the deployment documentation if you need to update it.
              </p>
            </div>
          </section>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Version: 1.1.0 | {Branding.brand.shortName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
