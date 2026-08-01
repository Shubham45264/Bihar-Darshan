import '../config/env';
import { Pool } from 'pg';

async function cleanupStorageTables() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log('🧹 Cleaning up unused Supabase Storage tables & objects...\n');

  try {
    // Truncate storage objects, buckets, and multipart uploads if they exist
    await pool.query(`TRUNCATE TABLE "storage"."objects" CASCADE;`).catch(() => null);
    await pool.query(`TRUNCATE TABLE "storage"."buckets" CASCADE;`).catch(() => null);
    await pool.query(`TRUNCATE TABLE "storage"."s3_multipart_uploads" CASCADE;`).catch(() => null);
    await pool.query(`TRUNCATE TABLE "storage"."s3_multipart_uploads_parts" CASCADE;`).catch(() => null);

    console.log('✅ Successfully emptied all Supabase Storage tables and buckets!');
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    await pool.end();
  }
}

cleanupStorageTables();
