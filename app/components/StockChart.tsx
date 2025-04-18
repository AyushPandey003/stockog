"use client";

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { StockData } from '../lib/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockChartProps {
  stockData: StockData;
  historicalData?: {
    dates: string[];
    prices: number[];
    volumes: number[];
  };
}

export default function StockChart({ stockData, historicalData }: StockChartProps) {
  // Format for displaying numbers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toString();
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Configure line chart data for historical prices
  const priceData = historicalData ? {
    labels: historicalData.dates,
    datasets: [
      {
        label: 'Price',
        data: historicalData.prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        yAxisID: 'y',
      },
    ],
  } : null;

  // Configure line chart options for historical prices
  const priceOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: `${stockData.symbol} - Price History`,
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Price (USD)',
        },
      },
    },
  };

  // Configure line chart data for volume
  const volumeData = historicalData ? {
    labels: historicalData.dates,
    datasets: [
      {
        label: 'Volume',
        data: historicalData.volumes,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  } : null;

  // Configure line chart options for volume
  const volumeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: `${stockData.symbol} - Volume History`,
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
          text: 'Volume',
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

  return (
    <div className="space-y-6">
      {/* Stock info card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-2xl font-bold">{stockData.symbol}</h2>
            <p className="text-gray-600 dark:text-gray-400">Last updated: {stockData.date}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="text-3xl font-bold">{formatCurrency(stockData.price)}</div>
            <div className={`text-lg font-semibold ${stockData.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(stockData.change)} ({formatPercentage(stockData.changePercent)})
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Open</p>
            <p className="font-semibold">{formatCurrency(stockData.open)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">High</p>
            <p className="font-semibold">{formatCurrency(stockData.high)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Low</p>
            <p className="font-semibold">{formatCurrency(stockData.low)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
            <p className="font-semibold">{formatLargeNumber(stockData.volume)}</p>
          </div>
        </div>
      </div>
      
      {/* Price chart */}
      {historicalData && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="h-80">
            <Line data={priceData!} options={priceOptions} />
          </div>
        </div>
      )}
      
      {/* Volume chart */}
      {historicalData && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="h-80">
            <Line data={volumeData!} options={volumeOptions} />
          </div>
        </div>
      )}
    </div>
  );
} 