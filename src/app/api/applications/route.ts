import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { json, errorResponse, readBody } from '@/server/utils';
import { ObjectId } from 'mongodb';
import type { CasteCategory } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const body = await readBody(req);
    const service = await db.collection(COLLECTIONS.SERVICES).findOne({ _id: new ObjectId(body.serviceId) });
    if (!service) return json({ error: 'Service not found' }, 400);

    const caste = (body.casteCategory || 'General') as CasteCategory;
    const feeRow = (service.fees || []).find((f: any) => f.category === caste) || service.fees?.[0] || { governmentFee: 0, convenienceFee: 100 };

    const doc = {
      applicantName: body.applicantName,
      address: body.address,
      email: body.email,
      phone: body.phone,
      serviceId: service._id,
      serviceName: service.name,
      serviceCategory: service.category,
      casteCategory: caste,
      governmentFee: Number(feeRow.governmentFee) || 0,
      convenienceFee: Number(feeRow.convenienceFee) || 100,
      totalFee: (Number(feeRow.governmentFee) || 0) + (Number(feeRow.convenienceFee) || 100),
      notes: body.notes || '',
      status: 'pending',
      statusNote: '',
      paymentVerified: false,
      paidAmount: 0,
      assignedTo: null,
      assignedToName: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection(COLLECTIONS.APPLICATIONS).insertOne(doc);
    return json({ _id: result.insertedId, ...doc }, 201);
  } catch (err) {
    return errorResponse(err, 'Failed to submit application');
  }
}
