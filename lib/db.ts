import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Ruta del archivo SQLite dentro del proyecto
const dbPath = path.join(process.cwd(), 'data', 'app.db')

// Asegurar que exista el directorio data/
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Crear conexión única a la base de datos
export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

// Crear tablas si no existen
// Users de cuentas bancarias
// Se guardan campos anidados como JSON para simplificar (bankDetails, abonos, referido)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    fechaIngreso TEXT NOT NULL,
    telefono TEXT NOT NULL,
    pais TEXT NOT NULL,
    referidoJson TEXT,
    bankDetailsJson TEXT NOT NULL,
    abonosJson TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS app_users (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    codigoSeguridad TEXT NOT NULL,
    password TEXT NOT NULL,
    activo INTEGER NOT NULL,
    createdAt TEXT NOT NULL
  );
`)
