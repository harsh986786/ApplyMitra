import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse } from '@/server/utils';

// Join-team applications — admin only. Separate from client applications.
export async function GET(req: NextRequest) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    const team = await db.collection(COLLECTIONS.TEAM).find({}).sort({ createdAt: -1 }).toArray();
    return json(team);
  } catch (err) {
    return errorResponse(err, 'Failed to load team applications');
  }
}
