/**
 * Database Setup Checker
 * 
 * This script checks if the ai_configurations table exists and provides
 * instructions for setting up the database if needed.
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.error('\nPlease check your .env file in the frontend directory.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseSetup() {
  console.log('🔍 Checking database setup...\n');

  try {
    // Check if ai_configurations table exists
    console.log('1. Checking ai_configurations table...');
    const { data, error } = await supabase
      .from('ai_configurations')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST301' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('❌ ai_configurations table does not exist');
        console.log('\n📋 To fix this, you need to run the database migration:');
        console.log('   1. Go to your Supabase dashboard');
        console.log('   2. Navigate to SQL Editor');
        console.log('   3. Copy and paste the contents of: docs/architecture/MIGRATE_AI_CONFIG_TO_ORG.sql');
        console.log('   4. Run the SQL script');
        console.log('   5. Refresh this page and try saving again');
        return false;
      } else {
        console.error('❌ Error checking ai_configurations table:', error.message);
        return false;
      }
    } else {
      console.log('✅ ai_configurations table exists');
    }

    // Check if organizations table exists
    console.log('\n2. Checking organizations table...');
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    if (orgError) {
      if (orgError.code === 'PGRST301' || orgError.message.includes('relation') || orgError.message.includes('does not exist')) {
        console.log('❌ organizations table does not exist');
        console.log('\n📋 You need to set up the organizations table first:');
        console.log('   1. Run the PHASE_3_SEED_DATA.sql script in Supabase');
        console.log('   2. Make sure to replace YOUR_ORGANIZATION_ID_HERE with actual IDs');
        return false;
      } else {
        console.error('❌ Error checking organizations table:', orgError.message);
        return false;
      }
    } else {
      console.log('✅ organizations table exists');
    }

    // Check if user_profiles table exists and has organization_id
    console.log('\n3. Checking user_profiles table...');
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .limit(1);

    if (profileError) {
      if (profileError.code === 'PGRST301' || profileError.message.includes('relation') || profileError.message.includes('does not exist')) {
        console.log('❌ user_profiles table does not exist');
        console.log('\n📋 You need to set up the user_profiles table first:');
        console.log('   1. Run the PHASE_3_SEED_DATA.sql script in Supabase');
        return false;
      } else {
        console.error('❌ Error checking user_profiles table:', profileError.message);
        return false;
      }
    } else {
      console.log('✅ user_profiles table exists');
    }

    console.log('\n✅ Database setup looks good!');
    console.log('   The AI configuration should work now.');
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the check
checkDatabaseSetup().then(success => {
  if (success) {
    console.log('\n🎉 You can now try saving your AI configuration!');
  } else {
    console.log('\n⚠️  Please fix the database setup issues above before trying to save.');
  }
});
