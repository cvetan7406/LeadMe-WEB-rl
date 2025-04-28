import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiInput from "../../../components/VuiInput";
import VuiButton from "../../../components/VuiButton";
import { supabase } from "../../../config/supabaseClient";

function AddLeadModal({ open, handleClose, onLeadAdded }) {
  const [formData, setFormData] = useState({
    region: '',
    sales_representative: '',
    sales_rep_phone: '',
    sales_rep_email: '',
    pharmacy_name: '',
    pharmacy_phone: '',
    pharmacist_name: '',
    district: '',
    locality: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('uploaded_leads')
        .insert([formData]);

      if (error) throw error;

      handleClose();
      onLeadAdded();
      setFormData({
        region: '',
        sales_representative: '',
        sales_rep_phone: '',
        sales_rep_email: '',
        pharmacy_name: '',
        pharmacy_phone: '',
        pharmacist_name: '',
        district: '',
        locality: ''
      });
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Error adding lead. Please try again.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          borderRadius: '15px',
          minWidth: '400px',
        }
      }}
    >
      <DialogTitle>
        <VuiTypography variant="h6" color="white">
          Add New Lead
        </VuiTypography>
      </DialogTitle>
      <DialogContent>
        <VuiBox display="flex" flexDirection="column" gap={2} mt={1}>
          <VuiBox>
            <VuiTypography variant="button" color="text" mb={1}>
              Region
            </VuiTypography>
            <VuiInput
              placeholder="Enter region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              fullWidth
            />
          </VuiBox>

          <VuiBox>
            <VuiTypography variant="button" color="text" mb={1}>
              Sales Representative
            </VuiTypography>
            <VuiInput
              placeholder="Enter sales representative name"
              name="sales_representative"
              value={formData.sales_representative}
              onChange={handleInputChange}
              fullWidth
            />
          </VuiBox>

          <VuiBox>
            <VuiTypography variant="button" color="text" mb={1}>
              Sales Rep Phone
            </VuiTypography>
            <VuiInput
              placeholder="Enter sales rep phone"
              name="sales_rep_phone"
              value={formData.sales_rep_phone}
              onChange={handleInputChange}
              fullWidth
            />
          </VuiBox>

          <VuiBox>
            <VuiTypography variant="button" color="text" mb={1}>
              Sales Rep Email
            </VuiTypography>
            <VuiInput
              placeholder="Enter sales rep email"
              name="sales_rep_email"
              value={formData.sales_rep_email}
              onChange={handleInputChange}
              fullWidth
            />
          </VuiBox>

          <VuiBox>
            <VuiTypography variant="button" color="text" mb={1}>
              Pharmacy Name
            </VuiTypography>
            <VuiInput
              placeholder="Enter pharmacy name"
              name="pharmacy_name"
              value={formData.pharmacy_name}
              onChange={handleInputChange}
              fullWidth
            />
          </VuiBox>

          <VuiBox>
            <VuiTypography variant="button" color="text" mb={1}>
              Pharmacy Phone
            </VuiTypography>
            <VuiInput
              placeholder="Enter pharmacy phone"
              name="pharmacy_phone"
              value={formData.pharmacy_phone}
              onChange={handleInputChange}
              fullWidth
            />
          </VuiBox>

          <VuiBox>
            <VuiTypography variant="button" color="text" mb={1}>
              Pharmacist Name
            </VuiTypography>
            <VuiInput
              placeholder="Enter pharmacist name"
              name="pharmacist_name"
              value={formData.pharmacist_name}
              onChange={handleInputChange}
              fullWidth
            />
          </VuiBox>

          <VuiBox>
            <VuiTypography variant="button" color="text" mb={1}>
              District
            </VuiTypography>
            <VuiInput
              placeholder="Enter district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              fullWidth
            />
          </VuiBox>

          <VuiBox>
            <VuiTypography variant="button" color="text" mb={1}>
              Locality
            </VuiTypography>
            <VuiInput
              placeholder="Enter locality"
              name="locality"
              value={formData.locality}
              onChange={handleInputChange}
              fullWidth
            />
          </VuiBox>
        </VuiBox>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <VuiButton
          color="error"
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </VuiButton>
        <VuiButton
          color="info"
          variant="contained"
          onClick={handleSubmit}
        >
          Add Lead
        </VuiButton>
      </DialogActions>
    </Dialog>
  );
}

export default AddLeadModal;