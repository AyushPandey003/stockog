"use client";

import React, { useState, useEffect } from 'react';
import { useStockStore } from '../../lib/store';

export default function SettingsPage() {
  // User preferences
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  
  const [refreshInterval, setRefreshInterval] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('refreshInterval') || '0', 10);
    }
    return 0;
  });
  
  const [defaultStock, setDefaultStock] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('defaultStock') || 'AAPL';
    }
    return 'AAPL';
  });

  const { selectedStock, setSelectedStock } = useStockStore();

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('darkMode', darkMode.toString());
      localStorage.setItem('refreshInterval', refreshInterval.toString());
      localStorage.setItem('defaultStock', defaultStock);
      
      // Update selected stock if default is changed
      if (defaultStock !== selectedStock) {
        setSelectedStock(defaultStock);
      }
      
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }, 500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Settings</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Appearance */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${darkMode ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <span className="ml-3">Dark Mode</span>
              </label>
            </div>
          </div>
          
          {/* Data Settings */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Data Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Auto-refresh Interval
                </label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value, 10))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="0">Disabled</option>
                  <option value="30">Every 30 seconds</option>
                  <option value="60">Every minute</option>
                  <option value="300">Every 5 minutes</option>
                  <option value="900">Every 15 minutes</option>
                  <option value="1800">Every 30 minutes</option>
                  <option value="3600">Every hour</option>
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Set how often the dashboard data should automatically refresh
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Stock
                </label>
                <input
                  type="text"
                  value={defaultStock}
                  onChange={(e) => setDefaultStock(e.target.value.toUpperCase())}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  placeholder="AAPL"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Set the default stock ticker to analyze when you open the dashboard
                </p>
              </div>
            </div>
          </div>
          
          {/* Account Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You are signed in with Google. To manage your account, please visit your Google account settings.
            </p>
          </div>
          
          {/* API Keys */}
          <div>
            <h2 className="text-lg font-semibold mb-4">API Keys</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              API keys are managed server-side for security. Contact the administrator if you need to update them.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="text-md font-medium mb-2">Available APIs</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>News API (Status: Active)</li>
                <li>Alpha Vantage API (Status: Active)</li>
                <li>Gemini API (Status: Active)</li>
              </ul>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              className={`py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
            
            {saveMessage && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                {saveMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 