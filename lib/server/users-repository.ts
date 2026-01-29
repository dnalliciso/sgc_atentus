import { db } from '@/lib/db'
import type { UserAccount } from '@/lib/users-store'

function mapRowToUser(row: any): UserAccount {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.createdAt,
    fechaIngreso: row.fechaIngreso,
    telefono: row.telefono,
    pais: row.pais,
    referido: row.referidoJson ? JSON.parse(row.referidoJson) : null,
    bankDetails: JSON.parse(row.bankDetailsJson),
    abonos: JSON.parse(row.abonosJson),
  }
}

export function getAllUsers(): UserAccount[] {
  const rows = db.prepare('SELECT * FROM users').all()
  return rows.map(mapRowToUser)
}

export function getUserByIdDb(id: string): UserAccount | null {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  return row ? mapRowToUser(row) : null
}

export function createUser(user: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount {
  const id = Date.now().toString()
  const createdAt = new Date().toISOString().split('T')[0]

  const bankDetailsJson = JSON.stringify(user.bankDetails)
  const abonosJson = JSON.stringify(user.abonos ?? [])
  const referidoJson = user.referido ? JSON.stringify(user.referido) : null

  db.prepare(
    `INSERT INTO users (
      id, name, email, role, status, createdAt, fechaIngreso,
      telefono, pais, referidoJson, bankDetailsJson, abonosJson
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    user.name,
    user.email,
    user.role,
    user.status,
    createdAt,
    user.fechaIngreso,
    user.telefono,
    user.pais,
    referidoJson,
    bankDetailsJson,
    abonosJson,
  )

  return {
    ...user,
    id,
    createdAt,
  }
}

export function updateUserDb(
  id: string,
  updates: Partial<Omit<UserAccount, 'id'>>
): UserAccount | null {
  const existing = getUserByIdDb(id)
  if (!existing) return null

  const merged: UserAccount = {
    ...existing,
    ...updates,
    bankDetails: updates.bankDetails ?? existing.bankDetails,
    abonos: updates.abonos ?? existing.abonos,
    referido: updates.referido ?? existing.referido,
  }

  db.prepare(
    `UPDATE users SET
      name = ?,
      email = ?,
      role = ?,
      status = ?,
      createdAt = ?,
      fechaIngreso = ?,
      telefono = ?,
      pais = ?,
      referidoJson = ?,
      bankDetailsJson = ?,
      abonosJson = ?
     WHERE id = ?`
  ).run(
    merged.name,
    merged.email,
    merged.role,
    merged.status,
    merged.createdAt,
    merged.fechaIngreso,
    merged.telefono,
    merged.pais,
    merged.referido ? JSON.stringify(merged.referido) : null,
    JSON.stringify(merged.bankDetails),
    JSON.stringify(merged.abonos ?? []),
    id,
  )

  return merged
}

export function deleteUserDb(id: string): boolean {
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id)
  return result.changes > 0
}

export function ensureUsersSeed(initialUsers: UserAccount[]) {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
  if (countRow.count > 0) return

  const insert = db.prepare(
    `INSERT INTO users (
      id, name, email, role, status, createdAt, fechaIngreso,
      telefono, pais, referidoJson, bankDetailsJson, abonosJson
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  const insertMany = db.transaction((users: UserAccount[]) => {
    for (const u of users) {
      insert.run(
        u.id,
        u.name,
        u.email,
        u.role,
        u.status,
        u.createdAt,
        u.fechaIngreso,
        u.telefono,
        u.pais,
        u.referido ? JSON.stringify(u.referido) : null,
        JSON.stringify(u.bankDetails),
        JSON.stringify(u.abonos ?? []),
      )
    }
  })

  insertMany(initialUsers)
}
