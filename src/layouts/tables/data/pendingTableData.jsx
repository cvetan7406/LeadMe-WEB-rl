/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiBadge from "../../../components/VuiBadge";
import { supabase } from '../../../config/supabaseClient';
import { useEffect, useState, useCallback } from 'react';

export const generateCampaignRows = (campaigns) => campaigns.map((campaign) => ({
  id: campaign.id,
  name: campaign.name,
  description: campaign.description || "No description",
  status: (
    <VuiBadge
      variant="standard"
      badgeContent={campaign.status}
      color={campaign.status === 'draft' ? 'info' : campaign.status === 'scheduled' ? 'warning' : 'error'}
      size="xs"
      container
      sx={({ palette: { white }, borders: { borderRadius, borderWidth } }) => ({
        border: `${borderWidth[1]} solid`,
        borderRadius: borderRadius.md,
        color: white.main,
      })}
    />
  ),
  start_time: campaign.start_time ? new Date(campaign.start_time).toLocaleDateString() : 'Not scheduled',
  created_at: new Date(campaign.created_at).toLocaleDateString(),
  updated_at: new Date(campaign.updated_at).toLocaleDateString()
}));

export const fetchCampaignsData = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error('No authenticated session found');
    return [];
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', session.user.id)
    .in('status', ['draft', 'scheduled', 'paused'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }

  return data;
};

export const useCampaignRows = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectingAll, setSelectingAll] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const campaigns = await fetchCampaignsData();
      const formattedRows = generateCampaignRows(campaigns);
      setRows(formattedRows);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchAllCampaignIds = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('campaigns')
      .select('id')
      .eq('user_id', session.user.id)
      .in('status', ['draft', 'scheduled', 'paused']);

    if (error) {
      console.error('Error fetching campaign IDs:', error);
      return [];
    }

    return data.map(row => row.id);
  };

  const selectAllCampaigns = async () => {
    setSelectingAll(true);
    try {
      const allIds = await fetchAllCampaignIds();
      setSelectedRows(allIds);
    } catch (error) {
      console.error('Error selecting all campaigns:', error);
    } finally {
      setSelectingAll(false);
    }
  };

  const toggleRowSelection = useCallback((id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  return {
    rows,
    loading,
    error,
    selectedRows,
    setSelectedRows,
    toggleRowSelection,
    selectAllCampaigns,
    selectingAll,
    refreshData: fetchData
  };
};

export const columns = [
  { name: "select", align: "center", label: "" },
  { name: "name", align: "center", label: "Campaign Name" },
  { name: "description", align: "center", label: "Description" },
  { name: "status", align: "center", label: "Status" },
  { name: "start_time", align: "center", label: "Scheduled Date & Time" },
  { name: "created_at", align: "center", label: "Created At" },
  { name: "updated_at", align: "center", label: "Updated At" },
  { name: "edit", align: "center", label: "Edit" },
  { name: "delete", align: "center", label: "Delete" }
];

export default useCampaignRows;
