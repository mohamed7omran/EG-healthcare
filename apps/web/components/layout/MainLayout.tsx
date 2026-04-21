import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatbotWidget } from '@/components/chatbot/ChatbotWidget';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="min-h-[calc(100vh-4rem)] p-6">
          {children}
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
