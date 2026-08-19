require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT ?? 3306),
    user: DB_USER,
    password: DB_PASSWORD ?? '',
    database: DB_NAME,
    multipleStatements: true,
    ssl: { rejectUnauthorized: false },
  });

  const migrationsDir = path.join(__dirname, '..', 'src', 'db', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Running ${file}...`);
    try {
      await connection.query(sql);
    } catch (err) {
      if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_FIELDNAME') {
        console.log(`  skipped (already applied)`);
      } else {
        throw err;
      }
    }
  }

  console.log('Migrations complete.');
  await connection.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
