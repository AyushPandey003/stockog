// Client-safe interface to database functions
// This file doesn't import any server-only modules and can be safely imported in client components

export interface SentimentRecord {
  id: number;
  stock_symbol: string;
  article_title: string;
  sentiment: string;
  created_at: string;
}

export interface SentimentDistribution {
  sentiment: string;
  count: number; 
}

// Define the actions as async functions that will call the server actions
export async function getSentimentAnalysisByStock(stockSymbol: string): Promise<SentimentRecord[]> {
  // In a client component, we'll make a fetch call to our API
  try {
    const response = await fetch(`/api/sentiment/analysis?stock=${stockSymbol}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sentiment analysis: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error getting sentiment analysis:', error);
    return [];
  }
}

export async function getSentimentDistribution(stockSymbol: string): Promise<SentimentDistribution[]> {
  try {
    const response = await fetch(`/api/sentiment/distribution?stock=${stockSymbol}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sentiment distribution: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.distribution || [];
  } catch (error) {
    console.error('Error getting sentiment distribution:', error);
    return [];
  }
} 