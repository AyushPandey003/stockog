import { NextRequest, NextResponse } from 'next/server';
import { fetchStockData } from '../../lib/api';

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
    const stockData = await fetchStockData(symbol);
    
    if (!stockData) {
      return NextResponse.json(
        { error: 'Stock data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: stockData });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
} 