// frontend/src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, LogOut, User, LayoutDashboard, CheckSquare, Plus } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen, onNewTask }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link to="/dashboard" className="flex items-center space-x-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden sm:inline">TaskManager</span>
        </Link>

        <div className="flex-1" />

        

        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              setIsOpen(false);
              navigate('/dashboard');
            }}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setIsOpen(false);
              navigate('/tasks');
            }}>
              <CheckSquare className="mr-2 h-4 w-4" />
              My Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setIsOpen(false);
              navigate('/settings');
            }}>
              <User className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;