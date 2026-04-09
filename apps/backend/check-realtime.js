require('dotenv').config();

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.log('No DATABASE_URL'); return; }
  
  const { Client } = require('pg');
  const client = new Client({ connectionString: dbUrl, connectionTimeoutMillis: 10000 });
  
  await client.connect();
  
  const pub = await client.query(`
    select * from pg_publication_tables where pubname = 'supabase_realtime';
  `);
  console.log('Realtime tables:', pub.rows.map(r => r.tablename));
  
  await client.end();
}

main().catch(console.error);
