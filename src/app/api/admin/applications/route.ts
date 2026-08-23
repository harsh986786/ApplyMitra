import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse } from '@/server/utils';
export async function GET(req: NextRequest) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    const apps = await db.collection(COLLECTIONS.APPLICATIONS).find({}).sort({ createdAt: -1 }).toArray();
    return json(apps);
  } catch (err) {
    return errorResponse(err, 'Failed to load applications');
  }
}
