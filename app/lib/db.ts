'use server';

import { sql } from '@vercel/postgres';
import { Pool } from 'pg';

// Create a connection pool for direct Postgres connections
// This will be used if Vercel Postgres is not available
let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    // Use DATABASE_URL from environment variables
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error('No database connection string provided');
    }
    
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

// Wrapper function to execute SQL queries
async function executeQuery(query: string, params: (string | number | boolean | null)[] = []) {
  try {
    // First, try using Vercel Postgres
    try {
      // For parameterized queries, we need to convert them to template literals for @vercel/postgres
      // Removed unused variable 'paramPlaceholders'
      const vercelQuery = query.replace(/\$\d+/g, () => '?');
      
      // Using @vercel/postgres with template literals
      const result = await sql.query(vercelQuery, params);
      return result;
    } catch (vercelError: unknown) {
      // If the error is missing_connection_string, try direct connection
      if (vercelError instanceof Error && vercelError.name === 'VercelPostgresError' && 
          ('code' in vercelError && (vercelError as { code: string }).code === 'missing_connection_string' || !process.env.POSTGRES_URL)) {
        console.log('Fallback to direct Postgres connection');
        
        // Use direct connection with pg
        const client = await getPool().connect();
        try {
          const result = await client.query(query, params);
          return result;
        } finally {
          client.release();
        }
      } else {
        // Other Vercel Postgres errors should be thrown
        throw vercelError;
      }
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function createTables() {
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS sentiment_analysis (
        id SERIAL PRIMARY KEY,
        stock_symbol VARCHAR(10) NOT NULL,
        article_title TEXT NOT NULL,
        sentiment VARCHAR(10) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

export async function saveSentimentAnalysis(stockSymbol: string, articleTitle: string, sentiment: string) {
  try {
    await executeQuery(
      `INSERT INTO sentiment_analysis (stock_symbol, article_title, sentiment)
       VALUES ($1, $2, $3)`,
      [stockSymbol, articleTitle, sentiment]
    );
    return true;
  } catch (error) {
    console.error('Error saving sentiment analysis:', error);
    return false;
  }
}

export async function getSentimentAnalysisByStock(stockSymbol: string) {
  try {
    const result = await executeQuery(
      `SELECT * FROM sentiment_analysis
       WHERE stock_symbol = $1
       ORDER BY created_at DESC`,
      [stockSymbol]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting sentiment analysis:', error);
    return [];
  }
}

export async function getSentimentDistribution(stockSymbol: string) {
  try {
    const result = await executeQuery(
      `SELECT sentiment, COUNT(*) as count
       FROM sentiment_analysis
       WHERE stock_symbol = $1
       GROUP BY sentiment`,
      [stockSymbol]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting sentiment distribution:', error);
    return [];
  }
} 