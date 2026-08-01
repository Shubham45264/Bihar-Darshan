import '../config/env';
import { Pool } from 'pg';

async function inspectPublicTables() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const tablesRes = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  console.log('📊 Table Record Counts in Public Schema:\n');

  for (const row of tablesRes.rows) {
    const tableName = row.table_name;
    const countRes = await pool.query(`SELECT COUNT(*) FROM "public"."${tableName}"`);
    console.log(` - ${tableName.padEnd(22)}: ${countRes.rows[0].count} records`);
  }

  // Also check storage objects count
  try {
    const storageObjectsCount = await pool.query(`SELECT COUNT(*) FROM "storage"."objects"`);
    const storageBucketsCount = await pool.query(`SELECT COUNT(*) FROM "storage"."buckets"`);
    console.log(`\n📦 Supabase Storage Objects : ${storageObjectsCount.rows[0].count}`);
    console.log(`📦 Supabase Storage Buckets : ${storageBucketsCount.rows[0].count}`);
  } catch (err) {
    console.log('\n📦 Storage schema not accessible or empty');
  }

  await pool.end();
}

inspectPublicTables().catch(console.error);
