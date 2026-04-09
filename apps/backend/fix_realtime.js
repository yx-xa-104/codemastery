require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.log('No DATABASE_URL'); return; }
  
  const client = new Client({ connectionString: dbUrl, connectionTimeoutMillis: 10000 });
  await client.connect();
  
  try {
    // 1. Ensure publication exists and tables are added
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_publication_tables 
              WHERE pubname = 'supabase_realtime' AND tablename = 'classroom_posts'
          ) THEN
              ALTER PUBLICATION supabase_realtime ADD TABLE classroom_posts;
          END IF;
          IF NOT EXISTS (
              SELECT 1 FROM pg_publication_tables 
              WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
          ) THEN
              ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
          END IF;
      END $$;
    `);

    // 2. Overwrite the RLS policy
    await client.query(`
      DROP POLICY IF EXISTS "Members can view posts" ON classroom_posts;
      CREATE POLICY "Members can view posts"
          ON classroom_posts FOR SELECT
          USING (
              EXISTS (
                  SELECT 1 FROM classrooms c 
                  WHERE c.id = classroom_posts.classroom_id 
                  AND (
                      c.teacher_id = auth.uid()
                      OR EXISTS (
                          SELECT 1 FROM enrollments e 
                          WHERE e.course_id = c.course_id AND e.user_id = auth.uid()
                      )
                      OR EXISTS (
                          SELECT 1 FROM profiles p
                          WHERE p.id = auth.uid() AND p.role = 'admin'
                      )
                  )
              )
          );
    `);
    
    // 3. Enable REPLICA IDENTITY FULL for these tables (sometimes needed for realtime deletes/updates, though not strictly required for inserts)
    await client.query(`ALTER TABLE classroom_posts REPLICA IDENTITY FULL;`);
    await client.query(`ALTER TABLE notifications REPLICA IDENTITY FULL;`);

    console.log('SUCCESS');
  } catch (err) {
    console.error('ERROR', err);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
