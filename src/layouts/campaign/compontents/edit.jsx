import React, { useState, useEffect } from 'react';
import { Grid, Card, Stack, IconButton, Collapse, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem } from '@mui/material';
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiButton from "../../../components/VuiButton";
import VuiInput from "../../../components/VuiInput";
import CloseIcon from '@mui/icons-material/Close';

function EditCampaign({ open, handleClose, campaignData, handleSave }) {
  const [formData, setFormData] = useState(campaignData || {});
  const [formNotification, setFormNotification] = useState({ open: false, message: '', type: 'info' });

  useEffect(() => {
    if (campaignData) {
      setFormData(campaignData);
    }
  }, [campaignData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    handleSave(formData);
    setFormNotification({ open: true, message: 'Campaign updated successfully!', type: 'success' });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#0f1535',
          width: '50%',
          maxWidth: 'none',
          borderRadius: 10,
        },
      }}
    >
      <DialogTitle>
        <VuiTypography variant="h6" color="primary">
          Edit Campaign
        </VuiTypography>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: 'inherit',
          color: 'background.paper',
          p: 3,
        }}
      >
        <VuiBox m={2}>
          <VuiBox mb={4}>
            <VuiTypography variant="h6" color="text.secondary" mb={2}>Campaign Name</VuiTypography>
            <VuiInput
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              fullWidth
              sx={{
                backgroundColor: 'background.paper',
                color: 'text.primary',
                borderRadius: 10,
                padding: '10px',
              }}
            />
          </VuiBox>

          <VuiBox mb={4}>
            <VuiTypography variant="h6" color="text.secondary" mb={2}>Description</VuiTypography>
            <VuiInput
              type="text"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              fullWidth
              sx={{
                backgroundColor: 'background.paper',
                color: 'text.primary',
                borderRadius: 10,
                padding: '10px',
              }}
            />
          </VuiBox>

          <VuiBox mb={4}>
            <VuiTypography variant="h6" color="text.secondary" mb={2}>Status</VuiTypography>
            <Select
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              fullWidth={true}
              sx={{
                backgroundColor: 'background.paper',
                color: 'text.primary',
                zIndex: 1500,
              }}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="running">Running</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </VuiBox>

          <VuiBox mb={4}>
            <VuiTypography variant="h6" color="text.secondary" mb={2}>Scheduled Date & Time</VuiTypography>
            <VuiInput
              type="datetime-local"
              name="start_time"
              value={formData.start_time || ''}
              onChange={handleChange}
              fullWidth
              sx={{
                backgroundColor: 'background.paper',
                color: 'text.primary',
                borderRadius: 10,
                padding: '10px',
              }}
            />
          </VuiBox>
        </VuiBox>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: 'background.default' }}>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCampaign;
