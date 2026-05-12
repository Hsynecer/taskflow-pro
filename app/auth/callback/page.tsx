'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase'; // Yol farklıysa kendi projene göre ayarla
export const dynamic = 'force-dynamic';


export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Supabase URL'deki tokeni yakalar ve oturumu açar.
    // Oturum açıldığını anladığımız an kullanıcıyı tahtaya (ana sayfaya) fırlatıyoruz.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        router.push('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500 flex items-center gap-2">
        <span className="animate-spin text-xl">⏳</span>
        Oturumunuz doğrulanıyor, çalışma alanına yönlendiriliyorsunuz...
      </div>
    </div>
  );
}
