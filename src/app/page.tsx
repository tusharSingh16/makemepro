"use client"
import Front from "@/app/userflow/Front";
import { useEffect } from "react";
import { usePathname } from 'next/navigation';

// Add TypeScript declarations for Tawk properties
declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: any;
  }
}

export default function Home() {
  const pathname = usePathname();

  useEffect(() => {
    // Only load Tawk if we're on the homepage
    if (pathname !== '/') {
      return;
    }

    // Create a script element for Tawk.to
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/673460094304e3196ae1c3b9/1ici9e9t9";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Add error handling for script loading
    script.onerror = (error) => {
      console.error('Error loading Tawk script:', error);
    };

    // Check if script is already present
    const existingScript = document.querySelector(`script[src="${script.src}"]`);
    if (!existingScript) {
      document.body.appendChild(script);
    }

    // Cleanup function
    return () => {
      try {
        // Remove the script tag
        const tawkScript = document.querySelector(`script[src="${script.src}"]`);
        if (tawkScript) {
          tawkScript.remove();
        }

        // Remove the Tawk_API elements
        const tawkAPIElements = document.querySelectorAll('[class*="tawk-"]');
        tawkAPIElements.forEach(element => element.remove());

        // Clean up the Tawk_API global object
        if (typeof window !== 'undefined') {
          if (window.Tawk_API?.hideWidget) {
            window.Tawk_API.hideWidget();
          }
          delete window.Tawk_API;
          delete window.Tawk_LoadStart;
        }
      } catch (error) {
        console.error('Error during Tawk cleanup:', error);
      }
    };
  }, [pathname]);

  return (
    <>
      <Front />
    </>
  );
}
