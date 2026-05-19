
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
  const { toast } = useToast();

  useEffect(() => {
    initClient(() => {
      // After gapi is initialized, check if the user is already signed in.
      const token = gapi.client.getToken();
      if (token && token.access_token) {
        setUser(token);
      }
    });
    initGis((token) => {
      if (token.error) {
        console.error('GIS Error:', token.error);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: `Error: ${token.error_description || token.error}`,
        });
        return;
      }

      if (token.access_token) {
        setUser(token);
        toast({
          title: "Signed in successfully",
          description: "You are now connected to Google Drive.",
        });
      }
    });
  }, [toast]);

  const handleSignIn = () => {
    handleAuthClick();
  };

  const handleSignOut = () => {
    handleSignoutClick();
    setUser(null);
    toast({
      title: "Signed out",
      description: "You have been signed out from Google Drive.",
    });
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
