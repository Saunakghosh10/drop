import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import HeaderButtons from './HeaderButtons';

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap'
});

const caveat = Caveat({ 
  subsets: ["latin"], 
  variable: "--font-caveat",
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Drop - Digital Wall",
  description: "Write anything you like on a digital wall",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: '#6b46c1' }
      }}
      afterSignInUrl="/wall"
      afterSignUpUrl="/wall"
    >
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className={`${inter.variable} ${caveat.variable} overflow-x-hidden min-h-screen`}>
          {/* Authentication header - positioned absolutely so it doesn't push content down */}
          <div className="absolute top-0 right-0 p-4 z-50">
            <HeaderButtons />
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
