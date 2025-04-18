import { NextRequest, NextResponse } from 'next/server';
import { getSentimentDistribution } from '../../../lib/db';

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
    const distribution = await getSentimentDistribution(stock);
    return NextResponse.json({ distribution });
  } catch (error) {
    console.error('Error fetching sentiment distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sentiment distribution' },
      { status: 500 }
    );
  }
} 