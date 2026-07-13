
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { initClient, initGis, handleAuthClick, handleSignoutClick } from '@/lib/googleDrive';

interface LayoutProps {
  children: (user: google.accounts.oauth2.TokenResponse | null) => React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const [user, setUser] = useState<google.accounts.oauth2.TokenResponse | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    // We need to wait for gapi and google to load
    const checkScripts = setInterval(() => {
      if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
        clearInterval(checkScripts);
        setScriptsLoaded(true);
      }
    }, 100);
    return () => clearInterval(checkScripts);
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;

    try {
      initClient(() => {
        // After gapi is initialized, check if the user is already signed in.
        const token = gapi.client.getToken();
        if (token) {
          setUser(token);
        }
      });
    } catch (e) {
      console.error("gapi init error", e);
    }

    try {
      initGis((token) => {
        gapi.client.setToken(token);
        setUser(token);
      });
    } catch (e) {
      console.error("gis init error", e);
    }

    // Listen for token changes periodically since Google APIs don't provide a direct event
    const tokenCheckInterval = setInterval(() => {
      if (typeof gapi !== 'undefined' && gapi.client) {
        const currentToken = gapi.client.getToken();
        setUser((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(currentToken)) return prev;
          return currentToken ? { ...currentToken } : null;
        });
      }
    }, 5000);

    return () => clearInterval(tokenCheckInterval);
  }, [scriptsLoaded]);

  const handleSignIn = () => {
    handleAuthClick();
  };

  const handleSignOut = () => {
    handleSignoutClick();
    setUser(null);
  };

  return (
    <div className={cn(
      "min-h-[100dvh] bg-background text-foreground flex flex-col",
      className
    )}>
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            KineticLog
          </h1>
          <div>
            {user ? (
              <Button onClick={handleSignOut}>Sign Out</Button>
            ) : (
              <Button onClick={handleSignIn} disabled={!scriptsLoaded}>Sign in with Google</Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">
        {children(user)}
      </main>
    </div>
  );
};

export default Layout;
