# Stock News Analyzer

A Next.js 15 application for analyzing live stock news using multiple news APIs, analyzing sentiment with the Gemini API via Vercel's Python integration, and displaying results in a clean dashboard.

## Features

- **Authentication**: Google sign-in using NextAuth.js
- **Stock Selection**: Search and select stocks to analyze
- **News Aggregation**: Fetch news articles from multiple sources
- **Sentiment Analysis**: Analyze news sentiment using Google's Gemini API
- **Stock Information**: View current and historical stock price data
- **Data Visualization**: Charts for sentiment distribution and stock performance
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js for Google OAuth
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Chart.js with react-chartjs-2
- **API Integration**:
  - NewsAPI for stock news
  - Alpha Vantage for stock data
  - Gemini API for sentiment analysis
- **Database**: Vercel Postgres for storing sentiment analysis
- **Deployment**: Optimized for Vercel with Python runtime

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Vercel account (for deployment)
- API keys for:
  - Google OAuth (for authentication)
  - NewsAPI (for news data)
  - Alpha Vantage (for stock data)
  - Gemini API (for sentiment analysis)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stock-news-analyzer.git
cd stock-news-analyzer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and credentials

```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting Up API Keys

#### Google OAuth (for authentication)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Set up OAuth consent screen
4. Create OAuth credentials
5. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`

#### NewsAPI
1. Sign up at [NewsAPI](https://newsapi.org/)
2. Get your API key from the dashboard

#### Alpha Vantage
1. Sign up at [Alpha Vantage](https://www.alphavantage.co/)
2. Get your API key from the dashboard

#### Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key for Gemini

## Deployment on Vercel

This application is optimized for deployment on Vercel with Python runtime support.

1. Push your code to a GitHub repository

2. Connect your repository to Vercel

3. Configure environment variables in Vercel dashboard

4. Set up Python runtime:
   - Vercel will automatically detect the Python requirements from `requirements.txt`

5. Deploy your application

## Project Structure

```
/app
  /auth
    /signin/page.tsx       # Sign-in page
  /dashboard
    /page.tsx              # Main dashboard
    /news/page.tsx         # News feed tab
    /sentiment/page.tsx    # Sentiment analysis tab
    /stock/page.tsx        # Stock performance tab
    /settings/page.tsx     # Settings page
  /api
    /news/route.ts         # API route to fetch news
    /sentiment/route.py    # Python API route for Gemini sentiment analysis
    /stock/route.ts        # API route for stock data
/components
  /Sidebar.tsx             # Reusable sidebar component
  /StockSelector.tsx       # Stock selection dropdown
  /NewsCard.tsx            # News article card
  /SentimentChart.tsx      # Sentiment charts
  /StockChart.tsx          # Stock price/volume charts
/lib
  /api.ts                  # API utility functions
  /auth.ts                 # NextAuth configuration
  /db.ts                   # Vercel Postgres utilities
  /store.ts                # Zustand store
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [Alpha Vantage](https://www.alphavantage.co/)
- [NewsAPI](https://newsapi.org/)
- [Google Gemini API](https://ai.google.dev/)
