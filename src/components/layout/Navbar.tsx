import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, LayoutDashboard, Settings, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../lib/auth-context';
import { signInWithGoogle, logout } from '../../lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/builder');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground transform group-hover:rotate-12 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight">Zaplo</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {!user ? (
            <>
              <Link to="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link to="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</Link>
              <Link to="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Dashboard</Link>
              <Link to="/builder" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/builder') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Workflows</Link>
              <Link to="/tasks" className={`text-sm font-medium transition-colors ${location.pathname === '/tasks' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Activity</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <Button onClick={signInWithGoogle} variant="default" size="sm" className="rounded-full shadow-lg shadow-primary/25">
              Get Started
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2 px-3 border-b border-border/50 mb-1">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground mt-1 truncate max-w-[160px]">{user.email}</span>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
