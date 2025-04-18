"use client";

import React, { useEffect, useState } from 'react';
import { useStockStore } from '../../lib/store';
import SentimentChart from '../../components/SentimentChart';
import StockSelector from '../../components/StockSelector';
import { NewsArticle, SentimentResult } from '../../lib/api';

interface SentimentTrend {
  dates: string[];
  positive: number[];
  negative: number[];
  neutral: number[];
}

export default function SentimentPage() {
  const {
    selectedStock,
    newsArticles, setNewsArticles, isLoadingNews, setIsLoadingNews,
 setSentimentResults, isLoadingSentiment, setIsLoadingSentiment,
    sentimentDistribution, setSentimentDistribution
  } = useStockStore();

  const [error, setError] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<SentimentTrend | null>(null);
  const [isLoadingTrend, setIsLoadingTrend] = useState(false);

  // Fetch data when selected stock changes
  // Removed duplicate declaration of fetchNewsData

 

  // Fetch news data
  const analyzeSentiment = React.useCallback(async (articles: NewsArticle[]) => {
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
      setError('Failed to analyze sentiment. Please try again later.');
    } finally {
      setIsLoadingSentiment(false);
    }
  }, [setIsLoadingSentiment, setSentimentResults, setSentimentDistribution, setError]);

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
      
      // Once we have news, analyze sentiment
      await analyzeSentiment(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news articles. Please try again later.');
    } finally {
      setIsLoadingNews(false);
    }
  }, [selectedStock, setIsLoadingNews, setError, setNewsArticles, analyzeSentiment]);
  useEffect(() => {
    if (!selectedStock) return;
    
    fetchNewsData();
    fetchTrendData();
  }, [selectedStock, fetchNewsData]);

  // Fetch sentiment trend data
  const fetchTrendData = async () => {
    setIsLoadingTrend(true);
    
    try {
      // Simulating an API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate dates for the last 7 days
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
      
      // Generate random sentiment data
      const positive = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10) + 1);
      const negative = Array.from({ length: 7 }, () => Math.floor(Math.random() * 8) + 1);
      const neutral = Array.from({ length: 7 }, () => Math.floor(Math.random() * 6) + 1);
      
      setTrendData({ dates, positive, negative, neutral });
    } catch (error) {
      console.error('Error fetching sentiment trend data:', error);
    } finally {
      setIsLoadingTrend(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchNewsData();
    fetchTrendData();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Sentiment Analysis</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <StockSelector />
          <button
            onClick={handleRefresh}
            className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
            disabled={isLoadingNews || isLoadingSentiment || isLoadingTrend}
          >
            {(isLoadingNews || isLoadingSentiment || isLoadingTrend) ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
            {(isLoadingNews || isLoadingSentiment || isLoadingTrend) ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Current Sentiment Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Current Sentiment Analysis</h2>
        
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
      
      {/* Sentiment Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Sentiment Trend Over Time</h2>
        
        {isLoadingTrend ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : trendData ? (
          <SentimentChart distribution={sentimentDistribution} trendData={trendData} />
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            No trend data available
          </div>
        )}
      </div>
      
      {/* Insights */}
      {sentimentDistribution.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Sentiment Insights</h2>
          
          <div className="space-y-4">
            <div className="text-gray-700 dark:text-gray-300">
              Based on the analysis of {newsArticles.length} recent news articles about {selectedStock}, 
              the overall market sentiment appears to be 
              <SentimentInsight 
                distribution={sentimentDistribution} 
              />
            </div>
            
            <p className="text-gray-700 dark:text-gray-300">
              The analyzed articles cover a range of topics including company performance, 
              market conditions, industry trends, and investor sentiment. The sentiment analysis 
              provides a snapshot of how the market perceives {selectedStock} based on recent news.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for sentiment insight text
function SentimentInsight({ distribution }: { distribution: { sentiment: string; count: number }[] }) {
  const totalArticles = distribution.reduce((sum, item) => sum + item.count, 0);
  
  const positiveCount = distribution.find(d => d.sentiment === 'positive')?.count || 0;
  const negativeCount = distribution.find(d => d.sentiment === 'negative')?.count || 0;
  const neutralCount = distribution.find(d => d.sentiment === 'neutral')?.count || 0; // Keeping neutral count for further use
  
  const positivePercentage = Math.round((positiveCount / totalArticles) * 100);
  const negativePercentage = Math.round((negativeCount / totalArticles) * 100);
  const neutralPercentage = Math.round((neutralCount / totalArticles) * 100); // Calculate neutral percentage
  
  let sentiment = 'neutral';
  let className = 'px-2 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  
  if (positiveCount > negativeCount * 1.5) {
    sentiment = 'predominantly positive';
    className = 'px-2 py-1 rounded-md bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
  } else if (negativeCount > positiveCount * 1.5) {
    sentiment = 'predominantly negative';
    className = 'px-2 py-1 rounded-md bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
  } else if (positiveCount > negativeCount) {
    sentiment = 'slightly positive';
    className = 'px-2 py-1 rounded-md bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-300';
  } else if (negativeCount > positiveCount) {
    sentiment = 'slightly negative';
    className = 'px-2 py-1 rounded-md bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-300';
  } else {
    sentiment = 'balanced';
  }
  
  return (
    <span className="mx-2">
      <span className={className}>{sentiment}</span>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {/* Optionally display percentage breakdown */}
        <div>Positive: {positivePercentage}%</div>
        <div>Negative: {negativePercentage}%</div>
        <div>Neutral: {neutralPercentage}%</div>
      </div>
    </span>
  );
}
