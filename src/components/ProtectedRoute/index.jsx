import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { user, session, loading: authLoading } = useAuth();
  const location = useLocation();
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [hasStoredSession, setHasStoredSession] = useState(false);

  useEffect(() => {
    // Check for auth token in localStorage
    const checkLocalStorage = () => {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb-') && key.includes('auth-token')) {
            return true;
          }
        }
        return false;
      } catch (e) {
        console.error('Error checking localStorage:', e);
        return false;
      }
    };

    if (!hasCheckedStorage) {
      setHasStoredSession(checkLocalStorage());
      setHasCheckedStorage(true);
    }
  }, [hasCheckedStorage]);

  // Show loading state during initial auth check
  if (authLoading || !hasCheckedStorage) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0f1535'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Allow access if we have a valid session or stored token
  if (session?.user || hasStoredSession) {
    return children;
  }

  // Redirect to sign-in if no session found
  sessionStorage.setItem('redirectAfterAuth', location.pathname);
  return <Navigate to="/authentication/sign-in" state={{ from: location }} replace />;
}

export default ProtectedRoute; 