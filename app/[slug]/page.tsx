'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function SlugRedirect() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  useEffect(() => {
    if (slug && slug !== 'admin' && slug !== '_next' && !slug.startsWith('.')) {
      router.replace(`/invitacion/${slug}`);
    }
  }, [slug, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="animate-pulse text-principal font-playfair text-2xl">
        Cargando invitaci贸n...
      </div>
    </div>
  );
}
