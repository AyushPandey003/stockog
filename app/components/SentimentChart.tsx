"use client";

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface SentimentDistribution {
  sentiment: string;
  count: number;
}

interface SentimentChartProps {
  distribution: SentimentDistribution[];
  trendData?: {
    dates: string[];
    positive: number[];
    negative: number[];
    neutral: number[];
  };
}

export default function SentimentChart({ distribution, trendData }: SentimentChartProps) {
  // Configure pie chart data
  const pieData = {
    labels: distribution.map(item => item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)),
    datasets: [
      {
        data: distribution.map(item => item.count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Positive - Green
          'rgba(255, 99, 132, 0.6)', // Negative - Red
          'rgba(201, 203, 207, 0.6)', // Neutral - Gray
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configure pie chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Sentiment Distribution',
        font: {
          size: 16,
        },
      },
    },
  };

  // Configure line chart data
  const lineData = trendData ? {
    labels: trendData.dates,
    datasets: [
      {
        label: 'Positive',
        data: trendData.positive,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Negative',
        data: trendData.negative,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Neutral',
        data: trendData.neutral,
        borderColor: 'rgba(201, 203, 207, 1)',
        backgroundColor: 'rgba(201, 203, 207, 0.2)',
        tension: 0.4,
      },
    ],
  } : null;

  // Configure line chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Sentiment Trend Over Time',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  // Calculate summary statistics
  const totalArticles = distribution.reduce((sum, item) => sum + item.count, 0);
  const getPercentage = (sentiment: string) => {
    const item = distribution.find(d => d.sentiment === sentiment);
    if (!item) return '0%';
    return `${Math.round((item.count / totalArticles) * 100)}%`;
  };
  
  const positivePercentage = getPercentage('positive');
  const negativePercentage = getPercentage('negative');
  const neutralPercentage = getPercentage('neutral');
  
  // Overall sentiment
  let overallSentiment = 'Neutral';
  let overallColor = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200';
  
  const positiveItem = distribution.find(d => d.sentiment === 'positive');
  const negativeItem = distribution.find(d => d.sentiment === 'negative');
  
  if (positiveItem && negativeItem) {
    if (positiveItem.count > negativeItem.count * 1.5) {
      overallSentiment = 'Positive';
      overallColor = 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
    } else if (negativeItem.count > positiveItem.count * 1.5) {
      overallSentiment = 'Negative';
      overallColor = 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pie chart */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <div className="h-64">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      
      {/* Summary statistics */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Sentiment Summary</h3>
        
        <div className="mb-4">
          <p className="mb-2">Total articles analyzed: <span className="font-semibold">{totalArticles}</span></p>
          <p className="mb-2">Positive sentiment: <span className="font-semibold text-green-600 dark:text-green-400">{positivePercentage}</span></p>
          <p className="mb-2">Negative sentiment: <span className="font-semibold text-red-600 dark:text-red-400">{negativePercentage}</span></p>
          <p className="mb-2">Neutral sentiment: <span className="font-semibold text-gray-600 dark:text-gray-400">{neutralPercentage}</span></p>
        </div>
        
        <div className="mt-6">
          <h4 className="mb-2">Overall Market Sentiment:</h4>
          <div className={`px-4 py-2 rounded-lg text-center font-semibold ${overallColor}`}>
            {overallSentiment}
          </div>
        </div>
      </div>
      
      {/* Line chart for trend */}
      {trendData && (
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="h-80">
            <Line data={lineData!} options={lineOptions} />
          </div>
        </div>
      )}
    </div>
  );
} 