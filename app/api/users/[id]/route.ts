import { NextResponse } from 'next/server'
import { getUserByIdDb, updateUserDb, deleteUserDb } from '@/lib/server/users-repository'

interface RouteParams {
  params: { id: string }
}

export async function GET(_req: Request, { params }: RouteParams) {
  const user = getUserByIdDb(params.id)
  if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const updates = await request.json()
  const updated = updateUserDb(params.id, updates)
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const ok = deleteUserDb(params.id)
  if (!ok) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}