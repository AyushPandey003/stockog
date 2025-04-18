import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/api/sentiment'],
};

export function middleware(request) {
  // Only handle POST requests to API
  if (request.method === 'POST' && request.nextUrl.pathname === '/api/sentiment') {
    // Removed unused variable 'baseUrl' and 'apiUrl'
    
    // Make a note in the headers that this request has been processed by middleware
    const headers = new Headers(request.headers);
    headers.set('x-middleware-processed', 'true');
    
    // Return the rewritten URL
    return NextResponse.next({
      request: {
        headers
      }
    });
  }
  
  return NextResponse.next();
} 