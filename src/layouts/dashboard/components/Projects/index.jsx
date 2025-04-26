/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master/LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../../config/supabaseClient";
import { useFilters } from "../../../../context/FilterContext";
import VuiPagination from "../../../../components/VuiPagination";
import CircularProgress from "@mui/material/CircularProgress";
import PaginationItem from "@mui/material/PaginationItem";
import Icon from "@mui/material/Icon";
import VuiInput from "../../../../components/VuiInput";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// @mui material components
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BsCheckCircleFill } from "react-icons/bs";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Vision UI Dashboard React components
import VuiBox from "../../../../components/VuiBox";
import VuiTypography from "../../../../components/VuiTypography";

// Vision UI Dashboard Materail-UI example components
import Table from "../../../../examples/Tables/Table";

function Projects() {
  const { filters, updateFilters } = useFilters();
  const [rows, setRows] = useState([]);
  const [menu, setMenu] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    console.log('Fetching data with filters:', filters);
    
    try {
      const startRange = (filters.page - 1) * filters.pageSize;
      const endRange = filters.page * filters.pageSize - 1;

      const { data, error, count } = await supabase
        .from('uploaded_leads')
        .select('*', { count: 'exact' })
        .range(startRange, endRange);
      
      console.log('Query response:', { data, error, count });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedRows = data.map(item => ({
          region: String(item.region || ''),
          sales_representative: String(item.sales_representative || ''),
          sales_rep_phone: String(item.sales_rep_phone || ''),
          sales_rep_email: String(item.sales_rep_email || ''),
          pharmacy_name: String(item.pharmacy_name || ''),
          pharmacy_phone: String(item.pharmacy_phone || ''),
          pharmacist_name: String(item.pharmacist_name || ''),
          district: String(item.district || ''),
          locality: String(item.locality || '')
        }));
        
        console.log('Formatted rows:', formattedRows);
        setRows(formattedRows);
        setTotalCount(count || 0);
        setTotalPages(Math.ceil((count || 10) / filters.pageSize));
      } else {
        console.log('No data returned');
        setRows([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setRows([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { name: "Region", accessor: "region", align: "left" },
    { name: "Sales Representative", accessor: "sales_representative", align: "left" },
    { name: "Sales Rep Phone", accessor: "sales_rep_phone", align: "left" },
    { name: "Sales Rep Email", accessor: "sales_rep_email", align: "left" },
    { name: "Pharmacy Name", accessor: "pharmacy_name", align: "left" },
    { name: "Pharmacy Phone", accessor: "pharmacy_phone", align: "left" },
    { name: "Pharmacist Name", accessor: "pharmacist_name", align: "left" },
    { name: "District", accessor: "district", align: "left" },
    { name: "Locality", accessor: "locality", align: "left" },
  ];

  const openMenu = ({ currentTarget }) => {
    setMenu(currentTarget);
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setMenu(null);
    setIsMenuOpen(false);
  };

  const handleDownload = () => {
    const csvContent = [
      ['Region', 'Sales Representative', 'Sales Rep Phone', 'Sales Rep Email', 'Pharmacy Name', 'Pharmacy Phone', 'Pharmacist Name', 'District', 'Locality'],
      ...rows.filter(row =>
        Object.values(row).some(value =>
          value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ).map(row => [
        row.region,
        row.sales_representative,
        row.sales_rep_phone,
        row.sales_rep_email,
        row.pharmacy_name,
        row.pharmacy_phone,
        row.pharmacist_name,
        row.district,
        row.locality
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'filtered_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={handleDownload}>Download Selected Data</MenuItem>
    </Menu>
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRows = rows.filter(row =>
    Object.values(row).some(value =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Card
      sx={{
        height: "520px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="32px">
        <VuiBox mb="auto">
          <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
            Uploaded Campaign Contacts
          </VuiTypography>
          <VuiBox display="flex" alignItems="center" lineHeight={0}>
            <BsCheckCircleFill color="green" size="15px" />
            <VuiTypography variant="button" fontWeight="regular" color="text" ml="5px">
              &nbsp;<strong>{totalCount}</strong> Total Contacts ({filteredRows.length} shown)
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <VuiBox display="flex" alignItems="center" ml="auto">
          <VuiInput
            placeholder="Search..."
            icon={{
              component: <SearchIcon sx={{ color: 'white.main' }} />,
              direction: "left"
            }}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                setSearchQuery(searchInput);
                fetchData();
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
          <VuiBox color="text" px={2}>
            <ExpandMoreIcon
              sx={{
                cursor: "pointer",
                fontWeight: "bold",
                transition: "transform 0.3s",
                transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
              fontSize="large"
              onClick={isMenuOpen ? closeMenu : openMenu}
            />
          </VuiBox>
        </VuiBox>
        {renderMenu}
      </VuiBox>
      <VuiBox
        sx={{
          flex: 1,
          overflow: "auto",
          position: "relative",
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
          "& .MuiTableContainer-root": {
            maxWidth: "100%",
            overflowX: "auto",
          },
          "& .MuiTable-root": {
            minWidth: "100%",
            tableLayout: "fixed",
          },
          "& th": {
            borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
              `${borderWidth[1]} solid ${grey[700]}`,
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          "& td": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
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
          <VuiBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress color="info" />
          </VuiBox>
        ) : error ? (
          <VuiBox
            display="flex"
            justifyContent="center"
            alignItems="center" 
            height="100%"
            flexDirection="column"
            p={3}
          >
            <VuiTypography color="error" variant="button" fontWeight="bold" mb={2}>
              Error loading data
            </VuiTypography>
            <VuiTypography color="text" variant="caption">
              {error}
            </VuiTypography>
            <VuiButton 
              color="info" 
              variant="contained" 
              onClick={fetchData} 
              sx={{ mt: 2 }}
            >
              Retry
            </VuiButton>
          </VuiBox>
        ) : filteredRows.length === 0 ? (
          <VuiBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <VuiTypography color="text" variant="button">
              No data available
            </VuiTypography>
          </VuiBox>
        ) : (
          <Table columns={columns} rows={filteredRows} />
        )}
      </VuiBox>
      <VuiBox mt={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <ArrowBackIcon
          sx={{ cursor: 'pointer', color: 'white.main' }}
          onClick={() => {
            if (filters.page > 1) {
              updateFilters({ page: filters.page - 1 });
            }
          }}
        />
        <VuiTypography variant="button" color="text">
          Page {filters.page} of {totalPages}
        </VuiTypography>
        <ArrowForwardIcon
          sx={{ cursor: 'pointer', color: 'white.main' }}
          onClick={() => {
            if (filters.page < totalPages) {
              updateFilters({ page: filters.page + 1 });
            }
          }}
        />
        <VuiBox display="flex" alignItems="center" gap={1}>
          <VuiTypography variant="button" color="text">
            Rows per page:
          </VuiTypography>
          <VuiBox
            component="select"
            value={filters.pageSize}
            onChange={(e) => updateFilters({ pageSize: Number(e.target.value), page: 1 })}
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
  );
}

export default Projects;
