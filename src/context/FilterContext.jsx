import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
  // Initialize with empty values - the Configurator component will set the default values
  const [filters, setFilters] = useState({
    selectedCampaign: '',
    page: 1,
    pageSize: 10
  });

  const updateFilters = (newFilters) => {
    // Check if any of the filter values have actually changed
    setFilters(prev => {
      // Create the updated filter object
      const updatedFilters = {
        ...prev,
        ...newFilters,
        page: newFilters.page || 1 // Reset page when filters change
      };
      
      // Check if anything has actually changed to avoid unnecessary re-renders
      const hasChanged = Object.keys(updatedFilters).some(
        key => updatedFilters[key] !== prev[key]
      );
      
      // Only update state if something has changed
      return hasChanged ? updatedFilters : prev;
    });
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
} 