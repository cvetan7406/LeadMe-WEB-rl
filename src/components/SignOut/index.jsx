import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Export handleSignOut function to be used by other components
export const handleSignOut = async (navigate) => {
  try {
    const { useAuth: importedUseAuth } = await import('../../context/AuthContext');
    const { signOut } = importedUseAuth();
    
    // Use the AuthContext's signOut function
    const { error } = await signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    
    // Redirect to sign-in page
    window.location.replace('/authentication/sign-in');
  } catch (error) {
    console.error('Error during sign out:', error);
    window.location.replace('/authentication/sign-in');
  }
};

const SignOut = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { signOut, user } = useAuth(); // Access auth context's signOut function

  useEffect(() => {
    const performSignOut = async () => {
      if (isProcessing) return;
      setIsProcessing(true);
      
      try {
        console.log('Signing out user:', user?.email);
        
        // Use the AuthContext's signOut function directly
        const { error } = await signOut();
        
        if (error) {
          console.error('Failed to sign out:', error);
          throw error;
        }
        
        // Navigate to sign-in page
        navigate('/authentication/sign-in');
      } catch (error) {
        console.error('Failed to sign out:', error);
        // Force navigation to sign-in page even if there's an error
        navigate('/authentication/sign-in');
      }
    };

    performSignOut();
  }, [navigate, isProcessing, user, signOut]);

  return null;
};

export default SignOut; 