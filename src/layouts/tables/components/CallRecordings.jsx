import { useState, useEffect } from "react";
import { Card, Grid, Skeleton, Pagination, Box, Select, MenuItem } from "@mui/material";
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiInput from "../../../components/VuiInput";
import Table from "../../../examples/Tables/Table";
import { useCallRecordingsData, callRecordingsColumns, generateCallRecordingsRows } from "../data/callRecordingsData";
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import MicIcon from '@mui/icons-material/Mic';

function CallRecordings() {
  const { recordings, loading } = useCallRecordingsData();
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedRows, setDisplayedRows] = useState([]);

  // Process recordings data when loaded
  useEffect(() => {
    if (!loading && recordings.length > 0) {
      const generatedRows = generateCallRecordingsRows(recordings);
      setRows(generatedRows);
      setFilteredRows(generatedRows);
    }
  }, [loading, recordings]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRows(rows);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = rows.filter(row => {
        // Convert row values to string and check if any contains the search query
        return Object.values(row).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(lowercaseQuery);
          } else if (value && typeof value === 'object') {
            // Try to search in React components' text content
            const stringified = JSON.stringify(value);
            return stringified.toLowerCase().includes(lowercaseQuery);
          }
          return false;
        });
      });
      setFilteredRows(filtered);
    }
    setPage(1); // Reset to first page on search
  }, [searchQuery, rows]);

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
    <VuiBox mb={3}>
      <Grid container spacing={3}>
        
        {/* Stats Cards */}
        <Grid item xs={12} md={6} lg={4}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          ) : (
            <Card>
              <VuiBox p={2}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <VuiBox>
                      <VuiTypography variant="button" color="text" fontWeight="medium">
                        Total Recordings
                      </VuiTypography>
                      <VuiBox display="flex" alignItems="center">
                        <VuiTypography variant="h4" fontWeight="bold" color="white">
                          {recordings.length}
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>
                  </Grid>
                  <Grid item xs={4}>
                    <VuiBox
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="4.5rem"
                      height="4.5rem"
                      borderRadius="xl"
                      bgcolor="info.focus"
                      color="white"
                      shadow="md"
                      ml="auto"
                    >
                      <MicIcon fontSize="large" />
                    </VuiBox>
                  </Grid>
                </Grid>
              </VuiBox>
            </Card>
          )}
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          ) : (
            <Card>
              <VuiBox p={2}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <VuiBox>
                      <VuiTypography variant="button" color="text" fontWeight="medium">
                        Average Duration
                      </VuiTypography>
                      <VuiBox display="flex" alignItems="center">
                        <VuiTypography variant="h4" fontWeight="bold" color="white">
                          {recordings.length > 0 
                            ? `${Math.round(recordings.reduce((sum, rec) => sum + (rec.duration || 0), 0) / recordings.length)} sec`
                            : '0 sec'
                          }
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>
                  </Grid>
                  <Grid item xs={4}>
                    <VuiBox
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="4.5rem"
                      height="4.5rem"
                      borderRadius="xl"
                      bgcolor="success.focus"
                      color="white"
                      shadow="md"
                      ml="auto"
                    >
                      <PhoneIcon fontSize="large" />
                    </VuiBox>
                  </Grid>
                </Grid>
              </VuiBox>
            </Card>
          )}
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          ) : (
            <Card>
              <VuiBox p={2}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <VuiBox>
                      <VuiTypography variant="button" color="text" fontWeight="medium">
                        Latest Recording
                      </VuiTypography>
                      <VuiBox display="flex" alignItems="center">
                        <VuiTypography variant="h4" fontWeight="bold" color="white">
                          {recordings.length > 0 
                            ? new Date(recordings[0].inserted_at).toLocaleDateString()
                            : 'None'
                          }
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>
                  </Grid>
                  <Grid item xs={4}>
                    <VuiBox
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="4.5rem"
                      height="4.5rem"
                      borderRadius="xl"
                      bgcolor="warning.focus"
                      color="white"
                      shadow="md"
                      ml="auto"
                    >
                      <MicIcon fontSize="large" />
                    </VuiBox>
                  </Grid>
                </Grid>
              </VuiBox>
            </Card>
          )}
        </Grid>
        
        {/* Recordings Table */}
        <Grid item xs={12}>
          <Card>
            <VuiBox p={3}>
              <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <VuiTypography variant="lg" color="white">
                  Call Recordings
                </VuiTypography>
                
                {/* Search Bar */}
                <VuiBox width="40%">
                  <VuiInput
                    placeholder="Search recordings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={{ component: <SearchIcon />, direction: "left" }}
                  />
                </VuiBox>
              </VuiBox>
              
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
              >
                {loading ? (
                  <Skeleton variant="rectangular" height={300} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
                ) : (
                  <>
                    <Table
                      columns={callRecordingsColumns}
                      rows={displayedRows}
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
  );
}

export default CallRecordings;