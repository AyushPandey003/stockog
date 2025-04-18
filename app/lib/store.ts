import { create } from 'zustand';
import { NewsArticle, StockData, SentimentResult } from './api';

interface StockStore {
  // Selected stock
  selectedStock: string;
  setSelectedStock: (symbol: string) => void;
  
  // News data
  newsArticles: NewsArticle[];
  isLoadingNews: boolean;
  setNewsArticles: (articles: NewsArticle[]) => void;
  setIsLoadingNews: (isLoading: boolean) => void;
  
  // Stock data
  stockData: StockData | null;
  isLoadingStockData: boolean;
  setStockData: (data: StockData | null) => void;
  setIsLoadingStockData: (isLoading: boolean) => void;
  
  // Sentiment data
  sentimentResults: SentimentResult[];
  isLoadingSentiment: boolean;
  setSentimentResults: (results: SentimentResult[]) => void;
  setIsLoadingSentiment: (isLoading: boolean) => void;
  
  // Sentiment distribution for charts
  sentimentDistribution: { sentiment: string; count: number }[];
  setSentimentDistribution: (distribution: { sentiment: string; count: number }[]) => void;
}

export const useStockStore = create<StockStore>((set) => ({
  // Selected stock
  selectedStock: 'AAPL', // Default to Apple
  setSelectedStock: (symbol) => set({ selectedStock: symbol }),
  
  // News data
  newsArticles: [],
  isLoadingNews: false,
  setNewsArticles: (articles) => set({ newsArticles: articles }),
  setIsLoadingNews: (isLoading) => set({ isLoadingNews: isLoading }),
  
  // Stock data
  stockData: null,
  isLoadingStockData: false,
  setStockData: (data) => set({ stockData: data }),
  setIsLoadingStockData: (isLoading) => set({ isLoadingStockData: isLoading }),
  
  // Sentiment data
  sentimentResults: [],
  isLoadingSentiment: false,
  setSentimentResults: (results) => set({ sentimentResults: results }),
  setIsLoadingSentiment: (isLoading) => set({ isLoadingSentiment: isLoading }),
  
  // Sentiment distribution for charts
  sentimentDistribution: [],
  setSentimentDistribution: (distribution) => set({ sentimentDistribution: distribution }),
})); 