import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { json, errorResponse, readBody } from '@/server/utils';

// Public submission of a "Join Our Team" application.
// Saved to a SEPARATE team_applications collection — distinct from client applications.
export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const body = await readBody(req);
    const doc = {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      city: body.city,
      experience: body.experience || '',
      acceptedTerms: !!body.acceptedTerms,
      feePaid: !!body.feePaid,
      status: 'pending',
      paymentVerified: false,
      paidAmount: 0,
      createdAt: new Date(),
    };
    const result = await db.collection(COLLECTIONS.TEAM).insertOne(doc);
    return json({ _id: result.insertedId, ...doc }, 201);
  } catch (err) {
    return errorResponse(err, 'Failed to submit team application');
  }
}
