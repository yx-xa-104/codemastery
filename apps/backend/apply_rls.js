require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.log('No DATABASE_URL'); return; }
  
  const client = new Client({ connectionString: dbUrl, connectionTimeoutMillis: 10000 });
  await client.connect();
  
  const sqlPath = path.join(__dirname, '../../supabase/migrations/008_fix_classroom_rls_realtime.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  await client.query(sql);
  console.log('Applied migration for RLS!');
  
  await client.end();
}

main().catch(console.error);
