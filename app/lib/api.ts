// API utility functions for fetching news and stock data

// Type definitions
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
  urlToImage?: string;
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  date: string;
  marketCap?: number; 
  
}

export interface SentimentResult {
  title: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

// Fetch news articles for a given stock symbol
export async function fetchNewsForStock(symbol: string): Promise<NewsArticle[]> {
  try {
    // Fetch from multiple sources for redundancy
    const apiKey = process.env.NEWS_API_KEY;
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${symbol}&apiKey=${apiKey}&pageSize=10&language=en&sortBy=publishedAt`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`News API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// Fetch stock data for a given symbol
export async function fetchStockData(symbol: string): Promise<StockData | null> {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const quote = data['Global Quote'];
    
    if (!quote || !quote['01. symbol']) {
      return null;
    }
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      previousClose: parseFloat(quote['08. previous close']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume'], 10),
      date: quote['07. latest trading day'],
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
}

// Perform sentiment analysis on news articles
export async function analyzeSentiment(articles: NewsArticle[]): Promise<SentimentResult[]> {
  try {
    const response = await fetch('/api/sentiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articles }),
    });
    
    if (!response.ok) {
      throw new Error(`Sentiment analysis failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.sentiments || [];
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return [];
  }
}

// Search for stocks by query (symbol or name)
export async function searchStocks(query: string) {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage search failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.bestMatches || [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
} 