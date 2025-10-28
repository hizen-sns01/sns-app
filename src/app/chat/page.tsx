'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatComponent from '@/components/ChatComponent';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ChatPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log('Checking auth in chat page...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) router.replace('/login');
          return;
        }

        if (!session) {
          console.log('No session found in chat page');
          if (mounted) router.replace('/login');
          return;
        }

        console.log('Valid session found in chat page');

        // Set up real-time auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log('Auth state changed:', event);
          if ((event === 'SIGNED_OUT' || !currentSession) && mounted) {
            router.replace('/login');
          }
        });

        // Cleanup subscription
        return () => {
          subscription.unsubscribe();
          mounted = false;
        };
      } catch (error) {
        console.error('Auth error in chat page:', error);
        if (mounted) router.replace('/login');
      }
    };

    checkAuth();
  }, [router, supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Chat Assistant</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          로그아웃
        </button>
      </div>
      <ChatComponent />
    </main>
  );
}