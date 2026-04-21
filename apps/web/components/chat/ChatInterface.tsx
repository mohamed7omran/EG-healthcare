import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Paperclip, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockDoctors, mockPatients } from '@/data/mockData';

export function ChatInterface() {
  const { role, currentUserId, chatMessages, addChatMessage } = useApp();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentUser = role === 'patient' 
    ? mockPatients.find(p => p.id === currentUserId)
    : mockDoctors.find(d => d.id === currentUserId);

  const chatPartner = role === 'patient'
    ? mockDoctors[0]
    : mockPatients[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderRole: role,
      content: input,
      timestamp: new Date(),
    };

    addChatMessage(newMessage);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOwnMessage = (message: ChatMessage) => message.senderId === currentUserId;

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-4 border-b border-border bg-secondary/30 px-6 py-4">
        <Avatar className="h-12 w-12 border-2 border-primary/10">
          <AvatarImage src={chatPartner.avatar} alt={chatPartner.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {chatPartner.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-display font-semibold text-foreground">
            {chatPartner.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4">
          {chatMessages.map((message) => {
            const isOwn = isOwnMessage(message);
            const sender = message.senderRole === 'patient'
              ? mockPatients.find(p => p.id === message.senderId)
              : mockDoctors.find(d => d.id === message.senderId);

            return (
              <div
                key={message.id}
                className={cn('flex gap-3', isOwn && 'flex-row-reverse')}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={sender?.avatar} alt={sender?.name} />
                  <AvatarFallback className={cn(
                    isOwn ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  )}>
                    {sender?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className={cn('max-w-[70%]', isOwn && 'items-end')}>
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3',
                      isOwn
                        ? 'gradient-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-secondary-foreground rounded-bl-md'
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={cn(
                    'mt-1 text-xs text-muted-foreground',
                    isOwn && 'text-right'
                  )}>
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-secondary/30 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-background"
          />
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleSend} 
            size="icon" 
            className="gradient-primary border-0"
            disabled={!input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
