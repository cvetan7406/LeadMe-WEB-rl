import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Stack, 
  Grid, 
  TextField, 
  MenuItem, 
  Alert, 
  Collapse, 
  IconButton, 
  Stepper, 
  Step, 
  StepLabel, 
  Box, 
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  Chip,
  Paper,
  Typography
} from '@mui/material';
import { useNotifications } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../config/supabaseClient';

import VuiBox from '../../../components/VuiBox';
import VuiTypography from '../../../components/VuiTypography';
import VuiButton from '../../../components/VuiButton';

import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';

import Footer from '../../../examples/Footer';

import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import SummarizeIcon from '@mui/icons-material/Summarize';

// Step titles for the wizard
const steps = [
  { label: 'Basic Info', icon: <DescriptionIcon /> },
  { label: 'Target Audience', icon: <GroupIcon /> },
  { label: 'Script & Schedule', icon: <EventIcon /> },
  { label: 'Call Settings', icon: <SettingsIcon /> },
  { label: 'Review & Create', icon: <SummarizeIcon /> }
];

function CreateCampaign() {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [errors, setErrors] = useState({});
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    status: 'draft',
    start_time: '',
    end_time: '',
    script_id: '',
    target_audience: {
      regions: [],
      districts: [],
      all_leads: false
    },
    call_settings: {
      max_attempts: 3,
      retry_interval: 60,
      call_time_start: '09:00',
      call_time_end: '18:00',
      voicemail_enabled: true,
      recording_enabled: true
    },
    metrics: {
      target_completion_rate: 80,
      expected_conversion_rate: 20
    },
    compliance_settings: {
      do_not_call_enabled: true,
      consent_required: true,
      call_recording_disclosure: true,
      compliance_script_id: ''
    }
  });
  const [scripts, setScripts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formNotification, setFormNotification] = useState({ open: false, message: '', type: 'info' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch scripts
        const { data: scriptsData, error: scriptsError } = await supabase
          .from('scripts')
          .select('id, name');

        if (scriptsError) throw scriptsError;
        setScripts(scriptsData || []);

        // Fetch leads for regions and districts
        const { data: leadsData, error: leadsError } = await supabase
          .from('uploaded_leads')
          .select('id, region, district, pharmacy_name');

        if (leadsError) throw leadsError;
        setLeads(leadsData || []);

        // Extract unique regions and districts
        const uniqueRegions = [...new Set(leadsData.map(lead => lead.region).filter(Boolean))];
        const uniqueDistricts = [...new Set(leadsData.map(lead => lead.district).filter(Boolean))];
        
        setRegions(uniqueRegions);
        setDistricts(uniqueDistricts);
      } catch (error) {
        console.error('Error fetching data:', error);
        showFormNotification('Failed to load necessary data. Please try again.', 'error');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCampaignData({
        ...campaignData,
        [parent]: {
          ...campaignData[parent],
          [child]: value
        }
      });
    } else {
      setCampaignData({ ...campaignData, [name]: value });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCampaignData({
        ...campaignData,
        [parent]: {
          ...campaignData[parent],
          [child]: checked
        }
      });
    } else {
      setCampaignData({ ...campaignData, [name]: checked });
    }
  };
  
  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCampaignData({
        ...campaignData,
        [parent]: {
          ...campaignData[parent],
          [child]: value
        }
      });
    } else {
      setCampaignData({ ...campaignData, [name]: value });
    }
  };
  
  const handleSliderChange = (name, value) => {
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCampaignData({
        ...campaignData,
        [parent]: {
          ...campaignData[parent],
          [child]: value
        }
      });
    } else {
      setCampaignData({ ...campaignData, [name]: value });
    }
  };

  const showFormNotification = (message, type = 'info') => {
    setFormNotification({ open: true, message, type });
    setTimeout(() => {
      setFormNotification(prev => ({ ...prev, open: false }));
    }, 8000);
  };
  
  const handleNext = () => {
    // Validate current step
    const currentStepValid = validateStep(activeStep);
    
    if (currentStepValid) {
      const newCompleted = { ...completed };
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const validateStep = (step) => {
    let stepValid = true;
    let newErrors = {};
    
    switch (step) {
      case 0: // Basic Info
        if (!campaignData.name.trim()) {
          newErrors.name = 'Campaign name is required';
          stepValid = false;
        }
        if (!campaignData.description.trim()) {
          newErrors.description = 'Description is required';
          stepValid = false;
        }
        break;
        
      case 1: // Target Audience
        if (!campaignData.target_audience.all_leads && 
            campaignData.target_audience.regions.length === 0 && 
            campaignData.target_audience.districts.length === 0) {
          newErrors['target_audience.regions'] = 'Select at least one region or district, or choose "All Leads"';
          stepValid = false;
        }
        break;
        
      case 2: // Script & Schedule
        if (!campaignData.script_id) {
          newErrors.script_id = 'Script selection is required';
          stepValid = false;
        }
        if (!campaignData.start_time) {
          newErrors.start_time = 'Start time is required';
          stepValid = false;
        }
        break;
        
      case 3: // Call Settings
        // Call settings validation if needed
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return stepValid;
  };

  const handleSubmit = async () => {
    console.log('[CAMPAIGN] Submission initiated');

    // Final validation of all steps
    let allValid = true;
    for (let i = 0; i < steps.length - 1; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setActiveStep(i);
        break;
      }
    }

    if (!allValid) {
      showFormNotification('Please complete all required fields before submitting.', 'error');
      return;
    }

    try {
      // Calculate selected leads based on target audience criteria
      let targetLeadIds = [];
      
      if (campaignData.target_audience.all_leads) {
        targetLeadIds = leads.map(lead => lead.id);
      } else {
        targetLeadIds = leads.filter(lead => {
          const regionMatch = campaignData.target_audience.regions.length === 0 || 
                             campaignData.target_audience.regions.includes(lead.region);
          const districtMatch = campaignData.target_audience.districts.length === 0 || 
                               campaignData.target_audience.districts.includes(lead.district);
          return regionMatch || districtMatch;
        }).map(lead => lead.id);
      }
      
      // Insert campaign
      const { data, error } = await supabase
        .from('campaigns')
        .insert([
          {
            user_id: user.id,
            name: campaignData.name,
            description: campaignData.description,
            status: campaignData.status,
            start_time: campaignData.start_time,
            end_time: campaignData.end_time,
            script_id: campaignData.script_id,
            target_audience: campaignData.target_audience,
            call_settings: campaignData.call_settings,
            metrics: campaignData.metrics,
            compliance_settings: campaignData.compliance_settings,
            target_lead_ids: targetLeadIds
          },
        ])
        .select();

      if (error) throw error;

      showFormNotification('Your campaign has been created successfully!');
      console.log('[CAMPAIGN] Campaign created:', data);
      
      // Reset form after successful submission
      setCampaignData({
        name: '',
        description: '',
        status: 'draft',
        start_time: '',
        end_time: '',
        script_id: '',
        target_audience: {
          regions: [],
          districts: [],
          all_leads: false
        },
        call_settings: {
          max_attempts: 3,
          retry_interval: 60,
          call_time_start: '09:00',
          call_time_end: '18:00',
          voicemail_enabled: true,
          recording_enabled: true
        },
        metrics: {
          target_completion_rate: 80,
          expected_conversion_rate: 20
        },
        compliance_settings: {
          do_not_call_enabled: true,
          consent_required: true,
          call_recording_disclosure: true,
          compliance_script_id: ''
        }
      });
      setActiveStep(0);
      setCompleted({});
    } catch (error) {
      console.error('[CAMPAIGN] Error creating campaign:', error);
      showFormNotification(error.message, 'error');
    }
  };
  
  // Render different form steps based on activeStep
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <TextField
              label="Campaign Name"
              variant="outlined"
              name="name"
              value={campaignData.name}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Description"
              variant="outlined"
              name="description"
              value={campaignData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
              error={!!errors.description}
              helperText={errors.description}
            />
            <TextField
              select
              label="Status"
              variant="outlined"
              name="status"
              value={campaignData.status}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="running">Running</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </Stack>
        );
        
      case 1:
        return (
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={campaignData.target_audience.all_leads}
                  onChange={handleCheckboxChange}
                  name="target_audience.all_leads"
                />
              }
              label="Target All Leads"
            />
            
            {!campaignData.target_audience.all_leads && (
              <>
                <FormControl fullWidth error={!!errors['target_audience.regions']}>
                  <InputLabel id="regions-label">Target Regions</InputLabel>
                  <Select
                    labelId="regions-label"
                    multiple
                    value={campaignData.target_audience.regions}
                    onChange={handleMultiSelectChange}
                    name="target_audience.regions"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {regions.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors['target_audience.regions'] && (
                    <FormHelperText>{errors['target_audience.regions']}</FormHelperText>
                  )}
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel id="districts-label">Target Districts</InputLabel>
                  <Select
                    labelId="districts-label"
                    multiple
                    value={campaignData.target_audience.districts}
                    onChange={handleMultiSelectChange}
                    name="target_audience.districts"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Box>
                  <VuiTypography variant="button" color="text" fontWeight="regular">
                    Estimated Target Audience: {
                      campaignData.target_audience.all_leads ? 
                      leads.length : 
                      leads.filter(lead => {
                        const regionMatch = campaignData.target_audience.regions.length === 0 || 
                                          campaignData.target_audience.regions.includes(lead.region);
                        const districtMatch = campaignData.target_audience.districts.length === 0 || 
                                            campaignData.target_audience.districts.includes(lead.district);
                        return regionMatch || districtMatch;
                      }).length
                    } leads
                  </VuiTypography>
                </Box>
              </>
            )}
          </Stack>
        );
        
      case 2:
        return (
          <Stack spacing={3}>
            <TextField
              select
              label="Script"
              variant="outlined"
              name="script_id"
              value={campaignData.script_id || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.script_id}
              helperText={errors.script_id}
              SelectProps={{
                native: false,
                MenuProps: {
                  PaperProps: {
                    style: { maxHeight: 200, overflowY: 'auto' },
                  },
                },
              }}
            >
              {scripts.length > 0 ? (
                scripts.map((script) => (
                  <MenuItem key={script.id} value={script.id}>
                    {script.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No scripts available</MenuItem>
              )}
            </TextField>
            
            <TextField
              label="Start Time (UTC+3)"
              type="datetime-local"
              variant="outlined"
              name="start_time"
              value={campaignData.start_time}
              onChange={(e) => {
                const formattedDate = e.target.value;
                handleChange({
                  target: {
                    name: 'start_time',
                    value: formattedDate
                  }
                });
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.start_time}
              helperText={errors.start_time || 'Time is in UTC+3 (Europe/Sofia)'}
            />
            
            <TextField
              label="End Time (Optional) (UTC+3)"
              type="datetime-local"
              variant="outlined"
              name="end_time"
              value={campaignData.end_time}
              onChange={(e) => {
                const formattedDate = e.target.value;
                handleChange({
                  target: {
                    name: 'end_time',
                    value: formattedDate
                  }
                });
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="Time is in UTC+3 (Europe/Sofia)"
            />
          </Stack>
        );
        
      case 3:
        return (
          <Stack spacing={3}>
            <VuiTypography variant="h6" color="white" fontWeight="regular">
              Call Attempt Settings
            </VuiTypography>
            
            <Box>
              <VuiTypography variant="button" color="text" fontWeight="regular" mb={1}>
                Maximum Call Attempts: {campaignData.call_settings.max_attempts}
              </VuiTypography>
              <Slider
                value={campaignData.call_settings.max_attempts}
                onChange={(e, value) => handleSliderChange('call_settings.max_attempts', value)}
                step={1}
                marks
                min={1}
                max={10}
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Box>
              <VuiTypography variant="button" color="text" fontWeight="regular" mb={1}>
                Retry Interval (minutes): {campaignData.call_settings.retry_interval}
              </VuiTypography>
              <Slider
                value={campaignData.call_settings.retry_interval}
                onChange={(e, value) => handleSliderChange('call_settings.retry_interval', value)}
                step={15}
                marks
                min={15}
                max={240}
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Divider />
            
            <VuiTypography variant="h6" color="white" fontWeight="regular">
              Call Time Settings
            </VuiTypography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Call Time Start"
                  type="time"
                  variant="outlined"
                  name="call_settings.call_time_start"
                  value={campaignData.call_settings.call_time_start}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Call Time End"
                  type="time"
                  variant="outlined"
                  name="call_settings.call_time_end"
                  value={campaignData.call_settings.call_time_end}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            
            <Divider />
            
            <VuiTypography variant="h6" color="white" fontWeight="regular">
              Additional Settings
            </VuiTypography>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={campaignData.call_settings.voicemail_enabled}
                  onChange={handleCheckboxChange}
                  name="call_settings.voicemail_enabled"
                />
              }
              label="Leave Voicemail if No Answer"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={campaignData.call_settings.recording_enabled}
                  onChange={handleCheckboxChange}
                  name="call_settings.recording_enabled"
                />
              }
              label="Record Calls"
            />
            
            <Divider />
            
            <VuiTypography variant="h6" color="white" fontWeight="regular">
              Compliance Settings
            </VuiTypography>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={campaignData.compliance_settings.do_not_call_enabled}
                  onChange={handleCheckboxChange}
                  name="compliance_settings.do_not_call_enabled"
                />
              }
              label="Respect Do Not Call List"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={campaignData.compliance_settings.consent_required}
                  onChange={handleCheckboxChange}
                  name="compliance_settings.consent_required"
                />
              }
              label="Require Consent Confirmation"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={campaignData.compliance_settings.call_recording_disclosure}
                  onChange={handleCheckboxChange}
                  name="compliance_settings.call_recording_disclosure"
                />
              }
              label="Include Call Recording Disclosure"
            />
          </Stack>
        );
        
      case 4:
        return (
          <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <VuiTypography variant="h6" color="white" fontWeight="bold" mb={2}>
                Campaign Summary
              </VuiTypography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Campaign Name:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {campaignData.name}
                  </VuiTypography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Status:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {campaignData.status.charAt(0).toUpperCase() + campaignData.status.slice(1)}
                  </VuiTypography>
                </Grid>
                
                <Grid item xs={12}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Description:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {campaignData.description}
                  </VuiTypography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Start Time:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {campaignData.start_time ? new Date(campaignData.start_time).toLocaleString() : 'Not set'}
                  </VuiTypography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    End Time:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {campaignData.end_time ? new Date(campaignData.end_time).toLocaleString() : 'Not set'}
                  </VuiTypography>
                </Grid>
                
                <Grid item xs={12}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Script:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {scripts.find(s => s.id === campaignData.script_id)?.name || 'None selected'}
                  </VuiTypography>
                </Grid>
                
                <Grid item xs={12}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Target Audience:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {campaignData.target_audience.all_leads ? 'All Leads' : 
                      `${campaignData.target_audience.regions.length} regions, ${campaignData.target_audience.districts.length} districts`}
                  </VuiTypography>
                </Grid>
                
                <Grid item xs={12}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Estimated Reach:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {campaignData.target_audience.all_leads ? 
                      leads.length : 
                      leads.filter(lead => {
                        const regionMatch = campaignData.target_audience.regions.length === 0 || 
                                          campaignData.target_audience.regions.includes(lead.region);
                        const districtMatch = campaignData.target_audience.districts.length === 0 || 
                                            campaignData.target_audience.districts.includes(lead.district);
                        return regionMatch || districtMatch;
                      }).length} leads
                  </VuiTypography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <VuiTypography variant="h6" color="white" fontWeight="bold" mb={2}>
                Call Settings
              </VuiTypography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Max Attempts:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {campaignData.call_settings.max_attempts}
                  </VuiTypography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Retry Interval:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {campaignData.call_settings.retry_interval} minutes
                  </VuiTypography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Call Hours:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {campaignData.call_settings.call_time_start} - {campaignData.call_settings.call_time_end}
                  </VuiTypography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <VuiTypography variant="button" color="text" fontWeight="bold">
                    Features:
                  </VuiTypography>
                  <VuiTypography variant="button" color="white" fontWeight="regular" ml={1}>
                    {[
                      campaignData.call_settings.voicemail_enabled ? 'Voicemail' : null,
                      campaignData.call_settings.recording_enabled ? 'Call Recording' : null
                    ].filter(Boolean).join(', ')}
                  </VuiTypography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        );
        
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox p={3}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Card sx={{ borderRadius: "20px" }}>
              <VuiBox p={3}>
                <VuiTypography variant="h5" color="white" fontWeight="bold" mb={2}>
                  Create New Campaign
                </VuiTypography>
                
                <Collapse in={formNotification.open} sx={{ mb: 2 }}>
                  <Alert severity={formNotification.type} action={
                    <IconButton aria-label="close" color="inherit" size="small" onClick={() => setFormNotification(prev => ({ ...prev, open: false }))}>
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }>
                    {formNotification.message}
                  </Alert>
                </Collapse>
                
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                  {steps.map((step, index) => (
                    <Step key={index} completed={completed[index]}>
                      <StepLabel
                        StepIconProps={{
                          icon: step.icon
                        }}
                      >
                        {step.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                
                <VuiBox mb={4}>
                  {renderStepContent(activeStep)}
                </VuiBox>
                
                <VuiBox display="flex" justifyContent="space-between">
                  <VuiButton
                    color="white"
                    variant="outlined"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    startIcon={<ArrowBackIcon />}
                  >
                    Back
                  </VuiButton>
                  
                  {activeStep === steps.length - 1 ? (
                    <VuiButton
                      color="info"
                      variant="contained"
                      onClick={handleSubmit}
                      endIcon={<CheckCircleOutlineIcon />}
                    >
                      Create Campaign
                    </VuiButton>
                  ) : (
                    <VuiButton
                      color="info"
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </VuiButton>
                  )}
                </VuiBox>
              </VuiBox>
            </Card>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CreateCampaign;
