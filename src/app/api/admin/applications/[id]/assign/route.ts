import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse, readBody } from '@/server/utils';
import { ObjectId } from 'mongodb';

// Assign an application to a staff member
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    const body = await readBody(req);
    const staff = await db.collection(COLLECTIONS.STAFF).findOne({ _id: new ObjectId(body.staffId) });
    if (!staff) return json({ error: 'Staff not found' }, 404);
    await db.collection(COLLECTIONS.APPLICATIONS).updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { assignedTo: staff._id, assignedToName: staff.name, status: 'assigned', updatedAt: new Date() } }
    );
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err, 'Failed to assign application');
  }
}
