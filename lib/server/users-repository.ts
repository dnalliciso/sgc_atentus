import { db } from '@/lib/db'
import type { UserAccount } from '@/lib/users-store'

function mapRowToUser(row: any): UserAccount {
  const referido = row.referidoJson ? JSON.parse(row.referidoJson) : null
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
    rutTitular: row.rutTitular ?? '',
    referido,
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
  const referidoRut = user.referido?.rut ?? null

  if (user.referido) {
    db.prepare(
      `INSERT OR IGNORE INTO referidos (rut, nombre, email, telefono)
       VALUES (?, ?, ?, ?)`
    ).run(
      user.referido.rut,
      user.referido.nombre,
      user.referido.email,
      user.referido.telefono,
    )
  }

  db.prepare(
    `INSERT INTO users (
      id, name, email, role, status, createdAt, fechaIngreso,
      telefono, pais, rutTitular, referidoJson, bankDetailsJson, abonosJson, referidoRut
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
    user.rutTitular,
    referidoJson,
    bankDetailsJson,
    abonosJson,
    referidoRut,
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

  const referidoRut = merged.referido?.rut ?? null

  if (merged.referido) {
    db.prepare(
      `INSERT OR IGNORE INTO referidos (rut, nombre, email, telefono)
       VALUES (?, ?, ?, ?)`
    ).run(
      merged.referido.rut,
      merged.referido.nombre,
      merged.referido.email,
      merged.referido.telefono,
    )
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
      rutTitular = ?,
      referidoJson = ?,
      bankDetailsJson = ?,
      abonosJson = ?,
      referidoRut = ?
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
    merged.rutTitular,
    merged.referido ? JSON.stringify(merged.referido) : null,
    JSON.stringify(merged.bankDetails),
    JSON.stringify(merged.abonos ?? []),
    referidoRut,
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

  const insertUser = db.prepare(
    `INSERT INTO users (
      id, name, email, role, status, createdAt, fechaIngreso,
      telefono, pais, rutTitular, referidoJson, bankDetailsJson, abonosJson, referidoRut
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  const insertReferido = db.prepare(
    `INSERT OR IGNORE INTO referidos (rut, nombre, email, telefono)
     VALUES (?, ?, ?, ?)`
  )

  const insertMany = db.transaction((users: UserAccount[]) => {
    for (const u of users) {
      const referidoRut = u.referido?.rut ?? null
      if (u.referido) {
        insertReferido.run(
          u.referido.rut,
          u.referido.nombre,
          u.referido.email,
          u.referido.telefono,
        )
      }

      insertUser.run(
        u.id,
        u.name,
        u.email,
        u.role,
        u.status,
        u.createdAt,
        u.fechaIngreso,
        u.telefono,
        u.pais,
        u.rutTitular,
        u.referido ? JSON.stringify(u.referido) : null,
        JSON.stringify(u.bankDetails),
        JSON.stringify(u.abonos ?? []),
        referidoRut,
      )
    }
  })

  insertMany(initialUsers)
}
