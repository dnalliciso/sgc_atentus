import { NextResponse } from 'next/server'
import { getAppUserByIdDb, updateAppUserDb, deleteAppUserDb, toggleAppUserStatusDb } from '@/lib/server/app-users-repository'

interface RouteParams {
  params: { id: string }
}

export async function GET(_req: Request, { params }: RouteParams) {
  const user = getAppUserByIdDb(params.id)
  if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const updates = await request.json()
  const updated = updateAppUserDb(params.id, updates)
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const ok = deleteAppUserDb(params.id)
  if (!ok) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}

export async function POST(_req: Request, { params }: RouteParams) {
  // Endpoint auxiliar para togglear estado: /api/app-users/[id]?action=toggle
  const updated = toggleAppUserStatusDb(params.id)
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}