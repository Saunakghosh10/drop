'use client';

import { useRouter } from 'next/navigation';
import { useAuth, SignInButton } from '@clerk/nextjs';

export default function StartMemoriesButton() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isSignedIn) {
      router.push('/wall');
    }
  };

  if (!isLoaded) {
    return (
      <button
        className="bg-[#1a1a1a] hover:bg-[#333333] text-white rounded-full px-8 py-3 mb-4 text-sm shadow-md transition-transform hover:scale-105"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (isSignedIn) {
    return (
      <button 
        onClick={handleClick}
        className="bg-[#1a1a1a] hover:bg-[#333333] text-white rounded-full px-8 py-3 mb-4 text-sm shadow-md transition-transform hover:scale-105"
      >
        Start making memories
      </button>
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="bg-[#1a1a1a] hover:bg-[#333333] text-white rounded-full px-8 py-3 mb-4 text-sm shadow-md transition-transform hover:scale-105">
        Start making memories
      </button>
    </SignInButton>
  );
} 