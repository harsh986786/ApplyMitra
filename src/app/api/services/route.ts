import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse, readBody, normalize } from '@/server/utils';
import { CASTE_CATEGORIES, type CategoryFee } from '@/types';

export async function GET() {
  try {
    const db = await getDb();
    const services = await db.collection(COLLECTIONS.SERVICES).find({}).sort({ createdAt: -1 }).toArray();
    return json(services);
  } catch (err) {
    return errorResponse(err, 'Failed to load services');
  }
}

export async function POST(req: NextRequest) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    const body = await readBody(req);
    const fees: CategoryFee[] = (body.fees && Array.isArray(body.fees) && body.fees.length > 0)
      ? CASTE_CATEGORIES.map((cat) => {
          const f = body.fees.find((x: any) => x.category === cat);
          return {
            category: cat,
            governmentFee: Number(f?.governmentFee ?? 0),
            convenienceFee: Number(f?.convenienceFee ?? 100),
          };
        })
      : CASTE_CATEGORIES.map((cat) => ({
          category: cat,
          governmentFee: Number(body.governmentFee ?? 0),
          convenienceFee: 100,
        }));

    const doc = {
      name: body.name,
      slug: body.slug || normalize(body.name),
      category: body.category || 'General',
      description: body.description || '',
      eligibility: body.eligibility || '',
      documentsRequired: body.documentsRequired || '',
      fees,
      createdAt: new Date(),
    };
    const result = await db.collection(COLLECTIONS.SERVICES).insertOne(doc);
    return json({ _id: result.insertedId, ...doc }, 201);
  } catch (err) {
    return errorResponse(err, 'Failed to create service');
  }
}
