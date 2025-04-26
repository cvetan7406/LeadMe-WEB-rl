import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabaseClient';
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiBadge from "../../../components/VuiBadge";
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Tooltip } from '@mui/material';

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

// Hook to fetch uploaded leads data
export const useUploadedLeadsData = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [regionCounts, setRegionCounts] = useState({});

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // Fetch total count
        const { count, error: countError } = await supabase
          .from('uploaded_leads')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        setTotalCount(count || 0);
        
        // Fetch leads data
        const { data, error } = await supabase
          .from('uploaded_leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        
        // Calculate region counts
        const regions = {};
        data.forEach(lead => {
          const region = lead.region || 'Unknown';
          regions[region] = (regions[region] || 0) + 1;
        });
        
        setRegionCounts(regions);
        setLeads(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching uploaded leads:', error);
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, []);
  
  return { leads, loading, totalCount, regionCounts };
};

export const uploadedLeadsColumns = [
  { name: "pharmacy", align: "left" },
  { name: "pharmacist", align: "left" },
  { name: "region", align: "center" },
  { name: "location", align: "left" },
  { name: "contact", align: "left" },
  { name: "sales_rep", align: "left" },
];

export const generateUploadedLeadsRows = (leads) => 
  leads.map(lead => ({
    id: lead.id,
    pharmacy: (
      <VuiBox display="flex" alignItems="center">
        <VuiBox mr={2} display="flex" justifyContent="center" alignItems="center" width="45px" height="45px" borderRadius="lg" bgcolor="info.focus" color="white">
          <LocalPharmacyIcon />
        </VuiBox>
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {lead.pharmacy_name || 'Unknown Pharmacy'}
        </VuiTypography>
      </VuiBox>
    ),
    pharmacist: (
      <VuiBox display="flex" alignItems="center">
        <PersonIcon sx={{ fontSize: 16, marginRight: 1 }} />
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          {lead.pharmacist_name || 'Unknown'}
        </VuiTypography>
      </VuiBox>
    ),
    region: <RegionBadge region={lead.region} />,
    location: (
      <Tooltip title={`${lead.district || ''}, ${lead.locality || ''}`}>
        <VuiBox display="flex" alignItems="center">
          <LocationOnIcon sx={{ fontSize: 16, marginRight: 1 }} />
          <VuiTypography variant="caption" color="white" fontWeight="medium">
            {lead.locality || 'Unknown'}
          </VuiTypography>
        </VuiBox>
      </Tooltip>
    ),
    contact: (
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          {formatPhoneNumber(lead.pharmacy_phone)}
        </VuiTypography>
      </VuiBox>
    ),
    sales_rep: (
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          {lead.sales_representative || 'Unassigned'}
        </VuiTypography>
        <VuiTypography variant="caption" color="text">
          {lead.sales_rep_email || ''}
        </VuiTypography>
      </VuiBox>
    ),
  }));

// Generate summary data for the leads
export const generateLeadsSummary = (totalCount, regionCounts) => {
  return {
    totalLeads: totalCount,
    regionBreakdown: regionCounts,
    // Add more summary metrics as needed
  };
};