// frontend/src/components/Layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { cn } from "../lib/utils.js"
import { Button } from './ui/button';

const Sidebar = ({ open, onClose }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:z-30",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile header with close button */}
          <div className="flex items-center justify-between p-4 border-b md:hidden">
            <span className="font-bold text-lg">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;