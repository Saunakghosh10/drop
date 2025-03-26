'use client';

import { usePathname } from 'next/navigation';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

export default function HeaderButtons() {
  const pathname = usePathname();
  const isWallPage = pathname?.startsWith('/wall');

  if (isWallPage) {
    return (
      <div className="flex gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="flex gap-2">
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );
} 