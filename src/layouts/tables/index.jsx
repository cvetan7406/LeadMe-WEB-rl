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

// React import
import React, { useState, useEffect, useMemo } from "react";

// @mui material components
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
import authorsTableData from "../../layouts/tables/data/authorsTableData";
import projectsTableData from "../../layouts/tables/data/projectsTableData";

// Icons
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Tables() {
  const { columns, rows } = authorsTableData;
  const { columns: prCols, rows: prRows } = projectsTableData;

  // Active tab state
  const [activeTab, setActiveTab] = useState("campaign-stats");

  // Search state
  const [authorsSearchQuery, setAuthorsSearchQuery] = useState("");
  const [projectsSearchQuery, setProjectsSearchQuery] = useState("");
  
  // Selection state
  const [selectedAuthorsRows, setSelectedAuthorsRows] = useState([]);
  const [selectedProjectsRows, setSelectedProjectsRows] = useState([]);
  
  // Pagination state for Authors table
  const [authorsPage, setAuthorsPage] = useState(1);
  const [authorsRowsPerPage, setAuthorsRowsPerPage] = useState(5);
  
  // Pagination state for Projects table
  const [projectsPage, setProjectsPage] = useState(1);
  const [projectsRowsPerPage, setProjectsRowsPerPage] = useState(5);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);
  const [bulkEditType, setBulkEditType] = useState(''); // 'authors' or 'projects'
  const [bulkEditData, setBulkEditData] = useState({ status: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);
  const [deleteType, setDeleteType] = useState(''); // 'authors' or 'projects'

  // Filter authors rows based on search query
  const filteredAuthorsRows = useMemo(() => {
    if (!authorsSearchQuery.trim()) return rows;
    
    const lowercaseQuery = authorsSearchQuery.toLowerCase();
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
  }, [rows, authorsSearchQuery]);

  // Filter projects rows based on search query
  const filteredProjectsRows = useMemo(() => {
    if (!projectsSearchQuery.trim()) return prRows;
    
    const lowercaseQuery = projectsSearchQuery.toLowerCase();
    return prRows.filter(row => {
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
  }, [prRows, projectsSearchQuery]);

  // Calculate paginated rows for Authors table
  const paginatedAuthorsRows = useMemo(() => {
    const startIndex = (authorsPage - 1) * authorsRowsPerPage;
    const endIndex = startIndex + authorsRowsPerPage;
    return filteredAuthorsRows.slice(startIndex, endIndex);
  }, [filteredAuthorsRows, authorsPage, authorsRowsPerPage]);

  // Calculate paginated rows for Projects table
  const paginatedProjectsRows = useMemo(() => {
    const startIndex = (projectsPage - 1) * projectsRowsPerPage;
    const endIndex = startIndex + projectsRowsPerPage;
    return filteredProjectsRows.slice(startIndex, endIndex);
  }, [filteredProjectsRows, projectsPage, projectsRowsPerPage]);

  // Calculate total pages for Authors table
  const authorsTotalPages = Math.ceil(filteredAuthorsRows.length / authorsRowsPerPage);
  
  // Calculate total pages for Projects table
  const projectsTotalPages = Math.ceil(filteredProjectsRows.length / projectsRowsPerPage);

  // Handle page change for Authors table
  const handleAuthorsPageChange = (event, newPage) => {
    setAuthorsPage(newPage);
  };

  // Handle rows per page change for Authors table
  const handleAuthorsRowsPerPageChange = (event) => {
    setAuthorsRowsPerPage(parseInt(event.target.value, 10));
    setAuthorsPage(1); // Reset to first page when changing rows per page
  };

  // Handle page change for Projects table
  const handleProjectsPageChange = (event, newPage) => {
    setProjectsPage(newPage);
  };

  // Handle rows per page change for Projects table
  const handleProjectsRowsPerPageChange = (event) => {
    setProjectsRowsPerPage(parseInt(event.target.value, 10));
    setProjectsPage(1); // Reset to first page when changing rows per page
  };
  
  // Handle bulk selection for Authors table
  const handleAuthorsSelect = (selectedIds) => {
    setSelectedAuthorsRows(selectedIds);
  };
  
  // Handle bulk selection for Projects table
  const handleProjectsSelect = (selectedIds) => {
    setSelectedProjectsRows(selectedIds);
  };
  
  // Handle edit for either table
  const handleEdit = (item, type) => {
    setCurrentEditItem({ ...item, type });
    setEditDialogOpen(true);
  };
  
  // Handle bulk edit
  const handleBulkEdit = (type) => {
    setBulkEditType(type);
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
    console.log('Saving bulk edit for type:', bulkEditType);
    console.log('Bulk edit data:', bulkEditData);
    
    if (bulkEditType === 'authors') {
      console.log('Selected authors:', selectedAuthorsRows);
    } else {
      console.log('Selected projects:', selectedProjectsRows);
    }
    
    // Close the dialog
    setBulkEditDialogOpen(false);
    setBulkEditData({ status: "" });
    
    // Clear selections
    if (bulkEditType === 'authors') {
      setSelectedAuthorsRows([]);
    } else {
      setSelectedProjectsRows([]);
    }
  };
  
  // Handle delete
  const handleDelete = (id, type) => {
    setDeleteIds([id]);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };
  
  // Handle bulk delete
  const handleBulkDelete = (type) => {
    if (type === 'authors' && selectedAuthorsRows.length > 0) {
      setDeleteIds(selectedAuthorsRows);
      setDeleteType('authors');
      setDeleteDialogOpen(true);
    } else if (type === 'projects' && selectedProjectsRows.length > 0) {
      setDeleteIds(selectedProjectsRows);
      setDeleteType('projects');
      setDeleteDialogOpen(true);
    }
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    // In a real application, you would delete the items from the database here
    console.log('Deleting items:', deleteIds);
    console.log('Delete type:', deleteType);
    
    // Close the dialog
    setDeleteDialogOpen(false);
    setDeleteIds([]);
    
    // Clear selections
    if (deleteType === 'authors') {
      setSelectedAuthorsRows([]);
    } else {
      setSelectedProjectsRows([]);
    }
  };

  // Import components
  const CampaignStats = React.lazy(() => import('./components/CampaignStats'));
  const CallRecordings = React.lazy(() => import('./components/CallRecordings'));
  const UploadedLeads = React.lazy(() => import('./components/UploadedLeads'));
  const FileStorage = React.lazy(() => import('./components/FileStorage'));
  const AudioFiles = React.lazy(() => import('./components/AudioFiles'));

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "campaign-stats":
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading campaign statistics...</VuiBox>}>
            <CampaignStats />
          </React.Suspense>
        );
      case "call-recordings":
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading call recordings...</VuiBox>}>
            <CallRecordings />
          </React.Suspense>
        );
      case "uploaded-leads":
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading uploaded leads...</VuiBox>}>
            <UploadedLeads />
          </React.Suspense>
        );
      case "file-storage":
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading file storage data...</VuiBox>}>
            <FileStorage />
          </React.Suspense>
        );
      case "audio-files":
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading audio files data...</VuiBox>}>
            <AudioFiles />
          </React.Suspense>
        );
      case "authors-table":
        return renderAuthorsTable();
      case "projects-table":
        return renderProjectsTable();
      default:
        return (
          <React.Suspense fallback={<VuiBox p={3}>Loading campaign statistics...</VuiBox>}>
            <CampaignStats />
          </React.Suspense>
        );
    }
  };

  // Render authors table
  const renderAuthorsTable = () => {
    return (
      <Card>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px" p={3}>
          <VuiTypography variant="lg" color="white">
            Authors table
          </VuiTypography>
          
          {/* Search for Authors table */}
          <VuiBox width="40%">
            <VuiInput
              placeholder="Search authors..."
              value={authorsSearchQuery}
              onChange={(e) => setAuthorsSearchQuery(e.target.value)}
              icon={{ component: <SearchIcon />, direction: "left" }}
            />
          </VuiBox>
        </VuiBox>
              
              {/* Bulk Actions for Authors */}
              {selectedAuthorsRows.length > 0 && (
                <VuiBox display="flex" gap={2} mb={3} px={3}>
                  <VuiButton
                    variant="contained"
                    color="info"
                    onClick={() => handleBulkEdit('authors')}
                    startIcon={<EditIcon />}
                  >
                    Bulk Edit ({selectedAuthorsRows.length})
                  </VuiButton>
                  <VuiButton
                    variant="contained"
                    color="error"
                    onClick={() => handleBulkDelete('authors')}
                    startIcon={<DeleteIcon />}
                  >
                    Bulk Delete ({selectedAuthorsRows.length})
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
                }}
                p={3}
              >
                <Table
                  columns={columns}
                  rows={paginatedAuthorsRows}
                  onBulkSelect={handleAuthorsSelect}
                  selectedRows={selectedAuthorsRows}
                  onEdit={(item) => handleEdit(item, 'authors')}
                  onDelete={(id) => handleDelete(id, 'authors')}
                />
                
                {/* Pagination for Authors table */}
                <VuiBox display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                  <Box display="flex" alignItems="center">
                    <VuiTypography variant="button" color="text" mr={1}>
                      Rows per page:
                    </VuiTypography>
                    <Select
                      value={authorsRowsPerPage}
                      onChange={handleAuthorsRowsPerPageChange}
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
                    count={authorsTotalPages}
                    page={authorsPage}
                    onChange={handleAuthorsPageChange}
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
  };

  // Render projects table
  const renderProjectsTable = () => {
    return (
      <Card>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          <VuiTypography variant="lg" color="white">
            Projects table
          </VuiTypography>
          
          {/* Search for Projects table */}
          <VuiBox width="40%">
            <VuiInput
              placeholder="Search projects..."
              value={projectsSearchQuery}
              onChange={(e) => setProjectsSearchQuery(e.target.value)}
              icon={{ component: <SearchIcon />, direction: "left" }}
            />
          </VuiBox>
        </VuiBox>
              
              {/* Bulk Actions for Projects */}
              {selectedProjectsRows.length > 0 && (
                <VuiBox display="flex" gap={2} mb={3} px={3}>
                  <VuiButton
                    variant="contained"
                    color="info"
                    onClick={() => handleBulkEdit('projects')}
                    startIcon={<EditIcon />}
                  >
                    Bulk Edit ({selectedProjectsRows.length})
                  </VuiButton>
                  <VuiButton
                    variant="contained"
                    color="error"
                    onClick={() => handleBulkDelete('projects')}
                    startIcon={<DeleteIcon />}
                  >
                    Bulk Delete ({selectedProjectsRows.length})
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
                }}
                p={3}
              >
                <Table
                  columns={prCols}
                  rows={paginatedProjectsRows}
                  onBulkSelect={handleProjectsSelect}
                  selectedRows={selectedProjectsRows}
                  onEdit={(item) => handleEdit(item, 'projects')}
                  onDelete={(id) => handleDelete(id, 'projects')}
                />
                
                {/* Pagination for Projects table */}
                <VuiBox display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                  <Box display="flex" alignItems="center">
                    <VuiTypography variant="button" color="text" mr={1}>
                      Rows per page:
                    </VuiTypography>
                    <Select
                      value={projectsRowsPerPage}
                      onChange={handleProjectsRowsPerPageChange}
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
                    count={projectsTotalPages}
                    page={projectsPage}
                    onChange={handleProjectsPageChange}
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
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        {/* Navigation Tabs */}
        <Card mb={3}>
          <VuiBox p={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <VuiBox
              component="button"
              onClick={() => handleTabChange("campaign-stats")}
              bgcolor={activeTab === "campaign-stats" ? "primary.main" : "transparent"}
              color="white"
              borderRadius="lg"
              px={2}
              py={1.5}
              mx={1}
              mb={1}
              sx={{ border: 'none', cursor: 'pointer' }}
            >
              <VuiTypography variant="button" color="white" fontWeight="medium">
                Campaign Stats
              </VuiTypography>
            </VuiBox>
            
            <VuiBox
              component="button"
              onClick={() => handleTabChange("call-recordings")}
              bgcolor={activeTab === "call-recordings" ? "primary.main" : "transparent"}
              color="white"
              borderRadius="lg"
              px={2}
              py={1.5}
              mx={1}
              mb={1}
              sx={{ border: 'none', cursor: 'pointer' }}
            >
              <VuiTypography variant="button" color="white" fontWeight="medium">
                Call Recordings
              </VuiTypography>
            </VuiBox>
            
            <VuiBox
              component="button"
              onClick={() => handleTabChange("uploaded-leads")}
              bgcolor={activeTab === "uploaded-leads" ? "primary.main" : "transparent"}
              color="white"
              borderRadius="lg"
              px={2}
              py={1.5}
              mx={1}
              mb={1}
              sx={{ border: 'none', cursor: 'pointer' }}
            >
              <VuiTypography variant="button" color="white" fontWeight="medium">
                Uploaded Leads
              </VuiTypography>
            </VuiBox>
            
            <VuiBox
              component="button"
              onClick={() => handleTabChange("file-storage")}
              bgcolor={activeTab === "file-storage" ? "primary.main" : "transparent"}
              color="white"
              borderRadius="lg"
              px={2}
              py={1.5}
              mx={1}
              mb={1}
              sx={{ border: 'none', cursor: 'pointer' }}
            >
              <VuiTypography variant="button" color="white" fontWeight="medium">
                File Storage
              </VuiTypography>
            </VuiBox>
            
            <VuiBox
              component="button"
              onClick={() => handleTabChange("audio-files")}
              bgcolor={activeTab === "audio-files" ? "primary.main" : "transparent"}
              color="white"
              borderRadius="lg"
              px={2}
              py={1.5}
              mx={1}
              mb={1}
              sx={{ border: 'none', cursor: 'pointer' }}
            >
              <VuiTypography variant="button" color="white" fontWeight="medium">
                Audio Files
              </VuiTypography>
            </VuiBox>
            
            <VuiBox
              component="button"
              onClick={() => handleTabChange("authors-table")}
              bgcolor={activeTab === "authors-table" ? "primary.main" : "transparent"}
              color="white"
              borderRadius="lg"
              px={2}
              py={1.5}
              mx={1}
              mb={1}
              sx={{ border: 'none', cursor: 'pointer' }}
            >
              <VuiTypography variant="button" color="white" fontWeight="medium">
                Authors Table
              </VuiTypography>
            </VuiBox>
            
            <VuiBox
              component="button"
              onClick={() => handleTabChange("projects-table")}
              bgcolor={activeTab === "projects-table" ? "primary.main" : "transparent"}
              color="white"
              borderRadius="lg"
              px={2}
              py={1.5}
              mx={1}
              mb={1}
              sx={{ border: 'none', cursor: 'pointer' }}
            >
              <VuiTypography variant="button" color="white" fontWeight="medium">
                Projects Table
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </Card>
        
        {/* Tab Content */}
        {renderTabContent()}
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
        <DialogTitle>Edit {currentEditItem?.type === 'authors' ? 'Author' : 'Project'}</DialogTitle>
        <DialogContent>
          <VuiBox mb={2} mt={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular" mb={1} display="block">
              {currentEditItem?.type === 'authors' ? 'Name' : 'Project Name'}
            </VuiTypography>
            <VuiInput
              fullWidth
              placeholder={currentEditItem?.type === 'authors' ? 'Author Name' : 'Project Name'}
            />
          </VuiBox>
          <VuiBox mb={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular" mb={1} display="block">
              Status
            </VuiTypography>
            <Select
              fullWidth
              defaultValue="online"
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
          Bulk Edit {bulkEditType === 'authors' ? 'Authors' : 'Projects'} ({bulkEditType === 'authors' ? selectedAuthorsRows.length : selectedProjectsRows.length})
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

export default Tables;
