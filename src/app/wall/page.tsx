'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import TextEditor, { TextOptions } from '../components/TextEditor';
import CreateNewWritingButton from '../components/CreateNewWritingButton';
import DraggableMessage from '../components/DraggableMessage';
// Import the existing Message type from the app
import { Message } from '../types';
import { Message as MessageType } from '@/types';

// Create server action wrappers for the database functions
import { 
  getAllMessages as dbGetAllMessages, 
  createMessage as dbCreateMessage, 
  updateMessage as dbUpdateMessage, 
  updateMessagePosition as dbUpdateMessagePosition, 
  testDatabaseConnection as dbTestDatabaseConnection,
  initializeDatabase as dbInitializeDatabase
} from '@/services/messagesService';

// Server actions wrapper functions
async function getAllMessages() {
  return await dbGetAllMessages();
}

async function createMessage(message: Omit<MessageType, 'id' | 'created_at' | 'updated_at'>) {
  return await dbCreateMessage(message);
}

async function updateMessage(id: string, updates: Partial<MessageType>) {
  return await dbUpdateMessage(id, updates);
}

async function updateMessagePosition(id: string, position: { x: number; y: number }) {
  return await dbUpdateMessagePosition(id, position);
}

async function testDatabaseConnection() {
  return await dbTestDatabaseConnection();
}

// Initialize the database
async function initDb() {
  return await dbInitializeDatabase();
}

// Convert between app's Message type and our database Message type
const convertToAppMessage = (dbMessage: MessageType): Message => {
  return {
    id: dbMessage.id || Date.now().toString(),
    text: dbMessage.content,
    position: dbMessage.position,
    color: dbMessage.color,
    rotation: dbMessage.size?.width || 0,
    fontSize: dbMessage.size?.height || 16
  };
};

const convertToDbMessage = (appMessage: Message, userId?: string | null): Omit<MessageType, 'id' | 'created_at' | 'updated_at'> => {
  return {
    content: appMessage.text,
    position: appMessage.position,
    color: appMessage.color,
    size: {
      width: appMessage.rotation || 0,
      height: appMessage.fontSize || 16
    },
    user_id: userId || undefined,
    author: undefined // Will be set by the backend
  };
};

export default function WallPage() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [editorPosition, setEditorPosition] = useState({ x: 50, y: 50 });
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnectionError, setDbConnectionError] = useState<string | null>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  
  // Redirect to home if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/');
    }
  }, [isLoaded, isSignedIn, router]);
  
  // Load messages from the database
  useEffect(() => {
    async function loadMessages() {
      if (isLoaded && isSignedIn) {
        try {
          setIsLoading(true);
          
          // Initialize the database first
          console.log('Initializing database...');
          const initResult = await initDb();
          if (!initResult.success) {
            console.error('Failed to initialize database:', initResult.error);
            setDbConnectionError('Failed to initialize database. Please check your configuration.');
            setIsLoading(false);
            return;
          }
          
          // Test database connection
          const connectionSuccess = await testDatabaseConnection();
          if (!connectionSuccess) {
            console.error('Failed to connect to database. Please check your configuration.');
            setDbConnectionError('Failed to connect to database. Your messages will not be saved.');
            
            // Set up sample messages for better UX
            const sampleMessages: Message[] = [
              {
                id: '1',
                text: 'Welcome to the wall!',
                position: { x: 30, y: 30 },
                color: '#000000',
                rotation: -2,
                fontSize: 16
              },
              {
                id: '2',
                text: 'You can add your own messages here.',
                position: { x: 60, y: 40 },
                color: '#0000ff',
                rotation: 1,
                fontSize: 14
              },
              {
                id: '3',
                text: 'Try dragging this message!',
                position: { x: 45, y: 60 },
                color: '#8b4513',
                rotation: 3,
                fontSize: 16
              }
            ];
            
            setMessages(sampleMessages);
            setIsLoading(false);
            return;
          }
          
          const dbMessages = await getAllMessages();
          
          if (dbMessages.length > 0) {
            // Convert from DB format to app format
            const appMessages = dbMessages.map(convertToAppMessage);
            setMessages(appMessages);
          } else {
            // If no messages, provide some samples
            const sampleMessages: Message[] = [
              {
                id: '1',
                text: 'Welcome to the wall!',
                position: { x: 30, y: 30 },
                color: '#000000',
                rotation: -2,
                fontSize: 16
              },
              {
                id: '2',
                text: 'You can add your own messages here.',
                position: { x: 60, y: 40 },
                color: '#0000ff',
                rotation: 1,
                fontSize: 14
              },
              {
                id: '3',
                text: 'Try dragging this message!',
                position: { x: 45, y: 60 },
                color: '#8b4513',
                rotation: 3,
                fontSize: 16
              }
            ];
            
            setMessages(sampleMessages);
            
            // Save sample messages to database
            for (const message of sampleMessages) {
              await createMessage(convertToDbMessage(message, userId));
            }
          }
        } catch (error) {
          console.error('Error loading messages:', error);
          setDbConnectionError('Error loading messages. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    loadMessages();
  }, [isLoaded, isSignedIn, userId]);

  const handleCreateNewWriting = () => {
    if (wallRef.current) {
      // Position the editor in the center of the screen
      setEditorPosition({ x: 50, y: 50 });
      setSelectedMessage(null);
      setIsEditing(true);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setEditorPosition(message.position);
    setIsEditing(true);
  };

  const handleSaveMessage = async (text: string, options: TextOptions) => {
    try {
      if (selectedMessage) {
        // Update existing message
        const updatedAppMessage = { 
          ...selectedMessage, 
          text, 
          ...options 
        };
        
        // Update in UI immediately for better UX
        const updatedMessages = messages.map(msg => 
          msg.id === selectedMessage.id ? updatedAppMessage : msg
        );
        setMessages(updatedMessages);
        
        // Update in database
        await updateMessage(selectedMessage.id, {
          content: text,
          color: options.color,
          size: {
            width: options.rotation || 0,
            height: options.fontSize || 16
          }
        });
      } else {
        // Create new message
        const newAppMsg: Message = {
          id: Date.now().toString(), // Temporary ID
          text,
          position: editorPosition,
          ...options
        };
        
        // Add to UI immediately for better UX
        setMessages(prevMessages => [...prevMessages, newAppMsg]);
        
        // Save to database
        const dbMessage = convertToDbMessage(newAppMsg, userId);
        const savedMessage = await createMessage(dbMessage);
        
        if (savedMessage) {
          // Update the message with the real ID from the database
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === newAppMsg.id 
                ? { ...msg, id: savedMessage.id || msg.id } 
                : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
    
    setIsEditing(false);
    setSelectedMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedMessage(null);
  };

  const handleMessagePositionChange = async (id: string, position: { x: number; y: number }) => {
    // Update UI immediately
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === id 
          ? { ...msg, position } 
          : msg
      )
    );
    
    // Update in database
    try {
      await updateMessagePosition(id, position);
    } catch (error) {
      console.error('Error updating message position:', error);
    }
  };

  // Show loading state while authentication is initializing or messages are loading
  if (!isLoaded || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-caveat flex items-center">
          <span>Drop</span>
          <span className="ml-2 text-[#6b46c1]">♏</span>
        </Link>
        
        {dbConnectionError && (
          <div className="text-xs text-red-600">
            {dbConnectionError}
          </div>
        )}
      </header>
      
      {/* Wall area */}
      <div 
        ref={wallRef}
        className="flex-1 relative"
      >
        {messages.map((msg) => (
          <DraggableMessage 
            key={msg.id} 
            message={msg} 
            onPositionChange={handleMessagePositionChange}
            onClick={() => handleMessageClick(msg)}
            wallRef={wallRef}
          />
        ))}
        
        {/* Text editor overlay */}
        {isEditing && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20"
            onClick={handleCancelEdit}
          >
            <div 
              className="absolute"
              style={{
                left: `${editorPosition.x}%`,
                top: `${editorPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <TextEditor 
                onSave={handleSaveMessage}
                onCancel={handleCancelEdit}
                initialText={selectedMessage?.text || ''}
                initialOptions={selectedMessage || {}}
              />
            </div>
          </div>
        )}
        
        {/* Bottom input controls */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-3">
            {/* Create New Writing button */}
            <CreateNewWritingButton onClick={handleCreateNewWriting} />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="p-4 flex justify-between items-center text-xs text-[#666666]">
        <div>
          <span>© Drop {new Date().getFullYear()}</span>
        </div>
        <div>
          <a href="https://x.com/heyits_saunak" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
            </svg>
            <span>@heyits_saunak</span>
          </a>
        </div>
      </footer>
    </div>
  );
}