import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    const result = await initializeDatabase();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error initializing database',
        error: result.error
      }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: 'Error initializing database',
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
} 