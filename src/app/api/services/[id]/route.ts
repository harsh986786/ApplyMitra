import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse, readBody } from '@/server/utils';
import { ObjectId } from 'mongodb';
import { CASTE_CATEGORIES, type CategoryFee } from '@/types';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    const body = await readBody(req);
    const update: any = {};
    for (const k of ['name', 'category', 'description', 'eligibility', 'documentsRequired']) {
      if (body[k] !== undefined) update[k] = body[k];
    }
    if (Array.isArray(body.fees)) {
      update.fees = CASTE_CATEGORIES.map((cat) => {
        const f = body.fees.find((x: any) => x.category === cat);
        return {
          category: cat,
          governmentFee: Number(f?.governmentFee ?? 0),
          convenienceFee: Number(f?.convenienceFee ?? 100),
        };
      }) as CategoryFee[];
    }
    await db.collection(COLLECTIONS.SERVICES).updateOne({ _id: new ObjectId(params.id) }, { $set: update });
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err, 'Failed to update service');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    await db.collection(COLLECTIONS.SERVICES).deleteOne({ _id: new ObjectId(params.id) });
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err, 'Failed to delete service');
  }
}
