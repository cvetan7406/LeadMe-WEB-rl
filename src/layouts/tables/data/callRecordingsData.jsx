import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabaseClient';
import axios from 'axios';
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiBadge from "../../../components/VuiBadge";
import VuiAvatar from "../../../components/VuiAvatar";
import PhoneIcon from '@mui/icons-material/Phone';
import MicIcon from '@mui/icons-material/Mic';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { IconButton } from '@mui/material';

// Call status badge component
function CallStatusBadge({ status }) {
  let color = "info";
  
  if (status === "completed") color = "success";
  else if (status === "in-progress") color = "info";
  else if (status === "busy" || status === "failed" || status === "no-answer") color = "error";
  else if (status === "canceled") color = "warning";
  
  return (
    <VuiBadge
      variant="standard"
      badgeContent={status.charAt(0).toUpperCase() + status.slice(1)}
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
  
  // Format as (XXX) XXX-XXXX if 10 digits
  if (phoneNumber.length === 10) {
    return `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX if more than 10 digits
  if (phoneNumber.length > 10) {
    const countryCode = phoneNumber.substring(0, phoneNumber.length - 10);
    const areaCode = phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length - 7);
    const prefix = phoneNumber.substring(phoneNumber.length - 7, phoneNumber.length - 4);
    const lineNumber = phoneNumber.substring(phoneNumber.length - 4);
    return `+${countryCode} (${areaCode}) ${prefix}-${lineNumber}`;
  }
  
  return phoneNumber;
}

// Format duration in seconds to MM:SS
function formatDuration(seconds) {
  if (!seconds) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Hook to fetch call recordings data directly from Twilio API
export const useCallRecordingsData = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCallsAndRecordings = async () => {
      try {
        // First, fetch calls from the API
        const callsResponse = await axios.get('/api/calls', {
          headers: {
            'X-API-Key': import.meta.env.VITE_API_KEY || 'your-api-key'
          }
        });
        
        if (!callsResponse.data || !Array.isArray(callsResponse.data)) {
          throw new Error('Invalid response from calls API');
        }
        
        // Filter calls that have recordings
        const callsWithRecordings = callsResponse.data.filter(call => call.has_recordings);
        
        // Fetch recordings for each call with recordings
        const recordingsPromises = callsWithRecordings.map(async (call) => {
          try {
            const recordingsResponse = await axios.get(`/api/call-recordings/${call.sid}`, {
              headers: {
                'X-API-Key': import.meta.env.VITE_API_KEY || 'your-api-key'
              }
            });
            
            if (!recordingsResponse.data || !Array.isArray(recordingsResponse.data)) {
              return null;
            }
            
            // Map recordings to include call data
            return recordingsResponse.data.map(recording => ({
              ...recording,
              twilio_calls: call
            }));
          } catch (error) {
            console.error(`Error fetching recordings for call ${call.sid}:`, error);
            return null;
          }
        });
        
        // Wait for all recording requests to complete
        const recordingsResults = await Promise.all(recordingsPromises);
        
        // Flatten and filter out null results
        const allRecordings = recordingsResults
          .filter(result => result !== null)
          .flat();
        
        setRecordings(allRecordings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching calls and recordings:', error);
        setLoading(false);
      }
    };
    
    fetchCallsAndRecordings();
  }, []);
  
  return { recordings, loading };
};

export const callRecordingsColumns = [
  { name: "recording", align: "left" },
  { name: "phone", align: "left" },
  { name: "status", align: "center" },
  { name: "duration", align: "center" },
  { name: "date", align: "center" },
  { name: "play", align: "center" },
];

export const generateCallRecordingsRows = (recordings) => 
  recordings.map(recording => {
    const call = recording.twilio_calls;
    return {
      id: recording.recording_sid,
      recording: (
        <VuiBox display="flex" alignItems="center">
          <VuiBox mr={2} display="flex" justifyContent="center" alignItems="center" width="45px" height="45px" borderRadius="lg" bgcolor="info.focus" color="white">
            <MicIcon />
          </VuiBox>
          <VuiBox display="flex" flexDirection="column">
            <VuiTypography variant="button" color="white" fontWeight="medium">
              Recording {recording.recording_sid.substring(0, 8)}...
            </VuiTypography>
            <VuiTypography variant="caption" color="text">
              Call {call?.sid.substring(0, 8)}...
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      ),
      phone: (
        <VuiBox display="flex" flexDirection="column">
          <VuiTypography variant="caption" fontWeight="medium" color="white">
            To: {formatPhoneNumber(call?.to_number)}
          </VuiTypography>
          <VuiTypography variant="caption" color="text">
            From: {formatPhoneNumber(call?.from_number)}
          </VuiTypography>
        </VuiBox>
      ),
      status: call ? <CallStatusBadge status={call.status} /> : null,
      duration: (
        <VuiBox display="flex" alignItems="center">
          <AccessTimeIcon sx={{ fontSize: 16, marginRight: 1 }} />
          <VuiTypography variant="caption" color="white" fontWeight="medium">
            {formatDuration(recording.duration)}
          </VuiTypography>
        </VuiBox>
      ),
      date: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          {new Date(recording.inserted_at).toLocaleDateString()}
        </VuiTypography>
      ),
      play: (
        <IconButton
          color="primary"
          size="small"
          onClick={() => window.open(recording.media_url, '_blank')}
        >
          <PlayArrowIcon />
        </IconButton>
      ),
    };
  });