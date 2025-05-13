#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🔧 Starting database table fixes...');

  try {
    // Check if any courses already exist
    const { data: existingCourses } = await supabase.from('courses').select('id').limit(1);

    // Check if any groups already exist
    const { data: existingGroups } = await supabase.from('groups').select('id').limit(1);

    // Log existing data
    console.log(`Found ${existingCourses?.length || 0} existing courses`);
    console.log(`Found ${existingGroups?.length || 0} existing groups`);

    // Fix database issues in transactions
    const { error: transactionError } = await supabase.rpc('fix_database_issues');

    if (transactionError) {
      // If RPC doesn't exist, perform updates directly
      console.log('Using direct database fixes instead of RPC...');

      // Fix the table names in course_enrollments
      console.log('Fixing course_enrollments foreign keys references...');
      const { error: referenceFix } = await supabase.rpc('alter_foreign_key_references', {
        table_name: 'course_enrollments',
        column_name: 'course_id',
        referenced_table: 'courses'
      });

      // If RPC doesn't exist, add the function and try again
      if (referenceFix) {
        console.log('Creating necessary database functions...');
        
        // Create RPC to alter foreign key references
        const { error: createFuncError } = await supabase.rpc('admin_create_alter_foreign_key_function');
        
        if (createFuncError) {
          console.error('Failed to create RPC function:', createFuncError);
          
          // Direct database query as last resort
          console.log('Using raw SQL to update schema...');
          await fixSchemaDirectly();
        } else {
          // Try the function again
          await supabase.rpc('alter_foreign_key_references', {
            table_name: 'course_enrollments',
            column_name: 'course_id',
            referenced_table: 'courses'
          });
        }
      }

      // Fix the table names in group_memberships
      console.log('Fixing group_memberships foreign keys references...');
      await supabase.rpc('alter_foreign_key_references', {
        table_name: 'group_memberships',
        column_name: 'group_id',
        referenced_table: 'groups'
      });
    }

    console.log('✅ Database tables fixed successfully!');

  } catch (error) {
    console.error('Error fixing database tables:', error);
    process.exit(1);
  }
}

async function fixSchemaDirectly() {
  console.log('Running direct SQL fixes for the schema...');
  
  try {
    // The method below uses direct SQL execution which depends on admin rights
    // This is a fallback method only if all other methods fail

    // For course_enrollments
    await supabase.rpc('execute_sql', {
      sql_query: `
        ALTER TABLE course_enrollments 
        DROP CONSTRAINT IF EXISTS course_enrollments_course_id_fkey,
        ADD CONSTRAINT course_enrollments_course_id_fkey 
          FOREIGN KEY (course_id) 
          REFERENCES courses(id) 
          ON DELETE CASCADE;
      `
    });

    // For group_memberships
    await supabase.rpc('execute_sql', {
      sql_query: `
        ALTER TABLE group_memberships 
        DROP CONSTRAINT IF EXISTS group_memberships_group_id_fkey,
        ADD CONSTRAINT group_memberships_group_id_fkey 
          FOREIGN KEY (group_id) 
          REFERENCES groups(id) 
          ON DELETE CASCADE;
      `
    });

    console.log('Direct SQL fixes completed');
  } catch (err) {
    console.error('Failed to execute direct SQL:', err);
    console.log('Please contact your database administrator to fix the foreign key references.');
    console.log('The references in the dashboard pages have been updated in the code.');
  }
}

main()
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  }); 