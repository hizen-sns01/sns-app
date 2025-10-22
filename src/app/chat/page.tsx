'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatComponent from '@/components/ChatComponent';
import { createClient } from '@/lib/supabase/client';

export default function ChatPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      }
    };

    checkAuth();
  }, [router, supabase]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">AI Chat Assistant</h1>
      <ChatComponent />
    </main>
  );
}