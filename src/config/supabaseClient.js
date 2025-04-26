import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`;

try {
  // Validate URL format
  new URL(formattedUrl);
} catch (error) {
  console.error('Invalid Supabase URL:', error);
  throw new Error('Invalid Supabase URL. Please check your VITE_SUPABASE_URL environment variable.');
}

// console.log('Initializing Supabase client with URL:', formattedUrl);

export const supabase = createClient(formattedUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'ecopharm'
    }
  }
});

// Add an auth state change listener for debugging
supabase.auth.onAuthStateChange((event, session) => {
  // console.log('Supabase auth event:', event);
  // console.log('Session user:', session?.user ? `ID: ${session.user.id}` : 'No user');
});

// Export a helper function to check authentication status
export const checkAuth = async () => {
  // First, check localStorage for Supabase v2 stored token
  const checkLocalStorage = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-') && key.includes('auth-token')) {
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error('Error checking localStorage:', e);
      return false;
    }
  };
  
  // If we find a token in localStorage, return early with authenticated=true
  if (checkLocalStorage()) {
    return { 
      authenticated: true, 
      fromCache: true,
      // Provide a dummy user object with id to prevent null errors
      session: { user: { id: 'cached-session' } },
      user: { id: 'cached-session' }
    };
  }
  
  // If no localStorage token is found, check with Supabase
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Auth check error:', error);
    return { authenticated: false, error };
  }
  
  const isAuthenticated = !!data.session;
  console.log('Auth check result:', { 
    authenticated: isAuthenticated,
    userId: data.session?.user?.id || null
  });
  
  return { 
    authenticated: isAuthenticated, 
    session: data.session,
    user: data.session?.user || null
  };
};

export const processUploadedFile = async (jsonData) => {
  try {
    console.log('Rows read from file:', jsonData); // Log the rows read from the file

    // Insert each row into the new table
    for (const row of jsonData) {
      console.log('Row to insert:', row); // Log each row before insertion

      // Convert phone numbers to numbers
      const salesRepPhone = row['телефон ТП'] ? parseInt(row['телефон ТП'], 10) : null;
      const pharmacyPhone = row['Телефон на аптека'] ? parseInt(row['Телефон на аптека'], 10) : null;

      // Log specific fields
      console.log('Sales Rep Phone:', salesRepPhone);
      console.log('Pharmacy Phone:', pharmacyPhone);

      // Check for undefined or null values
      if (!pharmacyPhone) {
        console.warn('Warning: Pharmacy phone is undefined or null for row:', row);
      }

      const { error } = await supabase
        .from('pharmacy_data')
        .insert({
          region: row['Регион'],
          sales_representative: row['търговси представител'],
          sales_rep_phone: salesRepPhone,
          sales_rep_email: row['e-mail ТП'],
          pharmacy_name: row['име на аптека'],
          pharmacy_phone: pharmacyPhone,
          pharmacist_name: row['име на фармацевт'],
          district: row['Област'],
          locality: row['Неселено място']
        });

      if (error) {
        console.error('Error inserting row:', error);
        throw error;
      } else {
        console.log('Row inserted successfully:', row); // Log successful insertions
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing uploaded file:', error);
    return { success: false, error: error.message };
  }
}; 