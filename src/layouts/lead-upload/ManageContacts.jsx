import React, { useState, useEffect } from "react";
import { Card, Grid, CircularProgress, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import VuiBox from "../../components/VuiBox";
import VuiTypography from "../../components/VuiTypography";
import VuiInput from "../../components/VuiInput";
import VuiButton from "../../components/VuiButton";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Table from "../../examples/Tables/Table";
import { columns, useLeadsRows } from "./components/manageTableLeads"; // Import the leads data and columns
import EditLeadModal from './components/EditLeadModal'; // Import the modal component
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BsCheckCircleFill } from "react-icons/bs";
import { supabase } from "../../config/supabaseClient";

function ManageContacts() {
  const {
    rows,
    totalCount,
    loading,
    error,
    pagination,
    setPagination,
    searchQuery,
    setSearchQuery,
    refreshData
  } = useLeadsRows(); // Use the custom hook to get leads data
  
  const [openModal, setOpenModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkEditField, setBulkEditField] = useState('');
  const [bulkEditValue, setBulkEditValue] = useState('');

  // Define handlers for edit and delete actions
  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setOpenModal(true);
  };

  const handleUpdate = (updatedLead) => {
    console.log('Updated lead:', updatedLead);
    // Implement the update logic here, e.g., update the database
    refreshData(); // Refresh data after update
  };

  const handleDelete = async (id) => {
    console.log(`Delete lead with ID: ${id}`);
    try {
      const { error } = await supabase
        .from('uploaded_leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      refreshData(); // Refresh data after delete
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error deleting lead. Please try again.');
    }
  };

  // Bulk action handlers
  const handleBulkSelect = (selectedIds) => {
    setSelectedRows(selectedIds);
  };

  const handleBulkActionClick = (event) => {
    setBulkActionAnchor(event.currentTarget);
  };

  const handleBulkActionClose = () => {
    setBulkActionAnchor(null);
  };

  const handleBulkEditClick = () => {
    setBulkActionAnchor(null);
    setBulkEditOpen(true);
  };

  const handleBulkDeleteClick = () => {
    setBulkActionAnchor(null);
    setConfirmDeleteOpen(true);
  };

  const handleBulkEditSubmit = async () => {
    if (!bulkEditField || !selectedRows.length) return;
    
    try {
      const { error } = await supabase
        .from('uploaded_leads')
        .update({ [bulkEditField]: bulkEditValue })
        .in('id', selectedRows);
      
      if (error) throw error;
      
      setBulkEditOpen(false);
      setBulkEditField('');
      setBulkEditValue('');
      setSelectedRows([]);
      refreshData();
    } catch (error) {
      console.error('Error updating leads:', error);
      alert('Error updating leads. Please try again.');
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (!selectedRows.length) return;
    
    try {
      const { error } = await supabase
        .from('uploaded_leads')
        .delete()
        .in('id', selectedRows);
      
      if (error) throw error;
      
      setConfirmDeleteOpen(false);
      setSelectedRows([]);
      refreshData();
    } catch (error) {
      console.error('Error deleting leads:', error);
      alert('Error deleting leads. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handlePageSizeChange = (event) => {
    setPagination(prev => ({
      ...prev,
      pageSize: Number(event.target.value),
      page: 1 // Reset to first page when changing page size
    }));
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px" p={3}>
                <VuiBox>
                  <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
                    Uploaded Leads
                  </VuiTypography>
                  <VuiBox display="flex" alignItems="center" lineHeight={0}>
                    <BsCheckCircleFill color="green" size="15px" />
                    <VuiTypography variant="button" fontWeight="regular" color="text" ml="5px">
                      &nbsp;<strong>{totalCount}</strong> Total Contacts
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>
                <VuiBox display="flex" alignItems="center" gap={2}>
                  {selectedRows.length > 0 && (
                    <VuiButton
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={handleBulkActionClick}
                      startIcon={selectedRows.length > 0 ? <EditIcon /> : null}
                    >
                      Bulk Actions ({selectedRows.length})
                    </VuiButton>
                  )}
                  <VuiInput
                    placeholder="Search..."
                    icon={{
                      component: <SearchIcon sx={{ color: 'white.main' }} />,
                      direction: "left"
                    }}
                    value={searchInput}
                    onChange={handleSearchChange}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        handleSearchSubmit();
                      }
                    }}
                    sx={({ breakpoints, palette }) => ({
                      [breakpoints.down("sm")]: {
                        maxWidth: "80px",
                      },
                      [breakpoints.only("sm")]: {
                        maxWidth: "80px",
                      },
                      backgroundColor: "info.main !important",
                      "& .MuiInputBase-input": {
                        color: palette.white.main,
                      },
                      "& .MuiInputAdornment-root": {
                        color: palette.white.main,
                      },
                      "& .MuiSvgIcon-root": {
                        color: `${palette.white.main} !important`,
                      }
                    })}
                  />
                </VuiBox>
              </VuiBox>
              <VuiBox
                sx={{
                  flex: 1,
                  overflow: "auto",
                  position: "relative",
                  p: 3,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.3)",
                    },
                  },
                }}
              >
                {loading ? (
                  <VuiBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="300px"
                  >
                    <CircularProgress color="info" />
                  </VuiBox>
                ) : error ? (
                  <VuiBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="300px"
                    flexDirection="column"
                  >
                    <VuiTypography color="error" variant="button" fontWeight="bold" mb={2}>
                      Error loading data
                    </VuiTypography>
                    <VuiTypography color="text" variant="caption">
                      {error}
                    </VuiTypography>
                  </VuiBox>
                ) : rows.length === 0 ? (
                  <VuiBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="300px"
                  >
                    <VuiTypography color="text" variant="button">
                      No data available
                    </VuiTypography>
                  </VuiBox>
                ) : (
                  <>
                    <VuiBox mb={2} display="flex" justifyContent="flex-end">
                      {selectedRows.length > 0 && (
                        <VuiButton
                          variant="contained"
                          color="info"
                          size="small"
                          onClick={handleBulkActionClick}
                          startIcon={<EditIcon />}
                        >
                          Bulk Actions ({selectedRows.length})
                        </VuiButton>
                      )}
                    </VuiBox>
                    <Table
                      columns={columns}
                      rows={rows}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onBulkSelect={handleBulkSelect}
                      selectedRows={selectedRows}
                    />
                  </>
                )}
              </VuiBox>
              <VuiBox mt={2} mb={2} display="flex" justifyContent="center" alignItems="center" gap={2} p={2} flexWrap="wrap">
                <VuiTypography variant="button" color="text">
                  Showing {rows.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0}-
                  {Math.min(pagination.page * pagination.pageSize, totalCount)} of {totalCount} contacts
                </VuiTypography>
                <VuiBox display="flex" alignItems="center" gap={1}>
                  <ArrowBackIcon
                    sx={{ cursor: pagination.page > 1 ? 'pointer' : 'not-allowed', color: pagination.page > 1 ? 'white.main' : 'grey.500' }}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  />
                  <VuiTypography variant="button" color="text">
                    Page {pagination.page} of {pagination.totalPages}
                  </VuiTypography>
                  <ArrowForwardIcon
                    sx={{ cursor: pagination.page < pagination.totalPages ? 'pointer' : 'not-allowed', color: pagination.page < pagination.totalPages ? 'white.main' : 'grey.500' }}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  />
                </VuiBox>
                <VuiBox display="flex" alignItems="center" gap={1}>
                  <VuiTypography variant="button" color="text">
                    Rows per page:
                  </VuiTypography>
                  <VuiBox
                    component="select"
                    value={pagination.pageSize}
                    onChange={handlePageSizeChange}
                    sx={({ palette, borders }) => ({
                      color: palette.text.primary,
                      backgroundColor: palette.background.paper,
                      border: `${borders.borderWidth[1]} solid ${palette.grey[300]}`,
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      '&:focus': {
                        outline: 'none',
                        borderColor: palette.info.main,
                      },
                      '& option': {
                        backgroundColor: palette.background.paper,
                        color: palette.text.primary,
                      }
                    })}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </VuiBox>
                </VuiBox>
              </VuiBox>
            </Card>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
      {selectedLead && (
        <EditLeadModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          lead={selectedLead}
          handleUpdate={handleUpdate}
        />
      )}

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkActionAnchor}
        open={Boolean(bulkActionAnchor)}
        onClose={handleBulkActionClose}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '10px',
            minWidth: '200px',
          }
        }}
      >
        <MenuItem onClick={handleBulkEditClick} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon fontSize="small" color="warning" />
          <VuiTypography variant="button" color="text">
            Edit Selected ({selectedRows.length})
          </VuiTypography>
        </MenuItem>
        <MenuItem onClick={handleBulkDeleteClick} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon fontSize="small" color="error" />
          <VuiTypography variant="button" color="text">
            Delete Selected ({selectedRows.length})
          </VuiTypography>
        </MenuItem>
      </Menu>

      {/* Bulk Edit Dialog */}
      <Dialog
        open={bulkEditOpen}
        onClose={() => setBulkEditOpen(false)}
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
            Edit {selectedRows.length} Selected Contacts
          </VuiTypography>
        </DialogTitle>
        <DialogContent>
          <VuiBox display="flex" flexDirection="column" gap={2} mt={1}>
            <VuiBox>
              <VuiTypography variant="button" color="text" mb={1}>
                Select Field to Edit
              </VuiTypography>
              <VuiBox
                component="select"
                value={bulkEditField}
                onChange={(e) => setBulkEditField(e.target.value)}
                sx={({ palette, borders }) => ({
                  width: '100%',
                  color: palette.text.primary,
                  backgroundColor: palette.background.paper,
                  border: `${borders.borderWidth[1]} solid ${palette.grey[300]}`,
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginTop: '0.5rem',
                  cursor: 'pointer',
                  '&:focus': {
                    outline: 'none',
                    borderColor: palette.info.main,
                  },
                })}
              >
                <option value="">Select a field</option>
                <option value="region">Region</option>
                <option value="sales_representative">Sales Representative</option>
                <option value="sales_rep_phone">Sales Rep Phone</option>
                <option value="sales_rep_email">Sales Rep Email</option>
                <option value="district">District</option>
                <option value="locality">Locality</option>
              </VuiBox>
            </VuiBox>
            
            <VuiBox>
              <VuiTypography variant="button" color="text" mb={1}>
                New Value
              </VuiTypography>
              <VuiInput
                placeholder="Enter new value"
                value={bulkEditValue}
                onChange={(e) => setBulkEditValue(e.target.value)}
                fullWidth
              />
            </VuiBox>
          </VuiBox>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <VuiButton
            color="error"
            variant="outlined"
            onClick={() => setBulkEditOpen(false)}
          >
            Cancel
          </VuiButton>
          <VuiButton
            color="info"
            variant="contained"
            onClick={handleBulkEditSubmit}
            disabled={!bulkEditField || !bulkEditValue}
          >
            Update {selectedRows.length} Contacts
          </VuiButton>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            borderRadius: '15px',
          }
        }}
      >
        <DialogTitle>
          <VuiTypography variant="h6" color="white">
            Confirm Deletion
          </VuiTypography>
        </DialogTitle>
        <DialogContent>
          <VuiTypography variant="button" color="text">
            Are you sure you want to delete {selectedRows.length} selected contacts? This action cannot be undone.
          </VuiTypography>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <VuiButton
            color="info"
            variant="outlined"
            onClick={() => setConfirmDeleteOpen(false)}
          >
            Cancel
          </VuiButton>
          <VuiButton
            color="error"
            variant="contained"
            onClick={handleBulkDeleteConfirm}
          >
            Delete {selectedRows.length} Contacts
          </VuiButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default ManageContacts;
