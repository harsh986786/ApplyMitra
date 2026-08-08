export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse } from '@/server/utils';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const session = requireRole(req, 'staff');
    const db = await getDb();
    const apps = await db.collection(COLLECTIONS.APPLICATIONS)
      .find({ assignedTo: new ObjectId(session.uid) })
      .sort({ createdAt: -1 })
      .toArray();
    return json(apps);
  } catch (err) {
    return errorResponse(err, 'Failed to load assigned applications');
  }
}
