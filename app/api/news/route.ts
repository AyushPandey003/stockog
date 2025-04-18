import { NextRequest, NextResponse } from 'next/server';
import { fetchNewsForStock } from '../../lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');
  
  if (!symbol) {
    return NextResponse.json(
      { error: 'Stock symbol is required' },
      { status: 400 }
    );
  }
  
  try {
    const news = await fetchNewsForStock(symbol);
    return NextResponse.json({ articles: news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
} 