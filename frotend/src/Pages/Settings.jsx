// frontend/src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext.jsx'; // Fixed import path (capital A)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { updateUserProfile, updatePassword, deleteAccount } from '../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    delete: false,
  });
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskReminder: true,
  });
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
    
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const applyTheme = (themeValue) => {
    if (themeValue === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (themeValue === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (themeValue === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const response = await updateUserProfile({ name: profileData.name });
      setUser(response.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(prev => ({ ...prev, password: true }));
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  const handleNotificationChange = (key) => {
    const newSettings = { ...notifications, [key]: !notifications[key] };
    setNotifications(newSettings);
    localStorage.setItem('notifications', JSON.stringify(newSettings));
    toast.success('Notification settings updated');
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    localStorage.setItem('theme', value);
    applyTheme(value);
    toast.success('Theme updated');
  };

  const handleDeleteAccount = async () => {
    setLoading(prev => ({ ...prev, delete: true }));
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      logout();
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <Button type="submit" disabled={loading.profile}>
              {loading.profile ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </form>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
                required
              />
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button type="submit" disabled={loading.password}>
              {loading.password ? 'Updating...' : 'Update Password'}
            </Button>
          </CardContent>
        </form>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={() => handleNotificationChange('email')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={() => handleNotificationChange('push')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Task Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded about due tasks</p>
            </div>
            <Switch
              checked={notifications.taskReminder}
              onCheckedChange={() => handleNotificationChange('taskReminder')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look of the app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('light')}
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('dark')}
            >
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('system')}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-destructive">Delete Account</Label>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading.delete}>
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your tasks from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
                    {loading.delete ? 'Deleting...' : 'Yes, delete my account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;