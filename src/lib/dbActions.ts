'use server';

import { initializeDatabase as dbInit } from './db';

// Export database initialization as a proper server action
export async function initializeDatabase(): Promise<{ success: boolean, error?: unknown }> {
  return await dbInit();
} 