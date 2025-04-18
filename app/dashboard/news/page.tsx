"use client";

import React, { useEffect, useState } from 'react';
import { useStockStore } from '../../lib/store';
import NewsCard from '../../components/NewsCard';
import StockSelector from '../../components/StockSelector';

export default function NewsPage() {
  const {
    selectedStock,
    newsArticles, setNewsArticles, isLoadingNews, setIsLoadingNews,
    sentimentResults, setSentimentResults, setIsLoadingSentiment
  } = useStockStore();

  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');


  

  // Fetch news data
  const analyzeSentiment = React.useCallback(async (articles: { title: string; description?: string; publishedAt: string }[]) => {
    if (!articles.length) return;
  
    try {
      setIsLoadingSentiment(true);
  
      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articles }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to analyze sentiment: ${response.statusText}`);
      }
  
      const data = await response.json();
      setSentimentResults(data.sentiments);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setIsLoadingSentiment(false);
    }
  }, [setIsLoadingSentiment, setSentimentResults]);
  
  const fetchNewsData = React.useCallback(async () => {
    try {
      setIsLoadingNews(true);
      setError(null);
  
      const response = await fetch(`/api/news?symbol=${selectedStock}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }
  
      const data = await response.json();
      setNewsArticles(data.articles);
  
      await analyzeSentiment(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news articles. Please try again later.');
    } finally {
      setIsLoadingNews(false);
    }
  }, [selectedStock, setIsLoadingNews, setNewsArticles, setError, analyzeSentiment]);
  useEffect(() => {
    if (!selectedStock) return;
    fetchNewsData();
  }, [selectedStock, fetchNewsData]);
  
  const filteredAndSortedArticles = React.useMemo(() => {
    // First filter by search term
    let filtered = newsArticles;
    if (searchTerm) {
      filtered = newsArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Then sort
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'positive':
          const aResult = sentimentResults.find(result => result.title === a.title);
          const bResult = sentimentResults.find(result => result.title === b.title);
          if (aResult?.sentiment === 'positive' && bResult?.sentiment !== 'positive') return -1;
          if (aResult?.sentiment !== 'positive' && bResult?.sentiment === 'positive') return 1;
          return 0;
        case 'negative':
          const aRes = sentimentResults.find(result => result.title === a.title);
          const bRes = sentimentResults.find(result => result.title === b.title);
          if (aRes?.sentiment === 'negative' && bRes?.sentiment !== 'negative') return -1;
          if (aRes?.sentiment !== 'negative' && bRes?.sentiment === 'negative') return 1;
          return 0;
        default:
          return 0;
      }
    });
  }, [newsArticles, searchTerm, sortOption, sentimentResults]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">News Feed</h1>
        <StockSelector />
      </div>
      
      {/* Filters and sorting */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-auto p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="positive">Positive Sentiment</option>
            <option value="negative">Negative Sentiment</option>
          </select>
        </div>
        <div>
          <button
            onClick={fetchNewsData}
            className="w-full sm:w-auto py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
            disabled={isLoadingNews}
          >
            {isLoadingNews ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
            {isLoadingNews ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* News articles */}
      <div>
        {isLoadingNews ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAndSortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedArticles.map((article, index) => {
              const sentimentResult = sentimentResults.find(result => result.title === article.title);
              return (
                <NewsCard 
                  key={`${article.title}-${index}`} 
                  article={article} 
                  sentiment={sentimentResult?.sentiment as 'positive' | 'negative' | 'neutral'} 
                />
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500">
              {searchTerm ? 'No articles match your search' : 'No news articles available'}
            </p>
          </div>
        )}
      </div>
      
      {/* Results count */}
      {filteredAndSortedArticles.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedArticles.length} {filteredAndSortedArticles.length === 1 ? 'article' : 'articles'}
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      )}
    </div>
  );
} 