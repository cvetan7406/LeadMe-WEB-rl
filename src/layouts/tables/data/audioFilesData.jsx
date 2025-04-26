import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabaseClient';
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiBadge from "../../../components/VuiBadge";
import AudioFileIcon from '@mui/icons-material/AudioFile';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton, Tooltip } from '@mui/material';

// Call status badge component
function CallStatusBadge({ status }) {
  let color = "info";
  
  if (status === "completed") color = "success";
  else if (status === "in-progress") color = "info";
  else if (status === "busy" || status === "failed" || status === "no-answer") color = "error";
  else if (status === "canceled") color = "warning";
  else if (!status) color = "secondary";
  
  return (
    <VuiBadge
      variant="standard"
      badgeContent={(status ? status.charAt(0).toUpperCase() + status.slice(1) : "No Call") || "Unknown"}
      color={color}
      size="xs"
      container
      sx={({ palette: { white, [color]: mainColor }, borders: { borderRadius, borderWidth } }) => ({
        background: color === "secondary" ? "unset" : mainColor.main,
        border: `${borderWidth[1]} solid ${color === "secondary" ? white.main : mainColor.main}`,
        borderRadius: borderRadius.md,
        color: white.main,
      })}
    />
  );
}

// Format phone number for display
function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return 'Unknown';
  
  // Convert to string if it's a number
  const phoneStr = phoneNumber.toString();
  
  // Format as (XXX) XXX-XXXX if 10 digits
  if (phoneStr.length === 10) {
    return `(${phoneStr.substring(0, 3)}) ${phoneStr.substring(3, 6)}-${phoneStr.substring(6)}`;
  }
  
  return phoneStr;
}

// Region badge component
function RegionBadge({ region }) {
  // Assign colors based on region name
  const getRegionColor = (region) => {
    const regionMap = {
      'North': 'info',
      'South': 'warning',
      'East': 'success',
      'West': 'error',
      'Central': 'primary'
    };
    
    return regionMap[region] || 'secondary';
  };
  
  const color = getRegionColor(region);
  
  return (
    <VuiBadge
      variant="standard"
      badgeContent={region || 'Unknown'}
      color={color}
      size="xs"
      container
      sx={({ palette: { white, [color]: mainColor }, borders: { borderRadius, borderWidth } }) => ({
        background: color === "secondary" ? "unset" : mainColor.main,
        border: `${borderWidth[1]} solid ${color === "secondary" ? white.main : mainColor.main}`,
        borderRadius: borderRadius.md,
        color: white.main,
      })}
    />
  );
}

// Hook to fetch audio files data
export const useAudioFilesData = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regionCounts, setRegionCounts] = useState({});
  const [callStatusCounts, setCallStatusCounts] = useState({});

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        // Fetch audio files data
        const { data, error } = await supabase
          .from('audio_files')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        
        // Calculate region counts and call status counts
        const regions = {};
        const statuses = {};
        
        data.forEach(file => {
          const region = file.region || 'Unknown';
          regions[region] = (regions[region] || 0) + 1;
          
          const status = file.call_status || 'No Call';
          statuses[status] = (statuses[status] || 0) + 1;
        });
        
        setRegionCounts(regions);
        setCallStatusCounts(statuses);
        setAudioFiles(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching audio files:', error);
        setLoading(false);
      }
    };
    
    fetchAudioFiles();
  }, []);
  
  return { audioFiles, loading, regionCounts, callStatusCounts };
};

export const audioFilesColumns = [
  { name: "audio", align: "left" },
  { name: "pharmacy", align: "left" },
  { name: "region", align: "center" },
  { name: "contact", align: "left" },
  { name: "call_status", align: "center" },
  { name: "play", align: "center" },
];

export const generateAudioFilesRows = (audioFiles) => 
  audioFiles.map(file => ({
    id: file.id,
    audio: (
      <VuiBox display="flex" alignItems="center">
        <VuiBox mr={2} display="flex" justifyContent="center" alignItems="center" width="45px" height="45px" borderRadius="lg" bgcolor="info.focus" color="white">
          <AudioFileIcon />
        </VuiBox>
        <VuiBox display="flex" flexDirection="column">
          <VuiTypography variant="button" color="white" fontWeight="medium">
            Audio {file.id.substring(0, 8)}...
          </VuiTypography>
          <VuiTypography variant="caption" color="text">
            {file.formatted_tts_text ? (file.formatted_tts_text.substring(0, 20) + '...') : 'No text available'}
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    ),
    pharmacy: (
      <VuiBox display="flex" alignItems="center">
        <LocalPharmacyIcon sx={{ fontSize: 16, marginRight: 1 }} />
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          {file.pharmacy_name || 'Unknown Pharmacy'}
        </VuiTypography>
      </VuiBox>
    ),
    region: <RegionBadge region={file.region} />,
    contact: (
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          {formatPhoneNumber(file.pharmacy_phone)}
        </VuiTypography>
        {file.supervisor_name && (
          <Tooltip title={`Supervisor: ${file.supervisor_name}`}>
            <VuiTypography variant="caption" color="text">
              Sup: {formatPhoneNumber(file.supervisor_phone)}
            </VuiTypography>
          </Tooltip>
        )}
      </VuiBox>
    ),
    call_status: <CallStatusBadge status={file.call_status} />,
    play: file.audio_url ? (
      <IconButton 
        color="primary" 
        size="small"
        onClick={() => window.open(file.audio_url, '_blank')}
      >
        <PlayArrowIcon />
      </IconButton>
    ) : (
      <VuiTypography variant="caption" color="text">
        No audio
      </VuiTypography>
    ),
  }));

// Generate summary data for audio files
export const generateAudioFilesSummary = (regionCounts, callStatusCounts) => {
  const totalFiles = Object.values(regionCounts).reduce((sum, count) => sum + count, 0);
  const successfulCalls = callStatusCounts['completed'] || 0;
  
  return {
    totalFiles,
    regionBreakdown: regionCounts,
    callStatusBreakdown: callStatusCounts,
    successRate: totalFiles > 0 ? Math.round((successfulCalls / totalFiles) * 100) : 0
  };
};