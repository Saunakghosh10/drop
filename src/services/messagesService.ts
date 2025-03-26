'use server';

import { Message } from '@/types';
import { executeQuery } from '@/lib/db';
import { initializeDatabase as dbInit } from '@/lib/dbActions';

// Expose database initialization as a server action
export async function initializeDatabase(): Promise<{ success: boolean, error?: unknown }> {
  return await dbInit();
}

// Ensure database is initialized before any operation
async function ensureDbInitialized() {
  const result = await dbInit();
  if (!result.success) {
    console.error('Failed to initialize database:', result.error);
    throw new Error('Database initialization failed');
  }
  return true;
}

// Helper to convert Record<string, unknown> to Message
function recordToMessage(record: Record<string, unknown>): Message {
  // Ensure the record has the required Message properties
  return {
    id: record.id as string,
    content: record.content as string,
    position: record.position as { x: number; y: number },
    color: record.color as string,
    size: record.size as { width: number; height: number } | undefined,
    user_id: record.user_id as string | undefined,
    author: record.author as string | undefined,
    created_at: record.created_at as string | undefined,
    updated_at: record.updated_at as string | undefined
  };
}

// Fetches all messages
export async function getAllMessages(): Promise<Message[]> {
  try {
    await ensureDbInitialized();
    
    const { data, error } = await executeQuery(`
      SELECT * FROM messages 
      ORDER BY created_at ASC
    `);
    
    if (error) {
      throw error;
    }
    
    return data ? data.map(recordToMessage) : [];
  } catch (err) {
    console.error('Error fetching messages:', err);
    return [];
  }
}

// Creates a new message
export async function createMessage(
  message: Omit<Message, 'id' | 'created_at' | 'updated_at'>
): Promise<Message | null> {
  try {
    await ensureDbInitialized();
    
    console.log('Creating message:', message);
    
    const { content, position, size, color, user_id, author } = message;
    
    const { data, error } = await executeQuery(
      `INSERT INTO messages 
       (content, position, size, color, user_id, author) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        content, 
        JSON.stringify(position), 
        size ? JSON.stringify(size) : null, 
        color, 
        user_id || null, 
        author || null
      ]
    );
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No row returned after insert');
    }
    
    console.log('Message created successfully:', data[0]);
    return recordToMessage(data[0]);
  } catch (err) {
    console.error('Error creating message:', err);
    return null;
  }
}

// Updates an existing message
export async function updateMessage(
  id: string, 
  updates: Partial<Message>
): Promise<Message | null> {
  try {
    await ensureDbInitialized();
    
    // Build the SET part of the query dynamically based on provided updates
    const updateFields = [];
    const values = [id]; // Start with the ID
    let paramIndex = 2; // Start parameter index at 2 (after ID)
    
    if (updates.content !== undefined) {
      updateFields.push(`content = $${paramIndex++}`);
      values.push(updates.content);
    }
    
    if (updates.position !== undefined) {
      updateFields.push(`position = $${paramIndex++}`);
      values.push(JSON.stringify(updates.position));
    }
    
    if (updates.size !== undefined) {
      updateFields.push(`size = $${paramIndex++}`);
      values.push(JSON.stringify(updates.size));
    }
    
    if (updates.color !== undefined) {
      updateFields.push(`color = $${paramIndex++}`);
      values.push(updates.color);
    }
    
    // Add updated_at to always update the timestamp
    updateFields.push(`updated_at = now()`);
    
    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }
    
    const query = `
      UPDATE messages 
      SET ${updateFields.join(', ')} 
      WHERE id = $1 
      RETURNING *
    `;
    
    const { data, error } = await executeQuery(query, values);
    
    if (error) {
      throw error;
    }
    
    return data && data.length > 0 ? recordToMessage(data[0]) : null;
  } catch (err) {
    console.error('Error updating message:', err);
    return null;
  }
}

// Updates just the position of a message
export async function updateMessagePosition(
  id: string, 
  position: { x: number; y: number }
): Promise<boolean> {
  try {
    await ensureDbInitialized();
    
    const { error } = await executeQuery(
      `UPDATE messages 
       SET position = $1, updated_at = now() 
       WHERE id = $2`,
      [JSON.stringify(position), id]
    );
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error updating message position:', err);
    return false;
  }
}

// Deletes a message
export async function deleteMessage(id: string): Promise<boolean> {
  try {
    await ensureDbInitialized();
    
    const { error } = await executeQuery(
      `DELETE FROM messages WHERE id = $1`,
      [id]
    );
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error deleting message:', err);
    return false;
  }
}

// Test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // Always initialize the database first
    await ensureDbInitialized();
    
    console.log('Testing database connection...');
    
    const { error } = await executeQuery('SELECT 1');
    
    if (error) {
      throw error;
    }
    
    console.log('Database connection test successful');
    return true;
  } catch (err) {
    console.error('Database connection test failed:', err);
    return false;
  }
} 