import { Request, Response } from 'express';
import { pool } from '../db/pool';
import { RowDataPacket } from 'mysql2';

export async function getTagStats(_req: Request, res: Response) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT t.name, COUNT(*) AS count
     FROM problems_tags pt
     JOIN tags t ON t.id = pt.tag_id
     GROUP BY t.name
     ORDER BY count DESC`
  );
  res.json(rows);
}
