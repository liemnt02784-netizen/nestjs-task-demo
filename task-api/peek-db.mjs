// Xem nhanh dữ liệu trong tasks.sqlite: node peek-db.mjs
import initSqlJs from 'sql.js';
import { readFileSync } from 'node:fs';
const SQL = await initSqlJs();
const db = new SQL.Database(readFileSync('tasks.sqlite'));
for (const table of ['users', 'tasks', 'activities']) {
  const r = db.exec(`SELECT * FROM ${table} LIMIT 6`)[0];
  console.log(`\n== ${table} ==`);
  if (r) { console.log(r.columns.join(' | ')); for (const row of r.values) console.log(row.map((v) => String(v).slice(0, 40)).join(' | ')); }
}
