import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../config/supabaseClient';
import { initDatabase } from '../utils/initDatabase';

const AuthContext = createContext({});

const useAuth = () => useContext(AuthContext);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if we have network connectivity
const checkNetwork = async () => {
  try {
    const response = await fetch('https://www.google.com/favicon.ico', {
      mode: 'no-cors',
    });
    return response.type === 'opaque' || response.status === 0;
  } catch (error) {
    return false;
  }
};

const retryOperation = async (operation, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    // Check network before attempting operation
    const hasNetwork = await checkNetwork();
    if (!hasNetwork) {
      console.error('No network connection detected');
      throw new Error('No network connection. Please check your internet connection and try again.');
    }

    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Operation failed (attempt ${i + 1}/${retries}):`, error.message);
      
      // If it's a network error, wait longer
      if (error.message.includes('fetch') || error.message.includes('network')) {
        await sleep(delay * (i + 2)); // Exponential backoff
      } else if (i < retries - 1) {
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check network connectivity
        const hasNetwork = await checkNetwork();
        if (!hasNetwork) {
          throw new Error('No network connection. Please check your internet connection.');
        }

        // Get current session state with retry
        const { data: { session: currentSession }, error: sessionError } = await retryOperation(
          () => supabase.auth.getSession()
        );
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(sessionError);
          return;
        }

        // Update state if we have a valid session
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          try {
            await initDatabase();
          } catch (dbError) {
            console.error('Error initializing database:', dbError);
            setError(dbError);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event);
      setError(null);
      
      switch (event) {
        case 'SIGNED_IN':
          if (currentSession?.user) {
            setSession(currentSession);
            setUser(currentSession.user);
            await initDatabase().catch(error => {
              console.error('Error initializing database:', error);
              setError(error);
            });
          }
          break;
          
        case 'SIGNED_OUT':
          setUser(null);
          setSession(null);
          break;
          
        case 'TOKEN_REFRESHED':
          if (currentSession?.user) {
            setSession(currentSession);
            setUser(currentSession.user);
          }
          break;
      }
      
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }) => {
    setError(null);
    try {
      // Check network connectivity first
      const hasNetwork = await checkNetwork();
      if (!hasNetwork) {
        throw new Error('No network connection. Please check your internet connection and try again.');
      }

      console.log('Attempting to sign in with:', { email });
      
      const { data, error } = await retryOperation(
        () => supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        })
      );

      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }

      if (data?.session) {
        console.log('Sign in successful');
        setSession(data.session);
        setUser(data.session.user);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error);
      return { 
        data: null, 
        error: {
          message: error.message || 'Failed to sign in. Please check your credentials and try again.',
          details: error
        }
      };
    }
  };

  const signUp = async ({ email, password }) => {
    setError(null);
    try {
      // Display a custom message instead of proceeding with registration
      throw new Error('Registration is restricted. Please contact an administrator at support@cyberoperations.ltd for access.');
      
      // The code below will never execute
      // Check network connectivity first
      const hasNetwork = await checkNetwork();
      if (!hasNetwork) {
        throw new Error('No network connection. Please check your internet connection and try again.');
      }

      console.log('Attempting to sign up with:', { email });

      const { data, error } = await retryOperation(
        () => supabase.auth.signUp({
          email: email.trim(),
          password: password
        })
      );

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error);
      return { 
        data: null, 
        error: {
          message: error.message || 'Failed to sign up. Please try again.',
          details: error
        }
      };
    }
  };

  const signInWithOAuth = async (provider) => {
    setError(null);
    try {
      // Check network connectivity first
      const hasNetwork = await checkNetwork();
      if (!hasNetwork) {
        throw new Error('No network connection. Please check your internet connection and try again.');
      }

      console.log(`Attempting to sign in with ${provider}`);
      
      const { data, error } = await retryOperation(
        () => supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: window.location.origin + '/dashboard'
          }
        })
      );

      if (error) {
        console.error(`Supabase auth error during ${provider} sign in:`, error);
        throw error;
      }

      // Note: The actual authentication completion happens via the onAuthStateChange handler
      // after the OAuth redirect flow completes. No need to set user/session here.
      
      return { data, error: null };
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      setError(error);
      return { 
        data: null, 
        error: {
          message: error.message || `Failed to sign in with ${provider}. Please try again.`,
          details: error
        }
      };
    }
  };

  const signInWithGoogle = () => signInWithOAuth('google');
  const signInWithGithub = () => signInWithOAuth('github');

  const signOut = async () => {
    setError(null);
    try {
      // Check network connectivity first
      const hasNetwork = await checkNetwork();
      if (!hasNetwork) {
        throw new Error('No network connection. Please check your internet connection and try again.');
      }

      console.log('Attempting to sign out');
      
      const { error } = await retryOperation(
        () => supabase.auth.signOut()
      );

      if (error) {
        console.error('Supabase auth error during sign out:', error);
        throw error;
      }

      // Immediately update state (don't wait for auth state change event)
      setUser(null);
      setSession(null);

      console.log('Sign out successful');
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error);
      return { 
        error: {
          message: error.message || 'Failed to sign out. Please try again.',
          details: error
        }
      };
    }
  };

  const value = useMemo(() => ({
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    user,
    session,
    loading,
    error,
    isAuthenticated: !!session
  }), [user, session, loading, error]);

  if (loading) {
    return <div>Loading auth...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth }; 