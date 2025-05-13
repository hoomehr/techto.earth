#!/usr/bin/env node

/**
 * This script helps configure Google OAuth credentials in Supabase
 * Run with: node scripts/setup-google-auth.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔑 Supabase Google Authentication Setup\n');

// Check if google.json exists
const googleJsonPath = path.join(process.cwd(), 'google.json');
if (!fs.existsSync(googleJsonPath)) {
  console.error('❌ Error: google.json file not found in the project root.');
  console.log('Please make sure you have your Google OAuth credentials file in the project root.');
  rl.close();
  process.exit(1);
}

// Read and parse the JSON file
let googleConfig;
try {
  const fileContent = fs.readFileSync(googleJsonPath, 'utf8');
  googleConfig = JSON.parse(fileContent);
  
  if (!googleConfig.web || !googleConfig.web.client_id || !googleConfig.web.client_secret) {
    throw new Error('Invalid Google OAuth configuration format');
  }
} catch (error) {
  console.error('❌ Error parsing google.json:', error.message);
  rl.close();
  process.exit(1);
}

// Extract credentials
const { client_id, client_secret } = googleConfig.web;

console.log('✅ Successfully loaded Google OAuth credentials');
console.log(`\nClient ID: ${client_id}`);
console.log(`Client Secret: ${client_secret}`);

console.log('\n📋 Instructions:');
console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
console.log('2. Select your project and navigate to Authentication > Providers');
console.log('3. Find "Google" in the list and enable it');
console.log('4. Enter the Client ID and Client Secret from above');
console.log('5. Add the following redirect URL:');
console.log(`   ${googleConfig.web.redirect_uris[0] || 'https://your-domain.com/api/auth/callback'}`);
console.log('\n6. Create a .env.local file in your project root with:');
console.log(`NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`);
console.log(`GOOGLE_CLIENT_ID=${client_id}`);
console.log(`GOOGLE_CLIENT_SECRET=${client_secret}`);

console.log('\n🎉 Setup information displayed successfully!\n');
rl.close(); 