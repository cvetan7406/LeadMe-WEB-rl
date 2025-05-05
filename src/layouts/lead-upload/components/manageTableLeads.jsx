import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../config/supabaseClient';

// Function to format the data for the table
export const generateLeadsRows = (leads, selectedIds = []) => {
  console.log('Formatting leads:', leads); // Debug log
  return leads.map((lead) => {
    const row = {
      id: lead.id,
      region: lead.region || '',
      sales_representative: lead.sales_representative || '',
      sales_rep_phone: lead.sales_rep_phone || '',
      sales_rep_email: lead.sales_rep_email || '',
      pharmacy_name: lead.pharmacy_name || '',
      pharmacy_phone: lead.pharmacy_phone || '',
      pharmacist_name: lead.pharmacist_name || '',
      district: lead.district || '',
      locality: lead.locality || '',
      created_at: lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ''
    };
    console.log('Generated row:', row); // Debug log
    return row;
  });
};

// Function to fetch data from the uploaded_leads table with pagination and search
export const fetchLeadsData = async ({ page = 1, pageSize = 10, searchQuery = '' }) => {
  try {
    console.log('Fetching leads with params:', { page, pageSize, searchQuery }); // Debug log
    
    // Calculate range for pagination
    const startRange = (page - 1) * pageSize;
    const endRange = page * pageSize - 1;
    
    let query = supabase
      .from('uploaded_leads')
      .select('*', { count: 'exact' });
    
    // Add search filter if searchQuery is provided
    if (searchQuery) {
      query = query.or(
        `region.ilike.%${searchQuery}%,` +
        `sales_representative.ilike.%${searchQuery}%,` +
        `sales_rep_phone.ilike.%${searchQuery}%,` +
        `sales_rep_email.ilike.%${searchQuery}%,` +
        `pharmacy_name.ilike.%${searchQuery}%,` +
        `pharmacy_phone.ilike.%${searchQuery}%,` +
        `pharmacist_name.ilike.%${searchQuery}%,` +
        `district.ilike.%${searchQuery}%,` +
        `locality.ilike.%${searchQuery}%`
      );
    }
    
    // Add pagination
    query = query
      .order('created_at', { ascending: false })
      .range(startRange, endRange);
    
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
      return { data: [], count: 0 };
    }

    console.log('Fetched data:', data); // Debug log
    console.log('Total count:', count); // Debug log

    return { data: data || [], count };
  } catch (error) {
    console.error('Error in fetchLeadsData:', error);
    return { data: [], count: 0 };
  }
};

// Custom hook to use leads data with pagination and search
export const useLeadsRows = () => {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectingAll, setSelectingAll] = useState(false);

  // Function to fetch all contact IDs
  const fetchAllContactIds = async () => {
    try {
      let query = supabase
        .from('uploaded_leads')
        .select('id');
      
      // Apply search filter if exists
      if (searchQuery) {
        query = query.or(
          `region.ilike.%${searchQuery}%,` +
          `sales_representative.ilike.%${searchQuery}%,` +
          `sales_rep_phone.ilike.%${searchQuery}%,` +
          `sales_rep_email.ilike.%${searchQuery}%,` +
          `pharmacy_name.ilike.%${searchQuery}%,` +
          `pharmacy_phone.ilike.%${searchQuery}%,` +
          `pharmacist_name.ilike.%${searchQuery}%,` +
          `district.ilike.%${searchQuery}%,` +
          `locality.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data.map(row => row.id);
    } catch (error) {
      console.error('Error fetching all contact IDs:', error);
      return [];
    }
  };

  // Function to select all contacts
  const selectAllContacts = async () => {
    setSelectingAll(true);
    try {
      const allIds = await fetchAllContactIds();
      setSelectedIds(allIds);
    } catch (error) {
      console.error('Error selecting all contacts:', error);
    } finally {
      setSelectingAll(false);
    }
  };

  const fetchData = useCallback(async () => {
    console.log('Fetching data...'); // Debug log
    setLoading(true);
    setError(null);
    
    try {
      const { data, count } = await fetchLeadsData({
        page: pagination.page,
        pageSize: pagination.pageSize,
        searchQuery
      });
      
      console.log('Raw data:', data); // Debug log
      const formattedRows = generateLeadsRows(data, selectedIds);
      console.log('Formatted rows:', formattedRows); // Debug log
      
      setRows(formattedRows);
      setTotalCount(count || 0);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, searchQuery, selectedIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle selection for a single row
  const toggleRowSelection = useCallback((id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  return {
    rows,
    totalCount,
    loading,
    error,
    pagination,
    setPagination,
    searchQuery,
    setSearchQuery,
    refreshData: fetchData,
    selectedIds,
    toggleRowSelection,
    selectAllContacts,
    selectingAll
  };
};

// Define columns for the table
export const columns = [
  { name: "select", align: "center", label: "" },
  { name: "region", align: "center", label: "Region" },
  { name: "sales_representative", align: "center", label: "Sales Rep" },
  { name: "sales_rep_phone", align: "center", label: "Sales Rep Phone" },
  { name: "sales_rep_email", align: "center", label: "Sales Rep Email" },
  { name: "pharmacy_name", align: "center", label: "Pharmacy" },
  { name: "pharmacy_phone", align: "center", label: "Pharmacy Phone" },
  { name: "pharmacist_name", align: "center", label: "Pharmacist Name" },
  { name: "district", align: "center", label: "District" },
  { name: "locality", align: "center", label: "Locality" },
  { name: "created_at", align: "center", label: "Created At" },
  { name: "edit", align: "center", label: "Edit" },
  { name: "delete", align: "center", label: "Delete" }
];

export default useLeadsRows;