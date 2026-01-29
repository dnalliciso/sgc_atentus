import { NextResponse } from 'next/server'
import { getAllAppUsers, createAppUser, ensureAppUsersSeed } from '@/lib/server/app-users-repository'
import { initialAppUsers } from '@/lib/app-users-store'

ensureAppUsersSeed(initialAppUsers)

export async function GET() {
  const users = getAllAppUsers()
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = createAppUser(body)
  return NextResponse.json(user, { status: 201 })
}