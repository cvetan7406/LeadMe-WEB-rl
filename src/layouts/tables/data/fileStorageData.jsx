import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabaseClient';
import VuiBox from "../../../components/VuiBox";
import VuiTypography from "../../../components/VuiTypography";
import VuiBadge from "../../../components/VuiBadge";
import VuiProgress from "../../../components/VuiProgress";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EventIcon from '@mui/icons-material/Event';
import { Tooltip } from '@mui/material';

// File status badge component
function FileStatusBadge({ status }) {
  let color = "info";
  
  if (status === "completed") color = "success";
  else if (status === "processing") color = "info";
  else if (status === "failed") color = "error";
  else if (status === "pending") color = "warning";
  
  return (
    <VuiBadge
      variant="standard"
      badgeContent={status.charAt(0).toUpperCase() + status.slice(1)}
      color={color}
      size="xs"
      container
      sx={({ palette: { white, [color]: mainColor }, borders: { borderRadius, borderWidth } }) => ({
        background: color === "secondary" ? "unset" : mainColor.main,
        border: `${borderWidth[1]} solid ${color === "secondary" ? white.main : mainColor.main}`,
        borderRadius: borderRadius.md,
        color: white.main,
      })}
    />
  );
}

// Format file size for display
function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Hook to fetch file storage data
export const useFileStorageData = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0
  });
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Fetch files data
        const { data, error } = await supabase
          .from('file_storage')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        
        // Calculate status counts and total size
        const counts = {
          pending: 0,
          processing: 0,
          completed: 0,
          failed: 0
        };
        
        let size = 0;
        
        data.forEach(file => {
          if (counts[file.status] !== undefined) {
            counts[file.status]++;
          }
          
          size += file.size || 0;
        });
        
        setStatusCounts(counts);
        setTotalSize(size);
        setFiles(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching file storage data:', error);
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, []);
  
  return { files, loading, statusCounts, totalSize };
};

export const fileStorageColumns = [
  { name: "file", align: "left" },
  { name: "size", align: "center" },
  { name: "status", align: "center" },
  { name: "scheduled", align: "center" },
  { name: "uploaded", align: "center" },
];

export const generateFileStorageRows = (files) => 
  files.map(file => {
    // Extract file extension
    const extension = file.filename.split('.').pop().toLowerCase();
    
    // Determine color based on extension
    const getExtensionColor = (ext) => {
      const extMap = {
        'pdf': 'error',
        'doc': 'info',
        'docx': 'info',
        'xls': 'success',
        'xlsx': 'success',
        'csv': 'success',
        'jpg': 'warning',
        'jpeg': 'warning',
        'png': 'warning'
      };
      
      return extMap[ext] || 'secondary';
    };
    
    const extensionColor = getExtensionColor(extension);
    
    return {
      id: file.id,
      file: (
        <VuiBox display="flex" alignItems="center">
          <VuiBox 
            mr={2} 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            width="45px" 
            height="45px" 
            borderRadius="lg" 
            bgcolor={`${extensionColor}.focus`} 
            color="white"
          >
            <InsertDriveFileIcon />
          </VuiBox>
          <VuiBox display="flex" flexDirection="column">
            <VuiTypography variant="button" color="white" fontWeight="bold">
              {file.filename.length > 20 ? file.filename.substring(0, 20) + '...' : file.filename}
            </VuiTypography>
            <VuiTypography variant="caption" color="white" opacity={0.8}>
              {file.content_type || extension.toUpperCase()}
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      ),
      size: (
        <VuiTypography variant="caption" color="white" fontWeight="bold">
          {formatFileSize(file.size)}
        </VuiTypography>
      ),
      status: <FileStatusBadge status={file.status} />,
      scheduled: file.scheduled_datetime ? (
        <Tooltip title={new Date(file.scheduled_datetime).toLocaleString()}>
          <VuiBox display="flex" alignItems="center">
            <EventIcon sx={{ fontSize: 16, marginRight: 1 }} />
            <VuiTypography variant="caption" color="white" fontWeight="bold">
              {new Date(file.scheduled_datetime).toLocaleDateString()}
            </VuiTypography>
          </VuiBox>
        </Tooltip>
      ) : (
        <VuiTypography variant="caption" color="white" opacity={0.7}>
          Not scheduled
        </VuiTypography>
      ),
      uploaded: (
        <VuiTypography variant="caption" color="white" fontWeight="bold">
          {new Date(file.created_at).toLocaleDateString()}
        </VuiTypography>
      ),
    };
  });

// Generate summary data for file storage
export const generateFileStorageSummary = (statusCounts, totalSize) => {
  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  
  return {
    totalFiles: total,
    totalSize: formatFileSize(totalSize),
    statusBreakdown: statusCounts,
    completionRate: total > 0 ? Math.round((statusCounts.completed / total) * 100) : 0
  };
};