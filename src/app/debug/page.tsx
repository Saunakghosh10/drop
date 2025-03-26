'use client';

import { useState, useEffect } from 'react';
import { testDatabaseConnection } from '@/services/messagesService';
import { executeQuery } from '@/lib/db';
import Link from 'next/link';

export default function DebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [postgresDatabaseUrl, setPostgresDatabaseUrl] = useState<string | null>(null);
  const [initDbStatus, setInitDbStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function checkConnection() {
      try {
        // Check env vars
        const url = process.env.POSTGRES_URL;
        
        if (url) {
          // Only show a fragment of the URL to avoid exposing credentials
          const urlParts = url.split('@');
          if (urlParts.length > 1) {
            setPostgresDatabaseUrl(`...@${urlParts[1]}`);
          } else {
            setPostgresDatabaseUrl('(URL format unrecognized)');
          }
        } else {
          setPostgresDatabaseUrl('Missing');
        }

        // Test connection
        const success = await testDatabaseConnection();
        
        if (success) {
          setConnectionStatus('success');
        } else {
          setConnectionStatus('error');
          setErrorDetails('Connection test failed. Check console for details.');
        }
      } catch (err) {
        console.error('Error testing connection:', err);
        setConnectionStatus('error');
        setErrorDetails(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    checkConnection();
  }, []);

  async function testDirectInsert() {
    try {
      const { data, error } = await executeQuery(
        'INSERT INTO messages (content, position, color) VALUES ($1, $2, $3) RETURNING *',
        ['Test message from debug page', JSON.stringify({ x: 50, y: 50 }), '#000000']
      );
        
      if (error) {
        throw error;
      }
        
      if (!data || data.length === 0) {
        console.error('Insert did not return a row');
        alert('Insert did not return a row');
        return;
      }
        
      console.log('Insert success:', data[0]);
      alert('Message inserted successfully!');
    } catch (err) {
      console.error('Error during direct insert:', err);
      alert('Insert failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }

  async function initializeDatabase() {
    try {
      setInitDbStatus('loading');
      const response = await fetch('/api/init-db');
      const result = await response.json();
      
      console.log('Database initialization result:', result);
      
      if (result.success) {
        setInitDbStatus('success');
        alert('Database initialized successfully!');
      } else {
        setInitDbStatus('error');
        alert('Database initialization failed: ' + result.error);
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      setInitDbStatus('error');
      alert('Error initializing database: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }

  async function checkTables() {
    try {
      const { data: tables, error: tablesError } = await executeQuery(
        'SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name',
        ['public']
      );
      
      if (tablesError) {
        throw tablesError;
      }
      
      console.log('Available tables:', tables);
      
      const tableList = tables?.map((row) => (row as { table_name: string }).table_name).join(', ') || '';
      
      if (!tables || tables.length === 0) {
        alert('No tables found in the database.');
      } else {
        alert(`Available tables: ${tableList}`);
      }
      
      // Check if messages table exists
      const messagesTable = tables?.find((row) => (row as { table_name: string }).table_name === 'messages');
      
      if (messagesTable) {
        // Check messages table structure
        const { data: columns, error: columnsError } = await executeQuery(
          'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position',
          ['messages']
        );
        
        if (columnsError) {
          throw columnsError;
        }
        
        console.log('Messages table columns:', columns);
      }
    } catch (err) {
      console.error('Error checking tables:', err);
      alert('Error checking tables: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">PostgreSQL Debug Page</h1>
      
      <div className="space-y-8">
        <section className="p-4 border rounded-md">
          <h2 className="text-xl font-medium mb-4">Database Connection</h2>
          <div className="space-y-2">
            <div><strong>POSTGRES_URL:</strong> {postgresDatabaseUrl || 'Not available'}</div>
          </div>
        </section>
        
        <section className="p-4 border rounded-md">
          <h2 className="text-xl font-medium mb-4">Connection Test</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <strong className="mr-2">Status:</strong> 
              {connectionStatus === 'loading' && 'Testing connection...'}
              {connectionStatus === 'success' && (
                <span className="text-green-600">Connected successfully</span>
              )}
              {connectionStatus === 'error' && (
                <span className="text-red-600">Connection failed</span>
              )}
            </div>
            
            {errorDetails && (
              <div className="text-red-600">{errorDetails}</div>
            )}
          </div>
        </section>
        
        <section className="p-4 border rounded-md">
          <h2 className="text-xl font-medium mb-4">Initialize Database</h2>
          <div className="space-y-4">
            <p className="text-sm">
              This will create the necessary tables in the database if they don't already exist.
            </p>
            <button 
              onClick={initializeDatabase}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              disabled={initDbStatus === 'loading'}
            >
              {initDbStatus === 'loading' ? 'Initializing...' : 'Initialize Database'}
            </button>
            
            {initDbStatus === 'success' && (
              <div className="text-green-600">Database initialized successfully!</div>
            )}
            
            {initDbStatus === 'error' && (
              <div className="text-red-600">Database initialization failed. Check console for details.</div>
            )}
          </div>
        </section>
        
        <section className="p-4 border rounded-md">
          <h2 className="text-xl font-medium mb-4">Table Check</h2>
          <div className="space-y-4">
            <p className="text-sm">
              This will check which tables exist in the database.
            </p>
            <button 
              onClick={checkTables}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Check Database Tables
            </button>
          </div>
        </section>
        
        <section className="p-4 border rounded-md">
          <h2 className="text-xl font-medium mb-4">Test Insert</h2>
          <div className="space-y-4">
            <p className="text-sm">
              This will test if we can query data directly from the database.
            </p>
            <button 
              onClick={testDirectInsert}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Insert Test Message
            </button>
          </div>
        </section>
      </div>
      
      <div className="mt-8">
        <Link
          href="/wall"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Return to Wall
        </Link>
      </div>
    </div>
  );
} 