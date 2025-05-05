import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Button,
  Box
} from "@mui/material";

import VuiBox from "../../components/VuiBox";
import VuiTypography from "../../components/VuiTypography";
import VuiInput from "../../components/VuiInput";
import VuiButton from "../../components/VuiButton";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Table from "../../examples/Tables/Table";

// Data
import { columns, useCampaignRows } from "./data/campaignsTableData";

// Icons
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../../config/supabaseClient';

import React, { useState } from "react";

function CustomTables() {
  const {
    rows,
    loading,
    error,
    selectedRows,
    setSelectedRows,
    toggleRowSelection,
    selectAllCampaigns,
    selectingAll,
    refreshData
  } = useCampaignRows();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({ status: "" });
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);

  // Handle edit
  const handleEdit = (row) => {
    setCurrentEditItem(row);
    setEditDialogOpen(true);
  };

  // Handle bulk edit
  const handleBulkEdit = () => {
    setBulkEditDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (currentEditItem) {
      try {
        const { error } = await supabase
          .from('campaigns')
          .update({
            name: currentEditItem.name,
            description: currentEditItem.description
          })
          .eq('id', currentEditItem.id);

        if (error) throw error;
        
        refreshData();
        setEditDialogOpen(false);
        setCurrentEditItem(null);
      } catch (error) {
        console.error('Error updating campaign:', error);
      }
    }
  };

  // Handle save bulk edit
  const handleSaveBulkEdit = async () => {
    try {
      if (bulkEditData.status) {
        const { error } = await supabase
          .from('campaigns')
          .update({ status: bulkEditData.status })
          .in('id', selectedRows);

        if (error) throw error;
        
        refreshData();
      }
      
      setBulkEditDialogOpen(false);
      setBulkEditData({ status: "" });
      setSelectedRows([]);
    } catch (error) {
      console.error('Error bulk updating campaigns:', error);
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    setDeleteIds([id]);
    setDeleteDialogOpen(true);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      setDeleteIds(selectedRows);
      setDeleteDialogOpen(true);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .in('id', deleteIds);

      if (error) throw error;

      refreshData();
      setDeleteDialogOpen(false);
      setDeleteIds([]);
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting campaigns:', error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={10}>
            <Card>
              <VuiBox p={3}>
                <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <VuiTypography variant="lg" color="white" fontSize="18.19px">
                    Completed Campaigns
                  </VuiTypography>
                  
                  <VuiBox display="flex" alignItems="center" gap={2}>
                    <VuiButton
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={selectAllCampaigns}
                      disabled={selectingAll}
                    >
                      {selectingAll ? 'Selecting All...' : 'Select All'}
                    </VuiButton>
                    <VuiInput
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      icon={{ component: <SearchIcon />, direction: "left" }}
                    />
                  </VuiBox>
                </VuiBox>
                
                {selectedRows.length > 0 && (
                  <VuiBox display="flex" gap={2} mb={3}>
                    <VuiButton
                      variant="contained"
                      color="info"
                      onClick={handleBulkEdit}
                      startIcon={<EditIcon />}
                    >
                      Bulk Edit ({selectedRows.length})
                    </VuiButton>
                    <VuiButton
                      variant="contained"
                      color="error"
                      onClick={handleBulkDelete}
                      startIcon={<DeleteIcon />}
                    >
                      Bulk Delete ({selectedRows.length})
                    </VuiButton>
                  </VuiBox>
                )}
                
                <VuiBox>
                  {loading ? (
                    <VuiTypography variant="button" color="white" p={2}>
                      Loading campaigns...
                    </VuiTypography>
                  ) : error ? (
                    <VuiTypography variant="button" color="error" p={2}>
                      {error}
                    </VuiTypography>
                  ) : (
                    <Table
                      columns={columns}
                      rows={rows}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onBulkSelect={toggleRowSelection}
                      selectedRows={selectedRows}
                    />
                  )}
                </VuiBox>
              </VuiBox>
            </Card>
          </Grid>
        </Grid>
      </VuiBox>
      
      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#0f1535',
            color: 'white',
            minWidth: '500px'
          }
        }}
      >
        <DialogTitle>Edit Campaign</DialogTitle>
        <DialogContent>
          <VuiBox mb={2} mt={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular" mb={1} display="block">
              Campaign Name
            </VuiTypography>
            <VuiInput
              fullWidth
              value={currentEditItem?.name || ''}
              onChange={(e) => setCurrentEditItem({...currentEditItem, name: e.target.value})}
            />
          </VuiBox>
          <VuiBox mb={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular" mb={1} display="block">
              Description
            </VuiTypography>
            <VuiInput
              fullWidth
              multiline
              rows={3}
              value={currentEditItem?.description || ''}
              onChange={(e) => setCurrentEditItem({...currentEditItem, description: e.target.value})}
            />
          </VuiBox>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bulk Edit Dialog */}
      <Dialog
        open={bulkEditDialogOpen}
        onClose={() => setBulkEditDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#0f1535',
            color: 'white',
            minWidth: '500px'
          }
        }}
      >
        <DialogTitle>Bulk Edit Campaigns ({selectedRows.length})</DialogTitle>
        <DialogContent>
          <VuiBox mb={2} mt={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular" mb={1} display="block">
              Status (leave empty to keep current values)
            </VuiTypography>
            <Select
              fullWidth
              value={bulkEditData.status}
              onChange={(e) => setBulkEditData({...bulkEditData, status: e.target.value})}
              displayEmpty
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '.MuiSvgIcon-root': { color: 'white' }
              }}
            >
              <MenuItem value="">No change</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </VuiBox>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={() => setBulkEditDialogOpen(false)} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveBulkEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#0f1535',
            color: 'white'
          }
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <VuiTypography variant="button" color="text">
            Are you sure you want to delete {deleteIds.length > 1 ? `these ${deleteIds.length} campaigns` : 'this campaign'}? This action cannot be undone.
          </VuiTypography>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <Footer />
    </DashboardLayout>
  );
}

export default CustomTables;