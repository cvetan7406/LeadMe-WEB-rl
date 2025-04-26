import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

function EditLeadModal({ open, handleClose, lead, handleUpdate }) {
  const [formData, setFormData] = useState(lead);

  useEffect(() => {
    setFormData(lead);
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    handleUpdate(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Lead</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Region"
          name="region"
          value={formData.region || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Sales Representative"
          name="sales_representative"
          value={formData.sales_representative || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Sales Rep Phone"
          name="sales_rep_phone"
          value={formData.sales_rep_phone || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Sales Rep Email"
          name="sales_rep_email"
          value={formData.sales_rep_email || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Pharmacy Name"
          name="pharmacy_name"
          value={formData.pharmacy_name || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Pharmacy Phone"
          name="pharmacy_phone"
          value={formData.pharmacy_phone || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Pharmacist Name"
          name="pharmacist_name"
          value={formData.pharmacist_name || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="District"
          name="district"
          value={formData.district || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Locality"
          name="locality"
          value={formData.locality || ''}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditLeadModal;