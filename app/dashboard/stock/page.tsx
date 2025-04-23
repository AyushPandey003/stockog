"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useStockStore } from '../../lib/store';
import StockChart from '../../components/StockChart';
import StockSelector from '../../components/StockSelector';

interface HistoricalData {
  dates: string[];
  prices: number[];
  volumes: number[];
}

export default function StockPage() {
  const {
    selectedStock,
    stockData,
    setStockData,
    isLoadingStockData,
    setIsLoadingStockData,
  } = useStockStore();

  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false);
  const [timeRange, setTimeRange] = useState('1m'); // 1d, 1w, 1m, 3m, 1y

  // Fetch current stock data
  const fetchStockData = useCallback(async () => {
    try {
      setIsLoadingStockData(true);
      setError(null);

      const response = await fetch(`/api/stock?symbol=${selectedStock}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stock data: ${response.statusText}`);
      }

      const data = await response.json();
      setStockData(data.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to load stock data. Please try again later.');
    } finally {
      setIsLoadingStockData(false);
    }
  }, [selectedStock, setIsLoadingStockData, setStockData]);

  // Fetch historical stock data
  const fetchHistoricalData = useCallback(async () => {
    setIsLoadingHistorical(true);

    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Number of data points based on time range
      let dataPoints = 30;
      switch (timeRange) {
        case '1d': dataPoints = 24; break; // hourly for a day
        case '1w': dataPoints = 7; break; // daily for a week
        case '1m': dataPoints = 30; break; // daily for a month
        case '3m': dataPoints = 90; break; // daily for 3 months
        case '1y': dataPoints = 12; break; // monthly for a year
        default: dataPoints = 30;
      }

      // Generate dates
      const dates: string[] = [];
      for (let i = 0; i < dataPoints; i++) {
        const date = new Date();

        switch (timeRange) {
          case '1d':
            date.setHours(date.getHours() - (dataPoints - i - 1));
            dates.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
            break;
          case '1y':
            date.setMonth(date.getMonth() - (dataPoints - i - 1));
            dates.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
            break;
          default:
            date.setDate(date.getDate() - (dataPoints - i - 1));
            dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
      }

      // Base price on current stock data if available
      const basePrice = stockData?.price || 100;

      // Generate price data with realistic volatility
      const prices: number[] = [];
      let currentPrice = basePrice;

      for (let i = 0; i < dataPoints; i++) {
        // Add random volatility but with a slight trend
        const volatility = basePrice * 0.02; // 2% volatility
        const trend = Math.random() > 0.5 ? 0.001 : -0.001; // Slight up or down trend

        const change = (Math.random() - 0.5) * volatility + (basePrice * trend);
        currentPrice += change;
        currentPrice = Math.max(currentPrice, basePrice * 0.7); // Prevent going too low

        prices.push(parseFloat(currentPrice.toFixed(2)));
      }

      // Generate volume data
      const baseVolume = stockData?.volume || 1000000;
      const volumes = Array.from({ length: dataPoints }, () => {
        return Math.floor((0.5 + Math.random()) * baseVolume);
      });

      setHistoricalData({ dates, prices, volumes });
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setIsLoadingHistorical(false);
    }
  }, [timeRange, stockData]);

  // Fetch current data when selected stock changes
  useEffect(() => {
    if (!selectedStock) return;
    fetchStockData();
  }, [selectedStock, fetchStockData]);

  // Fetch historical data when selected stock or time range changes
  useEffect(() => {
    if (!selectedStock) return;
    fetchHistoricalData();
  }, [selectedStock, timeRange, fetchHistoricalData]);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchStockData();
    fetchHistoricalData();
  };

  // Time range selector
  const TimeRangeSelector = () => (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      {[
        { value: '1d', label: '1D' },
        { value: '1w', label: '1W' },
        { value: '1m', label: '1M' },
        { value: '3m', label: '3M' },
        { value: '1y', label: '1Y' },
      ].map((range) => (
        <button
          key={range.value}
          type="button"
          className={`py-2 px-4 text-sm font-medium ${
            timeRange === range.value
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          } ${
            range.value === '1d' ? 'rounded-l-lg' : ''
          } ${
            range.value === '1y' ? 'rounded-r-lg' : ''
          } border border-gray-200 dark:border-gray-600`}
          onClick={() => setTimeRange(range.value)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Stock Performance</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <StockSelector />
          <button
            onClick={handleRefresh}
            className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
            disabled={isLoadingStockData || isLoadingHistorical}
          >
            {(isLoadingStockData || isLoadingHistorical) ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
            {(isLoadingStockData || isLoadingHistorical) ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Time range selector */}
      <div className="flex justify-center">
        <TimeRangeSelector />
      </div>

      {/* Stock data and charts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {isLoadingStockData || isLoadingHistorical ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : stockData ? (
          <StockChart
            stockData={stockData}
            historicalData={historicalData || undefined}
          />
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            No stock data available
          </div>
        )}
      </div>

      {/* Market information */}
      {stockData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Market Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Key Statistics</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 text-gray-600 dark:text-gray-400">Open</td>
                    <td className="py-2 text-right font-medium">${stockData.open.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 text-gray-600 dark:text-gray-400">High</td>
                    <td className="py-2 text-right font-medium">${stockData.high.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 text-gray-600 dark:text-gray-400">Low</td>
                    <td className="py-2 text-right font-medium">${stockData.low.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 text-gray-600 dark:text-gray-400">Close</td>
                    <td className="py-2 text-right font-medium">${stockData.price.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600 dark:text-gray-400">Volume</td>
                    <td className="py-2 text-right font-medium">
                      {stockData.volume.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Price Changes</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-2 text-gray-600 dark:text-gray-400">Today</td>
                    <td
                      className={`py-2 text-right font-medium ${
                        stockData.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stockData.change >= 0 ? '+' : ''}${stockData.change.toFixed(2)} (
                      {stockData.change >= 0 ? '+' : ''}
                      {stockData.changePercent.toFixed(2)}%)
                    </td>
                  </tr>
                  {historicalData && (
                    <>
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 text-gray-600 dark:text-gray-400">
                          {timeRange === '1d' ? 'Since Open' :
                           timeRange === '1w' ? '1 Week' :
                           timeRange === '1m' ? '1 Month' :
                           timeRange === '3m' ? '3 Months' : '1 Year'}
                        </td>
                        <td
                          className={`py-2 text-right font-medium ${
                            historicalData.prices[historicalData.prices.length - 1] >= historicalData.prices[0]
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {(() => {
                            const firstPrice = historicalData.prices[0];
                            const lastPrice = historicalData.prices[historicalData.prices.length - 1];
                            const change = lastPrice - firstPrice;
                            const percentChange = (change / firstPrice) * 100;

                            return `${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${change >= 0 ? '+' : ''}${percentChange.toFixed(2)}%)`;
                          })()}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600 dark:text-gray-400">Range</td>
                        <td className="py-2 text-right font-medium">
                          ${Math.min(...historicalData.prices).toFixed(2)} - $
                          {Math.max(...historicalData.prices).toFixed(2)}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}