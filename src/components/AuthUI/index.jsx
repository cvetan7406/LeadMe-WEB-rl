import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../config/supabaseClient'
import { Box, Alert } from '@mui/material'

const AuthUI = () => {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [view, setView] = useState('sign_in')
  const [loading, setLoading] = useState(true)
  const hasRedirected = useRef(false)
  
  useEffect(() => {
    // Prevent multiple redirects - if we've already redirected, exit early
    if (hasRedirected.current) return;
    
    // Check for existing auth in localStorage for Supabase v2
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
    
    // If session exists in localStorage, redirect immediately
    if (checkLocalStorage()) {
      const targetPath = sessionStorage.getItem('redirectAfterAuth') || '/dashboard';
      // Clear the redirect path after use
      sessionStorage.removeItem('redirectAfterAuth');
      hasRedirected.current = true;
      navigate(targetPath, { replace: true });
      return;
    }
    
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session && !hasRedirected.current) {
        const targetPath = sessionStorage.getItem('redirectAfterAuth') || '/dashboard';
        // Clear the redirect path after use
        sessionStorage.removeItem('redirectAfterAuth');
        hasRedirected.current = true;
        navigate(targetPath, { replace: true });
      }
      setLoading(false)
    })

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session && !hasRedirected.current) {
          const targetPath = sessionStorage.getItem('redirectAfterAuth') || '/dashboard';
          // Clear the redirect path after use
          sessionStorage.removeItem('redirectAfterAuth');
          hasRedirected.current = true;
          navigate(targetPath, { replace: true });
        }
      }
    )

    // Cleanup subscription
    return () => subscription.unsubscribe()
  }, [navigate])

  if (loading) {
    return <div style={{ height: '100vh', width: '100vw' }}></div>; // Return empty div instead of null
  }

  if (session) {
    return null
  }

  return (
    <>
      {view === 'sign_up' && (
        <Box mb={2}>
          <Alert severity="warning" variant="filled" sx={{ mb: 2 }}>
            Registration is restricted. Please contact an administrator for access.
          </Alert>
        </Box>
      )}
      
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          extend: true
        }}
        theme="dark"
        providers={['google', 'github', 'apple','azure',]}
        redirectTo={window.location.origin + '/dashboard'}
        magicLink={true}
        onlyThirdPartyProviders={false}
        socialLayout="horizontal"
        showLinks={true}
        view={view}
        onViewChange={newView => setView(newView)}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email Address',
              password_label: 'Password',
              button_label: 'Sign In'
            },
            sign_up: {
              email_label: 'Email Address',
              password_label: 'Create a Password',
              button_label: 'Request Account',
              link_text: 'Need an account?'
            }
          }
        }}
      />
    </>
  )
}

export default AuthUI 