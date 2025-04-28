import React, { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Grid,
  Alert,
  Collapse,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

// Material UI Icons
import CloseIcon from '@mui/icons-material/Close';

// React Icons
import { IoDocumentText, IoSave, IoList, IoAdd, IoTrash, IoInformationCircleOutline, IoHelpCircleOutline, IoExpand, IoContract } from "react-icons/io5";
import { FaRegEdit, FaRegCopy } from "react-icons/fa";

// Vision UI Components
import VuiBox from '../../components/VuiBox';
import VuiTypography from '../../components/VuiTypography';
import VuiButton from '../../components/VuiButton';
import VuiInput from '../../components/VuiInput';
import VuiBadge from '../../components/VuiBadge';
import VuiAvatar from '../../components/VuiAvatar';

// Layout Components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import Footer from '../../examples/Footer';

function ScriptsManager() {
  const { addNotification } = useNotifications();
  const { user, session } = useAuth();
  
  // Log user info for debugging
  useEffect(() => {
    if (user) {
      console.log('Authenticated user:', user);
      console.log('User ID:', user.id);
    } else {
      console.log('No authenticated user found');
    }
  }, [user]);
  
  // In-form notification state
  const [formNotification, setFormNotification] = useState({ open: false, message: '', type: 'info' });

  // Form state
  const [scriptName, setScriptName] = useState('');
  const [scriptDescription, setScriptDescription] = useState('');
  const [scriptContent, setScriptContent] = useState('');
  const [scriptCategory, setScriptCategory] = useState('');
  const [scriptStatus, setScriptStatus] = useState('active');
  const [scriptTags, setScriptTags] = useState([]);
  const [scriptVersion, setScriptVersion] = useState(1);
  const [newTag, setNewTag] = useState('');
  
  // UI state
  const [activeTab, setActiveTab] = useState(0);
  const [scripts, setScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPlaceholderInfo, setShowPlaceholderInfo] = useState(false);
  const [editorDialogOpen, setEditorDialogOpen] = useState(false);
  const [tempScriptContent, setTempScriptContent] = useState('');
  
  // Predefined categories and statuses
  const categories = [
    "Sales", "Support", "Follow-up", "Introduction", "Closing", "FAQ", "Other"
  ];
  
  const statuses = [
    "draft", "active", "archived"
  ];

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

  // Fetch scripts on component mount
  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      let query = supabase
        .from('scripts')
        .select('*');
      
      // If user is authenticated, filter scripts by user_id
      if (user?.id) {
        query = query.eq('user_id', user.id);
      }
      
      // Order by created_at
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setScripts(data || []);
    } catch (error) {
      console.error('Error fetching scripts:', error);
      showFormNotification('Failed to load scripts. Please try again.', 'error');
    }
  };

  const handleSaveScript = async () => {
    if (!scriptName.trim() || !scriptContent.trim()) {
      showFormNotification('Script name and content cannot be empty', 'warning');
      return;
    }

    try {
      let result;
      
      if (isEditing && selectedScript) {
        // Update existing script
        const scriptData = {
          name: scriptName,
          description: scriptDescription,
          content: scriptContent,
          // These fields will be available after running the SQL to alter the table
          category: scriptCategory,
          status: scriptStatus,
          tags: scriptTags.length > 0 ? scriptTags : null,
          version: parseInt(scriptVersion) + 1, // Increment version on update
          updated_at: new Date().toISOString()
        };
        
        result = await supabase
          .from('scripts')
          .update(scriptData)
          .eq('id', selectedScript.id);
          
        if (result.error) throw result.error;
        showFormNotification('Script updated successfully!', 'success');
      } else {
        // Insert new script
        const scriptData = {
          name: scriptName,
          description: scriptDescription,
          content: scriptContent,
          // Include the authenticated user's ID
          user_id: user?.id,
          // These fields will be available after running the SQL to alter the table
          category: scriptCategory,
          status: scriptStatus,
          tags: scriptTags.length > 0 ? scriptTags : null,
          version: scriptVersion,
          created_at: new Date().toISOString()
        };
        
        result = await supabase
          .from('scripts')
          .insert([scriptData]);
          
        if (result.error) throw result.error;
        showFormNotification('Script saved successfully!', 'success');
      }
      
      // Reset form and refresh scripts list
      resetForm();
      fetchScripts();
    } catch (error) {
      showFormNotification(error.message, 'error');
    }
  };
  
  const handleEditScript = (script) => {
    setScriptName(script.name);
    setScriptDescription(script.description || '');
    setScriptContent(script.content);
    setScriptCategory(script.category || '');
    setScriptStatus(script.status || 'active');
    setScriptTags(script.tags || []);
    setScriptVersion(script.version || 1);
    setSelectedScript(script);
    setIsEditing(true);
    setActiveTab(0); // Switch to edit tab
  };
  
  const handleDuplicateScript = (script) => {
    setScriptName(`${script.name} (Copy)`);
    setScriptDescription(script.description || '');
    setScriptContent(script.content);
    setScriptCategory(script.category || '');
    setScriptStatus('draft'); // Set as draft for duplicates
    setScriptTags(script.tags || []);
    setScriptVersion(1); // Reset version for duplicates
    setSelectedScript(null);
    setIsEditing(false);
    setActiveTab(0); // Switch to edit tab
  };
  
  const handleDeleteScript = async (scriptId) => {
    if (!confirm('Are you sure you want to delete this script?')) return;
    
    try {
      const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', scriptId);
        
      if (error) throw error;
      
      showFormNotification('Script deleted successfully!', 'success');
      fetchScripts();
      
      // Reset form if the deleted script was being edited
      if (selectedScript && selectedScript.id === scriptId) {
        resetForm();
      }
    } catch (error) {
      showFormNotification(error.message, 'error');
    }
  };
  
  const resetForm = () => {
    setScriptName('');
    setScriptDescription('');
    setScriptContent('');
    setScriptCategory('');
    setScriptStatus('active');
    setScriptTags([]);
    setScriptVersion(1);
    setNewTag('');
    setSelectedScript(null);
    setIsEditing(false);
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !scriptTags.includes(newTag.trim())) {
      setScriptTags([...scriptTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setScriptTags(scriptTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={5}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Card sx={{ overflow: 'visible' }}>
              <VuiBox p={3}>
                <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <VuiBox display="flex" alignItems="center">
                    <IoDocumentText size="24px" color="#fff" />
                    <VuiTypography variant="h4" color="white" fontWeight="bold" ml={1}>
                      Call Scripts Manager
                    </VuiTypography>
                  </VuiBox>
                  
                  {activeTab === 1 && (
                    <VuiButton
                      color="info"
                      variant="contained"
                      onClick={() => {
                        resetForm();
                        setActiveTab(0);
                      }}
                      startIcon={<IoAdd size="16px" />}
                    >
                      Create New Script
                    </VuiButton>
                  )}
                </VuiBox>
                
                {/* Tabs Navigation */}
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '10px',
                    padding: '5px',
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#0075FF',
                      height: '3px',
                      borderRadius: '3px'
                    },
                    '& .MuiTab-root': {
                      color: 'rgba(255,255,255,0.6)',
                      '&.Mui-selected': {
                        color: '#fff',
                        fontWeight: 'bold'
                      }
                    }
                  }}
                >
                  <Tab
                    label={
                      <VuiBox display="flex" alignItems="center">
                        {isEditing ? <FaRegEdit size="16px" /> : <IoAdd size="16px" />}
                        <VuiTypography variant="button" color="inherit" fontWeight="regular" ml={1}>
                          {isEditing ? 'Edit Script' : 'Create Script'}
                        </VuiTypography>
                      </VuiBox>
                    }
                  />
                  <Tab
                    label={
                      <VuiBox display="flex" alignItems="center">
                        <IoList size="16px" />
                        <VuiTypography variant="button" color="inherit" fontWeight="regular" ml={1}>
                          My Scripts
                        </VuiTypography>
                        <VuiBox
                          sx={{
                            ml: 1,
                            backgroundColor: '#0075FF',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {scripts.length}
                        </VuiBox>
                      </VuiBox>
                    }
                  />
                </Tabs>
                
                {/* In-form notification */}
                <Collapse in={formNotification.open} sx={{ mb: 3, transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
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
                
                {/* Tab Content */}
                {activeTab === 0 ? (
                  // Create/Edit Script Form
                  <VuiBox>
                    <VuiBox mb={3}>
                      <VuiBox display="flex" alignItems="center" mb={1}>
                        <VuiTypography variant="h6" color="white">Script Name</VuiTypography>
                        <Tooltip title="Give your script a descriptive name">
                          <IconButton size="small" sx={{ ml: 1, color: 'rgba(255,255,255,0.5)' }}>
                            <IoHelpCircleOutline size="16px" />
                          </IconButton>
                        </Tooltip>
                      </VuiBox>
                      <VuiInput
                        type="text"
                        placeholder="Enter script name"
                        value={scriptName}
                        onChange={(e) => setScriptName(e.target.value)}
                        fullWidth
                      />
                    </VuiBox>

                    <VuiBox mb={3}>
                      <VuiTypography variant="h6" color="white" mb={1}>Script Description</VuiTypography>
                      <VuiInput
                        type="text"
                        placeholder="Enter a brief description"
                        value={scriptDescription}
                        onChange={(e) => setScriptDescription(e.target.value)}
                        fullWidth
                      />
                    </VuiBox>
                    
                    <Grid container spacing={2} mb={3}>
                      <Grid item xs={12} md={6}>
                        <VuiBox>
                          <VuiTypography variant="h6" color="white" mb={1}>Category</VuiTypography>
                          <select
                            value={scriptCategory}
                            onChange={(e) => setScriptCategory(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '10px',
                              outline: 'none',
                              appearance: 'menulist-button' // Show dropdown arrow
                            }}
                          >
                            <option value="" style={{ backgroundColor: '#1a2035', color: 'white' }}>Select Category</option>
                            {categories.map(category => (
                              <option key={category} value={category} style={{ backgroundColor: '#1a2035', color: 'white' }}>{category}</option>
                            ))}
                          </select>
                        </VuiBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <VuiBox>
                          <VuiTypography variant="h6" color="white" mb={1}>Status</VuiTypography>
                          <select
                            value={scriptStatus}
                            onChange={(e) => setScriptStatus(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '10px',
                              outline: 'none',
                              appearance: 'menulist-button' // Show dropdown arrow
                            }}
                          >
                            {statuses.map(status => (
                              <option
                                key={status}
                                value={status}
                                style={{ backgroundColor: '#1a2035', color: 'white' }}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </VuiBox>
                      </Grid>
                    </Grid>
                    
                    <VuiBox mb={3}>
                      <VuiTypography variant="h6" color="white" mb={1}>Tags</VuiTypography>
                      <VuiBox display="flex" mb={1}>
                        <VuiInput
                          type="text"
                          placeholder="Add a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          sx={{ flexGrow: 1, marginRight: '8px' }}
                        />
                        <VuiButton
                          color="info"
                          variant="contained"
                          onClick={handleAddTag}
                        >
                          Add
                        </VuiButton>
                      </VuiBox>
                      <VuiBox display="flex" flexWrap="wrap" gap={1}>
                        {scriptTags.map(tag => (
                          <VuiBox
                            key={tag}
                            sx={{
                              backgroundColor: 'rgba(0, 117, 255, 0.2)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {tag}
                            <VuiBox
                              sx={{
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.7 }
                              }}
                              onClick={() => handleRemoveTag(tag)}
                            >
                              ✕
                            </VuiBox>
                          </VuiBox>
                        ))}
                      </VuiBox>
                    </VuiBox>
                    
                    {isEditing && (
                      <VuiBox mb={3}>
                        <VuiTypography variant="h6" color="white" mb={1}>Version</VuiTypography>
                        <VuiInput
                          type="number"
                          value={scriptVersion}
                          onChange={(e) => setScriptVersion(Math.max(1, parseInt(e.target.value) || 1))}
                          fullWidth
                          disabled
                        />
                        <VuiTypography variant="caption" color="text">
                          Version will automatically increment when you update the script
                        </VuiTypography>
                      </VuiBox>
                    )}

                    <VuiBox mb={4}>
                      <VuiBox display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <VuiTypography variant="h6" color="white">Script Content</VuiTypography>
                        <VuiBox>
                          <VuiButton
                            variant="text"
                            color="info"
                            size="small"
                            onClick={() => setShowPlaceholderInfo(!showPlaceholderInfo)}
                            sx={{ mr: 1 }}
                          >
                            <IoInformationCircleOutline size="18px" style={{ marginRight: '4px' }} />
                            Placeholders
                          </VuiButton>
                          <VuiButton
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={() => {
                              setTempScriptContent(scriptContent);
                              setEditorDialogOpen(true);
                            }}
                          >
                            <IoExpand size="16px" style={{ marginRight: '4px' }} />
                            Edit in Full Screen
                          </VuiButton>
                        </VuiBox>
                      </VuiBox>
                      
                      {showPlaceholderInfo && (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            mb: 2,
                            backgroundColor: 'rgba(0, 117, 255, 0.1)',
                            borderRadius: '10px',
                            border: '1px solid rgba(0, 117, 255, 0.2)'
                          }}
                        >
                          <VuiTypography variant="body2" color="white" fontWeight="regular" mb={1}>
                            You can use these placeholders in your script:
                          </VuiTypography>
                          <Grid container spacing={1}>
                            {[
                              "{{REGION}}", "{{SALES_REPRESENTATIVE}}", "{{SALES_REP_PHONE}}",
                              "{{SALES_REP_EMAIL}}", "{{PHARMACY_NAME}}", "{{PHARMACY_PHONE}}",
                              "{{PHARMACIST_NAME}}", "{{DISTRICT}}", "{{LOCALITY}}"
                            ].map((placeholder) => (
                              <Grid item key={placeholder}>
                                <VuiBadge
                                  variant="contained"
                                  color="dark"
                                  size="sm"
                                  container
                                  badgeContent={
                                    <VuiTypography variant="caption" color="white" fontWeight="medium">
                                      {placeholder}
                                    </VuiTypography>
                                  }
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': { opacity: 0.8 }
                                  }}
                                  onClick={() => {
                                    if (editorDialogOpen) {
                                      setTempScriptContent(prev => prev + ' ' + placeholder);
                                    } else {
                                      setScriptContent(prev => prev + ' ' + placeholder);
                                    }
                                  }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                          <VuiTypography variant="caption" color="text" fontWeight="regular" mt={1} display="block">
                            Click on any placeholder to add it to your script
                          </VuiTypography>
                        </Paper>
                      )}
                      
                      {/* Compact preview of script content */}
                      <Card
                        sx={{
                          p: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          }
                        }}
                        onClick={() => {
                          setTempScriptContent(scriptContent);
                          setEditorDialogOpen(true);
                        }}
                      >
                        <VuiBox
                          sx={{
                            maxHeight: '100px',
                            overflow: 'hidden',
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: '40px',
                              background: 'linear-gradient(to bottom, rgba(26, 32, 53, 0), rgba(26, 32, 53, 1))'
                            }
                          }}
                        >
                          <VuiTypography
                            variant="body2"
                            color="text"
                            fontFamily="monospace"
                            sx={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}
                          >
                            {scriptContent || 'Click to add script content...'}
                          </VuiTypography>
                        </VuiBox>
                        <VuiBox display="flex" justifyContent="center" mt={1}>
                          <VuiTypography variant="caption" color="info">
                            Click to edit in full screen
                          </VuiTypography>
                        </VuiBox>
                      </Card>
                      
                      {/* Full-screen editor dialog */}
                      <Dialog
                        open={editorDialogOpen}
                        onClose={() => setEditorDialogOpen(false)}
                        fullWidth
                        maxWidth="md"
                        PaperProps={{
                          sx: {
                            backgroundColor: '#1a2035',
                            backgroundImage: 'linear-gradient(310deg, #1a2035 0%, #1a2035 100%)',
                            color: 'white',
                            minHeight: '70vh'
                          }
                        }}
                      >
                        <DialogTitle>
                          <VuiBox display="flex" justifyContent="space-between" alignItems="center">
                            <VuiTypography variant="h5" color="white">
                              Edit Script Content
                            </VuiTypography>
                            <IconButton
                              onClick={() => setEditorDialogOpen(false)}
                              sx={{ color: 'white' }}
                            >
                              <IoContract size="20px" />
                            </IconButton>
                          </VuiBox>
                        </DialogTitle>
                        <DialogContent>
                          <VuiBox mb={2}>
                            {showPlaceholderInfo && (
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  mb: 2,
                                  backgroundColor: 'rgba(0, 117, 255, 0.1)',
                                  borderRadius: '10px',
                                  border: '1px solid rgba(0, 117, 255, 0.2)'
                                }}
                              >
                                <Grid container spacing={1}>
                                  {[
                                    "{{REGION}}", "{{SALES_REPRESENTATIVE}}", "{{SALES_REP_PHONE}}",
                                    "{{SALES_REP_EMAIL}}", "{{PHARMACY_NAME}}", "{{PHARMACY_PHONE}}",
                                    "{{PHARMACIST_NAME}}", "{{DISTRICT}}", "{{LOCALITY}}"
                                  ].map((placeholder) => (
                                    <Grid item key={placeholder}>
                                      <VuiBadge
                                        variant="contained"
                                        color="dark"
                                        size="sm"
                                        container
                                        badgeContent={
                                          <VuiTypography variant="caption" color="white" fontWeight="medium">
                                            {placeholder}
                                          </VuiTypography>
                                        }
                                        sx={{
                                          cursor: 'pointer',
                                          '&:hover': { opacity: 0.8 }
                                        }}
                                        onClick={() => {
                                          setTempScriptContent(prev => prev + ' ' + placeholder);
                                        }}
                                      />
                                    </Grid>
                                  ))}
                                </Grid>
                              </Paper>
                            )}
                            
                            <VuiInput
                              type="text"
                              multiline
                              rows={15}
                              placeholder="Enter your script content here. Use placeholders for dynamic content."
                              value={tempScriptContent}
                              onChange={(e) => setTempScriptContent(e.target.value)}
                              fullWidth
                              sx={{
                                minHeight: '350px',
                                '& textarea': {
                                  minHeight: '350px',
                                  fontFamily: 'monospace',
                                  fontSize: '0.875rem',
                                  lineHeight: 1.6
                                }
                              }}
                            />
                          </VuiBox>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                          <VuiButton
                            color="light"
                            onClick={() => setEditorDialogOpen(false)}
                          >
                            Cancel
                          </VuiButton>
                          <VuiButton
                            color="info"
                            variant="contained"
                            onClick={() => {
                              setScriptContent(tempScriptContent);
                              setEditorDialogOpen(false);
                            }}
                          >
                            <IoSave size="16px" style={{ marginRight: '4px' }} />
                            Apply Changes
                          </VuiButton>
                        </DialogActions>
                      </Dialog>
                    </VuiBox>

                    <VuiBox display="flex" justifyContent="space-between" mt={4}>
                      <VuiButton
                        color="light"
                        variant="outlined"
                        onClick={resetForm}
                      >
                        Cancel
                      </VuiButton>
                      
                      <VuiButton
                        color="info"
                        variant="contained"
                        onClick={handleSaveScript}
                        startIcon={<IoSave size="16px" />}
                      >
                        {isEditing ? 'Update Script' : 'Save Script'}
                      </VuiButton>
                    </VuiBox>
                  </VuiBox>
                ) : (
                  // Scripts List
                  <VuiBox>
                    {scripts.length > 0 ? (
                      scripts.map((script) => (
                        <Card
                          key={script.id}
                          sx={{
                            mb: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <VuiBox p={2}>
                            <Grid container alignItems="center" spacing={2}>
                              <Grid item xs={12} md={7}>
                                <VuiBox display="flex" alignItems="center">
                                  <VuiAvatar
                                    src=""
                                    alt={script.name}
                                    variant="rounded"
                                    bgColor="info"
                                    size="sm"
                                    shadow="md"
                                  >
                                    <IoDocumentText size="16px" />
                                  </VuiAvatar>
                                  <VuiBox ml={2}>
                                    <VuiTypography variant="button" color="white" fontWeight="medium">
                                      {script.name}
                                    </VuiTypography>
                                    <VuiTypography variant="caption" color="text" display="block">
                                      {script.description || 'No description provided'}
                                    </VuiTypography>
                                    <VuiTypography variant="caption" color="text" fontWeight="regular">
                                      Created: {new Date(script.created_at).toLocaleDateString()}
                                    </VuiTypography>
                                  </VuiBox>
                                </VuiBox>
                              </Grid>
                              <Grid item xs={12} md={5}>
                                <VuiBox display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} gap={1}>
                                  <Tooltip title="Edit Script">
                                    <VuiButton
                                      variant="outlined"
                                      color="info"
                                      size="small"
                                      onClick={() => handleEditScript(script)}
                                    >
                                      <FaRegEdit size="16px" />
                                    </VuiButton>
                                  </Tooltip>
                                  
                                  <Tooltip title="Duplicate Script">
                                    <VuiButton
                                      variant="outlined"
                                      color="light"
                                      size="small"
                                      onClick={() => handleDuplicateScript(script)}
                                    >
                                      <FaRegCopy size="16px" />
                                    </VuiButton>
                                  </Tooltip>
                                  
                                  <Tooltip title="Delete Script">
                                    <VuiButton
                                      variant="outlined"
                                      color="error"
                                      size="small"
                                      onClick={() => handleDeleteScript(script.id)}
                                    >
                                      <IoTrash size="16px" />
                                    </VuiButton>
                                  </Tooltip>
                                </VuiBox>
                              </Grid>
                            </Grid>
                          </VuiBox>
                        </Card>
                      ))
                    ) : (
                      <VuiBox
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        py={6}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: '10px',
                          border: '1px dashed rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <IoDocumentText size="48px" color="rgba(255, 255, 255, 0.3)" />
                        <VuiTypography variant="h6" color="text" fontWeight="regular" mt={2}>
                          No scripts found
                        </VuiTypography>
                        <VuiButton
                          color="info"
                          variant="contained"
                          onClick={() => setActiveTab(0)}
                          sx={{ mt: 2 }}
                          startIcon={<IoAdd size="16px" />}
                        >
                          Create Your First Script
                        </VuiButton>
                      </VuiBox>
                    )}
                  </VuiBox>
                )}
              </VuiBox>
            </Card>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ScriptsManager;