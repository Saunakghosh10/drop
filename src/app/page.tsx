import { FloatingElement, FadeInElement } from "./components/AnimatedElements";
import StartMemoriesButton from "./components/StartMemoriesButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9F9FB] relative overflow-hidden font-sans">
      {/* Floating elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement 
          className="bg-green-100 w-24 h-24 rounded-full opacity-20" 
          x={15} y={20} delay={0}
          speed={0.5}
        />
        <FloatingElement 
          className="bg-blue-100 w-32 h-32 rounded-full opacity-30" 
          x={85} y={65} delay={100}
          speed={0.7}
        />
        <FloatingElement 
          className="bg-purple-100 w-40 h-40 rounded-full opacity-20" 
          x={75} y={25} delay={200}
          speed={0.6}
        />
      </div>
      
      {/* Container for main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Welcome message with animation */}
        <FadeInElement className="text-center max-w-3xl mx-auto" delay={100}>
          {/* Logo/Branding */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl md:text-6xl font-caveat text-[#333333]">
              Drop
            </h1>
            <span className="text-4xl md:text-6xl text-[#6b46c1]">♏</span>
          </div>
          
          {/* Main content */}
          <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center">
              {/* Headline */}
              <h2 className="text-2xl font-medium mb-2 text-[#333333]">
                Leave your mark
              </h2>
              
              {/* Subtitle */}
              <p className="text-sm md:text-base text-gray-600 mt-2 mb-6">
                Leave your mark on our digital wall
              </p>
              
              {/* Call to action */}
              <StartMemoriesButton />
              
              {/* Additional info */}
              <p className="mt-8 text-xs text-gray-500">
                No account needed. Just start writing!
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Drop. All rights reserved.</p>
          </div>
        </FadeInElement>
      </div>
    </main>
  );
}
