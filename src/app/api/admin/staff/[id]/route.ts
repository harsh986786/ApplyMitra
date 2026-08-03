import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse } from '@/server/utils';
import { ObjectId } from 'mongodb';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    await db.collection(COLLECTIONS.STAFF).deleteOne({ _id: new ObjectId(params.id) });
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err, 'Failed to delete staff');
  }
}
