
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, BarChart3 } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full py-4 px-6 sm:px-12 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gradient">
          SpiritTrack
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="flex items-center gap-2">
                <BarChart3 size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Link to="/assessment">
              <Button variant="default" className="bg-spirit-purple hover:bg-spirit-deep-purple">
                Start Assessment
              </Button>
            </Link>
            <Button variant="ghost" onClick={() => logout()} className="text-gray-600">
              <LogOut size={18} />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="default" className="bg-spirit-purple hover:bg-spirit-deep-purple">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
