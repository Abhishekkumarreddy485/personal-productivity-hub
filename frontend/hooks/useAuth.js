// /frontend/hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function useAuth() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      router.replace('/login');
    }
    setLoading(false);
  }, []);

  return { authenticated, loading };
}
