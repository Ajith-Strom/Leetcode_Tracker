import { RowDataPacket } from 'mysql2';
import { pool } from '../db/pool';

export async function getSetting(key: string): Promise<string | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT `value` FROM settings WHERE `key` = ?',
    [key]
  );
  return rows.length > 0 ? (rows[0].value as string) : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await pool.query(
    'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
    [key, value]
  );
}
