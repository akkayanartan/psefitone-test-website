/**
 * SQLite connection for the admin module.
 *
 * Local-only persistence: better-sqlite3 against a file in `data/` (gitignored).
 *
 * Vercel deployment note: Vercel's serverless filesystem is read-only at
 * runtime, so this module will not persist there as-is. To deploy, swap the
 * driver below for `drizzle-orm/neon-http` + `@neondatabase/serverless` and
 * point at a Postgres URL. The Drizzle schema in `./schema.ts` is portable
 * (only `integer`/`text` types are used).
 */

import 'server-only';
import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;
let cachedSqlite: Database.Database | null = null;

function resolveDbPath(): string {
  const fromEnv = process.env.ADMIN_DB_PATH;
  if (fromEnv && fromEnv.length > 0) return path.resolve(fromEnv);
  return path.resolve(process.cwd(), 'data', 'psefitone-admin.db');
}

function ensureParentDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function getDb() {
  if (cachedDb) return cachedDb;

  const dbPath = resolveDbPath();
  ensureParentDir(dbPath);

  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.exec(schema.INIT_SQL);

  cachedSqlite = sqlite;
  cachedDb = drizzle(sqlite, { schema });
  return cachedDb;
}

// Exposed for tests and CLI scripts. Avoid in request paths.
export function _closeForTests() {
  if (cachedSqlite) cachedSqlite.close();
  cachedSqlite = null;
  cachedDb = null;
}
