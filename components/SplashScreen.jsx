// components/SplashScreen.jsx
"use client";

import { useEffect, useState } from "react";
import Logo from "@/assets/Logo.gif";

export function SplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  useEffect(() => {
    // Skip splash on initial page load
    setInitialLoad(false);
  }, []);

  // Check if user is returning to the page from another tab or minimized window
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only show splash if the page was hidden and is now visible again
      // AND it's not the initial page load
      if (document.visibilityState === 'visible' && !initialLoad) {
        setShowSplash(true);
        
        // Hide splash after 7 seconds
        const timer = setTimeout(() => {
          setShowSplash(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initialLoad]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[100]">
      <div className="flex flex-col items-center">
        <img 
          src={Logo.src} 
          alt="Logo Animation" 
          className="w-64 h-64 object-contain"
        />
      </div>
      
      <div className="absolute bottom-8 text-gray-800 text-lg font-medium" 
           style={{ fontFamily: "'Poppins', sans-serif" }}>
        Built by Harte Labs
      </div>
    </div>
  );
}