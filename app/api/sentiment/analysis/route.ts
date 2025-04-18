import { NextRequest, NextResponse } from 'next/server';
import { getSentimentAnalysisByStock } from '../../../lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stock = searchParams.get('stock');
  
  if (!stock) {
    return NextResponse.json(
      { error: 'Stock symbol is required' },
      { status: 400 }
    );
  }
  
  try {
    const results = await getSentimentAnalysisByStock(stock);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching sentiment analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sentiment analysis' },
      { status: 500 }
    );
  }
} 