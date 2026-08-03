import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse, readBody } from '@/server/utils';
import { ObjectId } from 'mongodb';

// Verify the ₹500 join-team fee payment
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    const body = await readBody(req);
    const paidAmount = Number(body.paidAmount) || 0;
    await db.collection(COLLECTIONS.TEAM).updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { paymentVerified: true, paidAmount, status: 'verified', updatedAt: new Date() } }
    );
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err, 'Failed to verify team payment');
  }
}
