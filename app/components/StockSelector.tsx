"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useStockStore } from '../lib/store';
import { searchStocks } from '../lib/api';

interface SearchResult {
  '1. symbol': string;
  '2. name': string;
}

export default function StockSelector() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { selectedStock, setSelectedStock } = useStockStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle search when query changes
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchStocks(query);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error searching stocks:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectStock = (symbol: string) => {
    setSelectedStock(symbol);
    setQuery(symbol);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a stock (e.g., AAPL, TSLA)"
          className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            if (searchResults.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showDropdown && searchResults.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg max-h-64 overflow-y-auto"
        >
          {searchResults.map((result) => (
            <button
              key={result['1. symbol']}
              className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
              onClick={() => selectStock(result['1. symbol'])}
            >
              <div>
                <div className="font-semibold">{result['1. symbol']}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{result['2. name']}</div>
              </div>
              {selectedStock === result['1. symbol'] && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
      
      {selectedStock && query === '' && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Currently analyzing: <span className="font-semibold">{selectedStock}</span>
        </div>
      )}
    </div>
  );
} 