import { supabase } from '../config/supabaseClient';
import * as XLSX from 'xlsx';

// Bucket name for file uploads
const STORAGE_BUCKET = 'campaign-files';

/**
 * Uploads a file to Supabase storage and records metadata in the database
 * @param {File} file - The file to upload
 * @param {Object} metadata - Additional metadata about the file
 * @returns {Promise<Object>} - The result of the upload operation
 */
export const uploadFile = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Check if user is authenticated first
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError || !authData.session) {
      console.error('Authentication error:', authError);
      throw new Error('User not authenticated. Please log in again.');
    }

    // Get the user's ID directly from the session
    const userId = authData.session.user.id;
    if (!userId) {
      throw new Error('Could not retrieve user ID from session');
    }
    
    console.log("Using Supabase auth UUID:", userId);
    
    // Correctly read and parse the Excel file from form input
    const fileContent = await file.arrayBuffer();
    const workbook = XLSX.read(fileContent, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const result = await processUploadedFile(parsedData);

    if (result.success) {
      console.log('File processed successfully.');
    } else {
      console.error('Error processing file:', result.error);
    }

    return {
      success: result.success,
      error: result.error
    };
  } catch (error) {
    console.error('File upload service error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Gets a list of files uploaded by the current user
 * @returns {Promise<Array>} - Array of file records
 */
export const getUserFiles = async () => {
  try {
    const { data, error } = await supabase
      .from('file_storage')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      files: data || []
    };
  } catch (error) {
    console.error('Get user files error:', error);
    return {
      success: false,
      error: error.message,
      files: []
    };
  }
};

/**
 * Deletes a file from storage and the database
 * @param {UUID} fileId - The ID of the file record to delete
 * @returns {Promise<Object>} - Result of the delete operation
 */
export const deleteFile = async (fileId) => {
  try {
    // 1. Get the file record to determine the storage path
    const { data: files, error: fetchError } = await supabase
      .from('file_storage')
      .select('storage_path')
      .eq('id', fileId);

    if (fetchError) {
      throw fetchError;
    }

    if (!files || files.length === 0) {
      throw new Error('File not found');
    }

    const fileData = files[0];

    // 2. Delete from storage
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([fileData.storage_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      // Continue to delete the database record even if storage delete fails
    }

    // 3. Delete from database
    const { error: dbError } = await supabase
      .from('file_storage')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      throw dbError;
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Delete file error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to read and insert data from the uploaded file
export const processUploadedFile = async (jsonData) => {
  try {
    console.log('Rows read from file:', jsonData);

    for (const row of jsonData) {
      console.log('Row to insert:', row);

      const { error } = await supabase
        .from('uploaded_leads')
        .insert({
          region: row['Region'],
          sales_representative: row['Sales Representative'],
          sales_rep_phone: row['Sales Representative Phone'],
          sales_rep_email: row['Sales Representative Email'],
          pharmacy_name: row['Pharmacy Name'],
          pharmacy_phone: row['Pharmacy Phone'],
          pharmacist_name: row['Pharmacist Name'],
          district: row['District'],
          locality: row['Locality']
        });

      if (error) {
        console.error('Error inserting row:', error);
        throw error;
      } else {
        console.log('Row inserted successfully:', row);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing uploaded file:', error);
    return { success: false, error: error.message };
  }
};

// Function to generate and download Excel template dynamically
export const generateExcelTemplate = () => {
  const sampleData = [
    {
      'Region': 'София',
      'Sales Representative': 'Иван Иванов',
      'Sales Representative Phone': '359888888888',
      'Sales Representative Email': 'sample@example.com',
      'Pharmacy Name': 'Нове 5',
      'Pharmacy Phone': '359999999999',
      'Pharmacist Name': 'Георги Георгиев',
      'District': 'София',
      'Locality': 'София'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

  XLSX.writeFile(workbook, 'campaign_template.xlsx');
};

