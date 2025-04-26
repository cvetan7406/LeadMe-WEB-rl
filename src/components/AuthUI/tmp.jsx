import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  // If still loading auth state, show nothing
  if (loading) {
    return null;
  }

  
  // If no user, redirect to sign-in
  if (!user) {
    return <Navigate to="/authentication/sign-in" state={{ from: location }} replace />;
  }

  // Prevent back navigation to protected routes after sign out
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/authentication/sign-in';
      }
    };

    const handlePopState = () => {
      checkSession();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return children;
};

export default ProtectedRoute; 