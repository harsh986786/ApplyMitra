import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole, hashPassword } from '@/server/auth';
import { json, errorResponse, readBody } from '@/server/utils';

export async function GET(req: NextRequest) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    const staff = await db.collection(COLLECTIONS.STAFF).find({}, { projection: { hash: 0, salt: 0 } }).toArray();
    return json(staff);
  } catch (err) {
    return errorResponse(err, 'Failed to load staff');
  }
}

export async function POST(req: NextRequest) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    const body = await readBody(req);
    const existing = await db.collection(COLLECTIONS.STAFF).findOne({ email: body.email });
    if (existing) return json({ error: 'Staff with this email already exists' }, 400);
    const { hash, salt } = hashPassword(body.password);
    const result = await db.collection(COLLECTIONS.STAFF).insertOne({
      name: body.name,
      email: body.email,
      hash,
      salt,
      createdAt: new Date(),
    });
    return json({ _id: result.insertedId, name: body.name, email: body.email }, 201);
  } catch (err) {
    return errorResponse(err, 'Failed to add staff');
  }
}
