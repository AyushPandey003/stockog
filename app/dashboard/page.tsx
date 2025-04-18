"use client";

import React, { useEffect, useState, useCallback } from 'react';
import StockSelector from '../components/StockSelector';
import { useStockStore } from '../lib/store';
import { NewsArticle, SentimentResult } from '../lib/api';
import NewsCard from '../components/NewsCard';
import SentimentChart from '../components/SentimentChart';
import StockChart from '../components/StockChart';
import { createTables } from '../lib/db';

export default function Dashboard() {
  const {
    selectedStock,
    newsArticles, setNewsArticles, isLoadingNews, setIsLoadingNews,
    stockData, setStockData, isLoadingStockData, setIsLoadingStockData,
    sentimentResults, setSentimentResults, isLoadingSentiment, setIsLoadingSentiment,
    sentimentDistribution, setSentimentDistribution
  } = useStockStore();

  const [error, setError] = useState<string | null>(null);

  // Initialize database tables
  useEffect(() => {
    const initDb = async () => {
      try {
        await createTables();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initDb();
  }, []);

  // Fetch data when selected stock change

  // Analyze sentiment of news articles
  const analyzeSentiment = useCallback(async (articles: NewsArticle[]) => {
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

      // Calculate sentiment distribution for charts
      const distribution = [
        { sentiment: 'positive', count: 0 },
        { sentiment: 'negative', count: 0 },
        { sentiment: 'neutral', count: 0 },
      ];

      data.sentiments.forEach((result: SentimentResult) => {
        const sentiment = result.sentiment.toLowerCase();
        const item = distribution.find(d => d.sentiment === sentiment);
        if (item) {
          item.count += 1;
        }
      });

      setSentimentDistribution(distribution);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setIsLoadingSentiment(false);
    }
  }, [setIsLoadingSentiment, setSentimentResults, setSentimentDistribution]);
  const fetchNewsData = useCallback(async () => {
    try {
      setIsLoadingNews(true);
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
  }, [selectedStock, setIsLoadingNews, setNewsArticles, analyzeSentiment]);
  
  const fetchStockData = useCallback(async () => {
    try {
      setIsLoadingStockData(true);
      const response = await fetch(`/api/stock?symbol=${selectedStock}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stock data: ${response.statusText}`);
      }
      const data = await response.json();
      setStockData(data.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to load stock data. Please try again later.');
    } finally {
      setIsLoadingStockData(false);
    }
  }, [selectedStock, setIsLoadingStockData, setStockData]);
  
  // And then:
  useEffect(() => {
    if (!selectedStock) return;
  
    const fetchData = async () => {
      setError(null);
      await Promise.all([
        fetchNewsData(),
        fetchStockData(),
      ]);
    };
  
    fetchData();
  }, [selectedStock, fetchNewsData, fetchStockData]);
  

  // Handle refresh button click
  const handleRefresh = () => {
    fetchNewsData();
    fetchStockData();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Stock News Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <StockSelector />
          <button
            onClick={handleRefresh}
            className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
            disabled={isLoadingNews || isLoadingStockData}
          >
            {(isLoadingNews || isLoadingStockData) ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
            {(isLoadingNews || isLoadingStockData) ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stock Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <h2 className="text-xl font-semibold">Stock Information</h2>
          {isLoadingStockData ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : stockData ? (
            <StockChart stockData={stockData} />
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No stock data available
            </div>
          )}
        </div>
        
        {/* Sentiment Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <h2 className="text-xl font-semibold">Sentiment Analysis</h2>
          {isLoadingSentiment ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : sentimentDistribution.length > 0 ? (
            <SentimentChart distribution={sentimentDistribution} />
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No sentiment data available
            </div>
          )}
        </div>
      </div>
      
      {/* News Articles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Latest News</h2>
        {isLoadingNews ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : newsArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.slice(0, 6).map((article, index) => {
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
          <div className="flex justify-center items-center h-64 text-gray-500">
            No news articles available
          </div>
        )}
        
        {newsArticles.length > 6 && (
          <div className="mt-6 text-center">
            <a 
              href="/dashboard/news" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all {newsArticles.length} articles
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 