
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box
} from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "../../components/VuiBox";
import VuiTypography from "../../components/VuiTypography";
import VuiInput from "../../components/VuiInput";
import VuiButton from "../../components/VuiButton";

// Vision UI Dashboard React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Table from "../../examples/Tables/Table";

// Data
import { columns, useCampaignRows, fetchCampaignsData } from "../../layouts/tables/data/pendingTableData.jsx";

// Icons
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../../config/supabaseClient';

import React, { useEffect, useState } from "react";

function PendingCapaign() {
  const [allRows, setAllRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [displayedRows, setDisplayedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  
  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({ status: "" });
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);

  // Fetch campaigns data
  useEffect(() => {
    const fetchData = async () => {
      const campaigns = await fetchCampaignsData();
      // Add id to each row for selection tracking
      const rowsWithIds = campaigns.map(campaign => ({
        ...campaign,
        id: campaign.id,
        name: campaign.name,
        description: campaign.description || "No description",
        status: campaign.status,
        start_time: new Date(campaign.start_time).toLocaleDateString(),
        compliance_settings: JSON.stringify(campaign.compliance_settings),
        created_at: new Date(campaign.created_at).toLocaleDateString(),
        updated_at: new Date(campaign.updated_at).toLocaleDateString(),
      }));
      
      setAllRows(rowsWithIds);
      setFilteredRows(rowsWithIds);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Update displayed rows when filtered rows or pagination changes
  useEffect(() => {
    if (filteredRows.length > 0) {
      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      setDisplayedRows(filteredRows.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(filteredRows.length / rowsPerPage));
    } else {
      setDisplayedRows([]);
      setTotalPages(1);
    }
  }, [filteredRows, page, rowsPerPage]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRows(allRows);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = allRows.filter(row =>
        row.name.toLowerCase().includes(lowercaseQuery) ||
        row.description.toLowerCase().includes(lowercaseQuery) ||
        row.status.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredRows(filtered);
    }
    setPage(1); // Reset to first page on search
  }, [searchQuery, allRows]);

  // Handle bulk selection
  const handleBulkSelect = (selectedIds) => {
    setSelectedRows(selectedIds);
  };

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
            description: currentEditItem.description,
            status: currentEditItem.status,
          })
          .eq('id', currentEditItem.id);

        if (error) throw error;

        // Update local state
        const updatedRows = allRows.map(row =>
          row.id === currentEditItem.id ? { ...row, ...currentEditItem } : row
        );
        setAllRows(updatedRows);
        setFilteredRows(updatedRows);
        
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
      // Only update fields that are not empty
      const updateData = {};
      if (bulkEditData.status) updateData.status = bulkEditData.status;
      
      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('campaigns')
          .update(updateData)
          .in('id', selectedRows);

        if (error) throw error;

        // Update local state
        const updatedRows = allRows.map(row =>
          selectedRows.includes(row.id)
            ? { ...row, ...updateData, status: updateData.status || row.status }
            : row
        );
        setAllRows(updatedRows);
        setFilteredRows(updatedRows);
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

      // Update local state
      const remainingRows = allRows.filter(row => !deleteIds.includes(row.id));
      setAllRows(remainingRows);
      setFilteredRows(remainingRows);
      
      setDeleteDialogOpen(false);
      setDeleteIds([]);
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting campaigns:', error);
    }
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox mb={5} p={3} display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={10}>
            <Card>
              <VuiBox p={3}>
                <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <VuiTypography variant="lg" color="white">
                    Pending Campaigns
                  </VuiTypography>
                  
                  {/* Search Bar */}
                  <VuiBox width="40%">
                    <VuiInput
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      icon={{ component: <SearchIcon />, direction: "left" }}
                    />
                  </VuiBox>
                </VuiBox>
                
                {/* Bulk Actions */}
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
                  ) : (
                    <>
                      <Table
                        columns={columns}
                        rows={displayedRows}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onBulkSelect={handleBulkSelect}
                        selectedRows={selectedRows}
                      />
                      
                      {/* Pagination */}
                      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                        <Box display="flex" alignItems="center">
                          <VuiTypography variant="button" color="text" mr={1}>
                            Rows per page:
                          </VuiTypography>
                          <Select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            size="small"
                            sx={{
                              color: 'white',
                              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                              '.MuiSvgIcon-root': { color: 'white' }
                            }}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                          </Select>
                        </Box>
                        
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          sx={{
                            '.MuiPaginationItem-root': {
                              color: 'white',
                            },
                            '.Mui-selected': {
                              backgroundColor: 'primary.main',
                            }
                          }}
                        />
                      </VuiBox>
                    </>
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
          <VuiBox mb={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular" mb={1} display="block">
              Status
            </VuiTypography>
            <Select
              fullWidth
              value={currentEditItem?.status || ''}
              onChange={(e) => setCurrentEditItem({...currentEditItem, status: e.target.value})}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '.MuiSvgIcon-root': { color: 'white' }
              }}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
            </Select>
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
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
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

export default PendingCapaign;
