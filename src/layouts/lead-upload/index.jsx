import React, { useState, useEffect } from 'react';
import { Card, Stack, Grid, Alert, Collapse, IconButton } from '@mui/material';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { uploadFile, generateExcelTemplate } from '../../services/fileUploadService';

import CloseIcon from '@mui/icons-material/Close';

import VuiBox from '../../components/VuiBox';
import VuiTypography from '../../components/VuiTypography';
import VuiButton from '../../components/VuiButton';

import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';

import Footer from '../../examples/Footer';

function FileUpload() {
  const [file, setFile] = useState(null);
  const { addNotification } = useNotifications();
  const { user, session } = useAuth();
  
  // In-form notification state
  const [formNotification, setFormNotification] = useState({ open: false, message: '', type: 'info' });

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

  const handleFileChange = (event) => {
    console.log('[FILE] File selection initiated');
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log('[FILE] Selected file:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: `${(selectedFile.size / 1024).toFixed(2)} KB`
      });
    }

    if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || selectedFile.type === 'application/vnd.ms-excel')) {
      console.log('[FILE] Valid Excel file selected');
      setFile(selectedFile);
      showFormNotification(`File "${selectedFile.name}" is ready for upload`, 'success');
    } else {
      console.warn('[FILE] Invalid file type rejected');
      setFile(null);
      showFormNotification('Please upload only Excel files (.xlsx or .xls)', 'error');
    }
  };

  const handleUpload = async () => {
    console.log('[UPLOAD] Upload process initiated');
    
    if (!file) {
      console.warn('[VALIDATION] No file selected');
      showFormNotification('Please select a file first', 'warning');
      return;
    }

    try {
      console.log('[UPLOAD] All validation passed, preparing upload');
      showFormNotification('Uploading leads...', 'info');
      
      // Use the uploadFile service to insert data into the database
      const result = await uploadFile(file);
      
      console.log('[UPLOAD] Upload result:', result);
      
      if (result.success) {
        console.log('[UPLOAD] Leads uploaded successfully');
        showFormNotification(`Leads uploaded successfully!`, 'success');
        setFile(null);
        addNotification({
          title: 'File Uploaded Successful',
          message: `Your file has been uploaded successfully!`
        });
      } else {
        console.error('[UPLOAD] Upload failed:', result.error);
        showFormNotification(result.error || 'Failed to upload file', 'error');
      }
    } catch (error) {
      console.error('[ERROR] Error in handleUpload:', error);
      showFormNotification('Error uploading the file: ' + (error.message || ''), 'error');
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={10}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} lg={6}>
            <Card>
              <VuiBox p={2}>
                <VuiTypography variant="h6" color="white" fontWeight="bold" mb="8px">
                  Upload Leads
                </VuiTypography>
                <VuiTypography variant="body2" color="text" fontWeight="regular" mb="16px">
                  Upload your Excel file (.xlsx or .xls) containing the following columns: 
                </VuiTypography>
                <ul style={{ paddingLeft: '20px', margin: 0, color: 'white' }}>
                  <li>Region</li>
                  <li>Sales Representative</li>
                  <li>Sales Representative Phone</li>
                  <li>Sales Representative Email</li>
                  <li>Pharmacy Name</li>
                  <li>Pharmacy Phone</li>
                  <li>Pharmacist Name</li>
                  <li>District</li>
                  <li>Locality</li>
                </ul>
                <VuiTypography variant="body2" color="text" fontWeight="regular" mb="16px">
                </VuiTypography>

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

                <VuiBox border="2px dashed" borderColor="info.main" borderRadius="lg" p={2} my={6} sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 }, transition: 'opacity 0.2s ease-in-out' }} onClick={() => document.getElementById('file-input').click()}>
                  <input type="file" id="file-input" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleFileChange} />
                  <Stack spacing={1} alignItems="center">
                    <VuiTypography variant="h6" color="white">
                      Drag and drop your file here or click to browse
                    </VuiTypography>
                    {file && <VuiTypography variant="button" color="success">Selected file: {file.name}</VuiTypography>}
                  </Stack>
                </VuiBox>

                {/* <VuiBox mb={4}>
                  <VuiTypography variant="h6" color="white" mb={2}>Campaign Name</VuiTypography>
                  <VuiInput type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} fullWidth />
                </VuiBox> */}

                <VuiButton color="info" variant="contained" onClick={handleUpload} disabled={!file} fullWidth>
                  Upload Leads
                </VuiButton>

                <VuiButton color="warning" variant="contained" onClick={generateExcelTemplate} fullWidth sx={{ mt: 2 }}>
                  Download Template
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