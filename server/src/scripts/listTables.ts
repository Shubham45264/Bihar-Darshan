import '../config/env';
import { Pool } from 'pg';

async function listTables() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const res = await pool.query(`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    ORDER BY table_schema, table_name;
  `);

  console.log('📋 All Database Tables:\n');
  res.rows.forEach((r) => {
    console.log(` - [${r.table_schema}] ${r.table_name}`);
  });

  await pool.end();
}

listTables().catch(console.error);
