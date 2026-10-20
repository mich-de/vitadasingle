import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import Sidebar from './Sidebar';
import Navbar from './Navbar';
// Remove HeroSection import

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation(); // Get current location
  const isDashboard = location.pathname === '/'; // Check if it's the dashboard route

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="container mx-auto max-w-7xl">
            {/* Remove conditional HeroSection rendering */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;