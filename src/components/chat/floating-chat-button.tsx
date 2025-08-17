'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  const handleStartChat = () => {
    setIsChatting(true);
    // Initialize chat service here
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 p-0 z-50"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Chat dengan Kami</span>
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat dengan Tim Kami</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!isChatting ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Silakan mulai percakapan dengan tim kami untuk konsultasi cepat
                  terkait kebutuhan industri Anda.
                </p>
                <Button onClick={handleStartChat} className="w-full">
                  Mulai Chat
                </Button>
              </div>
            ) : (
              <div className="min-h-[300px]">
                {/* Here you can integrate your preferred chat service
                    such as Crisp, Intercom, or custom implementation */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading chat...</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
