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

/* eslint-disable react/prop-types */
// Vision UI Dashboard React components
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiAvatar from "../../../components/VuiAvatar";
import VuiBadge from "../../../components/VuiBadge";
import { supabase } from '../../../config/supabaseClient';
import { useEffect, useState } from 'react';

// Images
import avatar1 from "../../../assets/images/avatar1.png";
import avatar2 from "../../../assets/images/avatar2.png";
import avatar3 from "../../../assets/images/avatar3.png";
import avatar4 from "../../../assets/images/avatar4.png";
import avatar5 from "../../../assets/images/avatar5.png";
import avatar6 from "../../../assets/images/avatar6.png";

function Author({ image, name, email }) {
  return (
    <VuiBox display="flex" alignItems="center" px={1} py={0.5}>
      <VuiBox mr={2}>
        <VuiAvatar src={image} alt={name} size="sm" variant="rounded" />
      </VuiBox>
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {name}
        </VuiTypography>
        <VuiTypography variant="caption" color="text">
          {email}
        </VuiTypography>
      </VuiBox>
    </VuiBox>
  );
}

function Function({ job, org }) {
  return (
    <VuiBox display="flex" flexDirection="column">
      <VuiTypography variant="caption" fontWeight="medium" color="white">
        {job}
      </VuiTypography>
      <VuiTypography variant="caption" color="text">
        {org}
      </VuiTypography>
    </VuiBox>
  );
}

export const generateCampaignRows = (campaigns) => campaigns.map((campaign) => ({
  id: campaign.id, // Include ID for selection, editing, and deletion
  name: campaign.name,
  description: campaign.description || "No description",
  status: campaign.status,
  start_time: new Date(campaign.start_time).toLocaleDateString(),
  compliance_settings: JSON.stringify(campaign.compliance_settings),
  created_at: new Date(campaign.created_at).toLocaleDateString(),
  updated_at: new Date(campaign.updated_at).toLocaleDateString(),
}));

export const fetchCampaignsData = async () => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .in('status', ['draft', 'scheduled', 'paused'])
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }

  return data;
};

export const useCampaignRows = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const campaigns = await fetchCampaignsData();
      console.log(campaigns);
      setRows(generateCampaignRows(campaigns));
    };

    fetchData();
  }, []);

  return rows;
};

export const columns = [
  { name: "Campaign Name", align: "left", accessor: "name" },
  { name: "Description", align: "left", accessor: "description" },
  { name: "Status", align: "center", accessor: "status" },
  { name: "Scheduled Date & Time", align: "center", accessor: "start_time" },
  { name: "Created At", align: "center", accessor: "created_at" },
  { name: "Updated At", align: "center", accessor: "updated_at" },
  { name: "Edit", align: "center", accessor: "edit" },
  { name: "Delete", align: "center", accessor: "delete" },
];
