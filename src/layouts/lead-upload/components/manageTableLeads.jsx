import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../config/supabaseClient';

// Function to format the data for the table
export const generateLeadsRows = (leads, selectedIds = []) => leads.map((lead) => ({
  id: lead.id,
  selected: selectedIds.includes(lead.id),
  region: lead.region || '',
  sales_representative: lead.sales_representative || '',
  sales_rep_phone: lead.sales_rep_phone || '',
  sales_rep_email: lead.sales_rep_email || '',
  pharmacy_name: lead.pharmacy_name || '',
  pharmacy_phone: lead.pharmacy_phone || '',
  pharmacist_name: lead.pharmacist_name || '',
  district: lead.district || '',
  locality: lead.locality || '',
  created_at: new Date(lead.created_at).toLocaleDateString(),
  edit: 'Edit',
  delete: 'Delete',
}));

// Function to fetch data from the uploaded_leads table with pagination and search
export const fetchLeadsData = async ({ page = 1, pageSize = 10, searchQuery = '' }) => {
  try {
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

    return { data, count };
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
  const [rawData, setRawData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, count } = await fetchLeadsData({
        page: pagination.page,
        pageSize: pagination.pageSize,
        searchQuery
      });
      
      setRawData(data);
      setRows(generateLeadsRows(data, selectedIds));
      setTotalCount(count || 0);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setRows([]);
      setRawData([]);
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
    setSelectedIds(prevSelectedIds => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter(selectedId => selectedId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  }, []);

  // Select all rows currently visible
  const selectAllRows = useCallback(() => {
    const currentPageIds = rawData.map(lead => lead.id);
    setSelectedIds(prevSelectedIds => {
      // If all current page rows are already selected, deselect them
      if (currentPageIds.every(id => prevSelectedIds.includes(id))) {
        return prevSelectedIds.filter(id => !currentPageIds.includes(id));
      }
      // Otherwise, add all current page rows to selection
      const newSelectedIds = [...prevSelectedIds];
      currentPageIds.forEach(id => {
        if (!newSelectedIds.includes(id)) {
          newSelectedIds.push(id);
        }
      });
      return newSelectedIds;
    });
  }, [rawData]);

  // Check if all rows on current page are selected
  const areAllRowsSelected = useCallback(() => {
    if (rawData.length === 0) return false;
    return rawData.every(lead => selectedIds.includes(lead.id));
  }, [rawData, selectedIds]);

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
    selectAllRows,
    areAllRowsSelected
  };
};

// Define columns for the table
export const columns = [
  {
    name: "Select",
    align: "center",
    accessor: "selected",
    width: "60px",
    renderHeader: (column, toggleAllRows, allSelected) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={toggleAllRows}
          style={{
            background: 'none',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '2px 8px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
    ),
    renderCell: (row, toggleSelection) => (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        visibility: 'visible !important',
        opacity: 1
      }}>
        {row.selected ? (
          // Checked state - green box with checkmark
          <div
            onClick={() => toggleSelection(row.id)}
            style={{
              cursor: 'pointer',
              width: '18px',
              height: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #4CAF50',
              borderRadius: '3px',
              backgroundColor: '#4CAF50',
              visibility: 'visible !important',
              opacity: 1
            }}
          >
            <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
          </div>
        ) : (
          // Unchecked state - empty box with border
          <div
            onClick={() => toggleSelection(row.id)}
            style={{
              cursor: 'pointer',
              width: '18px',
              height: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid #aaa',
              borderRadius: '3px',
              backgroundColor: 'transparent',
              visibility: 'visible !important',
              opacity: 1
            }}
          >
            {/* Empty box */}
          </div>
        )}
      </div>
    )
  },
  { name: "Region", align: "left", accessor: "region" },
  { name: "Sales Rep", align: "left", accessor: "sales_representative" },
  { name: "Sales Rep Phone", align: "center", accessor: "sales_rep_phone" },
  { name: "Sales Rep Email", align: "center", accessor: "sales_rep_email" },
  { name: "Pharmacy", align: "center", accessor: "pharmacy_name" },
  { name: "Pharmacy Phone", align: "center", accessor: "pharmacy_phone" },
  { name: "Pharmacist Name", align: "center", accessor: "pharmacist_name" },
  { name: "District", align: "center", accessor: "district" },
  { name: "Locality", align: "center", accessor: "locality" },
  { name: "Created At", align: "center", accessor: "created_at" },
  {
    name: "Edit",
    align: "center",
    accessor: "edit",
    renderCell: (row, _, handleEdit) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => handleEdit(row)}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Edit
        </button>
      </div>
    )
  },
  { name: "Delete", align: "center", accessor: "delete" },
];

// Function to handle editing a lead
export const editLead = async (leadId, updatedData) => {
  try {
    const { data, error } = await supabase
      .from('uploaded_leads')
      .update(updatedData)
      .eq('id', leadId);
    
    if (error) {
      console.error('Error updating lead:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in editLead:', error);
    return { success: false, error };
  }
};

// Custom hook for managing lead editing
export const useLeadEdit = (refreshData) => {
  const [editingLead, setEditingLead] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Function to open edit modal with lead data
  const handleEdit = useCallback(async (leadId) => {
    try {
      const { data, error } = await supabase
        .from('uploaded_leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (error) {
        console.error('Error fetching lead for edit:', error);
        return;
      }
      
      setEditingLead(data);
      setFormData({
        region: data.region || '',
        sales_representative: data.sales_representative || '',
        sales_rep_phone: data.sales_rep_phone || '',
        sales_rep_email: data.sales_rep_email || '',
        pharmacy_name: data.pharmacy_name || '',
        pharmacy_phone: data.pharmacy_phone || '',
        pharmacist_name: data.pharmacist_name || '',
        district: data.district || '',
        locality: data.locality || ''
      });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error in handleEdit:', error);
    }
  }, []);
  
  // Function to handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  // Function to submit the edit form
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!editingLead) return;
    
    setIsSubmitting(true);
    try {
      const { success, error } = await editLead(editingLead.id, formData);
      
      if (success) {
        setIsEditModalOpen(false);
        setEditingLead(null);
        refreshData(); // Refresh the table data
      } else {
        console.error('Failed to update lead:', error);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [editingLead, formData, refreshData]);
  
  // Function to close the edit modal
  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingLead(null);
  }, []);
  
  return {
    editingLead,
    isEditModalOpen,
    formData,
    isSubmitting,
    handleEdit,
    handleInputChange,
    handleSubmit,
    handleCloseModal
  };
};