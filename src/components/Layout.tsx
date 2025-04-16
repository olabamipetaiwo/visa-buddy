
import { ReactNode } from 'react';
import { GraduationCap, Laptop } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <div className="container max-w-5xl px-4 py-8 mx-auto">
        {/* Header */}
        <header className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-center">
              Visa Prep Buddy
            </h1>
          </div>
        </header>

        {/* Main content */}
        <main className="flex flex-col items-center justify-center">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Laptop className="h-4 w-4" />
            <span>Visa Prep Buddy</span>
          </div>
          <p>Practice makes perfect - ace your F1 visa interview!</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
