import type { QueryResult } from 'pg';

// Create a connection string using env variables
const connectionString = process.env.POSTGRES_URL || 'postgresql://dropdb_owner:npg_b4nBjqVLGp5g@ep-sparkling-violet-a1uemzpw-pooler.ap-southeast-1.aws.neon.tech/dropdb?sslmode=require';

// Create a function to get a connection pool
const getPool = async () => {
  // Dynamically import pg to avoid client-side import
  const { Pool } = await import('pg');
  
  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // This may be necessary for some PostgreSQL services
    },
  });
};

// Helper function for template literals style queries
export async function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<QueryResult> {
  const pool = await getPool();
  const text = strings.reduce((prev, curr, i) => prev + '$' + i + curr);
  return pool.query(text, values);
}

// Helper for consistent error handling with regular queries
export async function executeQuery(query: string, params: unknown[] = []): Promise<{ data: Record<string, unknown>[] | null, error: Error | null }> {
  try {
    const pool = await getPool();
    const result = await pool.query(query, params);
    return { data: result.rows, error: null };
  } catch (error) {
    console.error('Database query error:', error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

// Initialize database schema if needed
export async function initializeDatabase(): Promise<{ success: boolean, error?: unknown }> {
  try {
    console.log('Running database initialization...');
    const pool = await getPool();
    
    // Create messages table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        position JSONB NOT NULL,
        size JSONB,
        color TEXT NOT NULL,
        user_id TEXT,
        author TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    
    console.log('Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error };
  }
} 