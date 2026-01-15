require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    console.log('🔗 Connecting to database...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'Not found');
    
    await client.connect();
    console.log('Connected to database successfully!');
    
    const result = await client.query('SELECT COUNT(*) FROM courses');
    console.log(`Courses in database: ${result.rows[0].count}`);
    
    await client.end();
  } catch (error) {
    console.error('Connection failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check .env file exists in apps/api/');
    console.log('2. Verify DATABASE_URL format:');
    console.log('   postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres');
    console.log('3. Make sure password has no special characters or URL-encode them');
  }
}

testConnection();