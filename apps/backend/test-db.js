// Test Supabase connection — both REST API and Direct PostgreSQL
require('dotenv').config();

async function testSupabaseREST() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌐 TEST 1: Supabase REST API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  
  console.log('URL:', url || '❌ NOT SET');
  console.log('Key:', key ? '✅ Loaded' : '❌ NOT SET');
  
  if (!url || !key) {
    console.log('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
    return false;
  }

  try {
    // Test health endpoint
    const healthRes = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    console.log(`\nHealth check: HTTP ${healthRes.status}`);
    
    if (healthRes.status === 200) {
      console.log('✅ Supabase REST API is reachable!\n');
    } else {
      const body = await healthRes.text();
      console.log('Response:', body.substring(0, 200));
    }

    // Test categories table
    const catRes = await fetch(`${url}/rest/v1/categories?select=id,name&limit=5`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    if (catRes.ok) {
      const categories = await catRes.json();
      console.log(`📦 Categories table: ${categories.length} rows found`);
      categories.forEach(c => console.log(`   • ${c.name}`));
    } else {
      const err = await catRes.json();
      console.log(`Categories query: HTTP ${catRes.status}`, err.message || err.hint || '');
    }

    // Test courses table
    const courseRes = await fetch(`${url}/rest/v1/courses?select=id,title,status&limit=5`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    if (courseRes.ok) {
      const courses = await courseRes.json();
      console.log(`\n📚 Courses table: ${courses.length} rows found`);
      courses.forEach(c => console.log(`   • [${c.status}] ${c.title}`));
    } else {
      const err = await courseRes.json();
      console.log(`\nCourses query: HTTP ${courseRes.status}`, err.message || err.hint || '');
    }

    return true;
  } catch (error) {
    console.log('❌ REST API Error:', error.message);
    if (error.cause) console.log('   Cause:', error.cause.code || error.cause.message);
    return false;
  }
}

async function testDirectDB() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🗄️  TEST 2: Direct PostgreSQL');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const dbUrl = process.env.DATABASE_URL;
  console.log('DATABASE_URL:', dbUrl ? '✅ Loaded' : '❌ NOT SET');
  
  if (!dbUrl) return false;

  try {
    const { Client } = require('pg');
    const client = new Client({ connectionString: dbUrl, connectionTimeoutMillis: 10000 });
    
    await client.connect();
    console.log('✅ PostgreSQL connected!\n');
    
    const tables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    console.log(`📋 Public tables (${tables.rows.length}):`);
    tables.rows.forEach(t => console.log(`   • ${t.tablename}`));
    
    const courseCount = await client.query('SELECT COUNT(*) as count FROM courses');
    console.log(`\n📚 Courses: ${courseCount.rows[0].count}`);
    
    await client.end();
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   CodeMastery — Supabase Connection    ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const restOk = await testSupabaseREST();
  const dbOk = await testDirectDB();
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`REST API:    ${restOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`PostgreSQL:  ${dbOk ? '✅ OK' : '❌ FAILED'}`);
  
  if (!restOk && !dbOk) {
    console.log('\n⚠️  Both connections failed. Possible causes:');
    console.log('   1. Supabase project may be PAUSED (check dashboard)');
    console.log('   2. Network/firewall blocking connections');
    console.log('   3. Incorrect credentials in .env');
  }
}

main().catch(console.error);