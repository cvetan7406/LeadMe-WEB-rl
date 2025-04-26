import React, { useState, useEffect } from 'react';
import { Card, Stack, Grid, Alert, Collapse, IconButton } from '@mui/material';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

import CloseIcon from '@mui/icons-material/Close';

import VuiBox from '../../components/VuiBox';
import VuiTypography from '../../components/VuiTypography';
import VuiButton from '../../components/VuiButton';
import VuiInput from '../../components/VuiInput';

import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';

import Footer from '../../examples/Footer';

function FileUpload() {
  const { addNotification } = useNotifications();
  const { user, session } = useAuth();
  
  // In-form notification state
  const [formNotification, setFormNotification] = useState({ open: false, message: '', type: 'info' });

  const [scriptName, setScriptName] = useState('');
  const [scriptDescription, setScriptDescription] = useState('');
  const [scriptContent, setScriptContent] = useState('');

  // Function to show in-form notification
  const showFormNotification = (message, type = 'info') => {
    setFormNotification({ open: true, message, type });
    
    // Auto-close notification after 5 seconds
    setTimeout(() => {
      setFormNotification(prev => ({ ...prev, open: false }));
    }, 8000);
  };

  // Extract user ID from auth context or session
  const getUserId = () => {
    // First try getting it directly from user object
    if (user?.id) {
      console.log('[AUTH] Got user ID directly from user object:', user.id);
      return user.id;
    }
    
    // Next try getting it from session.user
    if (session?.user?.id) {
      console.log('[AUTH] Got user ID from session.user:', session.user.id);
      return session.user.id;
    }
    
    // Finally try from any alternative properties that might contain the ID
    const possibleIdProperties = ['id', 'uid', 'userId', 'user_id', 'sub'];
    for (const prop of possibleIdProperties) {
      if (user && user[prop]) {
        console.log(`[AUTH] Found alternative ID in user.${prop}:`, user[prop]);
        return user[prop];
      }
    }
    
    console.error('[AUTH] Could not find user ID in any expected location');
    return null;
  };

  useEffect(() => {
    console.log('FileUpload component mounted');
    console.log('[DEBUG] Auth state on mount:', { user, session });
    
    const verifyUser = async () => {
      console.log('Verifying user authentication...');
      try {
        const userId = getUserId();
        if (userId) {
          console.log('[AUTH] User authenticated successfully, ID:', userId);
        } else {
          throw new Error('Could not determine user ID');
        }
      } catch (error) {
        console.error('[AUTH] Authentication error:', error);
        addNotification({ title: 'Authentication Error', message: error.message });
        showFormNotification('Authentication error. Please log in again.', 'error');
      }
    };

    verifyUser();
    return () => {
      console.log('FileUpload component unmounted');
    };
  }, [user, session]);

  const handleSaveScript = async () => {
    if (!scriptName.trim() || !scriptContent.trim()) {
      showFormNotification('Script name and content cannot be empty', 'warning');
      return;
    }

    const scriptData = {
      name: scriptName,
      description: scriptDescription,
      content: scriptContent
    };

    try {
      const { data, error } = await supabase
        .from('scripts')
        .insert([scriptData]);

      if (error) throw error;

      showFormNotification('Script saved successfully!', 'success');
      setScriptName('');
      setScriptDescription('');
      setScriptContent('');
    } catch (error) {
      showFormNotification(error.message, 'error');
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={10} >
        <Grid container spacing={2}   justifyContent="center">
          <Grid item xs={12} lg={6} sx={{ width: '30%' }}>
            <Card>
              <VuiBox p={2}>
                <VuiTypography variant="h6" color="white" fontWeight="bold" mb="8px">
                  Upload Script
                </VuiTypography>
                <VuiBox mb={4}>
                  <VuiTypography variant="body2" color="text" fontWeight="regular" mb="16px">
                    You can use the following placeholders in your script content:
                  </VuiTypography>
                  <VuiBox variant="body2" color="text" fontWeight="regular" mb="16px">
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      <li>{"{{REGION}}"}</li>
                      <li>{"{{SALES_REPRESENTATIVE}}"}</li>
                      <li>{"{{SALES_REP_PHONE}}"}</li>
                      <li>{"{{SALES_REP_EMAIL}}"}</li>
                      <li>{"{{PHARMACY_NAME}}"}</li>
                      <li>{"{{PHARMACY_PHONE}}"}</li>
                      <li>{"{{PHARMACIST_NAME}}"}</li>
                      <li>{"{{DISTRICT}}"}</li>
                      <li>{"{{LOCALITY}}"}</li>
                    </ul>
                  </VuiBox>
                </VuiBox>

                {/* In-form notification */}
                <Collapse in={formNotification.open} sx={{ mb: 2, transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  <Alert 
                    severity={formNotification.type}
                    sx={{
                      backgroundColor: formNotification.type === 'success' ? 'rgba(46, 125, 50, 0.3)' : 
                                      formNotification.type === 'error' ? 'rgba(211, 47, 47, 0.3)' : 
                                      formNotification.type === 'warning' ? 'rgba(237, 108, 2, 0.3)' : 
                                      'rgba(2, 136, 209, 0.3)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                      borderRadius: '10px'
                    }}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setFormNotification(prev => ({ ...prev, open: false }))}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    {formNotification.message}
                  </Alert>
                </Collapse>

                <VuiBox mb={4}>
                  <VuiTypography variant="h6" color="white" mb={2}>Script Name</VuiTypography>
                  <VuiInput type="text" value={scriptName} onChange={(e) => setScriptName(e.target.value)} fullWidth />
                </VuiBox>

                <VuiBox mb={4}>
                  <VuiTypography variant="h6" color="white" mb={2}>Script Description</VuiTypography>
                  <VuiInput type="text" value={scriptDescription} onChange={(e) => setScriptDescription(e.target.value)} fullWidth />
                </VuiBox>

                <VuiBox mb={4}>
                  <VuiTypography variant="h6" color="white" mb={2}>Script Content</VuiTypography>
                  <VuiInput type="text" multiline rows={4} value={scriptContent} onChange={(e) => setScriptContent(e.target.value)} fullWidth />
                </VuiBox>

               

                <VuiButton color="info" variant="contained" onClick={handleSaveScript} fullWidth>
                  Save Script
                </VuiButton>
              </VuiBox>
            </Card>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FileUpload;