import { NextResponse } from 'next/server'
import { getAllUsers, createUser, ensureUsersSeed } from '@/lib/server/users-repository'
import { initialUsers } from '@/lib/users-store'

// Sembrar datos al primer acceso si la tabla está vacía
ensureUsersSeed(initialUsers)

export async function GET() {
  const users = getAllUsers()
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  // Esperamos que venga con la misma forma que UserAccount menos id/createdAt
  const user = createUser(body)
  return NextResponse.json(user, { status: 201 })
}