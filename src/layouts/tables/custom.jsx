import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import {
  Pagination,
  Box,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
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
import useCampaignsData from "./data/campaignsTableData";
import { useState, useMemo, useEffect } from "react";

// Icons
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CustomTables() {
  const { columns, rows } = useCampaignsData();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selection state
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);
  const [bulkEditType, setBulkEditType] = useState('campaigns');
  const [bulkEditData, setBulkEditData] = useState({ status: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);
  const [deleteType, setDeleteType] = useState('campaigns');

  // Filter authors rows based on search query
  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    return rows.filter(row => {
      // Check if any field contains the search query
      return Object.values(row).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowercaseQuery);
        } else if (value && typeof value === 'object' && value.props && value.props.children) {
          // Try to search in React components' text content
          const childrenText = JSON.stringify(value.props.children);
          return childrenText.toLowerCase().includes(lowercaseQuery);
        }
        return false;
      });
    });
  }, [rows, searchQuery]);

  // Calculate paginated rows
  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, page, rowsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page when changing rows per page
  };
  
  // Handle bulk selection
  const handleSelect = (selectedIds) => {
    setSelectedRows(selectedIds);
  };
  
  // Handle edit
  const handleEdit = (item) => {
    setCurrentEditItem({ ...item, type: 'campaigns' });
    setEditDialogOpen(true);
  };
  
  // Handle bulk edit
  const handleBulkEdit = () => {
    setBulkEditDialogOpen(true);
  };
  
  // Handle save edit
  const handleSaveEdit = () => {
    // In a real application, you would save the changes to the database here
    console.log('Saving edit for item:', currentEditItem);
    
    // Close the dialog
    setEditDialogOpen(false);
    setCurrentEditItem(null);
  };
  
  // Handle save bulk edit
  const handleSaveBulkEdit = () => {
    // In a real application, you would save the changes to the database here
    console.log('Saving bulk edit for campaigns');
    console.log('Bulk edit data:', bulkEditData);
    console.log('Selected rows:', selectedRows);
    
    // Close the dialog
    setBulkEditDialogOpen(false);
    setBulkEditData({ status: "" });
    
    // Clear selections
    setSelectedRows([]);
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
  const handleConfirmDelete = () => {
    // In a real application, you would delete the items from the database here
    console.log('Deleting items:', deleteIds);
    
    // Close the dialog
    setDeleteDialogOpen(false);
    setDeleteIds([]);
    
    // Clear selections
    setSelectedRows([]);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ overflow: 'hidden' }}>
              <VuiBox display="flex" justifyContent="space-between" alignItems="center" p={3} pb={0}>
                <VuiTypography variant="lg" color="white">
                  Completed Campaigns
                </VuiTypography>
                
                {/* Search for Campaigns table */}
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
                <VuiBox display="flex" gap={2} mt={2} px={3}>
                  <VuiButton
                    variant="contained"
                    color="info"
                    onClick={() => handleBulkEdit('campaigns')}
                    startIcon={<EditIcon />}
                  >
                    Bulk Edit ({selectedRows.length})
                  </VuiButton>
                  <VuiButton
                    variant="contained"
                    color="error"
                    onClick={() => handleBulkDelete('campaigns')}
                    startIcon={<DeleteIcon />}
                  >
                    Bulk Delete ({selectedRows.length})
                  </VuiButton>
                </VuiBox>
              )}
              
              <VuiBox
                sx={{
                  "& th": {
                    borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                      `${borderWidth[1]} solid ${grey[700]}`,
                  },
                  "& .MuiTableRow-root:not(:last-child)": {
                    "& td": {
                      borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                        `${borderWidth[1]} solid ${grey[700]}`,
                    },
                  },
                  "& .MuiTableCell-root": {
                    padding: "12px 24px",
                  }
                }}
                p={3}
                mt={2}
              >
                <Table
                  columns={columns}
                  rows={paginatedRows}
                  onBulkSelect={handleSelect}
                  selectedRows={selectedRows}
                  onEdit={(item) => handleEdit(item, 'campaigns')}
                  onDelete={(id) => handleDelete(id, 'campaigns')}
                />
                
                {/* Pagination */}
                <VuiBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={3}
                  sx={{
                    borderTop: ({ borders: { borderWidth }, palette: { grey } }) =>
                      `${borderWidth[1]} solid ${grey[700]}`,
                    pt: 2
                  }}
                >
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
              placeholder="Campaign Name"
              value={currentEditItem?.campaign?.props?.name || ''}
              onChange={(e) => setCurrentEditItem({
                ...currentEditItem,
                campaign: {
                  ...currentEditItem.campaign,
                  props: {
                    ...currentEditItem.campaign.props,
                    name: e.target.value
                  }
                }
              })}
            />
          </VuiBox>
          <VuiBox mb={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular" mb={1} display="block">
              Status
            </VuiTypography>
            <Select
              fullWidth
              value={currentEditItem?.status?.props?.badgeContent?.toLowerCase() || ''}
              onChange={(e) => setCurrentEditItem({
                ...currentEditItem,
                status: {
                  ...currentEditItem.status,
                  props: {
                    ...currentEditItem.status.props,
                    badgeContent: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
                  }
                }
              })}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '.MuiSvgIcon-root': { color: 'white' }
              }}
            >
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
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
        <DialogTitle>
          Bulk Edit Campaigns ({selectedRows.length})
        </DialogTitle>
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
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
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
            Are you sure you want to delete {deleteIds.length > 1 ? `these ${deleteIds.length} items` : 'this item'}? This action cannot be undone.
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