'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/auth');
    else if (adminOnly && !isAdmin) router.replace('/');
  }, [isAuthenticated, isAdmin, adminOnly, router]);

  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;
  return children;
}
