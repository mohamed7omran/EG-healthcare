'use client';

import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogOut } from 'lucide-react';
import { mockDoctors, mockPatients } from '@/data/mockData';
import { Button } from '../ui/button';
import Link from 'next/link';

export function Header() {
  const { user,authLoading, role, currentUserId, signOut } = useApp();
  
  const mockUser = role === 'patient' 
    ? mockPatients.find(p => p.id === currentUserId)
    : mockDoctors.find(d => d.id === currentUserId);
  
  const currentUser = mockUser ?? (user ? {
    id: user.uid,
    name: user.displayName ?? user.email ?? 'User',
    avatar: user.photoURL ?? '',
  } : null);


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
      {/* Left side - Page title or search could go here */}
      <div className="flex items-center gap-4">
        <h2 className="font-display text-lg font-semibold text-foreground">
          <span className="text-primary">{role === 'patient'?"":"Dr."}</span> {role === 'patient' ? currentUser?.name?.split(' ')[0] : currentUser?.name}
        </h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
    

        {/* Notifications */}
        <button className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* User Avatar */}
        <Avatar className="h-9 w-9 border-2 border-primary/20">
          <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {currentUser?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        {authLoading ? (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <Button variant="ghost" size="icon" onClick={signOut} className="text-muted-foreground hover:text-foreground">
            <Link href="/signin">
              <LogOut className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
