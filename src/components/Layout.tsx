
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { initClient, initGis, handleAuthClick, handleSignoutClick } from '@/lib/googleDrive';

interface LayoutProps {
  children: (user: any) => React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    initClient(() => {
      // After gapi is initialized, check if the user is already signed in.
      const token = gapi.client.getToken();
      if (token) {
        setUser(token);
      }
    });
    initGis((token) => {
      setUser(token);
    });
  }, []);

  const handleSignIn = () => {
    handleAuthClick();
    // TODO: Listen for token changes and update the user state.
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
              <Button onClick={handleSignIn}>Sign in with Google</Button>
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
