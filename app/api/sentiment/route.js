import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();
    const articles = body.articles || [];
    
    // Get the base URL for the current environment
    const baseUrl = process.env.NODE_ENV === 'production'
      ? `https://${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || request.headers.get('host')}`
      : `http://${request.headers.get('host')}`;
      
    // Check if this request has been processed by middleware already
    const isProcessed = request.headers.get('x-middleware-processed') === 'true';
    
    // If this request has already been processed by our middleware,
    // we need to proxy to the actual Python function
    if (isProcessed) {
      // Mock sentiment analysis for development (replace with real call in production)
      const mockedSentiments = articles.map(article => ({
        title: article.title,
        sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)]
      }));
      
      return NextResponse.json({ sentiments: mockedSentiments });
    }
    
    // Otherwise, call the API directly
    const response = await fetch(`${baseUrl}/api/sentiment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-middleware-processed': 'true'  // Mark as processed to avoid infinite loop
      },
      body: JSON.stringify({ articles }),
    });
    
    if (!response.ok) {
      throw new Error(`Sentiment analysis failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
} 