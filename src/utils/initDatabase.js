import { supabase } from '../config/supabaseClient';

const setupUsersTable = async () => {
  // Removed table creation logic
  // const { error: checkError } = await supabase
  //   .from('users')
  //   .select('id')
  //   .limit(1);

  // If we get a specific error about the table not existing, we need to create it
  // if (checkError && checkError.code === '42P01') {
  //   console.log('Users table does not exist. Please create the table in the Supabase dashboard with the following structure:');
  //   console.log(`
  //     Table Name: users
  //     Columns:
  //     - id: uuid (primary key, default: uuid_generate_v4())
  //     - email: text (unique, not null)
  //     - display_name: text
  //     - role: text (default: 'user')
  //     - created_at: timestamptz (default: now())
  //     - updated_at: timestamptz (default: now())
      
  //     Enable Row Level Security (RLS) and add the following policies:
  //     1. "Users can view their own data" (SELECT) using (auth.uid() = id)
  //     2. "Users can update their own data" (UPDATE) using (auth.uid() = id)
  //     3. "Users can insert their own data" (INSERT) with check (auth.uid() = id)
  //     4. "Allow initial admin creation" (INSERT) with check for first user
  //   `);
  //   return;
  // }
};

const ensureAdminExists = async () => {
  try {
    // First check if any admin exists
    const { data: existingAdmin, error: adminCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'office@csoc.bg')
      .single();

    if (adminCheckError && adminCheckError.code !== 'PGRST116') {
      console.error('Error checking for admin:', adminCheckError);
      return;
    }

    if (!existingAdmin) {
      console.log('Admin not found, creating admin user...');
      
      // Create auth account first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'office@csoc.bg',
        password: '147896325lL#$!',
        options: {
          data: {
            role: 'admin',
            display_name: 'Berlin Popov'
          }
        }
      });

      if (authError) {
        console.error('Error creating admin auth account:', authError);
        return;
      }

      if (authData.user) {
        // Wait briefly for the auth account to be created
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check again if the user exists before inserting
        const { data: userCheck, error: userCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('email', 'office@csoc.bg')
          .single();

        if (userCheckError && userCheckError.code !== 'PGRST116') {
          console.error('Error checking for user before insert:', userCheckError);
          return;
        }

        if (!userCheck) {
          // Try to insert the admin user
          const { error: insertError } = await supabase.from('users').insert({
            id: authData.user.id,
            email: 'office@csoc.bg',
            display_name: 'Berlin Popov',
            role: 'admin'
          });

          if (insertError) {
            console.error('Error inserting admin into users table:', insertError);
            // If insert fails, try to clean up the auth account
            await supabase.auth.admin.deleteUser(authData.user.id);
          } else {
            console.log('Admin user created successfully');
          }
        } else {
          console.log('Admin user already exists, skipping insertion.');
        }
      }
    }
  } catch (error) {
    console.error('Error in ensureAdminExists:', error);
  }
};

export const initDatabase = async () => {
  console.log('Initializing database...');
  await setupUsersTable();
  // Removed user initialization logic
  // await ensureAdminExists();

  // const { data: { user }, error: sessionError } = await supabase.auth.getSession();
  
  // if (sessionError) {
  //   console.error('Error getting session:', sessionError);
  //   return;
  // }

  // console.log('Current user session:', user ? 'Found' : 'Not found');
  
  // if (user) {
  //   const { data: existingUser, error: userCheckError } = await supabase
  //     .from('users')
  //     .select('id')
  //     .eq('id', user.id)
  //     .single();

  //   if (userCheckError && userCheckError.code !== 'PGRST116') {
  //     console.error('Error checking for existing user:', userCheckError);
  //   }

  //   if (!existingUser) {
  //     console.log('Creating new user record...');
  //     const { error: insertError } = await supabase.from('users').insert({
  //       id: user.id,
  //       email: user.email,
  //       role: 'user'
  //     });

  //     if (insertError) {
  //       console.error('Error creating user record:', insertError);
  //     } else {
  //       console.log('User record created successfully');
  //     }
  //   } else {
  //     console.log('User record already exists');
  //   }
  // }
}; 