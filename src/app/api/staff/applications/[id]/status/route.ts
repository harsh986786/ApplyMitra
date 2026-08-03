import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse, readBody } from '@/server/utils';
import { ObjectId } from 'mongodb';

// Staff updates the status of an application assigned to them
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(req, 'staff');
    const db = await getDb();
    const body = await readBody(req);
    const app = await db.collection(COLLECTIONS.APPLICATIONS).findOne({ _id: new ObjectId(params.id) });
    if (!app) return json({ error: 'Application not found' }, 404);
    if (!app.assignedTo || app.assignedTo.toString() !== session.uid) {
      return json({ error: 'Not assigned to you' }, 403);
    }
    await db.collection(COLLECTIONS.APPLICATIONS).updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status: body.status, statusNote: body.note || '', updatedAt: new Date() } }
    );
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err, 'Failed to update status');
  }
}
