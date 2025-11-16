"use cilent"
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('userinfo');
  console.log(isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
