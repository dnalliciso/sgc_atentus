import { db } from '@/lib/db'
import type { AppUser } from '@/lib/app-users-store'

function mapRowToAppUser(row: any): AppUser {
  return {
    id: row.id,
    nombre: row.nombre,
    apellido: row.apellido,
    email: row.email,
    telefono: row.telefono,
    codigoSeguridad: row.codigoSeguridad,
    password: row.password,
    activo: !!row.activo,
    createdAt: row.createdAt,
  }
}

export function getAllAppUsers(): AppUser[] {
  const rows = db.prepare('SELECT * FROM app_users').all()
  return rows.map(mapRowToAppUser)
}

export function getAppUserByIdDb(id: string): AppUser | null {
  const row = db.prepare('SELECT * FROM app_users WHERE id = ?').get(id)
  return row ? mapRowToAppUser(row) : null
}

export function createAppUser(
  user: Omit<AppUser, 'id' | 'createdAt' | 'activo'>
): AppUser {
  const id = `user-${Date.now()}`
  const createdAt = new Date().toISOString().split('T')[0]

  db.prepare(
    `INSERT INTO app_users (
      id, nombre, apellido, email, telefono,
      codigoSeguridad, password, activo, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    user.nombre,
    user.apellido,
    user.email,
    user.telefono,
    user.codigoSeguridad,
    user.password,
    1,
    createdAt,
  )

  return {
    ...user,
    id,
    activo: true,
    createdAt,
  }
}

export function updateAppUserDb(
  id: string,
  updates: Partial<Omit<AppUser, 'id' | 'createdAt'>>
): AppUser | null {
  const existing = getAppUserByIdDb(id)
  if (!existing) return null

  const merged: AppUser = {
    ...existing,
    ...updates,
  }

  db.prepare(
    `UPDATE app_users SET
      nombre = ?,
      apellido = ?,
      email = ?,
      telefono = ?,
      codigoSeguridad = ?,
      password = ?,
      activo = ?
     WHERE id = ?`
  ).run(
    merged.nombre,
    merged.apellido,
    merged.email,
    merged.telefono,
    merged.codigoSeguridad,
    merged.password,
    merged.activo ? 1 : 0,
    id,
  )

  return merged
}

export function deleteAppUserDb(id: string): boolean {
  const result = db.prepare('DELETE FROM app_users WHERE id = ?').run(id)
  return result.changes > 0
}

export function toggleAppUserStatusDb(id: string): AppUser | null {
  const existing = getAppUserByIdDb(id)
  if (!existing) return null
  const updated = updateAppUserDb(id, { activo: !existing.activo })
  return updated
}

export function ensureAppUsersSeed(initialUsers: AppUser[]) {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM app_users').get() as { count: number }
  if (countRow.count > 0) return

  const insert = db.prepare(
    `INSERT INTO app_users (
      id, nombre, apellido, email, telefono,
      codigoSeguridad, password, activo, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  const insertMany = db.transaction((users: AppUser[]) => {
    for (const u of users) {
      insert.run(
        u.id,
        u.nombre,
        u.apellido,
        u.email,
        u.telefono,
        u.codigoSeguridad,
        u.password,
        u.activo ? 1 : 0,
        u.createdAt,
      )
    }
  })

  insertMany(initialUsers)
}
