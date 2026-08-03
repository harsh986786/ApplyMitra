import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse, readBody } from '@/server/utils';
import { ObjectId } from 'mongodb';

// Verify payment for an application — admin enters the amount actually received.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    const body = await readBody(req);
    const paidAmount = Number(body.paidAmount) || 0;
    await db.collection(COLLECTIONS.APPLICATIONS).updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { paymentVerified: true, paidAmount, status: 'payment_verified', updatedAt: new Date() } }
    );
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err, 'Failed to verify payment');
  }
}
