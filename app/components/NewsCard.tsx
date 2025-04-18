"use client";

import React from 'react';
import { NewsArticle } from '../lib/api';

interface NewsCardProps {
  article: NewsArticle;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export default function NewsCard({ article, sentiment }: NewsCardProps) {
  // Format publish date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get color based on sentiment
  const getSentimentColor = () => {
    if (!sentiment) return '';
    switch(sentiment) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200';
      case 'negative':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200';
      case 'neutral':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200';
      default:
        return '';
    }
  };

  // Get sentiment emoji
  const getSentimentEmoji = () => {
    if (!sentiment) return '';
    switch(sentiment) {
      case 'positive':
        return '😀';
      case 'negative':
        return '😞';
      case 'neutral':
        return '😐';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {article.urlToImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={article.urlToImage} 
            alt={article.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {article.source.name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(article.publishedAt)}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {article.description ? 
            (article.description.length > 150 ? 
              `${article.description.substring(0, 150)}...` : 
              article.description
            ) : 'No description available'}
        </p>
        
        {sentiment && (
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getSentimentColor()}`}>
            {getSentimentEmoji()} {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </div>
        )}
        
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read More
        </a>
      </div>
    </div>
  );
} 